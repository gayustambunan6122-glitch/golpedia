import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Menu, Search, Bell } from "lucide-react";
import { getLiveMatches } from "@/lib/football-api.functions";
import { MOCK_ARTICLES, MOCK_LIVE } from "@/lib/mock-data";
import { LiveTicker } from "@/components/LiveTicker";
import { HeroSlider } from "@/components/HeroSlider";
import { ArticleCard } from "@/components/ArticleCard";
import { StandingsWidget } from "@/components/StandingsWidget";
import { BottomNav, type Tab } from "@/components/BottomNav";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kickoff — Gen Z Sports News & Livescores" },
      { name: "description", content: "The fastest, loudest, most fun sports app for Gen Z. Live scores, breaking rumors, standings and hot takes — all in dark mode." },
      { property: "og:title", content: "Kickoff — Gen Z Sports News & Livescores" },
      { property: "og:description", content: "Live scores, breaking rumors, hot takes. Built for Gen Z." },
    ],
  }),
  component: Home,
});

function Home() {
  const [tab, setTab] = useState<Tab>("home");

  const { data } = useQuery({
    queryKey: ["live-matches"],
    queryFn: () => getLiveMatches(),
    initialData: { matches: MOCK_LIVE, source: "mock" as const },
    refetchInterval: 60_000,
  });

  const hero = MOCK_ARTICLES.filter((a) => a.hero);
  const rest = MOCK_ARTICLES.filter((a) => !a.hero);

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      <LiveTicker matches={data.matches} source={data.source} />

      {tab === "home" && (
        <>
          <HeroSlider articles={hero} />
          <section className="px-4 pt-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-black tracking-tight">📰 The Feed</h2>
              <div className="no-scrollbar flex gap-1.5 overflow-x-auto text-xs">
                {["All", "TransferRumor", "UCL", "PremierLeague", "EpicFail"].map((t, i) => (
                  <button key={t} className={`shrink-0 rounded-full px-3 py-1 font-black uppercase tracking-wide ${i === 0 ? "bg-primary text-primary-foreground glow-purple" : "bg-secondary text-muted-foreground"}`}>
                    #{t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rest.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>
          </section>
          <StandingsWidget />
        </>
      )}

      {tab === "live" && <LiveView matches={data.matches} source={data.source} />}
      {tab === "leagues" && <StandingsWidget />}
      {tab === "me" && <MeView />}

      <BottomNav tab={tab} onChange={setTab} />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto grid max-w-2xl grid-cols-[auto_1fr_auto_auto] items-center gap-2 px-4 py-3">
        <button aria-label="Menu" className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground hover:text-primary">
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="truncate text-xl font-black tracking-tight">
          <span className="text-glow-purple text-primary">Kick</span>off<span className="ml-1 inline-block h-2 w-2 rounded-full bg-neon-green glow-green" />
        </h1>
        <button aria-label="Search" className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground hover:text-primary">
          <Search className="h-5 w-5" />
        </button>
        <button aria-label="Notifications" className="relative grid h-9 w-9 place-items-center rounded-xl bg-secondary text-foreground hover:text-primary">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-neon-pink glow-pink" />
        </button>
      </div>
    </header>
  );
}

function LiveView({ matches, source }: { matches: typeof MOCK_LIVE; source: "live" | "mock" }) {
  return (
    <section className="px-4 pt-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight">⚡ All Live</h2>
        <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-black uppercase text-muted-foreground">
          {source === "live" ? "Real-time" : "Demo data"}
        </span>
      </div>
      <div className="space-y-2">
        {matches.map((m) => (
          <div key={m.id} className="gradient-card grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-2xl border border-border/60 px-4 py-3">
            <span className="shrink-0 rounded-md bg-secondary px-2 py-0.5 text-[10px] font-black uppercase text-neon-purple">{m.competition}</span>
            <div className="min-w-0 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <span className="truncate text-right text-sm font-bold">{m.home}</span>
              <span className="rounded-lg bg-background px-3 py-1 font-mono text-base font-black">
                {m.homeScore}<span className="mx-1 text-muted-foreground">:</span>{m.awayScore}
              </span>
              <span className="truncate text-sm font-bold">{m.away}</span>
            </div>
            <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${
              m.status === "LIVE" ? "bg-destructive/20 text-destructive" : "bg-secondary text-muted-foreground"
            }`}>
              {m.status === "LIVE" && <span className="animate-live-pulse h-1.5 w-1.5 rounded-full bg-destructive" />}
              {m.minute}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MeView() {
  return (
    <section className="px-4 pt-8">
      <div className="gradient-hero rounded-3xl p-6 text-center glow-purple">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-background/30 text-3xl font-black backdrop-blur">🔥</div>
        <h2 className="mt-4 text-2xl font-black text-white">You're on the guest list</h2>
        <p className="mt-1 text-sm text-white/80">Sign up to save teams, react, and get streak rewards.</p>
        <button className="mt-4 rounded-full bg-background px-6 py-2.5 text-sm font-black uppercase tracking-wider text-primary">
          Join Kickoff
        </button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3">
        {["Following", "Streak", "Hyped", "Shared"].map((k, i) => (
          <div key={k} className="gradient-card rounded-2xl border border-border/60 p-4">
            <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">{k}</p>
            <p className="mt-1 text-2xl font-black">{[12, 7, 348, 24][i]}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
