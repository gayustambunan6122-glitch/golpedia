import { createFileRoute, Outlet, Link, useRouter, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, LayoutList, Plus, ArrowLeft } from "lucide-react";
import { auth, api, IS_MOCK } from "@/lib/admin-api";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Kickoff" },
      { name: "description", content: "Manage Kickoff articles, categories and cover images." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(auth.isLoggedIn());
    setReady(true);
  }, [pathname]);

  useEffect(() => {
    if (ready && !loggedIn && pathname !== "/admin/login") {
      router.navigate({ to: "/admin/login" });
    }
  }, [ready, loggedIn, pathname, router]);

  if (!ready) return null;

  const isLogin = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {!isLogin && loggedIn && (
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
            <Link to="/" className="grid h-9 w-9 place-items-center rounded-xl bg-secondary hover:text-primary" aria-label="Back to site">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-black tracking-tight">
              <span className="text-primary">Kick</span>off Admin
            </h1>
            {IS_MOCK && (
              <span className="ml-2 rounded-full bg-neon-pink/20 px-2 py-0.5 text-[10px] font-black uppercase text-neon-pink">
                Preview / Mock
              </span>
            )}
            <nav className="ml-auto flex items-center gap-1">
              <Link
                to="/admin"
                activeOptions={{ exact: true }}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-wide bg-secondary hover:text-primary"
                activeProps={{ className: "bg-primary text-primary-foreground" }}
              >
                <LayoutList className="h-3.5 w-3.5" /> Articles
              </Link>
              <Link
                to="/admin/editor"
                className="inline-flex items-center gap-1.5 rounded-full bg-neon-green/20 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-neon-green"
              >
                <Plus className="h-3.5 w-3.5" /> New
              </Link>
              <button
                onClick={() => { api.logout(); router.navigate({ to: "/admin/login" }); }}
                className="grid h-9 w-9 place-items-center rounded-xl bg-secondary hover:text-neon-pink"
                aria-label="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </nav>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
