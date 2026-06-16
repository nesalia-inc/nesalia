import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { TRPCError as BaseTRPCError } from "@trpc/server";
import type { AppRouter } from "@complete-web-template/api";

// ─── LabelColor ───────────────────────────────────────────────────────────────

export const LABEL_COLORS = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "brown",
  "gray",
  "black",
] as const;

export type LabelColor = (typeof LABEL_COLORS)[number];

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Label {
  id: string;
  organizationId: string;
  title: string;
  color: string; // narrow union enforced by Zod on the API side
  description: string | null;
  createdBy: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
  archivedAt: string | null;
}

export interface LabelWithCount extends Label {
  documentCount: number;
}

export interface LabelList {
  data: LabelWithCount[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
}

// ─── Params ──────────────────────────────────────────────────────────────────

export interface ListLabelsParams {
  organizationId: string;
  color?: LabelColor;
  sort?: "title" | "document-count" | "createdAt";
  page?: number;
  perPage?: number;
}

export interface GetLabelParams {
  organizationId: string;
  labelId: string;
  includeCount?: boolean;
}

export interface CreateLabelParams {
  organizationId: string;
  title: string;
  color: LabelColor;
  description?: string;
}

export interface UpdateLabelParams {
  organizationId: string;
  labelId: string;
  title?: string;
  color?: LabelColor;
  description?: string | null;
}

export interface DeleteLabelParams {
  organizationId: string;
  labelId: string;
  force?: boolean;
}

export interface SetDocumentLabelsParams {
  documentId: string;
  labelIds: string[];
}

export interface AddDocumentLabelParams {
  documentId: string;
  labelId: string;
}

export interface RemoveDocumentLabelParams {
  documentId: string;
  labelId: string;
}

export interface GetDocumentLabelsParams {
  documentId: string;
}

// ─── Error ───────────────────────────────────────────────────────────────────

export type LabelErrorCode =
  | "LABEL_TITLE_INVALID"
  | "LABEL_TITLE_COLLISION"
  | "LABEL_COLOR_INVALID"
  | "LABEL_FORBIDDEN"
  | "LABEL_NOT_FOUND"
  | "LABEL_IN_USE"
  | "DOCUMENT_NOT_FOUND"
  | "UNAUTHORIZED"
  | "UNKNOWN";

export class NesaliaLabelError extends Error {
  readonly code: LabelErrorCode;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    code: LabelErrorCode,
    status: number,
    details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = "NesaliaLabelError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

function mapTRPCError(err: unknown): never {
  if (err instanceof BaseTRPCError) {
    const trpcErr = err as { message: string; code: string; data?: Record<string, unknown> };
    const code = mapErrorCode(trpcErr.message, trpcErr.code);
    const status = mapHTTPStatus(trpcErr.code);
    throw new NesaliaLabelError(
      trpcErr.message,
      code,
      status,
      trpcErr.data,
    );
  }
  if (err instanceof Error) {
    throw new NesaliaLabelError(err.message, "UNKNOWN", 500);
  }
  throw new NesaliaLabelError("An unexpected error occurred", "UNKNOWN", 500);
}

function mapErrorCode(message: string, trpcCode: string): LabelErrorCode {
  if (message.includes("already exists")) return "LABEL_TITLE_COLLISION";
  if (message.includes("not found") || trpcCode === "NOT_FOUND") return "LABEL_NOT_FOUND";
  if (message.includes("permission") || trpcCode === "FORBIDDEN") return "LABEL_FORBIDDEN";
  if (message.includes("in use") || message.includes("is in use")) return "LABEL_IN_USE";
  if (trpcCode === "UNAUTHORIZED") return "UNAUTHORIZED";
  if (trpcCode === "BAD_REQUEST") return "DOCUMENT_NOT_FOUND";
  return "UNKNOWN";
}

function mapHTTPStatus(trpcCode: string): number {
  switch (trpcCode) {
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "BAD_REQUEST":
    case "INVALID_INPUT":
      return 400;
    case "CONFLICT":
      return 409;
    default:
      return 500;
  }
}

// ─── SDK Client ───────────────────────────────────────────────────────────────

export interface SDKClient {
  labels: {
    list(params: ListLabelsParams): Promise<LabelList>;
    get(params: GetLabelParams): Promise<LabelWithCount>;
    create(params: CreateLabelParams): Promise<Label>;
    update(params: UpdateLabelParams): Promise<Label>;
    delete(params: DeleteLabelParams): Promise<{ success: boolean }>;
  };
  documents: {
    labels: {
      list(params: GetDocumentLabelsParams): Promise<Label[]>;
      set(params: SetDocumentLabelsParams): Promise<{ document: unknown; labels: Label[] }>;
      add(params: AddDocumentLabelParams): Promise<{ document: unknown; labels: Label[] }>;
      remove(params: RemoveDocumentLabelParams): Promise<{ document: unknown; labels: Label[] }>;
    };
  };
}

export interface SDKOptions {
  /** Base URL of the API (default: http://localhost:3000) */
  baseUrl?: string;
  /** Custom headers (e.g., Authorization: Bearer token) */
  headers?: Record<string, string>;
}

export function createClient(options: SDKOptions = {}): SDKClient {
  const baseUrl = options.baseUrl ?? "http://localhost:3000";
  const headers = options.headers ?? {};

  const trpc = createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${baseUrl}/api/trpc`,
        headers: () => headers,
      }),
    ],
  });

  return {
    labels: {
      list: async (params) => {
        try {
          return await trpc.labels.list.query({
            orgId: params.organizationId,
            color: params.color,
            sort: params.sort,
            page: params.page,
            perPage: params.perPage,
          });
        } catch (err) {
          mapTRPCError(err);
        }
      },
      get: async (params) => {
        try {
          return await trpc.labels.get.query({
            orgId: params.organizationId,
            labelId: params.labelId,
            includeCount: params.includeCount,
          });
        } catch (err) {
          mapTRPCError(err);
        }
      },
      create: async (params) => {
        try {
          return await trpc.labels.create.mutate({
            orgId: params.organizationId,
            title: params.title,
            color: params.color,
            description: params.description,
          });
        } catch (err) {
          mapTRPCError(err);
        }
      },
      update: async (params) => {
        try {
          return await trpc.labels.update.mutate({
            orgId: params.organizationId,
            labelId: params.labelId,
            title: params.title,
            color: params.color,
            description: params.description,
          });
        } catch (err) {
          mapTRPCError(err);
        }
      },
      delete: async (params) => {
        try {
          return await trpc.labels.delete.mutate({
            orgId: params.organizationId,
            labelId: params.labelId,
            force: params.force,
          });
        } catch (err) {
          mapTRPCError(err);
        }
      },
    },
    documents: {
      labels: {
        list: async (params) => {
          try {
            return await trpc.organizationDocuments.labels.list.query({
              documentId: params.documentId,
            });
          } catch (err) {
            mapTRPCError(err);
          }
        },
        set: async (params) => {
          try {
            return await trpc.organizationDocuments.labels.set.mutate({
              documentId: params.documentId,
              labelIds: params.labelIds,
            });
          } catch (err) {
            mapTRPCError(err);
          }
        },
        add: async (params) => {
          try {
            return await trpc.organizationDocuments.labels.add.mutate({
              documentId: params.documentId,
              labelId: params.labelId,
            });
          } catch (err) {
            mapTRPCError(err);
          }
        },
        remove: async (params) => {
          try {
            return await trpc.organizationDocuments.labels.remove.mutate({
              documentId: params.documentId,
              labelId: params.labelId,
            });
          } catch (err) {
            mapTRPCError(err);
          }
        },
      },
    },
  };
}