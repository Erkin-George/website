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

export function getAllPosts(): PostMeta[] {
  return fs
    .readdirSync(postsDir)
    .filter(f => /\.mdx?$/.test(f))
    .flatMap(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const { data } = matter(fs.readFileSync(path.join(postsDir, fileName), 'utf8'))
      if (data.draft) return []
      return [{ slug, title: data.title as string, date: data.date as string }]
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPost(slug: string): Post {
  const filePath = path.join(postsDir, `${slug}.md`)
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))
  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    content,
  }
}
