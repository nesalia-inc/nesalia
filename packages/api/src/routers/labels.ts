import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../init";
import { TRPCError } from "@trpc/server";
import { db, labels, documentLabels, member, organization, LABEL_COLORS, eq, and, isNull, count, sql } from "@complete-web-template/db";

const LABEL_COLORS_ENUM = LABEL_COLORS as unknown as [string, ...string[]];

// Helpers
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

async function assertOrgAdmin(orgId: string, userId: string) {
  const membership = await assertOrgMembership(orgId, userId);
  if (membership.role !== "owner" && membership.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "You don't have permission to manage labels in this organization",
    });
  }
  return membership;
}

async function getDocumentCountForLabel(labelId: string): Promise<number> {
  const [result] = await db
    .select({ n: count() })
    .from(documentLabels)
    .where(eq(documentLabels.labelId, labelId));
  return result?.n ?? 0;
}

export const labelsRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        color: z.enum(LABEL_COLORS_ENUM).optional(),
        sort: z.enum(["title", "document-count", "createdAt"]).default("title"),
        page: z.number().int().min(1).default(1),
        perPage: z.number().int().min(1).max(100).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertOrgMembership(input.orgId, ctx.user!.id);

      const conditions = [
        eq(labels.organizationId, input.orgId),
        isNull(labels.archivedAt),
        input.color ? eq(labels.color, input.color) : undefined,
      ].filter(Boolean);

      // Get total count
      const [{ total }] = await db
        .select({ total: count() })
        .from(labels)
        .where(and(...conditions));

      // Get labels with document counts
      const sortColumn =
        input.sort === "title"
          ? sql`lower(${labels.title})`
          : input.sort === "createdAt"
            ? labels.createdAt
            : labels.title; // document-count needs subquery, sort by title as fallback

      const rows = await db
        .select()
        .from(labels)
        .where(and(...conditions))
        .orderBy(input.sort === "title" ? sql`lower(${labels.title})` : labels.createdAt)
        .limit(input.perPage)
        .offset((input.page - 1) * input.perPage);

      // Hydrate document counts
      const labelsWithCounts = await Promise.all(
        rows.map(async (label) => ({
          ...label,
          documentCount: await getDocumentCountForLabel(label.id),
        })),
      );

      // Sort by document-count if needed (after fetching)
      if (input.sort === "document-count") {
        labelsWithCounts.sort((a, b) => b.documentCount - a.documentCount);
      }

      return {
        data: labelsWithCounts,
        pagination: {
          page: input.page,
          perPage: input.perPage,
          total: total ?? 0,
        },
      };
    }),

  get: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        labelId: z.string(),
        includeCount: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      await assertOrgMembership(input.orgId, ctx.user!.id);

      const label = await db.query.labels.findFirst({
        where: and(eq(labels.id, input.labelId), eq(labels.organizationId, input.orgId)),
      });

      if (!label) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Label not found",
        });
      }

      if (label.archivedAt) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Label not found",
        });
      }

      return {
        ...label,
        documentCount: input.includeCount ? await getDocumentCountForLabel(label.id) : 0,
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        title: z.string().min(1, "Title is required").max(50, "Title must be 50 characters or fewer"),
        color: z.enum(LABEL_COLORS_ENUM),
        description: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOrgAdmin(input.orgId, ctx.user!.id);

      // Check title uniqueness within org
      const existing = await db.query.labels.findFirst({
        where: and(eq(labels.organizationId, input.orgId), eq(labels.title, input.title)),
      });

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A label with this title already exists",
        });
      }

      const [label] = await db
        .insert(labels)
        .values({
          organizationId: input.orgId,
          title: input.title,
          color: input.color,
          description: input.description ?? null,
          createdBy: ctx.user!.id,
        })
        .returning();

      return label;
    }),

  update: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        labelId: z.string(),
        title: z.string().min(1).max(50).optional(),
        color: z.enum(LABEL_COLORS_ENUM).optional(),
        description: z.string().max(500).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOrgAdmin(input.orgId, ctx.user!.id);

      const existing = await db.query.labels.findFirst({
        where: and(eq(labels.id, input.labelId), eq(labels.organizationId, input.orgId)),
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Label not found",
        });
      }

      // Check title uniqueness if title is being changed
      if (input.title && input.title !== existing.title) {
        const conflict = await db.query.labels.findFirst({
          where: and(
            eq(labels.organizationId, input.orgId),
            eq(labels.title, input.title),
          ),
        });

        if (conflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "A label with this title already exists",
          });
        }
      }

      const [updated] = await db
        .update(labels)
        .set({
          title: input.title,
          color: input.color,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(labels.id, input.labelId))
        .returning();

      return updated;
    }),

  delete: protectedProcedure
    .input(
      z.object({
        orgId: z.string(),
        labelId: z.string(),
        force: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await assertOrgAdmin(input.orgId, ctx.user!.id);

      const label = await db.query.labels.findFirst({
        where: and(eq(labels.id, input.labelId), eq(labels.organizationId, input.orgId)),
      });

      if (!label) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Label not found",
        });
      }

      // Check if label is in use
      if (!input.force) {
        const count = await getDocumentCountForLabel(label.id);
        if (count > 0) {
          throw new TRPCError({
            code: "CONFLICT",
            message: `This label is in use by ${count} documents`,
          });
        }
      }

      // Delete the label (cascade handles document_labels cleanup)
      await db.delete(labels).where(eq(labels.id, input.labelId));

      return { success: true };
    }),
});