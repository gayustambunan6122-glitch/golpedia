import { Home, Zap, Trophy, User } from "lucide-react";

type Tab = "home" | "live" | "leagues" | "me";

export function BottomNav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  const items: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "home", label: "Feed", icon: Home },
    { id: "live", label: "Live", icon: Zap },
    { id: "leagues", label: "Leagues", icon: Trophy },
    { id: "me", label: "Me", icon: User },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-around px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {items.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`group flex flex-1 flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 transition ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <span className={`grid h-8 w-10 place-items-center rounded-xl transition ${active ? "bg-primary/15 glow-purple" : ""}`}>
                <Icon className={`h-5 w-5 ${active && id === "live" ? "text-destructive" : ""}`} />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export type { Tab };
