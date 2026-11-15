import "server-only";
import { polarApiBase } from "./config";
import type { PolarCheckout, PolarProduct } from "./rules";

// Plain fetch against the Polar REST API; no SDK dependency. The organization access token
// needs only the products:read, checkouts:read and checkouts:write scopes.
async function polar<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = process.env.POLAR_ACCESS_TOKEN;
  if (!token) throw new Error("Polar is not configured");
  const response = await fetch(`${polarApiBase()}${path}`, {
    ...init, cache: "no-store", signal: AbortSignal.timeout(10000),
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json", "Polar-Version": "2026-10", ...init.headers },
  });
  if (!response.ok) throw new Error(`Polar request failed (${response.status})`);
  return response.json() as Promise<T>;
}

export const getProduct = (id: string) => polar<PolarProduct>(`/v1/products/${encodeURIComponent(id)}`);
export const getCheckout = (id: string) => polar<PolarCheckout>(`/v1/checkouts/${encodeURIComponent(id)}`);
export const createCheckout = (body: { products: string[]; success_url: string; return_url: string; metadata: Record<string, string> }) =>
  polar<PolarCheckout>("/v1/checkouts/", { method: "POST", body: JSON.stringify(body) });
