import { createTRPCRouter } from '../init';
import { organizationDocumentsRouter } from './organization-documents';

export const appRouter = createTRPCRouter({
  organizationDocuments: organizationDocumentsRouter,
});

export type AppRouter = typeof appRouter;
