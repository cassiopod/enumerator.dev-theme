# Cassiopod Theme Restructure Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure cassiopod-theme from a full Hugo site into a pure Hugo theme repo named "cassiopod".

**Architecture:** Move theme files from `themes/enumerator-dev/` to repo root. Move site files to `exampleSite/`. Delete old plan docs. Update references from "enumerator-dev" to "cassiopod".

**Tech Stack:** Hugo 0.91, Tailwind CSS v4, daisyUI v5, micro.blog

---

### Task 1: Create exampleSite directory and move site files

**Step 1: Create exampleSite directory structure**

Run: `mkdir -p exampleSite/content`

**Step 2: Move content directories**

Run: `git mv content/post exampleSite/content/post`
Run: `git mv content/page exampleSite/content/page`

**Step 3: Move config.toml to exampleSite**

Run: `git mv config.toml exampleSite/config.toml`

**Step 4: Update exampleSite/config.toml**

Change `theme = 'enumerator-dev'` to `theme = 'cassiopod'` on line 4.

**Step 5: Create exampleSite/package.json**

Create `exampleSite/package.json` with updated CSS paths:

```json
{
  "name": "cassiopod-example-site",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build:css": "npx @tailwindcss/cli -i ../assets/css/main.css -o ../static/custom.css --minify"
  },
  "devDependencies": {
    "@tailwindcss/cli": "^4.2.0",
    "@tailwindcss/typography": "^0.5.19",
    "daisyui": "^5.5.18",
    "tailwindcss": "^4.2.0"
  }
}
```

**Step 6: Delete old root package.json**

Run: `git rm package.json`

**Step 7: Delete old empty content directory**

Run: `rmdir content` (should be empty after git mv)

**Step 8: Commit**

Message: "Move site files to exampleSite/"

---

### Task 2: Move theme files to repo root

**Step 1: Move layouts directory**

Run: `git mv themes/enumerator-dev/layouts layouts`

**Step 2: Move assets directory**

Run: `git mv themes/enumerator-dev/assets assets`

**Step 3: Move static directory**

Run: `git mv themes/enumerator-dev/static static`

**Step 4: Move theme.toml**

Run: `git mv themes/enumerator-dev/theme.toml theme.toml`

**Step 5: Remove empty themes directory**

Run: `rm -rf themes`

**Step 6: Commit**

Message: "Move theme files from themes/enumerator-dev/ to repo root"

---

### Task 3: Rename theme to cassiopod

**Step 1: Update theme.toml**

Change line 1: `name = "enumerator-dev"` to `name = "cassiopod"`
Change line 3: update licenselink to `https://github.com/cassiopod/cassiopod-theme/blob/main/LICENSE`

**Step 2: Commit**

Message: "Rename theme from enumerator-dev to cassiopod"

---

### Task 4: Delete old plan docs

**Step 1: Remove historical plan docs**

Run: `git rm docs/plans/2026-03-05-hugo-theme-design.md`
Run: `git rm docs/plans/2026-03-05-hugo-theme-implementation.md`
Run: `git rm docs/plans/2026-03-06-hugo-091-microblog-design.md`
Run: `git rm docs/plans/2026-03-06-hugo-091-microblog-plan.md`

Keep: `2026-03-06-cassiopod-theme-restructure-design.md` and `2026-03-06-cassiopod-restructure-plan.md` (this file).

**Step 2: Commit**

Message: "Remove historical plan docs"

---

### Task 5: Rewrite CLAUDE.md

**Step 1: Rewrite CLAUDE.md**

Replace entire contents with documentation describing cassiopod as a Hugo theme:
- Theme name, purpose, and Hugo 0.91 / micro.blog compatibility
- How to use the theme (clone into themes/, set theme in config)
- CSS build process (npm install from exampleSite/, npm run build:css)
- Template structure (same sections as current CLAUDE.md but with root-relative paths)
- Styling details (Catppuccin, fonts, syntax highlighting, Mermaid)
- Content model (posts, pages, categories)
- exampleSite usage

**Step 2: Commit**

Message: "Rewrite CLAUDE.md for cassiopod theme"

---

### Task 6: Update .gitignore and clean up

**Step 1: Update .gitignore**

Add `exampleSite/public/`, `exampleSite/resources/`, `exampleSite/node_modules/`.
Remove `hugo_stats.json` line (no longer at root). Add `exampleSite/hugo_stats.json`.
Keep `node_modules/` for root-level safety.

**Step 2: Remove root-level files that belong to the site**

Run: `git rm hugo_stats.json` (if tracked)
Run: `rm -f .hugo_build.lock`

**Step 3: Remove package-lock.json if present**

Run: `git rm package-lock.json` (if tracked — belongs in exampleSite after npm install there)

**Step 4: Remove node_modules at root**

Run: `rm -rf node_modules`

**Step 5: Commit**

Message: "Clean up root directory and update .gitignore"

---

### Task 7: Verify exampleSite works

**Step 1: Install dependencies in exampleSite**

Run: `cd exampleSite && npm install`

**Step 2: Test CSS build**

Run: `cd exampleSite && npm run build:css`
Expected: `static/custom.css` is regenerated without errors.

**Step 3: Test Hugo server**

Run: `cd exampleSite && hugo server -D --themesDir ../..`
Expected: Site starts and serves on localhost. The `--themesDir` flag tells Hugo to look two levels up (the parent of exampleSite's parent) so it finds `cassiopod-theme/` as the theme directory.

Note: Hugo 0.91 is required. If not installed, verify the build command works: `cd exampleSite && hugo --themesDir ../..`

**Step 4: Commit any fixes if needed**
