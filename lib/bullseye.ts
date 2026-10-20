import { posts as all } from "@/content/bullseye";

export type Image = { src: string; w: number; h: number };

export type Block =
  | { type: "p"; html: string }
  | { type: "h"; text: string }
  | { type: "quote"; html: string }
  | { type: "ol" | "ul"; items: string[] }
  | ({ type: "img" } & Image)
  | { type: "gallery"; images: Image[] }
  | { type: "youtube"; id: string };

export type Post = {
  slug: string;
  title: string;
  author: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  readTime: string | null;
  blocks: Block[];
};

/** Newest first */
export const posts: Post[] = [...all].sort((a, b) => b.date.localeCompare(a.date));

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

/** Plain-text excerpt from the first paragraph, for metadata */
export function excerpt(post: Post, max = 160) {
  const p = post.blocks.find((b) => b.type === "p");
  if (!p || p.type !== "p") return undefined;
  const text = p.html.replace(/<[^>]+>/g, "").replace(/&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
