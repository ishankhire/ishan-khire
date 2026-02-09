import fs from 'fs';
import path from 'path';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const contentDir = path.join(process.cwd(), 'content/blog');

interface Frontmatter {
  title: string;
  date: string;
  description: string;
}

interface Post extends Frontmatter {
  slug: string;
}

// Read all posts and extract frontmatter
export async function getAllPosts(): Promise<Post[]> {
  const files = fs.readdirSync(contentDir);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace('.mdx', '');
        const source = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const { frontmatter } = await compileMDX<Frontmatter>({
          source,
          options: {
            parseFrontmatter: true,
            mdxOptions: {
              remarkPlugins: [remarkMath],
              rehypePlugins: [rehypeKatex],
            },
          },
        });
        return { slug, ...frontmatter };
      })
  );
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

// Get single post with compiled content
export async function getPostBySlug(slug: string) {
  const source = fs.readFileSync(
    path.join(contentDir, `${slug}.mdx`),
    'utf8'
  );

  const { content, frontmatter } = await compileMDX<Frontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeKatex],
      },
    },
  });

  return { content, frontmatter, slug };
}
