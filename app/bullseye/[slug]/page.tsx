import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Corners from "@/components/Corners";
import { excerpt, formatDate, getPost, posts, type Block } from "@/lib/bullseye";
import styles from "./page.module.css";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/bullseye/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  return { title: post.title, description: excerpt(post) };
}

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "h":
      return <h2 className={styles.subhead}>{block.text}</h2>;
    case "quote":
      return <blockquote className={styles.quote} dangerouslySetInnerHTML={{ __html: block.html }} />;
    case "ol":
    case "ul": {
      const List = block.type;
      return (
        <List className={styles.list}>
          {block.items.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
          ))}
        </List>
      );
    }
    case "img":
      return (
        <figure className={`blueprint ${styles.figure}`}>
          <Image src={block.src} alt="" width={block.w} height={block.h} sizes="(max-width: 800px) 100vw, 760px" />
          <Corners />
        </figure>
      );
    case "gallery":
      return (
        <div className={styles.gallery}>
          {block.images.map((img) => (
            <figure key={img.src} className={styles.galleryItem}>
              <Image src={img.src} alt="" width={img.w} height={img.h} sizes="(max-width: 800px) 50vw, 250px" />
            </figure>
          ))}
        </div>
      );
    case "youtube":
      return (
        <figure className={`blueprint ${styles.video}`}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${block.id}`}
            title="YouTube video"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
          <Corners />
        </figure>
      );
  }
}

export default async function PostPage({ params }: PageProps<"/bullseye/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const i = posts.indexOf(post);
  const newer = posts[i - 1];
  const older = posts[i + 1];

  return (
    <main className={styles.wrap}>
      <Link href="/bullseye" className={styles.back}>
        ← The Bullseye
      </Link>
      <header className={styles.header}>
        <span className={styles.meta}>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.author}</span>
          {post.readTime && <span>{post.readTime}</span>}
        </span>
        <h1 className={styles.title}>{post.title}</h1>
      </header>
      <article className={styles.body}>
        {post.blocks.map((b, k) => (
          <BlockView key={k} block={b} />
        ))}
      </article>
      <nav className={styles.pager} aria-label="More posts">
        {older ? (
          <Link href={`/bullseye/${older.slug}`} className={styles.pagerLink}>
            <span className={styles.pagerLabel}>← Older</span>
            <span className={styles.pagerTitle}>{older.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link href={`/bullseye/${newer.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`}>
            <span className={styles.pagerLabel}>Newer →</span>
            <span className={styles.pagerTitle}>{newer.title}</span>
          </Link>
        )}
      </nav>
    </main>
  );
}
