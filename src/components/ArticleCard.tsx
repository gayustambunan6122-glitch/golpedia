import { useState } from "react";
import type { Article } from "@/lib/mock-data";
import { TagBadge } from "./HeroSlider";
import { Flame, MessageCircle, Share2, Send } from "lucide-react";

export function ArticleCard({ article }: { article: Article }) {
  const [hyped, setHyped] = useState(false);
  const [count, setCount] = useState(article.reactions);
  const [openComments, setOpenComments] = useState(false);

  const react = () => {
    setHyped((h) => {
      setCount((c) => c + (h ? -1 : 1));
      return !h;
    });
  };

  const share = async () => {
    const shareData = { title: article.title, text: article.summary, url: `#/${article.slug}` };
    if (navigator.share) { try { await navigator.share(shareData); } catch { /* noop */ } }
    else { navigator.clipboard?.writeText(`${shareData.title} — ${shareData.url}`); }
  };

  return (
    <article className="animate-float-up gradient-card overflow-hidden rounded-3xl border border-border/60 transition hover:border-primary/60">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={article.cover} alt={article.title} className="h-full w-full object-cover transition duration-500 hover:scale-105" loading="lazy" />
        <div className="absolute left-3 top-3">
          <TagBadge color={article.tagColor} label={article.tag} />
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-black leading-snug">{article.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-semibold">{article.author} · {article.minutesAgo}m</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={react}
            className={`group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide transition ${
              hyped ? "bg-neon-pink/20 text-neon-pink glow-pink" : "bg-secondary text-foreground hover:bg-neon-pink/10 hover:text-neon-pink"
            }`}
          >
            <Flame className={`h-3.5 w-3.5 ${hyped ? "fill-current" : ""}`} />
            {format(count)} Hyped
          </button>
          <button
            onClick={() => setOpenComments((o) => !o)}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-black uppercase tracking-wide transition hover:bg-neon-purple/10 hover:text-neon-purple"
          >
            <MessageCircle className="h-3.5 w-3.5" />{format(article.comments)}
          </button>
          <button
            onClick={share}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-black uppercase tracking-wide transition hover:bg-neon-green/10 hover:text-neon-green"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
        {openComments && <Comments />}
      </div>
    </article>
  );
}

function Comments() {
  const [comments, setComments] = useState([
    { user: "@fifi", text: "goat behaviour 🐐", time: "2m" },
    { user: "@messi_stan", text: "we been knew", time: "5m" },
  ]);
  const [input, setInput] = useState("");
  return (
    <div className="mt-3 space-y-2 rounded-2xl bg-background/60 p-3">
      {comments.map((c, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-hero text-[10px] font-black">
            {c.user[1].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs"><span className="font-black text-neon-purple">{c.user}</span> <span className="text-muted-foreground">· {c.time}</span></p>
            <p className="truncate text-sm">{c.text}</p>
          </div>
        </div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          setComments((cs) => [...cs, { user: "@you", text: input, time: "now" }]);
          setInput("");
        }}
        className="flex items-center gap-2 pt-1"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Drop a take…"
          className="min-w-0 flex-1 rounded-full bg-secondary px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground glow-purple">
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function format(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
}
