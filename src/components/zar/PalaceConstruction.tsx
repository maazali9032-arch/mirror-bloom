import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

type Stroke = { d: string; w: number };

/**
 * Left (primary) half of the palace elevation, authored in a 0..200 x-range so
 * the right half can be produced purely by an SVG reflection transform.
 */
const HALF: Stroke[] = [
  { d: "M200 252 H8", w: 0.7 },
  { d: "M20 252 V186 H52 V252", w: 1 },
  { d: "M36 186 V128", w: 1 },
  { d: "M27 128 H45", w: 1 },
  { d: "M27 128 Q36 105 54 102", w: 1 },
  { d: "M54 102 L54 84 L45 70 L36 84 L36 102", w: 0.8 },
  { d: "M78 252 V150", w: 1.2 },
  { d: "M69 150 H87", w: 1 },
  { d: "M78 150 Q78 98 132 86", w: 1.2 },
  { d: "M132 86 Q172 78 194 44", w: 1.2 },
  { d: "M200 62 Q174 70 160 96 Q150 116 150 154 V252", w: 1 },
  { d: "M118 252 V198 Q118 170 150 162", w: 0.6 },
  { d: "M200 24 L200 62", w: 0.7 },
  { d: "M92 202 H140 M92 218 H140 M92 234 H140", w: 0.35 },
  { d: "M200 20 Q168 30 152 58", w: 0.6 },
];

const ORNAMENT: Stroke[] = [
  { d: "M200 132 Q176 140 176 158 Q176 176 200 184", w: 0.7 },
  { d: "M200 146 Q186 152 186 158 Q186 164 200 170", w: 0.5 },
];

function StrokeGroup({
  strokes,
  delay,
  duration,
  step,
  reduced,
  opacity = 1,
}: {
  strokes: Stroke[];
  delay: number;
  duration: number;
  step: number;
  reduced: boolean;
  opacity?: number;
}) {
  return (
    <g fill="none" stroke="var(--zar-gold)" strokeLinecap="round" strokeLinejoin="round">
      {strokes.map((s, i) => (
        <motion.path
          key={s.d}
          d={s.d}
          strokeWidth={s.w}
          initial={{ pathLength: reduced ? 1 : 0, opacity: reduced ? opacity : 0 }}
          animate={{ pathLength: 1, opacity }}
          transition={
            reduced
              ? { duration: 0.4, delay: 0.1 }
              : { duration, delay: delay + i * step, ease: "easeInOut" }
          }
        />
      ))}
    </g>
  );
}

export function PalaceConstruction({ className = "" }: { className?: string }) {
  const reduced = !!useReducedMotion();

  // Sequential timeline: axis -> primary half -> mirrored completion -> reflection.
  const t = useMemo(() => {
    const axis = 0.2;
    const primary = 1.1;
    const primarySpan = HALF.length * 0.22 + 1.2;
    const mirror = primary + primarySpan * 0.72;
    const water = mirror + 1.6;
    return { axis, primary, mirror, water };
  }, []);

  return (
    <svg
      viewBox="0 0 400 340"
      className={className}
      role="img"
      aria-label="An ornate palace elevation constructing itself and completing through reflection"
    >
      <defs>
        <linearGradient id="zar-axis" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zar-gold)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--zar-gold-soft)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--zar-gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="zar-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--zar-gold)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--zar-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* opening: central axis + faint guide marks */}
      <motion.line
        x1="200"
        y1="6"
        x2="200"
        y2="300"
        stroke="url(#zar-axis)"
        strokeWidth="0.8"
        initial={{ pathLength: reduced ? 1 : 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0.3 : 1.4, delay: t.axis, ease: "easeInOut" }}
      />
      <motion.g
        stroke="var(--zar-gold)"
        strokeWidth="0.3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2, delay: t.axis + 0.2 }}
      >
        <line x1="40" y1="252" x2="360" y2="252" />
        <line x1="60" y1="150" x2="340" y2="150" strokeDasharray="2 6" />
        <line x1="90" y1="86" x2="310" y2="86" strokeDasharray="2 6" />
      </motion.g>

      {/* primary half — genuinely drawn first */}
      <g>
        <StrokeGroup
          strokes={HALF}
          delay={t.primary}
          duration={1.05}
          step={0.22}
          reduced={reduced}
        />
        <StrokeGroup
          strokes={ORNAMENT}
          delay={t.primary + 1.6}
          duration={1}
          step={0.25}
          reduced={reduced}
          opacity={0.85}
        />
      </g>

      {/* mirrored completion — reflection of the same geometry */}
      <motion.g
        transform="translate(400 0) scale(-1 1)"
        initial={{ opacity: reduced ? 1 : 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: reduced ? 0.2 : t.mirror }}
      >
        <StrokeGroup
          strokes={HALF}
          delay={t.mirror}
          duration={0.7}
          step={0.1}
          reduced={reduced}
        />
        <StrokeGroup
          strokes={ORNAMENT}
          delay={t.mirror + 1}
          duration={0.7}
          step={0.12}
          reduced={reduced}
          opacity={0.85}
        />
      </motion.g>

      {/* reflection sweep across the axis at the moment of mirroring */}
      {!reduced && (
        <motion.rect
          x="196"
          y="10"
          width="8"
          height="290"
          fill="url(#zar-axis)"
          initial={{ scaleX: 1, opacity: 0 }}
          animate={{ scaleX: [1, 26, 1], opacity: [0, 0.5, 0] }}
          style={{ transformOrigin: "200px 155px" }}
          transition={{ duration: 1.8, delay: t.mirror, ease: "easeOut" }}
        />
      )}

      {/* still-water reflection resolves the balanced composition */}
      <motion.g
        transform="translate(0 504) scale(1 -1)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.22 }}
        transition={{ duration: 2, delay: reduced ? 0.4 : t.water }}
      >
        <g fill="none" stroke="url(#zar-water)" strokeLinecap="round">
          {HALF.map((s) => (
            <path key={`r-${s.d}`} d={s.d} strokeWidth={s.w} />
          ))}
        </g>
        <g fill="none" stroke="url(#zar-water)" strokeLinecap="round" transform="translate(400 0) scale(-1 1)">
          {HALF.map((s) => (
            <path key={`rm-${s.d}`} d={s.d} strokeWidth={s.w} />
          ))}
        </g>
      </motion.g>
    </svg>
  );
}
