# erkingeorge.com — Project Context

Personal portfolio and blog for Erkin George (Software Developer, Seattle).

## Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS 3 + `@tailwindcss/typography`
- **Blog:** Markdown files in `content/posts/` — gray-matter for frontmatter, next-mdx-remote for rendering
- **Hosting:** Vercel (deploy on push to master)
- **Domain:** erkingeorge.com (currently on AWS Route 53 — pending DNS cutover to Vercel)

## Key Commands

```bash
npm run dev          # local dev server at localhost:3000
npm run build        # production build (run before pushing)
npm run new-post "Title"  # scaffold a new blog post with draft: true
```

## Project Structure

```
app/                  # Next.js App Router pages
  layout.tsx          # root layout: nav + footer
  page.tsx            # home (intro + recent posts)
  about/page.tsx
  contact/page.tsx
  blog/page.tsx       # post listing
  blog/[slug]/page.tsx
content/posts/        # markdown blog posts (.md or .mdx)
  README.md           # blogging workflow guide
lib/posts.ts          # filesystem helpers: getAllPosts, getPost
scripts/new-post.mjs  # blog scaffolding script
.github/workflows/ci.yml  # runs next build on PRs
```

## Writing Blog Posts

```bash
npm run new-post "My Weekly Update"
# → creates content/posts/my-weekly-update.md with draft: true
# edit the file, set draft: false to publish, commit and push
```

See `content/posts/README.md` for the full workflow.

## Infrastructure Checklist (TODO — do once after merging)

- [ ] Connect repo to Vercel (import from GitHub, zero config needed)
- [ ] Add custom domain in Vercel: Settings → Domains → add `erkingeorge.com` + `www`
- [ ] Add the two DNS records Vercel provides into Route 53 (A record + CNAME)
- [ ] Delete old GitHub Actions secrets: `AWS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_BUCKET`
- [ ] Optionally: transfer domain from Route 53 to Cloudflare to eliminate the $0.50/mo hosted zone fee

## Active Feature Branch

**`claude/calendar-scheduling`** (planned, not yet built) — a `/schedule` page that:
- Shows 2-week availability grid (busy blocks visible, event names hidden)
- Lets visitors book 30-min slots directly to Google Calendar
- Uses Google Calendar API with OAuth (owner authorizes once; visitors don't need to log in)
- Requires env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `GOOGLE_CALENDAR_ID`

## Branch Conventions

Branches are prefixed `claude/` for AI-assisted work. Always branch off `master`.
