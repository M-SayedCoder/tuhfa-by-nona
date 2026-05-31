/**
 * Firebase stub — no longer used.
 * All data operations now go through NestJS + MongoDB via /src/lib/api.ts
 * This file is kept only to avoid breaking any stale import references.
 */

export const db = null;
export const auth = null;

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: Record<string, unknown>;
}

export function handleFirestoreError(
  error: unknown,
  _operationType: OperationType,
  _path: string | null
): never {
  throw error instanceof Error ? error : new Error(String(error));
}
