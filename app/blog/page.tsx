import Link from 'next/link';
import { getAllPosts } from '@/lib/mdx';

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-8">Blog</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="block group">
              <h2 className="text-lg font-normal text-zinc-900 dark:text-zinc-50 group-hover:text-zinc-600 group-hover:underline dark:group-hover:text-zinc-300 transition-colors">
                {post.title}
              </h2>
              <time className="text-sm text-zinc-500 dark:text-zinc-400">
                {post.date}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
