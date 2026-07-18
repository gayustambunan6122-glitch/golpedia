export type LiveMatch = {
  id: string;
  competition: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: string;
  status: "LIVE" | "HT" | "FT" | "SCHEDULED";
  time?: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover: string;
  tag: string;
  tagColor: "purple" | "green" | "pink" | "cyan";
  author: string;
  reactions: number;
  comments: number;
  minutesAgo: number;
  hero?: boolean;
};

export type Standing = {
  pos: number;
  team: string;
  played: number;
  gd: number;
  points: number;
  form: ("W" | "D" | "L")[];
};

export type Fixture = {
  id: string;
  competition: string;
  home: string;
  away: string;
  kickoff: string;
};

export const MOCK_LIVE: LiveMatch[] = [
  { id: "m1", competition: "PL", home: "Arsenal", away: "Chelsea", homeScore: 2, awayScore: 1, minute: "67'", status: "LIVE" },
  { id: "m2", competition: "La Liga", home: "Real Madrid", away: "Barcelona", homeScore: 1, awayScore: 1, minute: "42'", status: "LIVE" },
  { id: "m3", competition: "Serie A", home: "Inter", away: "Milan", homeScore: 0, awayScore: 0, minute: "HT", status: "HT" },
  { id: "m4", competition: "UCL", home: "Bayern", away: "PSG", homeScore: 3, awayScore: 2, minute: "82'", status: "LIVE" },
  { id: "m5", competition: "PL", home: "Man City", away: "Liverpool", homeScore: 1, awayScore: 2, minute: "55'", status: "LIVE" },
  { id: "m6", competition: "La Liga", home: "Atletico", away: "Sevilla", homeScore: 2, awayScore: 0, minute: "FT", status: "FT" },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: "a1",
    title: "Mbappé's stunning hat-trick sends Madrid top of La Liga",
    slug: "mbappe-hat-trick-madrid-top",
    summary: "The French superstar delivered a masterclass at the Bernabéu with a 12-minute treble that had fans in absolute meltdown.",
    cover: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200&q=70",
    tag: "#LaLiga",
    tagColor: "purple",
    author: "Kai Bennett",
    reactions: 12400,
    comments: 892,
    minutesAgo: 14,
    hero: true,
  },
  {
    id: "a2",
    title: "LEAKED: Man United ready shock €120M bid for Bellingham",
    slug: "man-united-bellingham-bid",
    summary: "United's board reportedly gave the green light for a summer megadeal that could reshape the Premier League.",
    cover: "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=1200&q=70",
    tag: "#TransferRumor",
    tagColor: "pink",
    author: "Jules Marín",
    reactions: 8720,
    comments: 1240,
    minutesAgo: 32,
    hero: true,
  },
  {
    id: "a3",
    title: "UCL bracket unlocked: the 3 dark horses nobody is talking about",
    slug: "ucl-dark-horses",
    summary: "Forget the usual suspects. These teams have the vibes and the tactics to go all the way.",
    cover: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&q=70",
    tag: "#UCL",
    tagColor: "cyan",
    author: "Zayn A.",
    reactions: 5310,
    comments: 402,
    minutesAgo: 58,
    hero: true,
  },
  {
    id: "a4",
    title: "That penalty miss though 💀 goalkeeper trolls striker on IG",
    slug: "penalty-miss-troll",
    summary: "The internet is unhinged after this post-match story. We have receipts.",
    cover: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=1200&q=70",
    tag: "#EpicFail",
    tagColor: "pink",
    author: "Riya S.",
    reactions: 22100,
    comments: 3120,
    minutesAgo: 90,
  },
  {
    id: "a5",
    title: "Pep's press conference: 5 quotes that broke the group chat",
    slug: "pep-presser-quotes",
    summary: "He came, he saw, he dropped bars. Here are the moments that went viral.",
    cover: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1200&q=70",
    tag: "#PremierLeague",
    tagColor: "green",
    author: "Tomiwa O.",
    reactions: 3200,
    comments: 210,
    minutesAgo: 120,
  },
  {
    id: "a6",
    title: "New Nike x Serie A drop is actually fire — first look",
    slug: "nike-serie-a-kits",
    summary: "Retro cuts, neon trims, and one shirt everyone is going to wear off the pitch.",
    cover: "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?w=1200&q=70",
    tag: "#Drip",
    tagColor: "purple",
    author: "Sam H.",
    reactions: 6100,
    comments: 480,
    minutesAgo: 180,
  },
  {
    id: "a7",
    title: "Vinícius wins Ballon d'Or vote among Gen Z fans (poll)",
    slug: "vini-ballon-dor-genz",
    summary: "Our community voted and the results are… controversial. Slide to see the full breakdown.",
    cover: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=1200&q=70",
    tag: "#Debate",
    tagColor: "cyan",
    author: "Ella K.",
    reactions: 9840,
    comments: 2100,
    minutesAgo: 240,
  },
];

export const MOCK_STANDINGS: Record<string, Standing[]> = {
  PL: [
    { pos: 1, team: "Arsenal", played: 24, gd: 32, points: 58, form: ["W","W","D","W","W"] },
    { pos: 2, team: "Man City", played: 24, gd: 30, points: 55, form: ["W","L","W","W","D"] },
    { pos: 3, team: "Liverpool", played: 24, gd: 28, points: 54, form: ["W","W","W","D","W"] },
    { pos: 4, team: "Tottenham", played: 24, gd: 14, points: 48, form: ["L","W","W","D","W"] },
    { pos: 5, team: "Chelsea", played: 24, gd: 10, points: 44, form: ["D","W","L","W","W"] },
  ],
  "La Liga": [
    { pos: 1, team: "Real Madrid", played: 24, gd: 36, points: 62, form: ["W","W","W","D","W"] },
    { pos: 2, team: "Barcelona", played: 24, gd: 28, points: 56, form: ["W","D","W","W","L"] },
    { pos: 3, team: "Atletico", played: 24, gd: 20, points: 51, form: ["W","W","L","W","W"] },
    { pos: 4, team: "Athletic", played: 24, gd: 12, points: 45, form: ["D","W","D","W","W"] },
    { pos: 5, team: "Sevilla", played: 24, gd: 8, points: 40, form: ["L","D","W","W","L"] },
  ],
  "Serie A": [
    { pos: 1, team: "Inter", played: 24, gd: 34, points: 60, form: ["W","W","W","W","D"] },
    { pos: 2, team: "Juventus", played: 24, gd: 22, points: 53, form: ["D","W","W","L","W"] },
    { pos: 3, team: "Milan", played: 24, gd: 20, points: 51, form: ["W","D","W","W","L"] },
    { pos: 4, team: "Napoli", played: 24, gd: 15, points: 46, form: ["L","W","D","W","W"] },
    { pos: 5, team: "Roma", played: 24, gd: 10, points: 42, form: ["W","L","W","D","W"] },
  ],
  UCL: [
    { pos: 1, team: "Bayern", played: 6, gd: 10, points: 15, form: ["W","W","W","D","W"] },
    { pos: 2, team: "Real Madrid", played: 6, gd: 8, points: 13, form: ["W","W","D","W","L"] },
    { pos: 3, team: "PSG", played: 6, gd: 6, points: 12, form: ["W","D","W","W","L"] },
    { pos: 4, team: "Arsenal", played: 6, gd: 5, points: 11, form: ["W","W","L","W","D"] },
    { pos: 5, team: "Inter", played: 6, gd: 4, points: 10, form: ["D","W","W","L","W"] },
  ],
};

export const MOCK_FIXTURES: Fixture[] = [
  { id: "f1", competition: "PL", home: "Newcastle", away: "Brighton", kickoff: "Today · 20:00" },
  { id: "f2", competition: "La Liga", home: "Villarreal", away: "Girona", kickoff: "Today · 21:00" },
  { id: "f3", competition: "UCL", home: "Dortmund", away: "Atletico", kickoff: "Tomorrow · 21:00" },
  { id: "f4", competition: "Serie A", home: "Lazio", away: "Fiorentina", kickoff: "Tomorrow · 18:00" },
  { id: "f5", competition: "PL", home: "Aston Villa", away: "West Ham", kickoff: "Sat · 15:00" },
];
