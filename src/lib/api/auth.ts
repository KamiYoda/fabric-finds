import { type AuthUser } from "@/features/auth/types";
import { apiRequest } from "./core";
import { clearAuthToken, setAuthToken, getRefreshToken } from "./token";

export interface SendCodePayload {
  identifier: string;
  type?: "registration" | "password_reset";
}

export interface VerifyCodePayload {
  identifier: string;
  code: string;
}

export interface RegisterPayload {
  first_name: string;
  last_name: string;
  region: string;
  identifier: string;
  verification_code: string;
  password: string;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: AuthUser;
}

export function sendAuthCode(payload: SendCodePayload) {
  return apiRequest<{ success: boolean }>("/auth/send-code", {
    method: "POST",
    body: payload,
  });
}

export function verifyAuthCode(payload: VerifyCodePayload) {
  return apiRequest<{ verification_code: string }>("/auth/verify-code", {
    method: "POST",
    body: payload,
  });
}

function unwrapResponse<T>(response: any): T {
  if (response && typeof response === "object") {
    if (response.data != null) return response.data as T;
    if (
      response.success &&
      response.message !== undefined &&
      response.data === undefined
    )
      return response as T;
  }
  return response as T;
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<any>("/auth/register", {
    method: "POST",
    body: payload,
    successMessage: "Registered successfully",
  });
  const result = unwrapResponse<any>(response);
  const accessToken = (result &&
    ((result.access_token as string) || (result.token as string))) as
    | string
    | undefined;
  const refreshToken = (result &&
    ((result.refresh_token as string) || (result.refreshToken as string))) as
    | string
    | undefined;
  if (accessToken) {
    setAuthToken(accessToken, refreshToken);
  }
  return result;
}

export async function login(payload: LoginPayload) {
  const response = await apiRequest<any>("/auth/login", {
    method: "POST",
    body: payload,
    successMessage: "Signed in successfully",
  });
  const result = unwrapResponse<any>(response);
  const accessToken = (result &&
    ((result.access_token as string) || (result.token as string))) as
    | string
    | undefined;
  const refreshToken = (result &&
    ((result.refresh_token as string) || (result.refreshToken as string))) as
    | string
    | undefined;
  if (accessToken) {
    setAuthToken(accessToken, refreshToken);
  }
  return result;
}

export function forgotPassword(identifier: string) {
  return apiRequest<{ success: boolean }>("/auth/forgot-password", {
    method: "POST",
    body: { identifier },
  });
}

export function resetPassword(
  identifier: string,
  code: string,
  password: string,
  password_confirmation: string,
) {
  return apiRequest<{ success: boolean }>("/auth/reset-password", {
    method: "POST",
    body: {
      identifier,
      code,
      password,
      password_confirmation,
    },
  });
}

export async function refreshAuth() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Refresh token not available");
  }
  const response = await apiRequest<AuthResponse>("/auth/refresh", {
    method: "POST",
    body: { refresh_token: refreshToken },
  });
  setAuthToken(response.access_token, response.refresh_token);
  return response;
}

export async function logout() {
  await apiRequest("/auth/logout", { method: "POST", auth: true });
  clearAuthToken();
}

export function getProfile() {
  return apiRequest<AuthUser>("/auth/profile", { method: "GET", auth: true });
}
