# ralovely.com

Personal blog and static website. Markdown content, custom static site generator, S3/CloudFront hosting.

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Build script | Node.js (~540 lines) |
| Markdown | [marked](https://github.com/markedjs/marked) |
| Frontmatter | [gray-matter](https://github.com/jonschlinkert/gray-matter) |
| Syntax highlighting | [shiki](https://github.com/shikijs/shiki) (build-time, github-dark theme) |
| Templating | ES6 template literals |
| Typography | [Inter](https://rsms.me/inter/) via Google Fonts |
| Styling | Hand-written CSS, dark mode support |
| Hosting | S3 + CloudFront |

Three npm dependencies. No frameworks.

---

## How It Works

The entire site is built by a single script (`build.js`) that:

1. Cleans the `public/` output directory
2. Initialises shiki for syntax highlighting
3. Parses Markdown files from `content/blog/` and `content/pages/`
4. Extracts frontmatter with gray-matter, dates from filenames
5. Converts Markdown to HTML with marked
6. Injects content into HTML template functions (no template language)
7. Generates HTML and plain text (`.text`) versions of every page
8. Generates the homepage, archives page, and static pages
9. Generates RSS feed and sitemaps (XML and TXT)
10. Copies static assets and blog-adjacent image files
11. Copies a legacy redirect for an old backlink
12. Checks all external links and reports broken ones

Templates are JavaScript functions returning HTML strings. No partials, no template language, just functions.

---

## Content Structure

```
ralovely/
├── build.js                  # Static site generator
├── deploy.sh                 # Build + deploy to S3/CloudFront
├── package.json              # 3 devDependencies
├── content/
│   ├── about.md              # Homepage intro (rendered inline)
│   ├── blog/                 # Blog posts (34 total: 13 active, 21 archived)
│   │   ├── 2017-10-20-on-the-one.md
│   │   ├── 2008-07-10-triplog-mockup.png   # Blog assets sit next to posts
│   │   └── ...
│   ├── pages/                # Static pages (built to /page/{slug}/)
│   │   └── career-highlights.md
│   └── drafts/               # Not processed by build
│       └── working-with-me.md
├── static/
│   ├── css/
│   │   └── main.css          # The only stylesheet
│   ├── images/
│   └── audio/
└── public/                   # Generated output (gitignored)
```

### Blog Post Format

```yaml
---
title: "Post Title"
archived: true          # optional --- moves post to /archives/
---

Markdown content here...
```

- **Title**: from frontmatter
- **Date**: parsed from the filename (`YYYY-MM-DD-slug.md`), not frontmatter
- **Archived**: posts with `archived: true` are grouped separately, shown on `/archives/` with a notice, and excluded from the RSS feed

### URL Structure

| Content | URL Pattern |
|---------|-------------|
| Homepage | `/` |
| Blog post | `/blog/{year}/{month}/{day}/{slug}/` |
| Static page | `/page/{slug}/` |
| Archives | `/archives/` |
| RSS feed | `/blog/feed.xml` |
| Sitemaps | `/sitemap.xml`, `/sitemap.txt` |
| Plain text | append `index.text` to any page URL |

Every page has a plain text alternate, linked via `<link rel="alternate" type="text/plain">`.

---

## Features

### Dark Mode

Supports light and dark themes via a toggle in the header. Persists choice to `localStorage` and respects `prefers-color-scheme` as the default. A small inline script in `<head>` applies the saved theme before paint to avoid flash.

### Post Navigation

Each blog post has prev/next links at the bottom. Keyboard shortcuts: `j` for older, `k` for newer (vim-style). Active and archived posts have separate navigation chains.

### Link Checker

Production builds automatically check all external URLs in the generated HTML (HEAD requests, concurrency of 10, 10s timeout). Reports broken links to stdout. Skipped in watch mode.

### Easter Eggs

A few. You'll have to find them.

---

## Deployment

```bash
npm run deploy
```

This runs `deploy.sh`, which:

1. Builds the site (`npm run build`)
2. Syncs to S3 with a two-tier cache strategy:
   - Static assets (CSS, images, audio): `max-age=31536000` (1 year)
   - HTML, XML, and text files: `no-cache`
3. Invalidates the CloudFront distribution

Credentials are read from a local, gitignored file. No CI/CD pipeline -- deployment is manual.

---

## Local Development

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone git@github.com:ralovely/ralovely.git
cd ralovely
npm install
```

### Commands

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build to `public/`, then link check |
| `npm run dev` | Watch mode with local server on `http://localhost:3000` |
| `npm run deploy` | Build and deploy to production |

---

## Design Decisions

### Custom build script over static site generators

The site has 34 posts and a handful of pages. A custom Node.js script gives full control over every step of the build, with no framework conventions to learn or external release cycles to track. Three npm dependencies vs. an entire framework ecosystem.

Trade-off: RSS, sitemaps, text versions, and link checking are all implemented by hand. For a site this size, that's a feature, not a cost.

### Hand-written CSS

One stylesheet, no preprocessors, no utility frameworks. Inter loaded from Google Fonts. Dark mode via CSS custom properties and a `data-theme` attribute. Small amount of client-side JavaScript for theme persistence and keyboard navigation.

### No CI/CD

Deployment is a shell script run locally. For a personal site with one author, the overhead of a CI/CD pipeline isn't justified. `npm run deploy` is one command.
