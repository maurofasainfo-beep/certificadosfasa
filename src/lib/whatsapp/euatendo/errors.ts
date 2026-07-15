import type { Json } from "@/lib/supabase/database.types";

import type { EuAtendoErrorCode } from "./types";

export class EuAtendoProviderError extends Error {
  readonly code: EuAtendoErrorCode;
  readonly httpStatus: number | null;
  readonly retryAfterSeconds: number | null;
  readonly retryable: boolean;
  readonly sanitizedResponse: Json;

  constructor({
    code,
    message,
    httpStatus = null,
    retryAfterSeconds = null,
    retryable = false,
    sanitizedResponse = null,
  }: {
    code: EuAtendoErrorCode;
    message: string;
    httpStatus?: number | null;
    retryAfterSeconds?: number | null;
    retryable?: boolean;
    sanitizedResponse?: Json;
  }) {
    super(message);
    this.name = "EuAtendoProviderError";
    this.code = code;
    this.httpStatus = httpStatus;
    this.retryAfterSeconds = retryAfterSeconds;
    this.retryable = retryable;
    this.sanitizedResponse = sanitizedResponse;
  }
}

export function isEuAtendoProviderError(error: unknown): error is EuAtendoProviderError {
  return error instanceof EuAtendoProviderError;
}
