# micro.blog Template Override Fix

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make cassiopod theme templates win Hugo's template lookup on micro.blog (Hugo 0.91.2) so typography renders correctly.

**Architecture:** micro.blog stores posts under Hugo section type "post". Its built-in templates at `layouts/post/` beat our `layouts/_default/` in Hugo's lookup order. We create section-specific templates and a homepage template to override the built-ins. We also fix Hugo 0.91 API incompatibilities (`.GetTerms` unavailable).

**Tech Stack:** Hugo 0.91 templates, Tailwind CSS v4, @tailwindcss/typography prose plugin

---

### Task 1: Create `layouts/post/single.html`

**Why:** Hugo 0.91 lookup for a page in section "post" checks `layouts/post/single.html` before `layouts/_default/single.html`. micro.blog's built-in provides one, so ours never wins.

**Files:**
- Create: `layouts/post/single.html`
- Reference: `layouts/_default/single.html`

**Step 1: Create the template**

This is the same as `_default/single.html` but uses `.Params.categories` instead of `.GetTerms "categories"` (which requires Hugo 0.97+, micro.blog runs 0.91.2).

```html
{{ define "main" }}
<article>

    <header class="mb-8">
        <h1 class="text-4xl font-bold mb-3">{{ .Title }}</h1>
        <div class="flex items-center gap-3 text-base-content/50">
            {{ with .Site.Params.author_name }}
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

    {{ with .Params.categories }}
        <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-base-300">
            {{ range . }}
                <a class="badge badge-outline badge-primary" href="{{ "categories/" | absURL }}{{ . | urlize }}/">{{ . }}</a>
            {{ end }}
        </div>
    {{ end }}

</article>
{{ end }}
```

**Step 2: Verify template renders locally**

Run from exampleSite/: `hugo server -D`
Visit a post page. Confirm:
- h1 title is large (text-4xl) and bold
- Date and reading time appear below title in muted text
- Content is wrapped in `prose` class (proper typography spacing)
- Categories show as badge pills below content

**Step 3: Commit**

```
git add layouts/post/single.html
git commit -m "Add post/single.html to win Hugo template lookup on micro.blog"
```

---

### Task 2: Fix `layouts/_default/single.html` for Hugo 0.91

**Why:** `.GetTerms` requires Hugo 0.97+. Replace with `.Params.categories` for micro.blog compatibility. This template is used as fallback for non-post content types.

**Files:**
- Modify: `layouts/_default/single.html:36-42`

**Step 1: Replace `.GetTerms` with `.Params.categories`**

Change lines 36-42 from:
```html
    {{ with .GetTerms "categories" }}
        <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-base-300">
            {{ range . }}
                <a class="badge badge-outline badge-primary" href="{{ .Permalink }}">{{ .LinkTitle }}</a>
            {{ end }}
        </div>
    {{ end }}
```

To:
```html
    {{ with .Params.categories }}
        <div class="flex flex-wrap gap-2 mt-8 pt-6 border-t border-base-300">
            {{ range . }}
                <a class="badge badge-outline badge-primary" href="{{ "categories/" | absURL }}{{ . | urlize }}/">{{ . }}</a>
            {{ end }}
        </div>
    {{ end }}
```

**Step 2: Also update author param**

Change `.Site.Params.author` to `.Site.Params.author_name` to match the micro.blog config parameter name (see blank theme config.json).

**Step 3: Verify locally**

Run from exampleSite/: `hugo server -D`
Visit a post. Confirm categories still render as badge pills.

**Step 4: Commit**

```
git add layouts/_default/single.html
git commit -m "Fix Hugo 0.91 compatibility: replace .GetTerms with .Params.categories"
```

---

### Task 3: Create `layouts/index.html` for homepage

**Why:** micro.blog's built-in homepage template uses classes like `post-preview`, `post-title`, `e-content` instead of our Tailwind utility classes. We need `layouts/index.html` which beats `_default/list.html` in Hugo's lookup order.

**Files:**
- Create: `layouts/index.html`
- Reference: `layouts/_default/list.html`

**Step 1: Create the homepage template**

This extends baseof.html and shows full post content (matching the Ghost theme's index.hbs behavior).

```html
{{ define "main" }}

{{ $pages := where .Site.RegularPages "Section" "post" }}
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

**Step 2: Verify locally**

Run from exampleSite/: `hugo server -D`
Visit homepage. Confirm:
- Posts show with large bold h2 titles
- Date, reading time, category badges in muted text
- Full post content wrapped in `prose` (proper typography)
- Posts separated by subtle bottom border

**Step 3: Commit**

```
git add layouts/index.html
git commit -m "Add index.html to override micro.blog built-in homepage template"
```

---

### Task 4: Rebuild CSS and verify class inclusion

**Why:** New templates must have all Tailwind utility classes present in the compiled CSS. The `@source "hugo_stats.json"` directive in main.css references a non-existent file — verify Tailwind still finds all classes via auto-detection.

**Files:**
- Verify: `static/cassiopod.css`
- Verify: `assets/css/main.css` (the `@source` line)

**Step 1: Rebuild CSS**

From theme root:
```bash
npm run build:css
```

**Step 2: Verify key classes exist in output**

Check that the compiled CSS contains: `prose`, `max-w-none`, `text-4xl`, `text-3xl`, `font-bold`, `text-base-content`, `badge`, `badge-outline`, `badge-primary`.

```bash
grep -c 'prose\|text-4xl\|text-3xl\|font-bold\|badge-outline' static/cassiopod.css
```

Expected: non-zero count for each.

**Step 3: Commit if CSS changed**

```
git add static/cassiopod.css
git commit -m "Rebuild CSS with updated template classes"
```

---

### Task 5: End-to-end verification

**Why:** Confirm the full template chain works: baseof.html -> index.html/post/single.html -> correct prose typography.

**Step 1: Run Hugo dev server**

From exampleSite/:
```bash
hugo server -D
```

**Step 2: Check homepage**

- Title "Hello World" should be large (text-3xl ~34px) and bold
- Body text should be 18px with 1.75 line-height (prose default)
- Headings within content (h2 "Code Block") should be visibly larger than body
- Code blocks should have Catppuccin mantle background
- Lists should have disc markers and proper indentation

**Step 3: Check single post page**

- Click through to a post
- Title should be text-4xl (~40px) bold, using Source Serif 4 font
- Content should have full prose typography (spacing, font sizes, margins)
- Categories should show as purple outline badges

**Step 4: Check page type still works**

- Visit /about/ page
- Should still use page/single.html template (no date, no categories)

**Step 5: Commit any final fixes**

---

## Notes

### Code highlighting on micro.blog

micro.blog's Hugo 0.91 uses `noClasses = true` (default), generating inline Monokai styles instead of Chroma CSS classes. Our Catppuccin Chroma styles won't apply on micro.blog. Options for a future task:
- Accept inline Monokai (functional but off-brand)
- Investigate if micro.blog respects theme config.json `markup.highlight` settings
- Add CSS that overrides inline styles (fragile)

### Template lookup reference (Hugo 0.91)

For a page in section "post":
1. `layouts/post/single.html` (we now provide this)
2. `layouts/_default/single.html` (our fallback)

For homepage:
1. `layouts/index.html` (we now provide this)
2. `layouts/_default/list.html` (our fallback for sections)

### `@source "hugo_stats.json"` in main.css

This line references a file that doesn't exist. Tailwind v4 still auto-detects classes from .html files in the project. The line is harmless but misleading — consider removing in a future cleanup.
