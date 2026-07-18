import { useState } from "react";
import { MOCK_STANDINGS, MOCK_FIXTURES } from "@/lib/mock-data";

const LEAGUES = ["PL", "La Liga", "Serie A", "UCL"] as const;

export function StandingsWidget() {
  const [league, setLeague] = useState<(typeof LEAGUES)[number]>("PL");
  const rows = MOCK_STANDINGS[league];
  return (
    <section className="px-4 pt-6">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">🏆 Standings</h2>
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
          {LEAGUES.map((l) => (
            <button
              key={l}
              onClick={() => setLeague(l)}
              className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide transition ${
                league === l ? "bg-primary text-primary-foreground glow-purple" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="gradient-card overflow-hidden rounded-3xl border border-border/60">
        <div className="grid grid-cols-[24px_1fr_36px_36px_44px_auto] items-center gap-2 border-b border-border/60 px-4 py-2 text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          <span>#</span><span>Team</span><span className="text-center">P</span><span className="text-center">GD</span><span className="text-center">Pts</span><span className="text-right">Form</span>
        </div>
        {rows.map((r) => (
          <div key={r.pos} className="grid grid-cols-[24px_1fr_36px_36px_44px_auto] items-center gap-2 border-b border-border/40 px-4 py-2.5 text-sm last:border-0">
            <span className={`font-black ${r.pos <= 4 ? "text-neon-green" : "text-muted-foreground"}`}>{r.pos}</span>
            <span className="truncate font-semibold">{r.team}</span>
            <span className="text-center text-muted-foreground">{r.played}</span>
            <span className={`text-center font-semibold ${r.gd >= 0 ? "text-neon-green" : "text-destructive"}`}>{r.gd > 0 ? `+${r.gd}` : r.gd}</span>
            <span className="text-center font-black">{r.points}</span>
            <span className="flex justify-end gap-1">
              {r.form.map((f, i) => (
                <span
                  key={i}
                  className={`grid h-4 w-4 place-items-center rounded text-[9px] font-black ${
                    f === "W" ? "bg-neon-green/25 text-neon-green" : f === "D" ? "bg-muted text-muted-foreground" : "bg-destructive/25 text-destructive"
                  }`}
                >{f}</span>
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 mb-2 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">⚡ Fixtures</h2>
        <span className="text-xs font-semibold text-muted-foreground">Next up</span>
      </div>
      <div className="space-y-2">
        {MOCK_FIXTURES.map((f) => (
          <div key={f.id} className="gradient-card grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/60 px-4 py-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-neon-purple">
                {f.competition}
              </div>
              <p className="mt-0.5 truncate text-sm font-bold">
                {f.home} <span className="text-muted-foreground">vs</span> {f.away}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-[11px] font-black text-foreground">{f.kickoff}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
