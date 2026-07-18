// Admin API client.
// - When VITE_API_BASE_URL is set → talks to your cPanel PHP backend.
// - Otherwise → falls back to a localStorage-backed mock so the admin UI
//   is fully usable in the Lovable preview.

import { MOCK_ARTICLES } from "./mock-data";

export type AdminArticle = {
  id: number;
  category_id: number | null;
  category_name?: string | null;
  title: string;
  slug: string;
  summary: string;
  content: string;
  cover_image: string | null;
  tag: string | null;
  is_published: number;
  views_count?: number;
  reactions_count?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type Category = { id: number; name: string; slug: string };

const BASE = "https://memberspesial.art/api-php";
export const IS_MOCK = false; // Matikan mode bohong-bohongan secara paksa

const TOKEN_KEY = "kickoff_admin_token";
const MOCK_ARTICLES_KEY = "kickoff_mock_articles";
const MOCK_CATS_KEY = "kickoff_mock_categories";

export const auth = {
  token: () => (typeof window === "undefined" ? null : localStorage.getItem(TOKEN_KEY)),
  set: (t: string) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
  isLoggedIn: () => !!auth.token(),
};

async function http<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = auth.token();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((json as { error?: string }).error || `HTTP ${res.status}`);
  return json as T;
}

// ---------- mock store ----------
function mockSeed(): AdminArticle[] {
  return MOCK_ARTICLES.map((a, i) => ({
    id: i + 1,
    category_id: null,
    title: a.title,
    slug: a.slug,
    summary: a.summary,
    content: `${a.summary}\n\n(This is seeded demo content. In production your article body renders here.)`,
    cover_image: a.cover,
    tag: a.tag,
    is_published: 1,
    views_count: 0,
    reactions_count: a.reactions,
    comments_count: a.comments,
    created_at: new Date(Date.now() - a.minutesAgo * 60_000).toISOString(),
  }));
}
function mockCats(): Category[] {
  return [
    { id: 1, name: "Premier League", slug: "premier-league" },
    { id: 2, name: "La Liga", slug: "la-liga" },
    { id: 3, name: "Serie A", slug: "serie-a" },
    { id: 4, name: "Champions League", slug: "ucl" },
    { id: 5, name: "Transfer Rumors", slug: "transfers" },
  ];
}
function mockLoad(): AdminArticle[] {
  if (typeof window === "undefined") return mockSeed();
  const raw = localStorage.getItem(MOCK_ARTICLES_KEY);
  if (raw) return JSON.parse(raw) as AdminArticle[];
  const seed = mockSeed();
  localStorage.setItem(MOCK_ARTICLES_KEY, JSON.stringify(seed));
  return seed;
}
function mockSave(items: AdminArticle[]) {
  localStorage.setItem(MOCK_ARTICLES_KEY, JSON.stringify(items));
}
function mockLoadCats(): Category[] {
  if (typeof window === "undefined") return mockCats();
  const raw = localStorage.getItem(MOCK_CATS_KEY);
  if (raw) return JSON.parse(raw) as Category[];
  const seed = mockCats();
  localStorage.setItem(MOCK_CATS_KEY, JSON.stringify(seed));
  return seed;
}
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
  Math.random().toString(36).slice(2, 8);

// ---------- API ----------
export const api = {
  async login(email: string, password: string) {
    if (IS_MOCK) {
      if (!email || !password) throw new Error("Email and password required");
      auth.set("mock-token");
      return { email };
    }
    const res = await http<{ token: string; email: string }>("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    auth.set(res.token);
    return { email: res.email };
  },
  logout() { auth.clear(); },

  async listArticles(): Promise<AdminArticle[]> {
    if (IS_MOCK) return mockLoad().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    return http<AdminArticle[]>("/articles");
  },
  async getArticle(id: number): Promise<AdminArticle> {
    if (IS_MOCK) {
      const a = mockLoad().find((x) => x.id === id);
      if (!a) throw new Error("Not found");
      return a;
    }
    return http<AdminArticle>(`/articles/${id}`);
  },
  async createArticle(input: Partial<AdminArticle>): Promise<{ id: number }> {
    if (IS_MOCK) {
      const items = mockLoad();
      const id = (items.at(0)?.id || 0) + 1;
      items.unshift({
        id,
        category_id: input.category_id ?? null,
        title: input.title || "Untitled",
        slug: input.slug || slugify(input.title || `post-${id}`),
        summary: input.summary || "",
        content: input.content || "",
        cover_image: input.cover_image || null,
        tag: input.tag || null,
        is_published: input.is_published ?? 1,
        views_count: 0, reactions_count: 0, comments_count: 0,
        created_at: new Date().toISOString(),
      });
      mockSave(items);
      return { id };
    }
    return http<{ id: number }>("/articles", { method: "POST", body: JSON.stringify(input) });
  },
  async updateArticle(id: number, input: Partial<AdminArticle>) {
    if (IS_MOCK) {
      const items = mockLoad().map((a) => (a.id === id ? { ...a, ...input } : a));
      mockSave(items);
      return { ok: true };
    }
    return http<{ ok: true }>(`/articles/${id}`, { method: "PUT", body: JSON.stringify(input) });
  },
  async deleteArticle(id: number) {
    if (IS_MOCK) {
      mockSave(mockLoad().filter((a) => a.id !== id));
      return { ok: true };
    }
    return http<{ ok: true }>(`/articles/${id}`, { method: "DELETE" });
  },

  async listCategories(): Promise<Category[]> {
    if (IS_MOCK) return mockLoadCats();
    return http<Category[]>("/categories");
  },

  async uploadCover(file: File): Promise<string> {
    if (IS_MOCK) {
      // Preview mode: return a data URL so the image renders immediately.
      return await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result));
        r.onerror = () => reject(new Error("Read failed"));
        r.readAsDataURL(file);
      });
    }
    const fd = new FormData();
    fd.append("file", file);
    const token = auth.token();
    const res = await fetch(`${BASE}/upload`, {
      method: "POST",
      body: fd,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    const json = (await res.json()) as { url?: string; error?: string };
    if (!res.ok || !json.url) throw new Error(json.error || "Upload failed");
    return json.url;
  },
};
