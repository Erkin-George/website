import { getAllPosts, getPost } from '@/lib/posts'
import { MDXRemote } from 'next-mdx-remote/rsc'
import NextImage from 'next/image'
import { notFound } from 'next/navigation'

const mdxComponents = {
  img: ({ src, alt }: { src?: string; alt?: string }) => (
    <NextImage
      src={src || ''}
      alt={alt || ''}
      width={0}
      height={0}
      sizes="100vw"
      className="w-full h-auto rounded-lg"
    />
  ),
}

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts().map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  try {
    const post = getPost(slug)
    return { title: post.title }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = getPost(slug)
  } catch {
    notFound()
  }

  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <time className="block text-sm text-slate-400 dark:text-slate-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
      </header>
      <div className="prose dark:prose-invert max-w-none">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>
    </article>
  )
}
