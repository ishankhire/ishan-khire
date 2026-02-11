import Link from 'next/link';

export function Navigation() {
  return (
    <nav className="flex gap-6 text-base">
      <Link
        href="/"
        className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Hi!
      </Link>
      <Link
        href="/blog"
        className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Blog
      </Link>
      <Link
        href="/habits"
        className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Habits
      </Link>
      <Link
        href="/work-log"
        className="text-zinc-600 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        Work Log
      </Link>
    </nav>
  );
}
