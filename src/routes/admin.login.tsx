import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api, IS_MOCK } from "@/lib/admin-api";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(null);
    try {
      await api.login(email.trim(), password);
      router.navigate({ to: "/admin" });
    } catch (err) {
      setError((err as Error).message);
    } finally { setBusy(false); }
  }

  return (
    <div className="mx-auto mt-10 max-w-sm">
      <div className="gradient-card rounded-3xl border border-border/60 p-6">
        <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-hero glow-purple">
          <Lock className="h-5 w-5 text-white" />
        </div>
        <h1 className="mt-4 text-2xl font-black tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {IS_MOCK
            ? "Preview mode — any email / password will unlock the mock editor."
            : "Enter the admin email + password you configured on the server."}
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-3">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-xs font-bold text-neon-pink">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-2xl bg-primary py-3 text-sm font-black uppercase tracking-wider text-primary-foreground glow-purple disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
