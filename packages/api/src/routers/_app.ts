import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  // Add routers here
});

export type AppRouter = typeof appRouter;
