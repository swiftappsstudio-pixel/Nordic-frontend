"use client";

class UnauthorizedError extends Error {
  constructor() {
    super("Session expired");
    this.name = "UnauthorizedError";
  }
}

export function isUnauthorizedError(err: unknown): boolean {
  return err instanceof UnauthorizedError;
}

function handleUnauthorized(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth-expired"));
  const path = window.location.pathname;
  if (path.startsWith("/admin")) {
    window.location.href = "/admin/login";
  } else {
    window.location.href = "/sign-in";
  }
}

export async function authFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);
  if (res.status === 401) {
    handleUnauthorized();
    throw new UnauthorizedError();
  }
  return res;
}
