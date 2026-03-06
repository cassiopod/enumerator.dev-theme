# Cassiopod Theme Restructure Design

## Goal

Restructure `cassiopod-theme` from a full Hugo site into a pure Hugo theme repo. Rename theme from "enumerator-dev" to "cassiopod". Preserve all existing functionality including micro.blog compatibility (Hugo 0.91).

## Changes

### Theme files move to repo root

| From | To |
|------|-----|
| `themes/enumerator-dev/layouts/` | `layouts/` |
| `themes/enumerator-dev/assets/` | `assets/` |
| `themes/enumerator-dev/static/` | `static/` |
| `themes/enumerator-dev/theme.toml` | `theme.toml` |

### Site files move to `exampleSite/`

| From | To |
|------|-----|
| `config.toml` | `exampleSite/config.toml` |
| `content/` | `exampleSite/content/` |
| `package.json` | `exampleSite/package.json` |

### Deleted

- `docs/plans/` — 4 historical implementation docs (replaced by this doc)
- `themes/` — empty after move

### Updated

- `theme.toml` — name = "cassiopod"
- `exampleSite/config.toml` — theme = "cassiopod"
- `exampleSite/package.json` — CSS path updated for exampleSite context
- `CLAUDE.md` — rewritten to describe cassiopod as a Hugo theme

### Unchanged

- All templates, partials, and feed formats
- Catppuccin light/dark CSS
- Fonts, JS, static assets
- Hugo 0.91 / micro.blog compatibility
- Tailwind CLI build tooling
