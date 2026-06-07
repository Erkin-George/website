#!/usr/bin/env node
// Scaffold a new blog post: `npm run new-post "My Post Title"`
import fs from 'fs'
import path from 'path'

const title = process.argv.slice(2).join(' ').trim()

if (!title) {
  console.error('Usage: npm run new-post "My Post Title"')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '')

const postsDir = path.join(process.cwd(), 'content/posts')
const filePath = path.join(postsDir, `${slug}.md`)

if (fs.existsSync(filePath)) {
  console.error(`Post already exists: content/posts/${slug}.md`)
  process.exit(1)
}

const date = new Date().toISOString()

const template = `---
title: "${title.replace(/"/g, '\\"')}"
date: ${date}
draft: true
---

Write your post here. Set \`draft: false\` when it's ready to publish.
`

fs.mkdirSync(postsDir, { recursive: true })
fs.writeFileSync(filePath, template)

console.log(`Created content/posts/${slug}.md`)
console.log(`Run \`npm run dev\` and visit http://localhost:3000/blog/${slug}`)
