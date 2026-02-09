import { getAllPosts, getPostBySlug } from '@/lib/mdx';

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface BlogPostProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const { content, frontmatter } = await getPostBySlug(slug);

  return (
    <article className="prose dark:prose-invert max-w-none">
      <h1>{frontmatter.title}</h1>
      <time className="text-sm text-zinc-500 dark:text-zinc-400">
        {frontmatter.date}
      </time>
      <div className="mt-8">{content}</div>
    </article>
  );
}
