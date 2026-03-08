# CLAUDE.md

Cassiopod is a Hugo theme with Catppuccin colors, Tailwind CSS, and daisyUI. Based on the visual design of the enumerator-dev Ghost theme.

## Usage

Import as a Hugo module, then configure in `hugo.toml`. See `exampleSite/` for a working site.

## Development

**Hugo version:** 0.157+ (uses `css.TailwindCSS`, Hugo modules, `hugo.toml`)

**CSS:** Tailwind CSS v4 + daisyUI v5 + @tailwindcss/typography. Built by Hugo's `css.TailwindCSS` asset pipeline at build time from `assets/css/main.css`. Requires Node.js + npm (`npm install` for Tailwind CLI).

**Dev server:** From `exampleSite/`, run `hugo server -D`

**Go modules:** Theme uses Hugo modules (`go.mod`). The plausible-hugo analytics module is imported as a dependency.

## Template structure

- `layouts/_default/baseof.html` — root layout (navbar, main, footer)
- `layouts/_default/list.html` — homepage and section listings (shows full post content)
- `layouts/_default/single.html` — blog post page
- `layouts/page/single.html` — static page (no date/categories metadata)
- `layouts/taxonomy/category.html` — category archive (card-based listing)
- `layouts/404.html` — error page
- `layouts/_default/_markup/render-codeblock-mermaid.html` — preserves mermaid code blocks for client-side rendering

### Feed templates

- `layouts/index.xml`, `layouts/index.json` — RSS and JSON Feed
- `layouts/_default/rss.xml`, `layouts/_default/list.json.json` — default feed templates
- `layouts/list.archivejson.json`, `layouts/list.archivehtml.html` — archive feeds
- `layouts/list.photosjson.json`, `layouts/list.photoshtml.html` — photo feeds
- `layouts/list.podcastxml.xml`, `layouts/list.podcastjson.json` — podcast feeds
- `layouts/_default/sitemap.xml`, `layouts/robots.txt` — SEO

### Partials

- `head.html` — meta tags, Tailwind CSS pipeline, feed discovery, plausible analytics
- `navbar.html` — site title + `menus.main`
- `footer.html` — `menus.footer` + copyright
- `card.html` — post card for archive listings
- `pagination.html` — newer/older navigation

## Styling

- Catppuccin palette: latte (light), macchiato (dark via `prefers-color-scheme`)
- Fonts: Source Serif 4 (headings), Source Sans 3 (body), Source Code Pro (code)
- Syntax highlighting: Chroma (server-side) with Catppuccin CSS variables. `noClasses = false` in `hugo.toml` so Hugo emits CSS classes. Token colors defined in `assets/css/main.css`.
- Diagrams: Mermaid via CDN (`static/js/mermaid.js`)

## Content model

- Posts: `content/post/*.md` — front matter: title, date, categories, images, summary, draft
- Pages: `content/page/*.md` with `type: "page"` — use `hide_title: true` to hide title/image
- Categories: auto-generated from post front matter

## Configuration

Site config in `hugo.toml`. Menus: `menus.main` (navbar), `menus.footer` (footer). See `exampleSite/hugo.toml` for required output formats (RSS, JSON, archive, photos, podcast).

### Analytics

Plausible analytics via [plausible-hugo](https://github.com/divinerites/plausible-hugo) module:

```toml
[params.plausible]
  enable = true
  domain = 'example.com'
```

### Site params

- `author_avatar` — avatar URL (for JSON feeds)
- `author_email` — author email (for RSS feeds)
- `author_name` — author display name (for RSS feeds)
