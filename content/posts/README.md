# Writing blog posts

Each post is a single Markdown file in this folder. The filename (minus the
extension) becomes the URL slug, e.g. `my-first-post.md` → `/blog/my-first-post`.

## Weekly workflow

1. **Scaffold a new post** — this creates the file with today's date and a
   `draft: true` flag so it stays hidden until you're ready:

   ```bash
   npm run new-post "My Post Title"
   ```

2. **Write it** — open the generated file in `content/posts/` and write your
   content in Markdown below the frontmatter.

3. **Preview locally**:

   ```bash
   npm run dev
   ```

   Then visit http://localhost:3000/blog

4. **Publish** — set `draft: false` in the frontmatter, then commit and push.
   Vercel deploys automatically.

## Frontmatter reference

```yaml
---
title: "Your Title"      # shown on the blog index and post page
date: 2026-06-07T12:00:00Z  # used for sorting (newest first)
draft: false             # true = hidden from the site
---
```

Drafts are excluded from the homepage and `/blog` index automatically.
