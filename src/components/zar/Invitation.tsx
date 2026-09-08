import { motion, useReducedMotion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { MapPin, Phone } from "lucide-react";

import { ArchPanel, Divider } from "./ArchPanel";
import { PalaceConstruction } from "./PalaceConstruction";
import { RsvpMirror } from "./RsvpMirror";
import { MusicToggle } from "./MusicToggle";
import {
  formatDate,
  galleryUrls,
  isValidMapsUrl,
  text,
  validContacts,
  whatsappHref,
} from "@/lib/zar/invitation";
import type { ZarContent, ZarPayload } from "@/lib/zar/types";

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = !!useReducedMotion();
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}

export function Invitation({ payload }: { payload: ZarPayload }) {
  const reduced = !!useReducedMotion();
  const content: ZarContent = payload.content ?? {};

  const groomName = text(content.groom_name);
  const brideName = text(content.bride_name);
  const bothNames = Boolean(groomName && brideName);
  const weddingDate = formatDate(content.wedding_date);
  const ceremonyTime = [text(content.start_time), text(content.end_time)].filter(Boolean).join(" – ");
  const invocation = text(content.invocation);
  const groomPhoto = text(content.groom_photo_url);
  const bridePhoto = text(content.bride_photo_url);

  const events = Array.isArray(content.events)
    ? content.events.filter((e) => text(e?.title ?? e?.name ?? e?.event_name))
    : [];
  const venueName = text(content.venue_name);
  const venueAddress = text(content.venue_address);
  const venueCity = text(content.city);
  const venueImage = text(content.venue_image_url);
  const mapsUrl = isValidMapsUrl(content.maps_url) ? content.maps_url!.trim() : null;
  const gallery = galleryUrls(content.gallery);
  const contacts = validContacts(content.contacts);
  const publicUrl = text(payload.invitation?.public_url);
  const qrLabel = text(content.qr_text) ?? "Our Invitation";
  const musicUrl = content.music_enabled === true ? text(content.music_url) : null;
  const relatives = text(content.relatives);

  const parents = [
    { side: "Groom's Parents", names: text(content.groom_parents) },
    { side: "Bride's Parents", names: text(content.bride_parents) },
  ]
    .filter((p): p is { side: string; names: string } => Boolean(p.names));

  const groomDetail = [text(content.groom_qualification), text(content.groom_occupation)]
    .filter(Boolean)
    .join(" · ");
  const brideDetail = [text(content.bride_qualification), text(content.bride_occupation)]
    .filter(Boolean)
    .join(" · ");

  return (
    <main className="zar-world relative min-h-screen overflow-x-hidden pb-20">
      {musicUrl && <MusicToggle url={musicUrl} />}

      {/* Opening + construction + hero */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-5 pb-24 pt-10">
        {invocation && (
          <motion.p
            initial={reduced ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, delay: 0.3 }}
            className="mx-auto max-w-xs text-center font-display text-base leading-relaxed text-zar-gold-soft"
          >
            {invocation}
          </motion.p>
        )}

        <PalaceConstruction className="mt-6 w-full max-w-lg" />

        <div className="mt-2 w-full max-w-md text-center">
          {(groomName || brideName) && (
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: reduced ? 0.2 : 5.6 }}
            >
              {groomName && (
                <p className="zar-title text-[2.1rem] leading-tight text-zar-ivory sm:text-5xl">
                  {groomName}
                </p>
              )}
              {bothNames && (
                <p className="my-1 font-display text-2xl text-zar-gold sm:my-2">&amp;</p>
              )}
              {brideName && (
                <p className="zar-title text-[2.1rem] leading-tight text-zar-ivory sm:text-5xl">
                  {brideName}
                </p>
              )}
            </motion.div>
          )}
          {weddingDate && (
            <motion.p
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, delay: reduced ? 0.3 : 6.4 }}
              className="zar-eyebrow mt-5 text-zar-gold-soft"
            >
              {weddingDate}
            </motion.p>
          )}
          {ceremonyTime && (
            <p className="zar-eyebrow mt-2 text-zar-gold-soft">{ceremonyTime}</p>
          )}
        </div>
      </section>

      {(groomPhoto || bridePhoto || groomDetail || brideDetail) && (
        <ArchPanel eyebrow="Two souls, one destiny" title="The Couple">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {[
              { name: groomName, photo: groomPhoto, detail: groomDetail },
              { name: brideName, photo: bridePhoto, detail: brideDetail },
            ]
              .filter((p) => p.name || p.photo)
              .map((p) => (
                <Reveal key={p.name ?? p.photo}>
                  <div className="text-center">
                    {p.photo && (
                      <img
                        src={p.photo}
                        alt={p.name ? `Portrait of ${p.name}` : "Portrait"}
                        loading="lazy"
                        className="mx-auto mb-4 h-44 w-36 rounded-t-[4rem] rounded-b-lg border border-zar-gold-deep/40 object-cover"
                      />
                    )}
                    {p.name && (
                      <p className="zar-title text-xl text-zar-ink">{p.name}</p>
                    )}
                    {p.detail && (
                      <p className="mt-1 text-xs leading-relaxed text-zar-ink-soft">
                        {p.detail}
                      </p>
                    )}
                  </div>
                </Reveal>
              ))}
          </div>
        </ArchPanel>
      )}

      {(parents.length > 0 || relatives) && (
        <ArchPanel title="With the Blessings" eyebrow="Of our beloved families">
          {parents.length > 0 && (
            <div className="grid grid-cols-2 gap-5 text-center">
              {parents.map((p) => (
                <Reveal key={p.side}>
                  <p className="zar-eyebrow text-zar-gold-deep">{p.side}</p>
                  <p className="mt-3 font-display text-base text-zar-ink">{p.names}</p>
                </Reveal>
              ))}
            </div>
          )}
          {relatives && (
            <>
              <Divider />
              <p className="zar-eyebrow text-center text-zar-gold-deep">With</p>
              <p className="mt-3 text-center text-sm leading-relaxed text-zar-ink-soft">
                {relatives}
              </p>
            </>
          )}
        </ArchPanel>
      )}

      {events.length > 0 && (
        <ArchPanel title="Wedding Events" eyebrow="A celebration of love">
          <ol className="space-y-7">
            {events.map((e, i) => (
              <Reveal key={`${e.title ?? e.name}-${i}`} delay={i * 0.05}>
                <li className="relative border-l border-zar-gold-deep/40 pl-6">
                  <span className="absolute -left-[3px] top-2 size-[5px] rounded-full bg-zar-gold-deep" />
                  <p className="zar-title text-xl text-zar-ink">{e.title ?? e.name ?? e.event_name}</p>
                  {(formatDate(e.date ?? e.event_date) || text(e.time ?? e.start_time)) && (
                    <p className="mt-1 text-xs text-zar-ink-soft">
                      {[formatDate(e.date ?? e.event_date), text(e.time ?? e.start_time)].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  {text(e.venue ?? e.venue_name) && (
                    <p className="mt-1 text-xs text-zar-ink-soft">{e.venue ?? e.venue_name}</p>
                  )}
                  {text(e.description ?? e.note) && (
                    <p className="mt-2 text-sm leading-relaxed text-zar-ink-soft">
                      {e.description ?? e.note}
                    </p>
                  )}
                </li>
              </Reveal>
            ))}
          </ol>
        </ArchPanel>
      )}

      {(venueName || venueAddress || venueCity || venueImage || mapsUrl) && (
        <ArchPanel title="Venue" eyebrow="Join us at">
          {venueImage && (
            <img
              src={venueImage}
              alt={venueName ? `${venueName} venue` : "Venue"}
              loading="lazy"
              className="mb-6 h-48 w-full rounded-t-[3rem] rounded-b-lg border border-zar-gold-deep/40 object-cover"
            />
          )}
          <div className="text-center">
            {venueName && <p className="zar-title text-2xl text-zar-ink">{venueName}</p>}
            {venueAddress && (
              <p className="mt-2 text-sm leading-relaxed text-zar-ink-soft">{venueAddress}</p>
            )}
            {venueCity && <p className="text-sm text-zar-ink-soft">{venueCity}</p>}
            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="zar-eyebrow mt-6 inline-flex items-center gap-2 rounded-full bg-zar-emerald px-6 py-3 text-zar-ivory transition-opacity hover:opacity-90"
              >
                <MapPin className="size-3.5" /> View on Maps
              </a>
            )}
          </div>
        </ArchPanel>
      )}

      {gallery.length > 0 && (
        <ArchPanel title="Gallery" eyebrow="Our beautiful moments">
          <div className="grid grid-cols-2 gap-3">
            {gallery.map((url, i) => (
              <Reveal key={url} delay={i * 0.04}>
                <img
                  src={url}
                  alt="A moment from the couple's story"
                  loading="lazy"
                  className={`w-full rounded-lg border border-zar-gold-deep/30 object-cover ${
                    i === 0 ? "col-span-2 h-52" : "h-32"
                  }`}
                />
              </Reveal>
            ))}
          </div>
        </ArchPanel>
      )}

      <ArchPanel title="RSVP" eyebrow="Kindly respond">
        <RsvpMirror />
      </ArchPanel>

      {(contacts.length > 0 || publicUrl) && (
        <ArchPanel title="Stay Connected" eyebrow="We'd love to hear from you">
          {contacts.length > 0 && (
            <div className="space-y-4">
              {contacts.map((c) => {
                const wa = whatsappHref(c);
                return (
                  <div
                    key={`${c.name}-${c.phone}`}
                    className="flex items-center gap-3 rounded-xl border border-zar-gold-deep/30 bg-zar-pearl/40 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      {text(c.name) && (
                        <p className="truncate font-display text-base text-zar-ink">{c.name}</p>
                      )}
                      <p className="truncate text-xs text-zar-ink-soft">{c.phone}</p>
                    </div>
                    <a
                      href={`tel:${c.phone}`}
                      aria-label={c.name ? `Call ${c.name}` : "Call"}
                      className="rounded-full bg-zar-emerald p-2 text-zar-ivory"
                    >
                      <Phone className="size-4" />
                    </a>
                    {wa && (
                      <a
                        href={wa}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={c.name ? `WhatsApp ${c.name}` : "WhatsApp"}
                        className="zar-eyebrow rounded-full border border-zar-emerald/60 px-3 py-2 text-zar-emerald"
                      >
                        WA
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {publicUrl && (
            <div className={contacts.length > 0 ? "mt-9 text-center" : "text-center"}>
              <p className="zar-title text-xl text-zar-ink">{qrLabel}</p>
              <p className="zar-eyebrow mt-1 text-zar-ink-soft">Scan to open</p>
              <div className="mx-auto mt-5 w-fit rounded-xl border border-zar-gold-deep/40 bg-zar-ivory p-3">
                <QRCodeSVG value={publicUrl} size={132} level="M" bgColor="#ffffff" fgColor="#1b1b1b" />
              </div>
            </div>
          )}
        </ArchPanel>
      )}

      {/* final balanced palace composition */}
      <section className="relative mt-4 flex flex-col items-center px-5 pt-10">
        <PalaceConstruction className="w-full max-w-2xl opacity-80" />
        <p className="zar-eyebrow -mt-6 text-center text-zar-gold-soft">A new chapter together</p>
        <p className="mt-3 text-center font-display text-sm text-zar-ivory/60">
          Jazakallah khair for your love and dua
        </p>
      </section>
    </main>
  );
}
