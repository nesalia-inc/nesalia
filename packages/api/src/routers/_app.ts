import { createTRPCRouter } from '../init';
import { organizationDocumentsRouter } from './organization-documents';
import { labelsRouter } from './labels';

export const appRouter = createTRPCRouter({
  organizationDocuments: organizationDocumentsRouter,
  labels: labelsRouter,
});

export type AppRouter = typeof appRouter;
