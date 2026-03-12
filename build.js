#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { Marked } = require('marked');
const { createHighlighter } = require('shiki');

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = __dirname;
const CONTENT_DIR = path.join(ROOT, 'content');
const STATIC_DIR = path.join(ROOT, 'static');
const PUBLIC_DIR = path.join(ROOT, 'public');
const SITE_URL = 'https://ralovely.com';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function clean(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function formatDate(d) {
  return d.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' });
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function postUrl(p) {
  return `/blog/${p.year}/${p.month}/${p.day}/${p.slug}/`;
}

// ---------------------------------------------------------------------------
// Plain text templates (for .text versions)
// ---------------------------------------------------------------------------
const TEXT_FOOTER = '\n---\nFor the humans reading the machine-readable version: hello. You\'re thorough. I appreciate that.\n';

function stripScripts(s) {
  return s
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<span[^>]*><\/span>/gi, '')
    .replace(/\n{3,}/g, '\n\n');
}

function textPost(title, date, url, body, archived) {
  let out = `Title: ${title}\n`;
  if (date) out += `Date: ${formatDate(date)}\n`;
  out += `URL: ${SITE_URL}${url}\n`;
  out += `Author: Raphael Campardou\n`;
  if (archived) out += `Archived: yes\n`;
  out += `\n---\n\n`;
  if (archived) out += `${ARCHIVE_NOTICE}\n\n---\n\n`;
  out += stripScripts(body).trim() + '\n';
  return out + TEXT_FOOTER;
}

function textIndex(aboutMarkdown, pages, posts) {
  let out = `Title: Ralovely\n`;
  out += `URL: ${SITE_URL}/\n`;
  out += `Author: Raphael Campardou\n`;
  out += `\n---\n\n`;
  out += stripScripts(aboutMarkdown).trim() + '\n';
  if (pages.length) {
    out += `\n---\n\n[Pages]\n\n`;
    for (const p of pages) {
      out += `- ${p.title}: ${SITE_URL}/page/${p.slug}/index.text\n`;
    }
  }
  out += `\n---\n\n[Blog]\n\n`;
  for (const p of posts) {
    out += `- ${p.title} (${formatDate(p.date)}): ${SITE_URL}${postUrl(p)}index.text\n`;
  }
  return out + TEXT_FOOTER;
}

function textArchives(posts) {
  let out = `Title: Archives\n`;
  out += `URL: ${SITE_URL}/archives/\n`;
  out += `Author: Raphael Campardou\n`;
  out += `\n---\n\n`;
  out += `${ARCHIVE_NOTICE}\n`;
  out += `\n---\n\n`;
  for (const p of posts) {
    out += `- ${p.title} (${formatDate(p.date)}): ${SITE_URL}${postUrl(p)}index.text\n`;
  }
  return out + TEXT_FOOTER;
}

// ---------------------------------------------------------------------------
// Parse blog posts — date from filename, title from frontmatter
// ---------------------------------------------------------------------------
function loadBlogPosts() {
  const dir = path.join(CONTENT_DIR, 'blog');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  return files.map(file => {
    const match = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    if (!match) return null;
    const [, year, month, day, slug] = match;
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const title = data.title || slug.replace(/-/g, ' ');
    const archived = data.archived === true;
    return { title, date, year, month, day, slug, archived, markdown: content };
  }).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Parse static pages — title from frontmatter, slug from filename
// ---------------------------------------------------------------------------
function loadPages() {
  const dir = path.join(CONTENT_DIR, 'pages');
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort();
  return files.map(file => {
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const { data, content } = matter(raw);
    const title = data.title || slug.replace(/-/g, ' ');
    return { title, slug, markdown: content };
  });
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------
const ARCHIVE_NOTICE = 'This is an old post, kept here for posterity. Some links may be broken, opinions may have changed, and technology has certainly moved on.';

const layout = (title, content) => `<!DOCTYPE html>
<!-- You're looking at the source. I like you already. -->
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(title)}</title>
  <script>
    (function(){var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t)})();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <link rel="stylesheet" href="/css/main.css">
  <link rel="alternate" type="application/rss+xml" title="Ralovely" href="/blog/feed.xml">
  <link rel="alternate" type="text/plain" href="index.text">
  <link rel="icon" href="/images/favicon.ico">
</head>
<body>
  <header>
    <nav>
      <a href="/">ralovely</a>
    </nav>
    <button class="theme-toggle" aria-label="Toggle dark mode">
      <svg class="icon-moon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      <svg class="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    </button>
  </header>
  <main>
    ${content}
  </main>
  <footer>
    <p>&copy; Raphael Campardou &middot; <a href="/archives/">Archives</a></p>
  </footer>
  <script>
    document.querySelector('.theme-toggle').addEventListener('click', function() {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme');
      var isDark = current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
      var next = isDark ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
    console.log('%cHello, curious one.', 'font-size: 14px; font-style: italic;');
    console.log('This site is ~300 lines of Node.js, zero frameworks. View the source: https://github.com/ralovely/ralovely');
  </script>
</body>
</html>`;

const postPage = (title, date, content, archived, prev, next) => layout(title + ' - Ralovely', `
    <article>
      <header>
        <h1>${escapeXml(title)}</h1>
        <time datetime="${date.toISOString().slice(0, 10)}">${formatDate(date)}</time>
      </header>
      ${archived ? `<aside class="archive-notice"><p>${ARCHIVE_NOTICE}</p></aside>` : ''}
      <div class="content">
        ${content}
      </div>
    </article>
    <nav class="post-nav">
      ${prev ? `<a href="${prev.url}" title="${escapeXml(prev.title)}">&larr; ${escapeXml(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a href="${next.url}" title="${escapeXml(next.title)}">${escapeXml(next.title)} &rarr;</a>` : '<span></span>'}
    </nav>
    <script>
      (function() {
        var prev = ${prev ? JSON.stringify(prev.url) : 'null'};
        var next = ${next ? JSON.stringify(next.url) : 'null'};
        document.addEventListener('keydown', function(e) {
          if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
          if (e.key === 'j' && prev) window.location.href = prev;
          if (e.key === 'k' && next) window.location.href = next;
        });
      })();
    </script>`);

const staticPage = (title, content) => layout(title + ' - Ralovely', `
    <article>
      <header>
        <h1>${escapeXml(title)}</h1>
      </header>
      <div class="content">
        ${content}
      </div>
    </article>`);

const indexPage = (aboutHtml, pages, posts) => layout('Ralovely', `
    <section id="about">
      ${aboutHtml}
    </section>
    ${pages.length ? `
    <section id="pages">
      <h2>More</h2>
      <ul>
        ${pages.map(p => `<li><a href="/page/${p.slug}/">${escapeXml(p.title)}</a></li>`).join('\n        ')}
      </ul>
    </section>` : ''}
    <section id="posts">
      <h2>Blog</h2>
      <ul>
        ${posts.map(p => `<li>
          <a href="/blog/${p.year}/${p.month}/${p.day}/${p.slug}/">${escapeXml(p.title)}</a>
          <time datetime="${p.date.toISOString().slice(0, 10)}">${formatDate(p.date)}</time>
        </li>`).join('\n        ')}
      </ul>
    </section>`);

const archivesPage = (posts) => layout('Archives - Ralovely', `
    <section id="archives">
      <h1>Archives</h1>
      <p>${ARCHIVE_NOTICE}</p>
      <ul>
        ${posts.map(p => `<li>
          <a href="/blog/${p.year}/${p.month}/${p.day}/${p.slug}/">${escapeXml(p.title)}</a>
          <time datetime="${p.date.toISOString().slice(0, 10)}">${formatDate(p.date)}</time>
        </li>`).join('\n        ')}
      </ul>
    </section>`);

const rssFeed = (posts) => `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Ralovely</title>
    <link>https://ralovely.com</link>
    <description>Raphael Campardou's blog</description>
    <atom:link href="https://ralovely.com/blog/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(p => `<item>
      <title>${escapeXml(p.title)}</title>
      <link>https://ralovely.com/blog/${p.year}/${p.month}/${p.day}/${p.slug}/</link>
      <guid>https://ralovely.com/blog/${p.year}/${p.month}/${p.day}/${p.slug}/</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description><![CDATA[${p.html}]]></description>
    </item>`).join('\n    ')}
  </channel>
</rss>`;

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
async function build() {
  const startTime = Date.now();

  // 1. Init shiki highlighter
  const highlighter = await createHighlighter({
    themes: ['github-dark'],
    langs: ['javascript', 'ruby', 'bash', 'html', 'css', 'json', 'yaml', 'shell',
            'python', 'sql', 'xml', 'markdown', 'erb', 'php', 'plaintext'],
  });

  // 2. Configure marked with shiki
  const marked = new Marked({
    breaks: true,
    renderer: {
      code(text, lang) {
        const language = lang || 'plaintext';
        try {
          return highlighter.codeToHtml(text, { lang: language, theme: 'github-dark' });
        } catch {
          return highlighter.codeToHtml(text, { lang: 'plaintext', theme: 'github-dark' });
        }
      },
    },
  });

  // 3. Clean output
  clean(PUBLIC_DIR);

  // 4. Load content
  const allPosts = loadBlogPosts().sort((a, b) => b.date - a.date);
  const posts = allPosts.filter(p => !p.archived);
  const archivedPosts = allPosts.filter(p => p.archived);
  const pages = loadPages();
  const aboutRaw = fs.existsSync(path.join(CONTENT_DIR, 'about.md'))
    ? fs.readFileSync(path.join(CONTENT_DIR, 'about.md'), 'utf8')
    : '';

  // 5. Render markdown to HTML
  for (const post of allPosts) {
    post.html = await marked.parse(post.markdown);
  }
  for (const page of pages) {
    page.html = await marked.parse(page.markdown);
  }
  const aboutHtml = await marked.parse(aboutRaw);

  // 6. Write blog posts — active and archived as separate groups for navigation
  function writePostGroup(group) {
    for (let i = 0; i < group.length; i++) {
      const post = group[i];
      // Posts are sorted newest-first: j = older (i+1), k = newer (i-1)
      const prev = i < group.length - 1 ? { title: group[i + 1].title, url: postUrl(group[i + 1]) } : null;
      const next = i > 0 ? { title: group[i - 1].title, url: postUrl(group[i - 1]) } : null;
      const dir = path.join(PUBLIC_DIR, 'blog', post.year, post.month, post.day, post.slug);
      writeFile(path.join(dir, 'index.html'), postPage(post.title, post.date, post.html, post.archived, prev, next));
      writeFile(path.join(dir, 'index.text'), textPost(post.title, post.date, postUrl(post), post.markdown, post.archived));
    }
  }
  writePostGroup(posts);
  writePostGroup(archivedPosts);

  // 6b. Copy blog asset files (images etc. sitting next to posts in content/blog/)
  const blogDir = path.join(CONTENT_DIR, 'blog');
  for (const file of fs.readdirSync(blogDir)) {
    if (file.endsWith('.md')) continue;
    const match = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
    if (!match) continue;
    const [, year, month, day, assetName] = match;
    const src = path.join(blogDir, file);
    const dest = path.join(PUBLIC_DIR, 'blog', year, month, day, assetName);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }

  // 7. Write static pages
  for (const page of pages) {
    const dir = path.join(PUBLIC_DIR, 'page', page.slug);
    writeFile(path.join(dir, 'index.html'), staticPage(page.title, page.html));
    writeFile(path.join(dir, 'index.text'), textPost(page.title, null, `/page/${page.slug}/`, page.markdown, false));
  }

  // 8. Write homepage (active posts only)
  writeFile(path.join(PUBLIC_DIR, 'index.html'), indexPage(aboutHtml, pages, posts));
  writeFile(path.join(PUBLIC_DIR, 'index.text'), textIndex(aboutRaw, pages, posts));

  // 9. Write archives page
  if (archivedPosts.length) {
    writeFile(path.join(PUBLIC_DIR, 'archives', 'index.html'), archivesPage(archivedPosts));
    writeFile(path.join(PUBLIC_DIR, 'archives', 'index.text'), textArchives(archivedPosts));
  }

  // 10. Write RSS feed (active posts only)
  writeFile(path.join(PUBLIC_DIR, 'blog', 'feed.xml'), rssFeed(posts));

  // 11. Write sitemaps
  const allUrls = [
    '/',
    ...pages.map(p => `/page/${p.slug}/`),
    '/archives/',
    ...allPosts.map(p => postUrl(p)),
  ];
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/xmlns/sitemap/0.9">
${allUrls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>`;
  writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml);

  const sitemapTxt = allUrls.flatMap(u => [
    `${SITE_URL}${u}`,
    `${SITE_URL}${u}index.text`,
  ]).join('\n') + '\n';
  writeFile(path.join(PUBLIC_DIR, 'sitemap.txt'), sitemapTxt);

  // 12. Copy static assets
  copyRecursive(STATIC_DIR, PUBLIC_DIR);

  // 13. Legacy redirects / backlink-preserving copies
  fs.mkdirSync(path.join(PUBLIC_DIR, 'downloads'), { recursive: true });
  fs.copyFileSync(
    path.join(CONTENT_DIR, 'blog', '2008-07-10-triplog-mockup.png'),
    path.join(PUBLIC_DIR, 'downloads', 'triplog1040.png')
  );

  const elapsed = Date.now() - startTime;
  console.log(`Built ${posts.length} posts, ${archivedPosts.length} archived, ${pages.length} pages in ${elapsed}ms`);
}

// ---------------------------------------------------------------------------
// Link checker — non-blocking, runs after build
// ---------------------------------------------------------------------------
async function checkLinks() {
  const htmlFiles = [];
  (function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.html')) htmlFiles.push(full);
    }
  })(PUBLIC_DIR);

  // Extract all external URLs from href and src attributes
  const urlRe = /(?:href|src)="(https?:\/\/[^"]+)"/g;
  const urlToFiles = new Map();
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = urlRe.exec(html)) !== null) {
      const url = m[1];
      if (!urlToFiles.has(url)) urlToFiles.set(url, []);
      urlToFiles.get(url).push(path.relative(PUBLIC_DIR, file));
    }
  }

  const urls = [...urlToFiles.keys()];
  if (!urls.length) return;

  console.log(`\nChecking ${urls.length} external links...`);

  const CONCURRENCY = 10;
  const TIMEOUT = 10000;
  const broken = [];
  let checked = 0;

  async function check(url) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT);
      const res = await fetch(url, {
        method: 'HEAD',
        signal: controller.signal,
        redirect: 'manual',
        headers: { 'User-Agent': 'ralovely-link-checker/1.0' },
      });
      clearTimeout(timer);
      const status = res.status;
      if (status >= 400) {
        broken.push({ url, status, files: urlToFiles.get(url) });
      }
    } catch (err) {
      broken.push({ url, status: err.name === 'AbortError' ? 'timeout' : 'error', files: urlToFiles.get(url) });
    }
    checked++;
    if (checked % 20 === 0) process.stdout.write(`  ${checked}/${urls.length}\r`);
  }

  // Run with concurrency limit
  const queue = [...urls];
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (queue.length) {
      await check(queue.shift());
    }
  });
  await Promise.all(workers);

  if (broken.length) {
    console.log(`\n⚠ ${broken.length} broken link(s):`);
    for (const { url, status, files } of broken) {
      console.log(`  [${status}] ${url}`);
      for (const f of files) console.log(`         in ${f}`);
    }
  } else {
    console.log(`All ${urls.length} links OK.`);
  }
}

// ---------------------------------------------------------------------------
// Watch mode (--watch flag)
// ---------------------------------------------------------------------------
if (process.argv.includes('--watch')) {
  const http = require('http');

  async function rebuild() {
    try { await build(); }
    catch (err) { console.error('Build error:', err.message); }
  }

  rebuild().then(() => {
    // Simple static file server
    const server = http.createServer((req, res) => {
      let url = req.url.split('?')[0];
      if (url.endsWith('/')) url += 'index.html';
      const filePath = path.join(PUBLIC_DIR, url);
      if (!fs.existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = path.extname(filePath);
      const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
                       '.xml': 'application/xml', '.ico': 'image/x-icon', '.jpg': 'image/jpeg',
                       '.png': 'image/png', '.mp3': 'audio/mpeg', '.gif': 'image/gif',
                       '.text': 'text/plain', '.txt': 'text/plain' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(3000, () => console.log('Dev server: http://localhost:3000'));

    // Watch for changes
    for (const dir of [CONTENT_DIR, STATIC_DIR]) {
      if (fs.existsSync(dir)) {
        fs.watch(dir, { recursive: true }, () => {
          console.log('Change detected, rebuilding...');
          rebuild();
        });
      }
    }
  });
} else {
  build()
    .then(() => checkLinks())
    .catch(err => { console.error(err); process.exit(1); });
}
