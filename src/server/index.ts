import { router, publicProcedure } from './trpc';
import { applicationRouter } from './routers/application';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return 'Yay! tRPC is working.';
  }),
  application: applicationRouter,
});

export type AppRouter = typeof appRouter;
