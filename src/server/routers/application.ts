import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';
import { TRPCError } from '@trpc/server';

// Helper to get or create Prisma User from Clerk
const getPrismaUser = async (clerkId: string) => {
  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) throw new TRPCError({ code: 'UNAUTHORIZED' });
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser.primaryEmailAddress?.emailAddress ?? `${clerkId}@no-email.com`,
        name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User',
      },
    });
  }
  return user;
};

export const applicationRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await getPrismaUser(ctx.userId);
    return prisma.application.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  create: protectedProcedure
    .input(z.object({
      company: z.string().min(1),
      role: z.string().min(1),
      status: z.string(),
      deadline: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await getPrismaUser(ctx.userId);
      return prisma.application.create({
        data: {
          ...input,
          userId: user.id,
        },
      });
    }),
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      company: z.string().optional(),
      role: z.string().optional(),
      status: z.string().optional(),
      deadline: z.date().optional().nullable(),
      notes: z.string().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await getPrismaUser(ctx.userId);
      const { id, ...data } = input;
      const app = await prisma.application.findUnique({ where: { id } });
      if (!app || app.userId !== user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      // Omit undefined fields
      const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));
      
      return prisma.application.update({
        where: { id },
        data: cleanData,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getPrismaUser(ctx.userId);
      const app = await prisma.application.findUnique({ where: { id: input.id } });
      if (!app || app.userId !== user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return prisma.application.delete({
        where: { id: input.id },
      });
    }),
});
