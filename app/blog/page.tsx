import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Blog' }

export default function Blog() {
  const posts = getAllPosts()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-slate-500">No posts yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-800">
          {posts.map(post => (
            <li key={post.slug} className="py-4 first:pt-0">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex justify-between items-baseline gap-4"
              >
                <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </span>
                <span className="shrink-0 text-sm text-slate-400 dark:text-slate-500 tabular-nums">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
