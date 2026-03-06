# CLAUDE.md

Cassiopod is a Hugo theme with Catppuccin colors, micro.blog compatibility, and Hugo 0.91 support. Based on the visual design of the enumerator-dev Ghost theme.

## Usage

Add to a Hugo site as `themes/cassiopod/`, then set `theme = 'cassiopod'` in `config.toml`.

See `exampleSite/` for a working site using this theme.

## Development

**Hugo version:** 0.91 (required for micro.blog compatibility)

**CSS build:** Tailwind CSS v4 + daisyUI v5 + @tailwindcss/typography. Pre-compiled via Tailwind CLI and committed as `static/cassiopod.css`. No Hugo asset pipeline (Hugo 0.91 doesn't support `css.TailwindCSS`).

**Rebuild CSS:** From theme root, run `npm install` then `npm run build:css` (after editing `assets/css/main.css`).

**Dev server:** From `exampleSite/`, run `hugo server -D`

## Template structure

- `layouts/_default/baseof.html` — root layout (navbar, main, footer, custom_footer)
- `layouts/_default/list.html` — homepage and section listings (shows full post content)
- `layouts/_default/single.html` — blog post page
- `layouts/page/single.html` — static page (no date/categories metadata)
- `layouts/taxonomy/category.html` — category archive (card-based listing)
- `layouts/404.html` — error page
- `layouts/_default/_markup/render-codeblock-mermaid.html` — preserves mermaid code blocks for client-side rendering

### micro.blog templates

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

## Styling

- Catppuccin palette: latte (light), mocha (dark via `prefers-color-scheme`)
- Fonts: Source Serif 4 (headings), Source Sans 3 (body), Source Code Pro (code)
- Syntax highlighting: Chroma (server-side) with Catppuccin CSS variables
- Diagrams: Mermaid via CDN (`static/js/mermaid.js`)

## Content model

- Posts: `content/post/*.md` — front matter: title, date, categories, images, summary, draft
- Pages: `content/page/*.md` with `type: "page"` — use `hide_title: true` to hide title/image
- Categories: auto-generated from post front matter (micro.blog uses categories, not tags)

## Configuration

Site config in `config.toml` (not `hugo.toml` — Hugo 0.91 doesn't support that name). Menus: `menus.main` (navbar), `menus.footer` (footer). See `exampleSite/config.toml` for required output formats (RSS, JSON, RSD, archive, photos, podcast).

### micro.blog params

Templates use `.Site.Params` for author info (compatible with both Hugo 0.91 and modern Hugo):

- `microblog_username` — micro.blog username (for identity links and favicon)
- `author_avatar` — avatar URL (for JSON feeds and newsletter)
- `author_email` — author email (for RSS feeds)
- `author_name` — author display name (for RSS feeds)
