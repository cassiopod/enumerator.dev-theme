# Hugo Theme Design: enumerator-dev

## Overview

Fully compliant Hugo theme rewriting the existing Ghost CMS theme for enumerator.dev. Same visual design, Hugo-native implementation.

## Page Types

- **Index**: Post listing with full content, date, reading time, tags, feature images. 10 posts per page with pagination.
- **Single post**: Title, author, date, reading time, feature image, prose-wrapped content, tag badges.
- **Static page**: Title, optional feature image, prose-wrapped content. Simpler than posts (no date/tags/author metadata).
- **Tag archive**: Tag name, description, card-based post listing with pagination.
- **404**: Centered error message with link home.
- **RSS**: Custom template with full post content in feed.

## Template Structure

```
themes/enumerator-dev/
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Root layout (head, navbar, main, footer)
│   │   ├── list.html            # Index + taxonomy listings
│   │   ├── single.html          # Single post
│   │   └── rss.xml              # RSS feed with full content
│   ├── page/
│   │   └── single.html          # Static pages
│   ├── partials/
│   │   ├── head.html            # <head>: meta, CSS, fonts
│   │   ├── navbar.html          # daisyUI navbar with site title + nav
│   │   ├── footer.html          # daisyUI footer with secondary nav + copyright
│   │   ├── card.html            # Post card for archive listings
│   │   └── pagination.html      # Pagination controls
│   ├── taxonomy/
│   │   └── tag.html             # Tag archive (override if needed)
│   └── 404.html                 # Error page
├── assets/
│   └── css/
│       └── main.css             # Tailwind v4 source
├── static/
│   └── fonts/                   # Source Serif/Sans/Code WOFF2 files
├── hugo.toml                    # Theme config defaults
└── theme.toml                   # Theme metadata
```

## Styling

- **Stack**: Tailwind CSS v4 + daisyUI v5 + @tailwindcss/typography
- **Build**: Hugo Pipes with PostCSS — compiles as part of `hugo server` / `hugo build`
- **Colors**: Catppuccin palette — latte (light, default), mocha (dark, `prefers-color-scheme`)
- **Fonts**: Source Serif 4 (headings), Source Sans 3 (body), Source Code Pro (code) — WOFF2 variable fonts
- **Dark mode**: Automatic via `prefers-color-scheme: dark`, no JS toggle

## Syntax Highlighting

Hugo's built-in Chroma (server-side). Catppuccin colors mapped to Chroma CSS classes. No Prism.js dependency.

## Diagrams

Mermaid via CDN. Same dynamic import approach as Ghost theme — detect `language-mermaid` code blocks, replace with rendered diagrams, theme-aware (light/dark).

## Content Model

- Posts: `content/posts/*.md` — front matter: title, date, tags, images, summary, draft
- Pages: `content/page/*.md` or top-level with `type: page`
- Tags: auto-generated from post front matter via Hugo taxonomy system

## Key Mapping: Ghost to Hugo

| Ghost | Hugo |
|-------|------|
| `default.hbs` | `baseof.html` |
| `{{!< default}}` | `{{ define "main" }}` blocks |
| `{{> "partial"}}` | `{{ partial "name" . }}` |
| `{{{body}}}` | `{{ block "main" . }}` |
| `{{@site.title}}` | `{{ .Site.Title }}` |
| `{{content}}` | `{{ .Content }}` |
| `{{excerpt}}` | `{{ .Summary }}` |
| `{{date format="..."}}` | `{{ .Date.Format "..." }}` |
| `{{reading_time}}` | Custom partial using `.ReadingTime` |
| `{{#foreach posts}}` | `{{ range .Pages }}` / `{{ range .Paginator.Pages }}` |
| `{{pagination}}` | Custom pagination partial using `.Paginator` |
| `{{asset "path"}}` | Hugo Pipes / `{{ resources.Get }}` |
| `{{img_url}}` with sizes | Hugo image processing |
| `{{navigation}}` | `{{ .Site.Menus.main }}` |
| Prism.js (CDN) | Chroma (server-side) |

## Configuration

Theme provides sensible defaults in `hugo.toml`:
- `paginate = 10`
- Chroma syntax highlighting style
- Taxonomy config for tags
- Menu structure
- RSS output format
