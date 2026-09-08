import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

/**
 * RSVP is animation only: no storage, no counting, no analytics.
 * The chosen side is answered by its mirrored reflection.
 */
export function RsvpMirror() {
  const [choice, setChoice] = useState<"yes" | "no" | null>(null);
  const reduced = !!useReducedMotion();

  const option = (key: "yes" | "no", label: string) => {
    const active = choice === key;
    return (
      <button
        key={key}
        type="button"
        onClick={() => setChoice(key)}
        aria-pressed={active}
        className={`relative flex-1 overflow-hidden rounded-t-[3rem] rounded-b-xl border px-4 py-8 transition-colors duration-500 ${
          active
            ? "border-zar-emerald/70 bg-zar-emerald/90 text-zar-ivory"
            : "border-zar-gold-deep/40 bg-zar-pearl/40 text-zar-ink hover:border-zar-gold-deep/70"
        }`}
      >
        <span className="zar-title block text-lg leading-snug">{label}</span>
        {active && !reduced && (
          <motion.span
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 bg-zar-ivory/10"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            style={{ transformOrigin: "bottom" }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />
        )}
      </button>
    );
  };

  return (
    <div>
      <div className="flex gap-4">
        {option("yes", "Will Be There")}
        {option("no", "Regretfully Decline")}
      </div>

      <AnimatePresence mode="wait">
        {choice && (
          <motion.div
            key={choice}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6 }}
            className="mt-8 text-center"
          >
            <svg viewBox="0 0 200 60" className="mx-auto h-12 w-40" aria-hidden>
              <g fill="none" stroke="var(--zar-gold-deep)" strokeWidth="0.9" strokeLinecap="round">
                <motion.path
                  d="M100 46 Q100 18 62 12 Q34 8 16 20"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduced ? 0.3 : 0.9 }}
                />
                <motion.path
                  d="M100 46 Q100 18 62 12 Q34 8 16 20"
                  transform="translate(200 0) scale(-1 1)"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: reduced ? 0.3 : 0.7, delay: reduced ? 0 : 0.7 }}
                />
              </g>
            </svg>
            <p className="zar-title mt-2 text-2xl text-zar-ink">
              {choice === "yes" ? "Thank You" : "You Will Be Missed"}
            </p>
            <p className="zar-eyebrow mt-2 text-zar-ink-soft">
              {choice === "yes" ? "For being a part of our story" : "Your duas are with us"}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
