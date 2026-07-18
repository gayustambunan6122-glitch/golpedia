import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { api } from "@/lib/admin-api";
import { Upload, Save, Trash2 } from "lucide-react";

const searchSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
});

export const Route = createFileRoute("/admin/editor")({
  validateSearch: (s) => searchSchema.parse(s),
  component: Editor,
});

type FormState = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string;
  cover_position_y: number;
  tag: string;
  category_id: string;
  is_published: boolean;
};

const empty: FormState = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  cover_image: "",
  cover_position_y: 50,
  tag: "",
  category_id: "",
  is_published: true,
};

function Editor() {
  const router = useRouter();
  const qc = useQueryClient();
  const { id } = Route.useSearch();
  const isNew = !id;

  const [form, setForm] = useState<FormState>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => api.listCategories(),
  });

  const { data: existing } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: () => api.getArticle(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title,
        slug: existing.slug,
        summary: existing.summary,
        content: existing.content,
        cover_image: existing.cover_image ?? "",
        cover_position_y: existing.cover_position_y ?? 50,
        tag: existing.tag ?? "",
        category_id: existing.category_id
          ? String(existing.category_id)
          : "",
        is_published: !!existing.is_published,
      });
    }
  }, [existing]);

  function update<K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function onUpload(file: File) {
    setUploading(true);
    setError(null);

    try {
      const url = await api.uploadCover(file);

      setForm((current) => ({
        ...current,
        cover_image: url,
        cover_position_y: 50,
      }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        summary: form.summary.trim(),
        content: form.content,
        cover_image: form.cover_image || null,
        cover_position_y: form.cover_position_y,
        tag: form.tag.trim() || null,
        category_id: form.category_id
          ? Number(form.category_id)
          : null,
        is_published: form.is_published ? 1 : 0,
      };

      if (isNew) {
        await api.createArticle(payload);
      } else {
        await api.updateArticle(id!, payload);
      }

      qc.invalidateQueries({
        queryKey: ["admin-articles"],
      });

      qc.invalidateQueries({
        queryKey: ["public-articles"],
      });

      router.navigate({
        to: "/admin",
      });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!id) return;

    if (!confirm(`Delete "${form.title}"?`)) {
      return;
    }

    try {
      await api.deleteArticle(id);

      qc.invalidateQueries({
        queryKey: ["admin-articles"],
      });

      qc.invalidateQueries({
        queryKey: ["public-articles"],
      });

      router.navigate({
        to: "/admin",
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }

  return (
    <form onSubmit={onSave} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black tracking-tight">
          {isNew ? "New article" : "Edit article"}
        </h2>

        {!isNew && (
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 rounded-full bg-neon-pink/20 px-3 py-1.5 text-xs font-black uppercase text-neon-pink"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        )}
      </div>

      <Field label="Title">
        <input
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          required
          maxLength={200}
          className="w-full rounded-xl bg-secondary px-3 py-2.5 text-base font-bold outline-none focus:ring-2 focus:ring-primary"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Slug (auto if empty)">
          <input
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            maxLength={220}
            placeholder="my-article-slug"
            className="w-full rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>

        <Field label="Tag (e.g. #TransferRumor)">
          <input
            value={form.tag}
            onChange={(e) => update("tag", e.target.value)}
            maxLength={50}
            className="w-full rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </Field>
      </div>

      <Field label="Category">
        <select
          value={form.category_id}
          onChange={(e) => update("category_id", e.target.value)}
          className="w-full rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">— none —</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Cover image">
        <div className="space-y-3">
          {form.cover_image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-secondary">
              <img
                src={form.cover_image}
                alt="Cover preview"
                className="absolute inset-0 h-full w-full object-cover"
                style={{
                  objectPosition: `50% ${form.cover_position_y}%`,
                }}
              />

              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          )}

          {form.cover_image && (
            <div className="rounded-xl bg-secondary p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  Posisi vertikal cover
                </span>

                <span className="rounded-md bg-background px-2 py-1 text-xs font-black">
                  {form.cover_position_y}%
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={form.cover_position_y}
                onChange={(e) =>
                  update(
                    "cover_position_y",
                    Number(e.target.value),
                  )
                }
                className="w-full cursor-pointer accent-primary"
              />

              <div className="mt-1 flex justify-between text-[10px] font-bold uppercase text-muted-foreground">
                <span>Atas</span>
                <span>Tengah</span>
                <span>Bawah</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    update("cover_position_y", 0)
                  }
                  className="rounded-lg bg-background px-3 py-1.5 text-xs font-black hover:text-primary"
                >
                  Atas
                </button>

                <button
                  type="button"
                  onClick={() =>
                    update("cover_position_y", 50)
                  }
                  className="rounded-lg bg-background px-3 py-1.5 text-xs font-black hover:text-primary"
                >
                  Tengah
                </button>

                <button
                  type="button"
                  onClick={() =>
                    update("cover_position_y", 100)
                  }
                  className="rounded-lg bg-background px-3 py-1.5 text-xs font-black hover:text-primary"
                >
                  Bawah
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              value={form.cover_image}
              onChange={(e) =>
                update("cover_image", e.target.value)
              }
              placeholder="https://…  (or upload)"
              className="min-w-0 flex-1 rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-neon-green/20 px-3 py-2.5 text-xs font-black uppercase text-neon-green disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" />
              {uploading ? "…" : "Upload"}
            </button>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  onUpload(file);
                }

                e.target.value = "";
              }}
            />
          </div>
        </div>
      </Field>

      <Field label="Summary">
        <textarea
          value={form.summary}
          onChange={(e) => update("summary", e.target.value)}
          required
          maxLength={500}
          rows={2}
          className="w-full rounded-xl bg-secondary px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </Field>

      <Field label="Content (Markdown or HTML)">
        <textarea
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          required
          rows={12}
          className="w-full rounded-xl bg-secondary px-3 py-2.5 font-mono text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm font-bold">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) =>
            update("is_published", e.target.checked)
          }
          className="h-4 w-4 accent-primary"
        />

        Published (uncheck for draft)
      </label>

      {error && (
        <p className="text-sm font-bold text-neon-pink">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-black uppercase tracking-wider text-primary-foreground glow-purple disabled:opacity-60"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving…"
            : isNew
              ? "Publish"
              : "Save changes"}
        </button>

        <button
          type="button"
          onClick={() =>
            router.navigate({
              to: "/admin",
            })
          }
          className="rounded-full bg-secondary px-4 py-3 text-sm font-black uppercase tracking-wider hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      {children}
    </label>
  );
}
