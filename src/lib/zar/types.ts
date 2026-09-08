export type LifecycleState = "live" | "fallback" | "not_found";

export type ZarContact = {
  name?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
  whatsapp?: string | null;
  photo_url?: string | null;
  relation?: string | null;
};

export type ZarEvent = {
  title?: string | null;
  name?: string | null;
  date?: string | null;
  time?: string | null;
  description?: string | null;
  venue?: string | null;
};

export type ZarVenue = {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  maps_url?: string | null;
  image_url?: string | null;
};

export type ZarPerson = {
  name?: string | null;
  photo_url?: string | null;
  qualification?: string | null;
  occupation?: string | null;
  father_name?: string | null;
  mother_name?: string | null;
};

export type ZarContent = {
  invocation?: string | null;
  invitation_message?: string | null;
  message?: string | null;
  groom?: ZarPerson | null;
  bride?: ZarPerson | null;
  groom_name?: string | null;
  bride_name?: string | null;
  wedding_date?: string | null;
  events?: ZarEvent[] | null;
  venue?: ZarVenue | null;
  gallery?: (string | { url?: string | null })[] | null;
  music?: { enabled?: boolean | null; url?: string | null } | null;
  contacts?: ZarContact[] | null;
  relatives?: (string | { name?: string | null; relation?: string | null })[] | null;
  qr_label?: string | null;
};

export type ZarInvitation = {
  slug?: string | null;
  public_url?: string | null;
  start_at?: string | null;
  end_at?: string | null;
};

export type ZarPayload = {
  state: LifecycleState;
  invitation?: ZarInvitation | null | undefined;
  content?: ZarContent | null | undefined;
  /** Safe public brand/shop display fields returned by the central RPC. */
  shop?: Record<string, unknown> | null | undefined;
  brand_display_name?: string | null | undefined;
  raw?: Record<string, unknown>;
};
