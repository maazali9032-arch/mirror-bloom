import { motion } from "motion/react";
import type { ReactNode } from "react";

function Shell({ children }: { children: ReactNode }) {
  return (
    <main className="zar-world flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <svg viewBox="0 0 200 90" className="mx-auto mb-8 h-20 w-48" aria-hidden>
          <g fill="none" stroke="var(--zar-gold)" strokeWidth="0.8" strokeLinecap="round">
            <motion.path
              d="M100 80 V34 Q100 8 62 6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2 }}
            />
            <motion.path
              d="M100 80 V34 Q100 8 62 6"
              transform="translate(200 0) scale(-1 1)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 1 }}
            />
            <line x1="40" y1="82" x2="160" y2="82" strokeOpacity="0.4" />
          </g>
        </svg>
        {children}
      </div>
    </main>
  );
}

export function LoadingState() {
  return (
    <Shell>
      <p className="zar-eyebrow text-zar-gold-soft">Preparing the invitation</p>
    </Shell>
  );
}

export function NotFoundState() {
  return (
    <Shell>
      <h1 className="zar-title text-3xl text-zar-ivory">Invitation Not Found</h1>
      <p className="mt-3 text-sm leading-relaxed text-zar-ivory/70">
        This link does not lead to an invitation. Please check the link shared with you.
      </p>
    </Shell>
  );
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Shell>
      <h1 className="zar-title text-3xl text-zar-ivory">Unable to Open</h1>
      <p className="mt-3 text-sm leading-relaxed text-zar-ivory/70">
        The invitation could not be loaded right now.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="zar-eyebrow mt-7 rounded-full border border-zar-gold/50 px-6 py-3 text-zar-gold-soft transition-colors hover:border-zar-gold"
      >
        Try again
      </button>
    </Shell>
  );
}

export function FallbackState() {
  return (
    <Shell>
      <h1 className="zar-title text-3xl text-zar-ivory">Invitation Unavailable</h1>
      <p className="mt-3 text-sm leading-relaxed text-zar-ivory/70">
        This invitation is no longer available. Crafting beautiful beginnings.
      </p>
    </Shell>
  );
}
