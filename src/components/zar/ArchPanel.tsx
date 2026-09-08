import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/**
 * Ivory panel inside an ornate arch whose outline keeps constructing itself,
 * mirrored half by half, as each section enters the viewport.
 */
export function ArchPanel({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const reduced = !!useReducedMotion();
  const half = "M100 3 Q46 5 14 54 V336";

  return (
    <section className={`relative px-4 py-10 sm:py-14 ${className}`}>
      <div className="relative mx-auto w-full max-w-md">
        <div className="zar-panel relative overflow-hidden rounded-t-[6rem] rounded-b-3xl px-6 pb-10 pt-12 sm:px-9">
          {/* constructing arch outline: primary half, then mirrored completion */}
          <svg
            aria-hidden
            viewBox="0 0 200 340"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)]"
          >
            <g fill="none" stroke="var(--zar-gold-deep)" strokeOpacity="0.55" strokeLinecap="round">
              <motion.path
                d={half}
                strokeWidth="0.9"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduced ? 0.3 : 1.5, ease: "easeInOut" }}
              />
              <motion.path
                d={half}
                strokeWidth="0.9"
                transform="translate(200 0) scale(-1 1)"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: reduced ? 0.3 : 1.1, delay: reduced ? 0 : 1.1, ease: "easeInOut" }}
              />
            </g>
          </svg>

          <div className="relative">
            {title && (
              <h2 className="zar-title text-center text-[2rem] leading-tight text-zar-ink">{title}</h2>
            )}
            {eyebrow && (
              <p className="zar-eyebrow mt-2 text-center text-zar-ink-soft">{eyebrow}</p>
            )}
            <div className={title || eyebrow ? "mt-8" : ""}>{children}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Divider() {
  return (
    <div className="mx-auto flex items-center justify-center gap-2 py-6 opacity-70">
      <span className="h-px w-10 bg-zar-gold-deep/50" />
      <span className="text-[0.6rem] text-zar-gold-deep">✦</span>
      <span className="h-px w-10 bg-zar-gold-deep/50" />
    </div>
  );
}
