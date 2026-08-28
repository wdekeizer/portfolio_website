import type { Project } from "../types";

export const API_BASE = import.meta.env.VITE_API_URL ?? "";

export function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}

export const ADMIN_TOKEN_STORAGE_KEY = "admin_token";

export function getStoredAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
}

export function setStoredAdminToken(token: string) {
  localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
}

export function clearStoredAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
}

export type ProjectInput = {
  title: string;
  description: string;
  repoUrl?: string;
  liveUrl?: string;
  tags: string[];
  featured: boolean;
};

class AdminAuthError extends Error {
  constructor() {
    super("Invalid or expired admin token");
  }
}

async function adminRequest(path: string, options: RequestInit, token: string) {
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 401) {
    throw new AdminAuthError();
  }
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`);
  }
  return res;
}

export { AdminAuthError };

export async function createProject(input: ProjectInput, token: string): Promise<Project> {
  const res = await adminRequest(
    "/api/projects",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    token,
  );
  return res.json();
}

export async function updateProject(
  id: string,
  input: Partial<ProjectInput>,
  token: string,
): Promise<Project> {
  const res = await adminRequest(
    `/api/projects/${id}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    token,
  );
  return res.json();
}

export async function deleteProject(id: string, token: string): Promise<void> {
  await adminRequest(`/api/projects/${id}`, { method: "DELETE" }, token);
}
