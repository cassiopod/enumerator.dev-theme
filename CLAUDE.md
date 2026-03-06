# CLAUDE.md

Hugo site for enumerator.dev using the `enumerator-dev` theme. Targets **Hugo 0.91** for micro.blog compatibility.

## Development

**Hugo version:** 0.91 (required for micro.blog compatibility)

**Start dev server:** `hugo server -D` (includes drafts)

**Build for production:** `hugo`

**Install dependencies:** `npm install` (from project root)

**Rebuild CSS:** `npm run build:css` (run after editing `assets/css/main.css`, commits the output)

## Theme

Located at `themes/enumerator-dev/`. Tailwind CSS v4 + daisyUI v5 + @tailwindcss/typography.

CSS is pre-compiled via Tailwind CLI (`npm run build:css`) and committed as `static/custom.css`. No Hugo asset pipeline is used (Hugo 0.91 doesn't support `css.TailwindCSS`).

### Template structure

- `layouts/_default/baseof.html` — root layout (navbar, main, footer, custom_footer)
- `layouts/_default/list.html` — homepage and section listings (shows full post content)
- `layouts/_default/single.html` — blog post page
- `layouts/page/single.html` — static page (no date/categories metadata)
- `layouts/taxonomy/category.html` — category archive (card-based listing)
- `layouts/404.html` — error page
- `layouts/_default/_markup/render-codeblock-mermaid.html` — preserves mermaid code blocks for client-side rendering

### micro.blog templates (from theme-blank)

- `layouts/index.xml`, `layouts/index.json` — RSS and JSON Feed
- `layouts/_default/rss.xml`, `layouts/_default/list.json.json` — default feed templates
- `layouts/list.archivejson.json`, `layouts/list.archivehtml.html` — archive feeds
- `layouts/list.photosjson.json`, `layouts/list.photoshtml.html` — photo feeds
- `layouts/list.podcastxml.xml`, `layouts/list.podcastjson.json` — podcast feeds
- `layouts/list.rsd.xml` — RSD discovery
- `layouts/_default/sitemap.xml`, `layouts/robots.txt` — SEO
- `layouts/newsletter.html`, `layouts/redirect/single.html` — utilities

### Partials

- `head.html` — meta tags, static CSS link, includes `microblog_head.html`
- `microblog_head.html` — micro.blog identity, feed discovery, endpoints, plugin CSS
- `microblog_syndication.html` — Bluesky syndication links
- `navbar.html` — site title + `menus.main`
- `footer.html` — `menus.footer` + copyright
- `custom_footer.html` — empty micro.blog plugin hook
- `card.html` — post card for archive listings
- `pagination.html` — newer/older navigation

### Styling

- Catppuccin palette: latte (light), mocha (dark via `prefers-color-scheme`)
- Fonts: Source Serif 4 (headings), Source Sans 3 (body), Source Code Pro (code)
- Syntax highlighting: Chroma (server-side) with Catppuccin CSS variables
- Diagrams: Mermaid via CDN (`static/js/mermaid.js`)

## Content

- Posts: `content/post/*.md` — front matter: title, date, categories, images, summary, draft
- Pages: `content/page/*.md` with `type: "page"` — use `hide_title: true` to hide title/image
- Categories: auto-generated from post front matter (micro.blog uses categories, not tags)

## Configuration

Site config in `config.toml` (not `hugo.toml` — Hugo 0.91 doesn't support that name). Menus: `menus.main` (navbar), `menus.footer` (footer). Includes micro.blog output formats (RSS, JSON, RSD, archive, photos, podcast).
