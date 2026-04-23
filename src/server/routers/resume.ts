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

export const resumeRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const user = await getPrismaUser(ctx.userId);
    return prisma.resume.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
  }),
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      fileUrl: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const user = await getPrismaUser(ctx.userId);
      return prisma.resume.create({
        data: {
          name: input.name,
          fileUrl: input.fileUrl,
          userId: user.id,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await getPrismaUser(ctx.userId);
      const resume = await prisma.resume.findUnique({ where: { id: input.id } });
      if (!resume || resume.userId !== user.id) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return prisma.resume.delete({
        where: { id: input.id },
      });
    }),
});
