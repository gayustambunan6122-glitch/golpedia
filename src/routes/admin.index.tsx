import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type AdminArticle } from "@/lib/admin-api";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin/")({
  component: ArticlesList,
});

function ArticlesList() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: () => api.listArticles(),
  });

  const del = useMutation({
    mutationFn: (id: number) => api.deleteArticle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-articles"] }),
  });

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (error) return <p className="text-sm text-neon-pink">Error: {(error as Error).message}</p>;

  const articles = data ?? [];

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">Articles</h2>
        <span className="text-xs font-bold text-muted-foreground">{articles.length} total</span>
      </div>

      {articles.length === 0 && (
        <div className="gradient-card rounded-2xl border border-border/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">No articles yet.</p>
          <Link to="/admin/editor" className="mt-3 inline-block rounded-full bg-primary px-4 py-2 text-xs font-black uppercase text-primary-foreground">
            Create the first one
          </Link>
        </div>
      )}

      <ul className="space-y-2">
        {articles.map((a: AdminArticle) => (
          <li key={a.id} className="gradient-card grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-2xl border border-border/60 p-3">
            <div className="h-14 w-14 overflow-hidden rounded-xl bg-secondary">
              {a.cover_image
                ? <img src={a.cover_image} alt="" className="h-full w-full object-cover" />
                : <div className="grid h-full w-full place-items-center text-xs text-muted-foreground">no img</div>}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{a.title}</p>
              <p className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                {a.is_published
                  ? <span className="inline-flex items-center gap-1 text-neon-green"><Eye className="h-3 w-3" /> Published</span>
                  : <span className="inline-flex items-center gap-1"><EyeOff className="h-3 w-3" /> Draft</span>}
                {a.tag && <span className="rounded-full bg-secondary px-2 py-0.5 font-bold">{a.tag}</span>}
                {a.category_name && <span>· {a.category_name}</span>}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/admin/editor"
                search={{ id: a.id }}
                className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:text-primary"
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Link>
              <button
                onClick={() => {
                  if (confirm(`Delete "${a.title}"?`)) del.mutate(a.id);
                }}
                className="grid h-9 w-9 place-items-center rounded-lg bg-secondary hover:text-neon-pink"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
