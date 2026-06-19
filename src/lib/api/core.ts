import { getAuthToken } from "./token";
import { toast } from "sonner";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  auth?: boolean;
  formData?: boolean;
  body?: unknown;
  headers?: HeadersInit;
  successMessage?: string;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers = new Headers(options.headers ?? {});
  headers.set("Accept", "application/json");

  if (
    !options.formData &&
    options.body != null &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const init: RequestInit = {
    method: options.method ?? "GET",
    headers,
    body:
      options.body != null &&
      !(options.body instanceof FormData) &&
      !options.formData
        ? JSON.stringify(options.body)
        : (options.body as BodyInit | null),
    credentials: options.credentials ?? "same-origin",
    mode: options.mode ?? "cors",
    cache: options.cache,
    redirect: options.redirect,
    referrer: options.referrer,
    referrerPolicy: options.referrerPolicy,
    integrity: options.integrity,
    keepalive: options.keepalive,
    signal: options.signal,
  };

  const response = await fetch(url, init);
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    let details: unknown = text;
    try {
      if (contentType.includes("application/json") && text) {
        details = JSON.parse(text);
      }
    } catch (_error) {
      details = text;
    }
    const message =
      typeof details === "object" && details !== null && "message" in details
        ? ((details as { message?: string }).message ?? response.statusText)
        : response.statusText;
    // show toast for failed requests
    try {
      toast.error(message);
    } catch (error) {
      console.warn(error);
    }
    throw new ApiError(message, response.status, details);
  }

  if (!text) {
    // success but no body
    try {
      const method = (init.method ?? "GET").toUpperCase();
      if (method === "POST" || method === "PUT") {
        toast.success("Success");
      }
    } catch (error) {
      console.warn(error);
    }
    return undefined as unknown as T;
  }

  if (contentType.includes("application/json")) {
    const parsed = JSON.parse(text) as T;
    try {
      const method = (init.method ?? "GET").toUpperCase();
      if (method === "POST" || method === "PUT") {
        const parsedMessage = parsed as unknown as {
          message?: string;
          msg?: string;
        };
        const maybeMessage =
          options.successMessage ??
          parsedMessage.message ??
          parsedMessage.msg ??
          response.statusText;
        toast.success(
          typeof maybeMessage === "string" && maybeMessage
            ? maybeMessage
            : "Success",
        );
      }
    } catch (error) {
      console.warn(error);
    }
    return parsed;
  }

  return text as unknown as T;
}
