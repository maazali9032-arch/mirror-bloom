/**
 * Global floating shop/brand strip.
 * Tiny, semi-transparent, marquee-animated ribbon around the 70% viewport-height
 * mark. Brand name is data-driven from the approved public payload field only.
 */
export function BrandTicker({ brandName }: { brandName?: string | null | undefined }) {
  const name = brandName?.trim();
  if (!name) return null;

  const cell = (key: string) => (
    <span key={key} className="flex shrink-0 items-center gap-3 px-4">
      <span className="zar-eyebrow text-[0.5rem] text-zar-gold-soft/90">{name}</span>
      <span aria-hidden className="text-[0.5rem] text-zar-gold/70">
        ✦
      </span>
    </span>
  );

  const run = Array.from({ length: 12 }, (_, i) => cell(`a-${i}`));

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 select-none"
    >
      <div className="mx-auto max-w-4xl overflow-hidden border-t border-zar-gold/25 bg-zar-night/20 py-[0.15rem] backdrop-blur-[1px] sm:py-[0.2rem]">
        <div className="zar-marquee-track flex w-[200%] items-center">
          <div className="flex w-1/2 items-center">{run}</div>
          <div className="flex w-1/2 items-center">
            {Array.from({ length: 12 }, (_, i) => cell(`b-${i}`))}
          </div>
        </div>
      </div>
    </div>
  );
}
