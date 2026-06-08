import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDir = path.join(process.cwd(), 'content/posts')

export type PostMeta = {
  slug: string
  title: string
  date: string
}

export type Post = PostMeta & {
  content: string
}

// gray-matter parses unquoted YAML dates into Date objects, so normalize to an
// ISO string for stable typing, sorting, and formatting.
function normalizeDate(value: unknown): string {
  return value instanceof Date ? value.toISOString() : String(value)
}

// Resolve a slug to its file, supporting both .md and .mdx extensions.
function resolvePostPath(slug: string): string | null {
  for (const ext of ['.md', '.mdx']) {
    const filePath = path.join(postsDir, `${slug}${ext}`)
    if (fs.existsSync(filePath)) return filePath
  }
  return null
}

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDir)
    .filter(f => /\.mdx?$/.test(f))
    .flatMap(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const { data } = matter(fs.readFileSync(path.join(postsDir, fileName), 'utf8'))
      if (!data.title || data.draft) return []
      return [{ slug, title: data.title as string, date: normalizeDate(data.date) }]
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post {
  const filePath = resolvePostPath(slug)
  if (!filePath) throw new Error(`Post not found: ${slug}`)
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return {
    slug,
    title: data.title as string,
    date: normalizeDate(data.date),
    content,
  }
}
