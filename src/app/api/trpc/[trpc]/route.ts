import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server';
import { auth } from '@clerk/nextjs/server';

const handler = async (req: Request) => {
  const { userId } = await auth();
  
  return fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => ({ userId }),
    onError: ({ path, error }) => {
      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`, error);
    },
  });
};

export { handler as GET, handler as POST };
