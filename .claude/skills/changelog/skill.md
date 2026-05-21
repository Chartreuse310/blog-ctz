---
name: changelog
description: >
  Update the project changelog (changelog.md) with versioned entries.
  Use this skill when the user says "更新日志", "changelog", "更新changelog",
  "版本记录", "写更新日志", or explicitly invokes /changelog.
---

# Changelog

Maintain the project's changelog at `changelog.md` with structured, versioned entries.

## File

`changelog.md` at project root.

## Format

```markdown
# 更新日志

## X.Y.Z (YYYY-MM-DD)

<emoji> <分组标题>

- 条目一
- 条目二
```

Version numbers follow semver (major.minor.patch). Date is the release date.

## Steps

### Step 1 — Determine the version

- If the user specifies a version, use it.
- Otherwise, bump the latest version:
  - **Patch** (x.y.Z): bug fixes, minor tweaks.
  - **Minor** (x.Y.0): new features, new pages, new articles, UI changes.
  - **Major** (X.0.0): breaking changes, site restructure.
- Read the current `changelog.md` to find the latest version number.

### Step 2 — Collect changes

Gather what changed since the last version entry:

1. Check `git log` since the last version date for commits.
2. Check what the user describes as new changes.
3. Scan for new/modified `.md` content files (articles) and `.vitepress/` config/component changes.

### Step 3 — Categorize and write

Categorize changes into groups. Use these standard groups and emoji when applicable:

| Emoji | Group | What goes here |
|-------|-------|----------------|
| 📄 | 新文章 | Articles published on the version date |
| 📖 | 旧有文章回顾 | Articles dated before the version date, linked in this release |
| 🏗️ | 基础搭建 | Infrastructure, scaffolding, new sections |
| 🎨 | 外观 | Theme, styling, layout changes |
| 🔍 | 功能 | New features, pages, interactions |
| 📈 | 数据/图表 | Charts, statistics, data visualization |
| 🗂️ | 侧边栏/导航 | Sidebar, nav bar changes |
| 📝 | 排版 | Markdown plugins, typography |
| 🔧 | 工具 | Skills, scripts, dev tooling |
| 🐛 | 修复 | Bug fixes |
| 🚀 | 性能 | Performance improvements |

Add new groups as needed, always with an emoji prefix.

### Step 4 — Article entries

For article entries (新文章 and 旧有文章回顾), use this format:

**新文章** (article date = version date):
```
- [文章标题](base路径)——栏目/分组名
```

**旧有文章回顾** (article date < version date):
```
- [文章标题](base路径)（YYYY-MM-DD）——栏目/分组名
```

The link uses the VitePress base path format: `/blog-ctz/<section>/<filename-without-ext>`.
The `——` suffix shows the section sidebar path (栏目/分组).

To determine the sidebar path, read `.vitepress/config.ts` and find where the article is registered.

### Step 5 — Insert the entry

- If the version already exists in changelog.md, **update** its content (merge new groups/items).
- If it's a new version, **insert** it at the top (after `# 更新日志`), before all existing versions.
- Do not touch other version entries.

## Rules

- Always read the current `changelog.md` before editing.
- Always read `.vitepress/config.ts` to determine sidebar paths for article entries.
- Use Edit, not Write, to modify changelog.md — preserve original formatting.
- Keep entries concise: one line per item, no explanations beyond the bullet point.
- If the user only asks to update a specific section, only modify that section.
- Bump `version` in `package.json` to match the new changelog version.
