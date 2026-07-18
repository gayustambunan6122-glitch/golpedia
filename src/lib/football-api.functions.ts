import { createServerFn } from "@tanstack/react-start";
import { MOCK_LIVE, type LiveMatch } from "./mock-data";

/**
 * Fetch live matches from Football-Data.org with a graceful mock fallback.
 * Set FOOTBALL_DATA_API_KEY in the environment (secrets) to enable live data.
 * Free tier: 10 requests/min — we cache-bust minimally and fall back on any error.
 */
export const getLiveMatches = createServerFn({ method: "GET" }).handler(async (): Promise<{
  matches: LiveMatch[];
  source: "live" | "mock";
}> => {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) return { matches: MOCK_LIVE, source: "mock" };

  try {
    const res = await fetch("https://api.football-data.org/v4/matches?status=LIVE,IN_PLAY,PAUSED", {
      headers: { "X-Auth-Token": apiKey },
    });
    if (!res.ok) throw new Error(`FD ${res.status}`);
    const json = (await res.json()) as {
      matches: Array<{
        id: number;
        competition: { code: string; name: string };
        homeTeam: { shortName?: string; name: string };
        awayTeam: { shortName?: string; name: string };
        score: { fullTime: { home: number | null; away: number | null } };
        minute?: number | null;
        status: string;
      }>;
    };
    const matches: LiveMatch[] = (json.matches ?? []).slice(0, 12).map((m) => ({
      id: String(m.id),
      competition: m.competition.code || m.competition.name,
      home: m.homeTeam.shortName ?? m.homeTeam.name,
      away: m.awayTeam.shortName ?? m.awayTeam.name,
      homeScore: m.score.fullTime.home ?? 0,
      awayScore: m.score.fullTime.away ?? 0,
      minute: m.minute ? `${m.minute}'` : m.status === "PAUSED" ? "HT" : "LIVE",
      status: m.status === "PAUSED" ? "HT" : m.status === "FINISHED" ? "FT" : "LIVE",
    }));
    return { matches: matches.length ? matches : MOCK_LIVE, source: matches.length ? "live" : "mock" };
  } catch {
    return { matches: MOCK_LIVE, source: "mock" };
  }
});
