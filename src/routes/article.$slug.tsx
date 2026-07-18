import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, Eye } from "lucide-react";
import { api, type AdminArticle } from "@/lib/admin-api";

export const Route = createFileRoute("/article/$slug")({
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const { slug } = Route.useParams();

  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery<AdminArticle[]>({
    queryKey: ["public-articles"],
    queryFn: () => api.listArticles(),
  });

  const article = articles.find((item) => item.slug === slug);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-2xl text-center font-bold text-muted-foreground animate-pulse">
          ⚡ Memuat artikel...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 font-bold text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <div className="rounded-2xl border border-destructive/40 p-6">
            <h1 className="text-xl font-black">
              Gagal mengambil artikel
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Periksa koneksi API atau backend.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!article) {
    return (
      <main className="min-h-screen bg-background px-4 py-10">
        <div className="mx-auto max-w-2xl">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 font-bold text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke beranda
          </Link>

          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <div className="text-5xl">📭</div>
            <h1 className="mt-4 text-2xl font-black">
              Artikel tidak ditemukan
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tidak ada artikel dengan slug:
            </p>
            <code className="mt-2 inline-block rounded-lg bg-secondary px-3 py-1 text-sm">
              {slug}
            </code>
          </div>
        </div>
      </main>
    );
  }

  const createdDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen bg-background pb-16">
      <article className="mx-auto max-w-2xl">
        <div className="px-4 pt-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-black text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {article.cover_image && (
          <img
            src={article.cover_image}
            alt={article.title}
            className="mt-5 aspect-video w-full object-cover sm:rounded-3xl"
          />
        )}

        <div className="px-4 pt-6">
          {article.tag && (
            <span className="inline-block rounded-full bg-primary/15 px-3 py-1 text-xs font-black uppercase text-primary">
              {article.tag}
            </span>
          )}

          <h1 className="mt-4 text-3xl font-black leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground">
            {createdDate && (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {createdDate}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {article.views_count || 0} kali dibaca
            </span>
          </div>

          {article.summary && (
            <p className="mt-6 rounded-2xl border border-border bg-card p-4 text-base font-semibold leading-7 text-muted-foreground">
              {article.summary}
            </p>
          )}

          <div className="mt-7 whitespace-pre-line text-base leading-8">
            {article.content}
          </div>
        </div>
      </article>
    </main>
  );
}
