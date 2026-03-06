# Hugo 0.91 / micro.blog Compatibility

## Goal

Downgrade the enumerator.dev Hugo site from Hugo 0.157 to 0.91 for micro.blog compatibility. The theme must work both locally with Hugo 0.91 and when deployed as a custom theme on micro.blog.

## Constraints

- Hugo 0.91 is micro.blog's default version
- micro.blog themes are individual template files (HTML, Markdown, JSON, CSS only)
- micro.blog uses `categories` taxonomy (not `tags`)
- micro.blog content type is `post` (singular)
- No Node.js or npm available on micro.blog — CSS must be pre-compiled
- micro.blog generates its own config.json; our config.toml is for local dev only
- The blank theme (github.com/microdotblog/theme-blank) provides the base layer

## Changes

### 1. CSS Pipeline

**Current:** `css.TailwindCSS` Hugo pipe (requires Hugo 0.128+)
**New:** Pre-compile via Tailwind CLI, commit static output

- Add npm script: `npx @tailwindcss/cli -i assets/css/main.css -o static/custom.css --minify`
- Commit `static/custom.css` to repo
- `head.html` uses plain `<link rel="stylesheet" href="{{ "custom.css" | relURL }}">`
- Source CSS (`assets/css/main.css`) stays for development; `static/custom.css` is the build artifact

### 2. Config

**Rename:** `hugo.toml` -> `config.toml` (Hugo 0.91 doesn't support `hugo.toml`)

**Changes:**
- `[pagination]` section -> `paginate = 10` (top-level key)
- Remove `[build.buildStats]`, `[build.cachebusters]` (post-0.91, Tailwind v4 specific)
- Remove `[module.mounts]` for hugo_stats.json (no longer needed without build-time CSS)
- `tag = 'tags'` -> `category = 'categories'`
- Add micro.blog output formats from blank theme (RSS, JSON, RSD, ArchiveJSON, PhotosJSON, PodcastXML, PodcastJSON)
- Add `paginate = 10`, `rssLimit = 25`, `enableRobotsTXT = true`

### 3. Template Changes

| Current (0.157) | New (0.91) | Reason |
|---|---|---|
| `css.TailwindCSS` pipe | Static `<link>` tag | Pipe doesn't exist in 0.91 |
| `hugo.IsDevelopment` | Remove conditional | Function is 0.120+ |
| `site.RegularPages` | `.Site.RegularPages` | Lowercase `site` global is 0.99+ |
| `.GetTerms "tags"` | `.GetTerms "categories"` | micro.blog uses categories |
| `resources.Get "js/mermaid.js"` | Static `<script>` tag | Simplify for 0.91 |
| `fingerprint` pipe | Remove | Not needed with static files |
| Tag references in all templates | Category references | micro.blog convention |

### 4. Blank Theme Integration

Include all blank theme templates in our theme (they act as the base layer):

**Feed templates:**
- `layouts/index.xml` (RSS)
- `layouts/index.json` (JSON Feed)
- `layouts/_default/rss.xml`
- `layouts/_default/list.json.json`
- `layouts/list.archivejson.json`
- `layouts/list.archivehtml.html` (+ `_default/` copy)
- `layouts/list.photosjson.json`
- `layouts/list.photoshtml.html` (+ `_default/` copy)
- `layouts/list.podcastxml.xml`
- `layouts/list.podcastjson.json`
- `layouts/list.rsd.xml`
- `layouts/_default/sitemap.xml`
- `layouts/robots.txt`
- `layouts/newsletter.html`
- `layouts/redirect/single.html`

**Partials:**
- `microblog_head.html` — micro.blog identity/feed/endpoint links
- `microblog_syndication.html` — Bluesky syndication
- `custom_footer.html` — empty hook for plugins

### 5. Partial Changes

**`head.html`:**
- Include `{{ partial "microblog_head.html" . }}` for micro.blog meta links
- Replace CSS pipeline with static `<link>` to `custom.css`
- Keep charset, viewport, title, description, canonical

**`baseof.html`:**
- Add `{{ partial "custom_footer.html" . }}` after footer (micro.blog plugin hook)

### 6. Content

- Rename `content/posts/` -> `content/post/` (matches micro.blog's `"Type" "post"`)
- Front matter: `tags` -> `categories` in all posts

### 7. Static Assets

- `static/custom.css` — pre-compiled Tailwind output (new)
- `static/js/mermaid.js` — moved from `assets/js/`
- `static/fonts/` — stays (uploaded separately on micro.blog)

### 8. Development Workflow

- Edit `assets/css/main.css` for style changes
- Run `npm run build:css` to recompile `static/custom.css`
- Commit the compiled CSS
- `hugo server` works locally with Hugo 0.91
- Theme templates can be pasted into micro.blog's custom theme editor

### 9. Hugo Version

- Install Hugo 0.91 locally (via `brew install hugo@0.91` or direct download)
- package.json gets a `build:css` script

## What stays the same

- Visual design (Catppuccin latte/mocha, daisyUI components, typography)
- Template structure (baseof -> list/single/page/taxonomy)
- Mermaid diagram support
- Chroma syntax highlighting with Catppuccin CSS variables
- Source fonts (Source Serif 4, Source Sans 3, Source Code Pro)
