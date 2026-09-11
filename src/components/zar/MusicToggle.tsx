import { useEffect, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";

/** Optional music; never autoplays against browser restrictions. */
export function MusicToggle({ url }: { url: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      const el = audioRef.current;
      if (!el) return;
      if (document.hidden) {
        el.pause();
      } else {
        if (playing) {
          void el.play().catch(() => setPlaying(false));
        }
      }
    };
    
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [playing]);

  const toggle = () => {
    if (!audioRef.current) {
      const el = new Audio(url);
      el.loop = true;
      el.volume = 0.55;
      audioRef.current = el;
    }
    const el = audioRef.current;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? "Pause music" : "Play music"}
      className="fixed right-4 top-4 z-50 rounded-full border border-zar-gold/40 bg-zar-night/50 p-2 text-zar-gold-soft backdrop-blur-sm transition-colors hover:border-zar-gold"
    >
      {playing ? <Pause className="size-4" /> : <Music className="size-4" />}
    </button>
  );
}
