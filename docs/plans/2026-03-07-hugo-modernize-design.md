# Hugo Modernization + Plausible Analytics

## Goal

Upgrade cassiopod theme from Hugo 0.91 (micro.blog compat) to latest Hugo (0.157+), integrate Tailwind CSS into Hugo's asset pipeline, and add Plausible analytics via hugo module.

## Changes

### 1. Config modernization
- Rename `config.toml` → `hugo.toml` (theme root and exampleSite)
- Delete `config/_default/markup.json` (merge into hugo.toml)
- Update `theme.toml` min_version
- Initialize `go.mod` for the theme

### 2. Plausible analytics (Hugo module)
- Add `github.com/divinerites/plausible-hugo` as module import
- Add `{{ partial "plausible_head.html" . }}` to `head.html`
- Add `[params.plausible]` config section to exampleSite

### 3. Tailwind CSS in Hugo asset pipeline
- Replace `<link rel="stylesheet" href="{{ "cassiopod.css" | relURL }}">` with Hugo pipe using `css.TailwindCSS`
- Delete `static/cassiopod.css` (pre-compiled CSS)
- Update `package.json` (remove build:css script)
- Enable `build.buildStats` in hugo.toml for class purging
- Update `assets/css/main.css` source references as needed for Hugo pipeline

### 4. Remove micro.blog wiring (keep feed templates)
**Delete entirely:**
- `layouts/partials/microblog_head.html`
- `layouts/partials/microblog_syndication.html`
- `layouts/partials/custom_footer.html`
- `layouts/partials/header.html`
- `layouts/list.rsd.xml`
- `layouts/newsletter.html`
- `layouts/redirect/single.html`
- `config/_default/markup.json`

**Clean up templates:**
- `head.html` — remove microblog_head include, add feed discovery links directly, add plausible partial
- `baseof.html` — remove custom_footer partial call
- `index.xml` — remove `source:markdown` element, micro.blog-specific params
- `index.json` — remove micro.blog-specific fields
- Archive/photo/podcast feed templates — remove `_microblog` fields

**Clean up config:**
- Remove micro.blog params from exampleSite config
- Remove RSD output format
- Keep RSS, JSON, archive, photo, podcast output formats

### 5. Update CLAUDE.md
- Remove all micro.blog references
- Document new Hugo version requirement
- Document Hugo asset pipeline for CSS
- Document plausible configuration
