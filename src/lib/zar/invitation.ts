import { getSupabase, isSupabaseConfigured } from "./supabase";
import type { LifecycleState, ZarContact, ZarPayload } from "./types";

export class ZarConfigError extends Error {}
export class ZarRpcError extends Error {}

function unwrap(value: unknown): Record<string, unknown> | null {
  if (!value) return null;
  let node = value;
  if (Array.isArray(node)) node = node[0];
  if (!node || typeof node !== "object") return null;
  const obj = node as Record<string, unknown>;
  if (obj['data'] && typeof obj['data'] === "object" && !Array.isArray(obj['data'])) {
    return obj['data'] as Record<string, unknown>;
  }
  return obj;
}

function readState(obj: Record<string, unknown>): LifecycleState {
  const raw = (obj['state'] ?? obj['lifecycle_state'] ?? obj['status']) as string | undefined;
  if (raw === "live" || raw === "fallback" || raw === "not_found") return raw;
  return "not_found";
}

/** Only the safe public display field provided by the central RPC contract. */
function readBrandName(obj: Record<string, unknown>): string | null {
  const shop = (obj['shop'] ?? obj['brand'] ?? null) as Record<string, unknown> | null;
  const candidates = [
    obj['brand_display_name'],
    obj['shop_display_name'],
    obj['shop_name'],
    shop?.['display_name'],
    shop?.['brand_display_name'],
    shop?.['name'],
  ];
  for (const c of candidates) {
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return null;
}

export async function fetchInvitation(slug: string): Promise<ZarPayload> {
  if (!isSupabaseConfigured) {
    throw new ZarConfigError("Invitation service is not configured.");
  }
  const supabase = getSupabase()!;
  const { data, error } = await supabase.rpc("get_public_invitation_content", {
    p_slug: slug,
  });
  if (error) throw new ZarRpcError(error.message);

  const obj = unwrap(data);
  if (!obj) return { state: "not_found" };

  const state = readState(obj);
  return {
    state,
    invitation: (obj['invitation'] ?? null) as ZarPayload["invitation"],
    content: state === "live" ? ((obj['content'] ?? null) as ZarPayload["content"]) : null,
    shop: (obj['shop'] ?? null) as Record<string, unknown> | null,
    brand_display_name: readBrandName(obj),
    raw: obj,
  };
}

/* ---------- content helpers ---------- */

export function digitsOnly(phone: string): string {
  return phone.replace(/\D+/g, "");
}

export function whatsappHref(contact: ZarContact): string | null {
  const supplied = contact.whatsapp_url ?? contact.whatsapp;
  if (typeof supplied === "string" && /^https?:\/\//i.test(supplied.trim())) {
    return supplied.trim();
  }
  const phone = contact.phone ? digitsOnly(contact.phone) : "";
  return phone ? `https://wa.me/${phone}` : null;
}

export function validContacts(contacts?: ZarContact[] | null): ZarContact[] {
  if (!Array.isArray(contacts)) return [];
  return contacts.filter((c) => typeof c?.phone === "string" && c.phone.trim().length > 0).slice(0, 2);
}

export function galleryUrls(gallery?: (string | { url?: string | null })[] | null): string[] {
  if (!Array.isArray(gallery)) return [];
  return gallery
    .map((g) => (typeof g === "string" ? g : (g?.url ?? "")))
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
}

export function isValidMapsUrl(url?: string | null): boolean {
  if (typeof url !== "string") return false;
  return /^https?:\/\//i.test(url.trim());
}

export function formatDate(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.trim() || null;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function text(value?: string | null): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  return t.length ? t : null;
}
