import { useState } from "react";
import type { LiveMatch } from "@/lib/mock-data";

const compColor: Record<string, string> = {
  PL: "text-neon-green",
  "La Liga": "text-neon-pink",
  "Serie A": "text-neon-cyan",
  UCL: "text-neon-purple",
};

export function LiveTicker({ matches, source }: { matches: LiveMatch[]; source: "live" | "mock" }) {
  const [paused, setPaused] = useState(false);
  const doubled = [...matches, ...matches];
  return (
    <div className="relative w-full overflow-hidden border-b border-border/60 bg-card/60 backdrop-blur">
      <div className="pointer-events-none absolute left-0 top-0 z-10 flex h-full items-center gap-2 bg-gradient-to-r from-background via-background to-transparent pl-3 pr-6">
        <span className="animate-live-pulse inline-block h-2 w-2 rounded-full bg-destructive" />
        <span className="text-[10px] font-black uppercase tracking-widest text-destructive">
          {source === "live" ? "Live" : "Demo"}
        </span>
      </div>
      <div
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
        className={`flex w-max gap-6 whitespace-nowrap py-2.5 pl-24 pr-6 text-sm ${paused ? "" : "animate-ticker"}`}
      >
        {doubled.map((m, i) => (
          <div key={`${m.id}-${i}`} className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase ${compColor[m.competition] ?? "text-muted-foreground"}`}>
              {m.competition}
            </span>
            <span className="text-foreground/90 font-semibold">{m.home}</span>
            <span className="rounded-md bg-secondary px-1.5 py-0.5 font-mono text-xs font-bold text-foreground">
              {m.homeScore} – {m.awayScore}
            </span>
            <span className="text-foreground/90 font-semibold">{m.away}</span>
            <span className="text-[10px] font-bold text-muted-foreground">{m.minute}</span>
            <span className="text-border">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
