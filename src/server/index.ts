import { router, publicProcedure } from './trpc';
import { applicationRouter } from './routers/application';
import { resumeRouter } from './routers/resume';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return 'Yay! tRPC is working.';
  }),
  application: applicationRouter,
  resume: resumeRouter,
});

export type AppRouter = typeof appRouter;
