# Hugo 0.91 / micro.blog Migration — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Migrate the enumerator.dev Hugo site from Hugo 0.157 to 0.91 for micro.blog compatibility.

**Architecture:** Pre-compile Tailwind CSS via CLI and commit the output. Replace all Hugo 0.91-incompatible template features with their older equivalents. Integrate micro.blog's blank theme templates for feed/metadata support. Switch taxonomy from tags to categories and content directory from posts to post.

**Tech Stack:** Hugo 0.91, Tailwind CSS v4 (CLI), daisyUI v5, micro.blog blank theme conventions

---

### Task 1: Install Hugo 0.91

**Files:**
- None (system-level change)

**Step 1: Download and install Hugo 0.91**

Hugo 0.91 is too old for Homebrew's current tap. Download the binary directly:

```bash
# Download Hugo 0.91.2 extended for macOS ARM
curl -L https://github.com/gohugoio/hugo/releases/download/v0.91.2/hugo_extended_0.91.2_macOS-ARM64.tar.gz -o /tmp/hugo-0.91.tar.gz
tar -xzf /tmp/hugo-0.91.tar.gz -C /tmp/hugo-0.91
```

If that URL doesn't work (0.91 predates ARM releases), try the universal or AMD64 build:
```bash
curl -L https://github.com/gohugoio/hugo/releases/download/v0.91.2/hugo_extended_0.91.2_macOS-64bit.tar.gz -o /tmp/hugo-0.91.tar.gz
mkdir -p /tmp/hugo-0.91
tar -xzf /tmp/hugo-0.91.tar.gz -C /tmp/hugo-0.91
```

Place the binary somewhere on PATH (e.g., `/usr/local/bin/hugo-0.91`) or use it directly.

**Step 2: Verify the version**

```bash
/tmp/hugo-0.91/hugo version
```

Expected: `hugo v0.91.2+extended ...`

Note: We'll use this binary for all `hugo` commands in later tasks. For convenience, you can alias it or put it first in PATH.

**Step 3: No commit needed for this task**

---

### Task 2: Rename config and update for Hugo 0.91

**Files:**
- Rename: `hugo.toml` → `config.toml`
- Modify: `config.toml` (full rewrite)

**Step 1: Rename the config file**

```bash
cd /Users/cassidy/code/enumerator.dev-hugo
git mv hugo.toml config.toml
```

**Step 2: Rewrite config.toml for Hugo 0.91 + micro.blog**

Replace the entire contents of `config.toml` with:

```toml
baseURL = 'https://enumerator.dev/'
languageCode = 'en-us'
title = 'enumerator.dev'
theme = 'enumerator-dev'
paginate = 10
rssLimit = 25
enableRobotsTXT = true
pluralizeListTitles = false

[params]
  description = 'A dev blog by cassiopod'

[taxonomies]
  category = 'categories'

[markup]
  [markup.highlight]
    noClasses = false
    lineNos = false
    guessSyntax = true
  [markup.goldmark]
    [markup.goldmark.renderer]
      unsafe = true

[mediaTypes]
  [mediaTypes."application/json"]
    suffixes = ["json"]

[outputFormats]
  [outputFormats.RSS]
    baseName = "feed"
  [outputFormats.JSON]
    baseName = "feed"
  [outputFormats.RSD]
    mediaType = "application/xml"
    baseName = "rsd"
    isPlainText = true
    notAlternative = true
  [outputFormats.ArchiveJSON]
    mediaType = "application/json"
    path = "archive"
    baseName = "index"
    isPlainText = true
    notAlternative = true
  [outputFormats.PhotosJSON]
    mediaType = "application/json"
    path = "photos"
    baseName = "index"
    isPlainText = true
    notAlternative = true
  [outputFormats.PodcastXML]
    mediaType = "application/rss+xml"
    baseName = "podcast"
    isPlainText = true
    notAlternative = true
  [outputFormats.PodcastJSON]
    mediaType = "application/json"
    baseName = "podcast"
    isPlainText = true
    notAlternative = true

[outputs]
  home = ['HTML', 'RSS', 'JSON', 'RSD', 'ArchiveJSON', 'PhotosJSON', 'PodcastXML', 'PodcastJSON']
  page = ['HTML']
  section = ['HTML']
  taxonomy = ['HTML', 'RSS', 'JSON']
  term = ['HTML', 'RSS', 'JSON']

[menus]
  [[menus.main]]
    name = 'About'
    url = '/about/'
    weight = 10
  [[menus.footer]]
    name = 'RSS'
    url = '/feed.xml'
    weight = 10
```

Key changes from the old config:
- `[pagination]` section → `paginate = 10` (top-level)
- Removed `[build.buildStats]`, `[build.cachebusters]`, `[module.mounts]`
- `tag = 'tags'` → `category = 'categories'`
- Added all micro.blog output formats and media types
- RSS basename changed to `feed` (micro.blog convention), so footer link is `/feed.xml`
- Added `[markup.goldmark.renderer] unsafe = true` (micro.blog convention)

**Step 3: Commit**

```bash
git add config.toml
git commit -m "Rename hugo.toml to config.toml and update for Hugo 0.91 + micro.blog"
```

---

### Task 3: Pre-compile CSS and update head.html

**Files:**
- Modify: `package.json`
- Create: `static/custom.css` (generated)
- Modify: `themes/enumerator-dev/layouts/partials/head.html`

**Step 1: Add build:css script to package.json**

Edit `package.json` to add a scripts section:

```json
{
  "name": "enumerator-dev-hugo",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build:css": "npx @tailwindcss/cli -i themes/enumerator-dev/assets/css/main.css -o themes/enumerator-dev/static/custom.css --minify"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.2.0",
    "@tailwindcss/typography": "^0.5.19",
    "daisyui": "^5.5.18",
    "tailwindcss": "^4.2.0"
  }
}
```

Note: The CSS source is in the theme's assets dir, and the output goes to the theme's static dir so Hugo serves it at the site root.

**Step 2: Run the CSS build**

```bash
cd /Users/cassidy/code/enumerator.dev-hugo
npm run build:css
```

Expected: Creates `themes/enumerator-dev/static/custom.css` with compiled Tailwind output. Verify the file exists and is non-empty.

**Step 3: Rewrite head.html**

Replace `themes/enumerator-dev/layouts/partials/head.html` with:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{{ if .IsHome }}{{ .Site.Title }}{{ else }}{{ .Title }} | {{ .Site.Title }}{{ end }}</title>
<meta name="description" content="{{ with .Description }}{{ . }}{{ else }}{{ with .Summary }}{{ . }}{{ else }}{{ .Site.Params.description }}{{ end }}{{ end }}">
<link rel="canonical" href="{{ .Permalink }}">
<link rel="stylesheet" href="{{ "custom.css" | relURL }}">
{{ partial "microblog_head.html" . }}
```

This replaces the `css.TailwindCSS` pipe with a plain link to the pre-compiled CSS, and delegates micro.blog-specific meta tags (feeds, identity, endpoints) to the `microblog_head.html` partial (created in Task 5).

**Step 4: Commit**

```bash
git add package.json themes/enumerator-dev/static/custom.css themes/enumerator-dev/layouts/partials/head.html
git commit -m "Pre-compile Tailwind CSS and simplify head.html for Hugo 0.91"
```

---

### Task 4: Update baseof.html and move mermaid.js to static

**Files:**
- Modify: `themes/enumerator-dev/layouts/_default/baseof.html`
- Move: `themes/enumerator-dev/assets/js/mermaid.js` → `themes/enumerator-dev/static/js/mermaid.js`

**Step 1: Move mermaid.js to static**

```bash
mkdir -p themes/enumerator-dev/static/js
git mv themes/enumerator-dev/assets/js/mermaid.js themes/enumerator-dev/static/js/mermaid.js
```

**Step 2: Rewrite baseof.html**

Replace `themes/enumerator-dev/layouts/_default/baseof.html` with:

```html
<!DOCTYPE html>
<html lang="{{ .Site.LanguageCode | default "en" }}">
<head>
    {{ partial "head.html" . }}
</head>
<body>

    {{ partial "navbar.html" . }}

    <main class="mx-auto w-full max-w-3xl px-5 py-8">
        {{ block "main" . }}{{ end }}
    </main>

    {{ partial "footer.html" . }}
    {{ partial "custom_footer.html" . }}

    <script src="{{ "js/mermaid.js" | relURL }}" defer></script>
</body>
</html>
```

Changes from original:
- Removed `hugo.IsDevelopment` conditional (doesn't exist in 0.91)
- Removed `resources.Get`, `minify`, `fingerprint` pipes (simplified for static file)
- Added `{{ partial "custom_footer.html" . }}` (micro.blog plugin hook)
- Plain `<script>` tag for mermaid.js from static dir

**Step 3: Commit**

```bash
git add themes/enumerator-dev/layouts/_default/baseof.html themes/enumerator-dev/static/js/mermaid.js
git commit -m "Move mermaid.js to static and simplify baseof.html for Hugo 0.91"
```

---

### Task 5: Add micro.blog blank theme partials

**Files:**
- Create: `themes/enumerator-dev/layouts/partials/microblog_head.html`
- Create: `themes/enumerator-dev/layouts/partials/microblog_syndication.html`
- Create: `themes/enumerator-dev/layouts/partials/custom_footer.html`

**Step 1: Create microblog_head.html**

Copy from blank theme verbatim. Create `themes/enumerator-dev/layouts/partials/microblog_head.html`:

```html
{{ if ne .Kind "home" }}
  <link rel="alternate" href="{{ "feed.xml" | absURL }}" type="application/rss+xml" title="{{ $.Site.Title }}">
  <link rel="alternate" href="{{ "feed.json" | absURL }}" type="application/json" title="{{ $.Site.Title }}">
{{ end }}

{{ range .AlternativeOutputFormats -}}
  {{ printf `<link rel="%s" href="%s" type="%s" title="%s">` .Rel .Permalink .MediaType.Type $.Site.Title | safeHTML }}
{{ end -}}

{{ if .Site.Params.has_podcasts }}
  <link rel="alternate" href="{{ "podcast.xml" | absURL }}" type="application/rss+xml" title="Podcast">
  <link rel="alternate" href="{{ "podcast.json" | absURL }}" type="application/json" title="Podcast">
{{ end }}

<link rel="me" href="https://micro.blog/{{ .Site.Author.username }}">

{{ with .Site.Params.twitter_username }}
  <link rel="me" href="https://twitter.com/{{ . }}">
{{ end }}

{{ with .Site.Params.github_username }}
  <link rel="me" href="https://github.com/{{ . }}">
{{ end }}

{{ with .Site.Params.instagram_username }}
  <link rel="me" href="https://instagram.com/{{ . }}">
{{ end }}

<link rel="shortcut icon" href="https://micro.blog/{{ .Site.Author.username }}/favicon.png" type="image/x-icon">
<link rel="EditURI" type="application/rsd+xml" href="{{ "rsd.xml" | absURL }}">
<link rel="authorization_endpoint" href="https://micro.blog/indieauth/auth">
<link rel="token_endpoint" href="https://micro.blog/indieauth/token">
<link rel="subscribe" href="https://micro.blog/users/follow">
<link rel="webmention" href="https://micro.blog/webmention">
<link rel="micropub" href="https://micro.blog/micropub">
<link rel="microsub" href="https://micro.blog/microsub">

<link rel="stylesheet" href="{{ "custom.css" | relURL }}?{{ .Site.Params.theme_seconds }}">

{{ range .Site.Params.plugins_css }}
  <link rel="stylesheet" href="{{ . }}">
{{ end }}

{{ range $filename := .Site.Params.plugins_html }}
  {{ partial $filename $ }}
{{ end }}
```

**Step 2: Create microblog_syndication.html**

Create `themes/enumerator-dev/layouts/partials/microblog_syndication.html`:

```html
{{ if eq .Kind "home" }}
  {{ if .Params.bluesky }}
    <a class="u-syndication" {{ printf "href=%q" .Params.bluesky.url | safeHTMLAttr }} style="display: none;">Also on Bluesky</a>
  {{ end }}
{{ else }}
  {{ if .Params.bluesky }}
    <! -- <a class="u-syndication" {{ printf "href=%q" .Params.bluesky.url | safeHTMLAttr }}>Reply on Bluesky</a> -->
  {{ end }}
{{ end }}
```

**Step 3: Create custom_footer.html**

Create `themes/enumerator-dev/layouts/partials/custom_footer.html` as an empty file (micro.blog plugin hook):

```
```

(Empty file — this is intentional. Micro.blog plugins inject content here.)

**Step 4: Commit**

```bash
git add themes/enumerator-dev/layouts/partials/microblog_head.html themes/enumerator-dev/layouts/partials/microblog_syndication.html themes/enumerator-dev/layouts/partials/custom_footer.html
git commit -m "Add micro.blog blank theme partials"
```

---

### Task 6: Add micro.blog feed and utility templates

**Files:**
- Create: 17 template files in `themes/enumerator-dev/layouts/`

Copy all feed/utility templates from the blank theme verbatim. These files are listed below with their source paths from `/tmp/theme-blank/`.

**Step 1: Create directory structure**

```bash
mkdir -p themes/enumerator-dev/layouts/_default
mkdir -p themes/enumerator-dev/layouts/redirect
```

**Step 2: Copy all blank theme templates**

Copy the following files from `/tmp/theme-blank/layouts/` to `themes/enumerator-dev/layouts/`, preserving exact paths:

| Source (in /tmp/theme-blank/) | Destination (in themes/enumerator-dev/) |
|---|---|
| `layouts/index.xml` | `layouts/index.xml` |
| `layouts/index.json` | `layouts/index.json` |
| `layouts/_default/rss.xml` | `layouts/_default/rss.xml` |
| `layouts/_default/list.json.json` | `layouts/_default/list.json.json` |
| `layouts/_default/list.archivehtml.html` | `layouts/_default/list.archivehtml.html` |
| `layouts/_default/list.photoshtml.html` | `layouts/_default/list.photoshtml.html` |
| `layouts/_default/sitemap.xml` | `layouts/_default/sitemap.xml` |
| `layouts/list.archivejson.json` | `layouts/list.archivejson.json` |
| `layouts/list.archivehtml.html` | `layouts/list.archivehtml.html` |
| `layouts/list.photosjson.json` | `layouts/list.photosjson.json` |
| `layouts/list.photoshtml.html` | `layouts/list.photoshtml.html` |
| `layouts/list.podcastxml.xml` | `layouts/list.podcastxml.xml` |
| `layouts/list.podcastjson.json` | `layouts/list.podcastjson.json` |
| `layouts/list.rsd.xml` | `layouts/list.rsd.xml` |
| `layouts/newsletter.html` | `layouts/newsletter.html` |
| `layouts/robots.txt` | `layouts/robots.txt` |
| `layouts/redirect/single.html` | `layouts/redirect/single.html` |

```bash
cp /tmp/theme-blank/layouts/index.xml themes/enumerator-dev/layouts/index.xml
cp /tmp/theme-blank/layouts/index.json themes/enumerator-dev/layouts/index.json
cp /tmp/theme-blank/layouts/_default/rss.xml themes/enumerator-dev/layouts/_default/rss.xml
cp /tmp/theme-blank/layouts/_default/list.json.json themes/enumerator-dev/layouts/_default/list.json.json
cp /tmp/theme-blank/layouts/_default/list.archivehtml.html themes/enumerator-dev/layouts/_default/list.archivehtml.html
cp /tmp/theme-blank/layouts/_default/list.photoshtml.html themes/enumerator-dev/layouts/_default/list.photoshtml.html
cp /tmp/theme-blank/layouts/_default/sitemap.xml themes/enumerator-dev/layouts/_default/sitemap.xml
cp /tmp/theme-blank/layouts/list.archivejson.json themes/enumerator-dev/layouts/list.archivejson.json
cp /tmp/theme-blank/layouts/list.archivehtml.html themes/enumerator-dev/layouts/list.archivehtml.html
cp /tmp/theme-blank/layouts/list.photosjson.json themes/enumerator-dev/layouts/list.photosjson.json
cp /tmp/theme-blank/layouts/list.photoshtml.html themes/enumerator-dev/layouts/list.photoshtml.html
cp /tmp/theme-blank/layouts/list.podcastxml.xml themes/enumerator-dev/layouts/list.podcastxml.xml
cp /tmp/theme-blank/layouts/list.podcastjson.json themes/enumerator-dev/layouts/list.podcastjson.json
cp /tmp/theme-blank/layouts/list.rsd.xml themes/enumerator-dev/layouts/list.rsd.xml
cp /tmp/theme-blank/layouts/newsletter.html themes/enumerator-dev/layouts/newsletter.html
cp /tmp/theme-blank/layouts/robots.txt themes/enumerator-dev/layouts/robots.txt
cp /tmp/theme-blank/layouts/redirect/single.html themes/enumerator-dev/layouts/redirect/single.html
```

**Step 3: Remove old RSS template**

Our existing `layouts/_default/rss.xml` is being replaced by the blank theme's version. The copy in Step 2 already overwrites it.

**Step 4: Commit**

```bash
git add themes/enumerator-dev/layouts/index.xml themes/enumerator-dev/layouts/index.json themes/enumerator-dev/layouts/_default/rss.xml themes/enumerator-dev/layouts/_default/list.json.json themes/enumerator-dev/layouts/_default/list.archivehtml.html themes/enumerator-dev/layouts/_default/list.photoshtml.html themes/enumerator-dev/layouts/_default/sitemap.xml themes/enumerator-dev/layouts/list.archivejson.json themes/enumerator-dev/layouts/list.archivehtml.html themes/enumerator-dev/layouts/list.photosjson.json themes/enumerator-dev/layouts/list.photoshtml.html themes/enumerator-dev/layouts/list.podcastxml.xml themes/enumerator-dev/layouts/list.podcastjson.json themes/enumerator-dev/layouts/list.rsd.xml themes/enumerator-dev/layouts/newsletter.html themes/enumerator-dev/layouts/robots.txt themes/enumerator-dev/layouts/redirect/single.html
git commit -m "Add micro.blog blank theme feed and utility templates"
```

---

### Task 7: Update list.html and single.html templates

**Files:**
- Modify: `themes/enumerator-dev/layouts/_default/list.html`
- Modify: `themes/enumerator-dev/layouts/_default/single.html`

**Step 1: Update list.html**

Replace `themes/enumerator-dev/layouts/_default/list.html` with:

```html
{{ define "main" }}

{{ if .Data.Singular }}
<header class="mb-8">
    <h1 class="text-3xl font-bold mb-2">{{ .Title }}</h1>
    {{ with .Content }}
        <div class="text-base-content/60">{{ . }}</div>
    {{ end }}
</header>
{{ end }}

{{ $pages := .Pages }}
{{ if .IsHome }}
  {{ $pages = where .Site.RegularPages "Section" "post" }}
{{ end }}
{{ range (.Paginate $pages).Pages }}
<article class="py-8 border-b border-base-content/15 last:border-b-0">

    <h2 class="text-3xl font-bold mb-4">
        <a class="text-base-content hover:text-primary" href="{{ .Permalink }}">{{ .Title }}</a>
    </h2>

    <div class="flex flex-wrap items-center gap-3 mb-6 text-sm text-base-content/50">
        <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "Jan 2, 2006" }}</time>
        {{ with .ReadingTime }}
            <span>&middot;</span>
            <span>{{ . }} min read</span>
        {{ end }}
        {{ with .Params.categories }}
            <span>&middot;</span>
            {{ range . }}
                <a class="badge badge-outline badge-primary badge-sm" href="{{ "categories/" | absURL }}{{ . | urlize }}/">{{ . }}</a>
            {{ end }}
        {{ end }}
    </div>

    {{ with .Params.images }}
        {{ with index . 0 }}
        <figure class="mb-6">
            <img
                class="w-full rounded-lg"
                src="{{ . }}"
                alt=""
                loading="lazy"
            >
        </figure>
        {{ end }}
    {{ end }}

    <section class="prose max-w-none">
        {{ .Content }}
    </section>

</article>
{{ end }}

{{ partial "pagination.html" . }}

{{ end }}
```

Changes:
- `site.RegularPages` → `.Site.RegularPages`
- `"Section" "posts"` → `"Section" "post"`
- `tags` → `categories` (front matter param and URL)

**Step 2: Update single.html**

Replace `themes/enumerator-dev/layouts/_default/single.html` with:

```html
{{ define "main" }}
<article>

    <header class="mb-8">
        <h1 class="text-4xl font-bold mb-3">{{ .Title }}</h1>
        <div class="flex items-center gap-3 text-base-content/50">
            {{ with .Site.Params.author }}
                <span>{{ . }}</span>
                <span>&middot;</span>
            {{ end }}
            <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "Jan 2, 2006" }}</time>
            {{ with .ReadingTime }}
                <span>&middot;</span>
                <span>{{ . }} min read</span>
            {{ end }}
        </div>
    </header>

    {{ with .Params.images }}
        {{ with index . 0 }}
        <figure class="mb-8">
            <img
                class="w-full rounded-lg"
                src="{{ . }}"
                alt=""
                loading="lazy"
            >
        </figure>
        {{ end }}
    {{ end }}

    <section class="prose max-w-none">
        {{ .Content }}
    </section>

    {{ with .GetTerms "categories" }}
        <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-base-300">
            {{ range . }}
                <a class="badge badge-outline badge-primary" href="{{ .Permalink }}">{{ .LinkTitle }}</a>
            {{ end }}
        </div>
    {{ end }}

</article>
{{ end }}
```

Changes:
- `.GetTerms "tags"` → `.GetTerms "categories"`

**Step 3: Commit**

```bash
git add themes/enumerator-dev/layouts/_default/list.html themes/enumerator-dev/layouts/_default/single.html
git commit -m "Update list.html and single.html for categories and Hugo 0.91"
```

---

### Task 8: Update remaining templates (card, tag, 404)

**Files:**
- Modify: `themes/enumerator-dev/layouts/partials/card.html`
- Rename: `themes/enumerator-dev/layouts/taxonomy/tag.html` → `themes/enumerator-dev/layouts/taxonomy/category.html`

**Step 1: Update card.html**

Replace `themes/enumerator-dev/layouts/partials/card.html` with:

```html
<article class="py-6 border-b border-base-300 last:border-b-0">
    <h2 class="text-2xl font-bold mb-2">
        <a class="text-base-content hover:text-primary" href="{{ .Permalink }}">{{ .Title }}</a>
    </h2>
    {{ with .Summary }}
        <p class="text-base-content/70 mb-3">{{ . }}</p>
    {{ end }}
    <div class="flex items-center gap-3 text-sm text-base-content/50">
        <time datetime="{{ .Date.Format "2006-01-02" }}">{{ .Date.Format "Jan 2, 2006" }}</time>
        {{ with .ReadingTime }}
            <span>&middot;</span>
            <span>{{ . }} min read</span>
        {{ end }}
        {{ with .Params.categories }}
            {{ with index . 0 }}
                <span>&middot;</span>
                <a class="text-primary" href="{{ "categories/" | absURL }}{{ . | urlize }}/">{{ . }}</a>
            {{ end }}
        {{ end }}
    </div>
</article>
```

Changes: `.Params.tags` → `.Params.categories`, URL path `tags/` → `categories/`

**Step 2: Rename tag.html to category.html**

```bash
git mv themes/enumerator-dev/layouts/taxonomy/tag.html themes/enumerator-dev/layouts/taxonomy/category.html
```

No content changes needed — the taxonomy template itself doesn't reference tags/categories by name.

**Step 3: Commit**

```bash
git add themes/enumerator-dev/layouts/partials/card.html themes/enumerator-dev/layouts/taxonomy/category.html
git commit -m "Update card partial and rename tag taxonomy template to category"
```

---

### Task 9: Update theme.toml

**Files:**
- Modify: `themes/enumerator-dev/theme.toml`

**Step 1: Update min_version**

Edit `themes/enumerator-dev/theme.toml` and change `min_version`:

```toml
name = "enumerator-dev"
license = "MIT"
licenselink = "https://github.com/yourusername/enumerator-dev-theme/blob/main/LICENSE"
description = "A clean dev blog theme with Catppuccin colors, Tailwind CSS, and daisyUI"
tags = ["blog", "tailwind", "daisyui", "catppuccin", "dark-mode"]
min_version = "0.91.0"

[author]
  name = "cassiopod"
```

**Step 2: Commit**

```bash
git add themes/enumerator-dev/theme.toml
git commit -m "Update theme min_version to 0.91.0"
```

---

### Task 10: Rename content directory and update front matter

**Files:**
- Rename: `content/posts/` → `content/post/`
- Modify: `content/post/hello-world.md` (front matter)

**Step 1: Rename the content directory**

```bash
git mv content/posts content/post
```

**Step 2: Update front matter in hello-world.md**

Change `tags` to `categories`:

```yaml
---
title: "Hello World"
date: 2026-03-05
categories: ["hugo", "test"]
summary: "A test post to verify the theme works correctly."
---
```

**Step 3: Commit**

```bash
git add content/post/hello-world.md
git commit -m "Rename content/posts to content/post and switch tags to categories"
```

---

### Task 11: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Update CLAUDE.md to reflect new project state**

Update the following sections:

- Development: mention Hugo 0.91 requirement, `npm run build:css` for CSS changes
- Theme: note pre-compiled CSS workflow
- Content: `content/post/` not `content/posts/`, categories not tags
- Remove references to `css.TailwindCSS` pipe
- Note that `config.toml` is used (not `hugo.toml`)

**Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "Update CLAUDE.md for Hugo 0.91 and micro.blog workflow"
```

---

### Task 12: Test with Hugo 0.91

**Files:**
- None (verification only)

**Step 1: Run hugo build**

```bash
/tmp/hugo-0.91/hugo --source /Users/cassidy/code/enumerator.dev-hugo
```

Expected: Build succeeds with no errors. Warnings about missing params (like `site_id`, `Author.username`) are fine — those are populated by micro.blog.

**Step 2: Run hugo server and verify pages**

```bash
/tmp/hugo-0.91/hugo server --source /Users/cassidy/code/enumerator.dev-hugo
```

Manually verify:
- Homepage loads with styled content (Tailwind CSS applied)
- Hello World post renders with syntax highlighting and mermaid diagram placeholder
- About page renders
- Category links work
- RSS feed at `/feed.xml` renders
- JSON feed at `/feed.json` renders
- 404 page renders

**Step 3: Fix any issues found**

If there are errors, debug and fix them before proceeding.

**Step 4: Commit any fixes**

If fixes were needed, commit them with descriptive messages.

---

### Task 13: Clean up old assets directory

**Files:**
- Delete: `themes/enumerator-dev/assets/js/` (mermaid.js already moved)
- Keep: `themes/enumerator-dev/assets/css/main.css` (Tailwind source)

**Step 1: Remove the now-empty assets/js directory**

```bash
rmdir themes/enumerator-dev/assets/js
```

This directory should already be empty since mermaid.js was moved in Task 4. If it's not empty, investigate before deleting.

**Step 2: Verify assets/css/main.css still exists**

```bash
ls themes/enumerator-dev/assets/css/main.css
```

This file is the Tailwind CSS source and must remain for the `npm run build:css` workflow.

**Step 3: No commit needed** (directory removal is tracked by the git mv in Task 4)
