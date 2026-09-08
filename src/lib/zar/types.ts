export type LifecycleState = "live" | "fallback" | "not_found";

export type ZarContact = {
  name?: string | null;
  phone?: string | null;
  whatsapp_url?: string | null;
};

export type ZarEvent = {
  title?: string | null;
  name?: string | null;
  event_name?: string | null;
  date?: string | null;
  event_date?: string | null;
  time?: string | null;
  start_time?: string | null;
  description?: string | null;
  note?: string | null;
  venue?: string | null;
  venue_name?: string | null;
  city?: string | null;
  maps_url?: string | null;
  mapsUrl?: string | null;
};

export type ZarGalleryItem = string | {
  url?: string | null;
  src?: string | null;
  image_url?: string | null;
  alt?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  span?: "tall" | "wide" | null;
};

/** The `content` object returned by get_public_invitation_content for `live`. */
export type ZarContent = {
  invocation?: string | null;
  groom_name?: string | null;
  bride_name?: string | null;
  groom_photo_url?: string | null;
  bride_photo_url?: string | null;
  groom_qualification?: string | null;
  bride_qualification?: string | null;
  groom_occupation?: string | null;
  bride_occupation?: string | null;
  groom_parents?: string | null;
  bride_parents?: string | null;
  relatives?: string | null;
  wedding_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  events?: ZarEvent[] | null;
  venue_name?: string | null;
  venue_address?: string | null;
  city?: string | null;
  maps_url?: string | null;
  venue_image_url?: string | null;
  gallery?: ZarGalleryItem[] | null;
  music_enabled?: boolean | null;
  music_url?: string | null;
  contacts?: ZarContact[] | null;
  qr_text?: string | null;
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
  /** Fallback-only data; it is never used to render a live invitation. */
  shop?: Record<string, unknown> | null | undefined;
};
