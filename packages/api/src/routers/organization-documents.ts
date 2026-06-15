import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { db, documents, organizationDocuments, member, eq, and, isNull } from "@complete-web-template/db";

const documentTypes = ["handbook", "policy", "template", "note", "knowledge"] as const;
const visibilityOptions = ["all", "admins_only"] as const;

async function assertOrgMembership(orgId: string, userId: string) {
  const membership = await db.query.member.findFirst({
    where: and(eq(member.organizationId, orgId), eq(member.userId, userId)),
  });
  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization",
    });
  }
  return membership;
}

async function assertDocumentOwnership(documentId: string, userId: string) {
  const doc = await db.query.organizationDocuments.findFirst({
    where: eq(organizationDocuments.id, documentId),
  });
  if (!doc) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Document not found",
    });
  }
  const membership = await db.query.member.findFirst({
    where: and(eq(member.organizationId, doc.organizationId), eq(member.userId, userId)),
  });
  if (!membership) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You are not a member of this organization",
    });
  }
  return { doc, membership };
}

export const organizationDocumentsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        type: z.enum(documentTypes).optional(),
        tags: z.array(z.string()).optional(),
        archived: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const membership = await assertOrgMembership(input.orgId, ctx.user!.id);

      const docs = await db
        .select()
        .from(organizationDocuments)
        .innerJoin(documents, eq(organizationDocuments.documentId, documents.id))
        .where(
          and(
            eq(organizationDocuments.organizationId, input.orgId),
            input.archived
              ? eq(organizationDocuments.archivedAt, organizationDocuments.archivedAt)
              : isNull(organizationDocuments.archivedAt),
            input.type ? eq(organizationDocuments.type, input.type) : undefined,
          ),
        );

      // Filter by tags
      let filtered = docs;
      if (input.tags && input.tags.length > 0) {
        filtered = docs.filter((d) => {
          if (!d.documents.tags) return false;
          return input.tags!.some((tag) => d.documents.tags!.includes(tag));
        });
      }

      // Filter visibility for non-admins
      if (membership.role !== "owner" && membership.role !== "admin") {
        filtered = filtered.filter((d) => d.organization_documents.visibility === "all");
      }

      return filtered.map((d) => ({
        id: d.organization_documents.id,
        documentId: d.documents.id,
        name: d.documents.name,
        type: d.organization_documents.type,
        visibility: d.organization_documents.visibility,
        tags: d.documents.tags,
        archivedAt: d.organization_documents.archivedAt,
        createdAt: d.organization_documents.createdAt,
        updatedAt: d.organization_documents.updatedAt,
      }));
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { doc, membership } = await assertDocumentOwnership(input.id, ctx.user!.id);

      if (doc.visibility === "admins_only" && membership.role !== "owner" && membership.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have access to this document",
        });
      }

      const fullDoc = await db.query.documents.findFirst({
        where: eq(documents.id, doc.documentId),
      });

      if (!fullDoc) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document content not found",
        });
      }

      return {
        id: doc.id,
        documentId: doc.documentId,
        name: fullDoc.name,
        content: fullDoc.content,
        type: doc.type,
        visibility: doc.visibility,
        tags: fullDoc.tags,
        archivedAt: doc.archivedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        name: z.string().min(1).max(256),
        type: z.enum(documentTypes),
        content: z.string().optional(),
        visibility: z.enum(visibilityOptions).default("all"),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOrgMembership(input.orgId, ctx.user!.id);

      const [doc] = await db
        .insert(documents)
        .values({
          name: input.name,
          content: input.content ?? null,
          tags: input.tags ?? null,
          createdBy: ctx.user!.id,
        })
        .returning();

      const [orgDoc] = await db
        .insert(organizationDocuments)
        .values({
          documentId: doc.id,
          organizationId: input.orgId,
          type: input.type,
          visibility: input.visibility,
        })
        .returning();

      return {
        id: orgDoc.id,
        documentId: doc.id,
        name: doc.name,
        type: orgDoc.type,
        visibility: orgDoc.visibility,
        tags: doc.tags,
        createdAt: orgDoc.createdAt,
        updatedAt: orgDoc.updatedAt,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(256).optional(),
        content: z.string().optional(),
        visibility: z.enum(visibilityOptions).optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { doc, membership } = await assertDocumentOwnership(input.id, ctx.user!.id);

      const docContent = await db.query.documents.findFirst({
        where: eq(documents.id, doc.documentId),
      });

      if (membership.role !== "owner" && membership.role !== "admin" && docContent!.createdBy !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot update this document",
        });
      }

      if (input.name || input.content !== undefined || input.tags) {
        await db
          .update(documents)
          .set({
            name: input.name,
            content: input.content,
            tags: input.tags,
            updatedAt: new Date(),
          })
          .where(eq(documents.id, doc.documentId));
      }

      if (input.visibility) {
        await db
          .update(organizationDocuments)
          .set({ updatedAt: new Date() })
          .where(eq(organizationDocuments.id, input.id));
      }

      const updated = await db.query.organizationDocuments.findFirst({
        where: eq(organizationDocuments.id, input.id),
      });

      return {
        id: updated!.id,
        documentId: updated!.documentId,
        name: input.name ?? docContent!.name,
        type: updated!.type,
        visibility: updated!.visibility,
        tags: input.tags ?? docContent!.tags,
        createdAt: updated!.createdAt,
        updatedAt: updated!.updatedAt,
      };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { doc, membership } = await assertDocumentOwnership(input.id, ctx.user!.id);

      const docContent = await db.query.documents.findFirst({
        where: eq(documents.id, doc.documentId),
      });

      if (membership.role !== "owner" && membership.role !== "admin" && docContent!.createdBy !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot delete this document",
        });
      }

      await db
        .update(organizationDocuments)
        .set({ archivedAt: new Date(), updatedAt: new Date() })
        .where(eq(organizationDocuments.id, input.id));

      return { success: true };
    }),

  archive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { doc, membership } = await assertDocumentOwnership(input.id, ctx.user!.id);

      const docContent = await db.query.documents.findFirst({
        where: eq(documents.id, doc.documentId),
      });

      if (membership.role !== "owner" && membership.role !== "admin" && docContent!.createdBy !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot archive this document",
        });
      }

      await db
        .update(organizationDocuments)
        .set({ archivedAt: new Date(), updatedAt: new Date() })
        .where(eq(organizationDocuments.id, input.id));

      return { success: true };
    }),

  restore: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { doc, membership } = await assertDocumentOwnership(input.id, ctx.user!.id);

      const docContent = await db.query.documents.findFirst({
        where: eq(documents.id, doc.documentId),
      });

      if (membership.role !== "owner" && membership.role !== "admin" && docContent!.createdBy !== ctx.user!.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot restore this document",
        });
      }

      await db
        .update(organizationDocuments)
        .set({ archivedAt: null, updatedAt: new Date() })
        .where(eq(organizationDocuments.id, input.id));

      return { success: true };
    }),

  search: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        query: z.string().min(1),
        type: z.enum(documentTypes).optional(),
        tags: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const membership = await assertOrgMembership(input.orgId, ctx.user!.id);

      const docs = await db
        .select()
        .from(organizationDocuments)
        .innerJoin(documents, eq(organizationDocuments.documentId, documents.id))
        .where(
          and(
            eq(organizationDocuments.organizationId, input.orgId),
            isNull(organizationDocuments.archivedAt),
            input.type ? eq(organizationDocuments.type, input.type) : undefined,
          ),
        );

      const query = input.query.toLowerCase();
      let filtered = docs.filter((d) => {
        const nameMatch = d.documents.name.toLowerCase().includes(query);
        const contentMatch = d.documents.content?.toLowerCase().includes(query);
        return nameMatch || contentMatch;
      });

      if (input.tags && input.tags.length > 0) {
        filtered = filtered.filter((d) => {
          if (!d.documents.tags) return false;
          return input.tags!.some((tag) => d.documents.tags!.includes(tag));
        });
      }

      if (membership.role !== "owner" && membership.role !== "admin") {
        filtered = filtered.filter((d) => d.organization_documents.visibility === "all");
      }

      return filtered.map((d) => ({
        id: d.organization_documents.id,
        documentId: d.documents.id,
        name: d.documents.name,
        type: d.organization_documents.type,
        visibility: d.organization_documents.visibility,
        tags: d.documents.tags,
        createdAt: d.organization_documents.createdAt,
        updatedAt: d.organization_documents.updatedAt,
      }));
    }),
});
