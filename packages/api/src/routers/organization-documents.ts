import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { db, documents, organizationDocuments, member, labels, documentLabels, eq, and, isNull, inArray, count, sql } from "@complete-web-template/db";

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
        archived: z.boolean().default(false),
        labelIds: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const membership = await assertOrgMembership(input.orgId, ctx.user!.id);

      // Start with base conditions
      const conditions = [
        eq(organizationDocuments.organizationId, input.orgId),
        input.archived
          ? eq(organizationDocuments.archivedAt, organizationDocuments.archivedAt)
          : isNull(organizationDocuments.archivedAt),
        input.type ? eq(organizationDocuments.type, input.type) : undefined,
      ].filter(Boolean);

      // Filter by labelIds (AND logic — document must have ALL listed labels)
      if (input.labelIds && input.labelIds.length > 0) {
        // Find documents that have ALL the requested labels
        const docIdsWithAllLabels = await db
          .select({ documentId: documentLabels.documentId })
          .from(documentLabels)
          .where(
            and(
              inArray(documentLabels.labelId, input.labelIds),
              inArray(
                documentLabels.documentId,
                db
                  .select({ id: organizationDocuments.documentId })
                  .from(organizationDocuments)
                  .where(and(...conditions)),
              ),
            ),
          )
          .groupBy(documentLabels.documentId)
          .having(eq(count(documentLabels.labelId), input.labelIds.length));

        if (docIdsWithAllLabels.length === 0) {
          return [];
        }

        conditions.push(
          inArray(
            organizationDocuments.documentId,
            docIdsWithAllLabels.map((d) => d.documentId),
          ),
        );
      }

      const docs = await db
        .select()
        .from(organizationDocuments)
        .innerJoin(documents, eq(organizationDocuments.documentId, documents.id))
        .where(and(...conditions));

      // Filter visibility for non-admins
      let filtered = docs;
      if (membership.role !== "owner" && membership.role !== "admin") {
        filtered = filtered.filter((d) => d.organization_documents.visibility === "all");
      }

      return filtered.map((d) => ({
        id: d.organization_documents.id,
        documentId: d.documents.id,
        name: d.documents.name,
        type: d.organization_documents.type,
        visibility: d.organization_documents.visibility,
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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOrgMembership(input.orgId, ctx.user!.id);

      const [doc] = await db
        .insert(documents)
        .values({
          name: input.name,
          content: input.content ?? null,
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
        createdAt: orgDoc.createdAt,
        updatedAt: orgDoc.updatedAt,
      };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(256).optional(),
        type: z.enum(documentTypes).optional(),
        content: z.string().optional(),
        visibility: z.enum(visibilityOptions).optional(),
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

      if (input.name || input.content !== undefined) {
        await db
          .update(documents)
          .set({
            name: input.name,
            content: input.content,
            updatedAt: new Date(),
          })
          .where(eq(documents.id, doc.documentId));
      }

      if (input.type || input.visibility) {
        await db
          .update(organizationDocuments)
          .set({
            type: input.type,
            visibility: input.visibility,
            updatedAt: new Date(),
          })
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
        labelIds: z.array(z.string()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const membership = await assertOrgMembership(input.orgId, ctx.user!.id);

      const conditions = [
        eq(organizationDocuments.organizationId, input.orgId),
        isNull(organizationDocuments.archivedAt),
        input.type ? eq(organizationDocuments.type, input.type) : undefined,
      ].filter(Boolean);

      // Filter by labelIds (AND logic)
      if (input.labelIds && input.labelIds.length > 0) {
        const docIdsWithAllLabels = await db
          .select({ documentId: documentLabels.documentId })
          .from(documentLabels)
          .where(
            and(
              inArray(documentLabels.labelId, input.labelIds),
              inArray(
                documentLabels.documentId,
                db
                  .select({ id: organizationDocuments.documentId })
                  .from(organizationDocuments)
                  .where(and(...conditions)),
              ),
            ),
          )
          .groupBy(documentLabels.documentId)
          .having(eq(count(documentLabels.labelId), input.labelIds.length));

        if (docIdsWithAllLabels.length === 0) {
          return [];
        }

        conditions.push(
          inArray(
            organizationDocuments.documentId,
            docIdsWithAllLabels.map((d) => d.documentId),
          ),
        );
      }

      const docs = await db
        .select()
        .from(organizationDocuments)
        .innerJoin(documents, eq(organizationDocuments.documentId, documents.id))
        .where(and(...conditions));

      const query = input.query.toLowerCase();
      let filtered = docs.filter((d) => {
        const nameMatch = d.documents.name.toLowerCase().includes(query);
        const contentMatch = d.documents.content?.toLowerCase().includes(query);
        return nameMatch || contentMatch;
      });

      if (membership.role !== "owner" && membership.role !== "admin") {
        filtered = filtered.filter((d) => d.organization_documents.visibility === "all");
      }

      return filtered.map((d) => ({
        id: d.organization_documents.id,
        documentId: d.documents.id,
        name: d.documents.name,
        type: d.organization_documents.type,
        visibility: d.organization_documents.visibility,
        createdAt: d.organization_documents.createdAt,
        updatedAt: d.organization_documents.updatedAt,
      }));
    }),

  labels: createTRPCRouter({
    list: protectedProcedure
      .input(z.object({ documentId: z.string() }))
      .query(async ({ ctx, input }) => {
        // Verify user has access to the document's org
        const orgDoc = await db.query.organizationDocuments.findFirst({
          where: eq(organizationDocuments.documentId, input.documentId),
        });

        if (!orgDoc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        await assertOrgMembership(orgDoc.organizationId, ctx.user!.id);

        const rows = await db
          .select({ label: labels })
          .from(documentLabels)
          .innerJoin(labels, eq(documentLabels.labelId, labels.id))
          .where(
            and(
              eq(documentLabels.documentId, input.documentId),
              isNull(labels.archivedAt),
            ),
          )
          .orderBy(sql`lower(${labels.title})`);

        return rows.map((r) => r.label);
      }),

    set: protectedProcedure
      .input(
        z.object({
          documentId: z.string(),
          labelIds: z.array(z.string()),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { doc } = await assertDocumentOwnership(input.documentId, ctx.user!.id);

        // Delete existing label associations
        await db
          .delete(documentLabels)
          .where(eq(documentLabels.documentId, input.documentId));

        // Insert new label associations
        if (input.labelIds.length > 0) {
          await db.insert(documentLabels).values(
            input.labelIds.map((labelId) => ({
              documentId: input.documentId,
              labelId,
              appliedBy: ctx.user!.id,
            })),
          );
        }

        // Return document with updated labels
        const rows = await db
          .select({ label: labels })
          .from(documentLabels)
          .innerJoin(labels, eq(documentLabels.labelId, labels.id))
          .where(
            and(
              eq(documentLabels.documentId, input.documentId),
              isNull(labels.archivedAt),
            ),
          )
          .orderBy(sql`lower(${labels.title})`);

        return {
          document: {
            id: doc.id,
            documentId: doc.documentId,
            name: (await db.query.documents.findFirst({ where: eq(documents.id, doc.documentId) }))?.name,
            type: doc.type,
            visibility: doc.visibility,
            archivedAt: doc.archivedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          },
          labels: rows.map((r) => r.label),
        };
      }),

    add: protectedProcedure
      .input(
        z.object({
          documentId: z.string(),
          labelId: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { doc } = await assertDocumentOwnership(input.documentId, ctx.user!.id);

        // Verify label exists and belongs to same org
        const label = await db.query.labels.findFirst({
          where: eq(labels.id, input.labelId),
        });

        if (!label || label.archivedAt) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Label not found",
          });
        }

        // Check label belongs to same org
        const orgDoc = await db.query.organizationDocuments.findFirst({
          where: eq(organizationDocuments.documentId, input.documentId),
        });

        if (label.organizationId !== orgDoc?.organizationId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Label does not belong to this organization",
          });
        }

        // Check if already applied (idempotent)
        const existing = await db.query.documentLabels.findFirst({
          where: and(
            eq(documentLabels.documentId, input.documentId),
            eq(documentLabels.labelId, input.labelId),
          ),
        });

        if (!existing) {
          await db.insert(documentLabels).values({
            documentId: input.documentId,
            labelId: input.labelId,
            appliedBy: ctx.user!.id,
          });
        }

        // Return updated labels
        const rows = await db
          .select({ label: labels })
          .from(documentLabels)
          .innerJoin(labels, eq(documentLabels.labelId, labels.id))
          .where(
            and(
              eq(documentLabels.documentId, input.documentId),
              isNull(labels.archivedAt),
            ),
          )
          .orderBy(sql`lower(${labels.title})`);

        return {
          document: {
            id: doc.id,
            documentId: doc.documentId,
            name: (await db.query.documents.findFirst({ where: eq(documents.id, doc.documentId) }))?.name,
            type: doc.type,
            visibility: doc.visibility,
            archivedAt: doc.archivedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          },
          labels: rows.map((r) => r.label),
        };
      }),

    remove: protectedProcedure
      .input(
        z.object({
          documentId: z.string(),
          labelId: z.string(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const { doc } = await assertDocumentOwnership(input.documentId, ctx.user!.id);

        // Delete the association (idempotent — no error if not exists)
        await db
          .delete(documentLabels)
          .where(
            and(
              eq(documentLabels.documentId, input.documentId),
              eq(documentLabels.labelId, input.labelId),
            ),
          );

        // Return updated labels
        const rows = await db
          .select({ label: labels })
          .from(documentLabels)
          .innerJoin(labels, eq(documentLabels.labelId, labels.id))
          .where(
            and(
              eq(documentLabels.documentId, input.documentId),
              isNull(labels.archivedAt),
            ),
          )
          .orderBy(sql`lower(${labels.title})`);

        return {
          document: {
            id: doc.id,
            documentId: doc.documentId,
            name: (await db.query.documents.findFirst({ where: eq(documents.id, doc.documentId) }))?.name,
            type: doc.type,
            visibility: doc.visibility,
            archivedAt: doc.archivedAt,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
          },
          labels: rows.map((r) => r.label),
        };
      }),
  }),
});
