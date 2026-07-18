import { useEffect, useRef, useState } from "react";
import type { Article } from "@/lib/mock-data";
import { Flame, MessageCircle, Share2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HeroSlider({ articles }: { articles: Article[] }) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const i = Math.round(el.scrollLeft / el.clientWidth);
      setIdx(i);
    };

    el.addEventListener("scroll", onScroll, { passive: true });

    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="px-4 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">
          🔥 Breaking
        </h2>

        <span className="text-xs font-semibold text-muted-foreground">
          Swipe →
        </span>
      </div>

      <div
        ref={ref}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-4"
      >
        {articles.map((a) => (
          <Link
            key={a.id}
            to="/article/$slug"
            params={{ slug: a.slug }}
            className="relative mr-3 block h-64 w-[85%] shrink-0 snap-center overflow-hidden rounded-3xl border border-border/60 transition-transform active:scale-[0.98] last:mr-4"
          >
            <img
              src={a.cover}
              alt={a.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
              <TagBadge color={a.tagColor} label={a.tag} />

              <h3 className="mt-2 text-lg font-black leading-tight text-white text-glow-purple">
                {a.title}
              </h3>

              <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-white/80">
                <span className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-neon-pink" />
                  {format(a.reactions)}
                </span>

                <span className="flex items-center gap-1">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {format(a.comments)}
                </span>

                <span className="flex items-center gap-1">
                  <Share2 className="h-3.5 w-3.5" />
                </span>

                <span className="ml-auto">
                  {a.minutesAgo}m ago
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {articles.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === idx
                ? "w-6 bg-primary glow-purple"
                : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export function TagBadge({
  color,
  label,
}: {
  color: Article["tagColor"];
  label: string;
}) {
  const map = {
    purple:
      "bg-neon-purple/20 text-neon-purple ring-neon-purple/40",
    green:
      "bg-neon-green/20 text-neon-green ring-neon-green/40",
    pink:
      "bg-neon-pink/20 text-neon-pink ring-neon-pink/40",
    cyan:
      "bg-neon-cyan/20 text-neon-cyan ring-neon-cyan/40",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ring-1 ${map[color]}`}
    >
      {label}
    </span>
  );
}

function format(n: number) {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1)}k`;
  }

  return n.toString();
}
