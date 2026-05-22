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

::: info 修改类型（紧急程度顺序，一般先修改再新建）
🏗️ 初始化 → 🐛 修复 → ⚙️ 修改框架 → ✏️ 修改页面 → 📄 增加页面 → 📝 修改笔记 → 📖 增加笔记
:::

## V.X.Y.Z (YYYY-MM-DD)

<emoji> <类型>

- 主要条目
	- 缩进的详细描述
```

Version numbers follow semver (major.minor.patch). Date is the release date.

## Modification Types

Within each version, group changes by type **in this order**:

| Emoji | Type | What goes here |
|-------|------|----------------|
| 🏗️ | 初始化 | Initial setup, scaffolding, first-time configuration |
| 🐛 | 修复 | Bug fixes, broken links, build failures |
| ⚙️ | 修改框架 | Site-wide framework changes: new frontmatter fields, favicon, global data pipeline, theme infrastructure |
| ✏️ | 修改页面 | Changes to existing pages, layouts, components, sidebar/nav |
| 📄 | 增加页面 | New pages, new features, new interactions |
| 📝 | 修改笔记 | Edits to existing article content |
| 📖 | 增加笔记 | New articles/note posts |

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

Categorize changes using the modification types above, in the specified order. Each type group is a heading with emoji. Items under each type use `- ` with optional indented `\t- ` for details.

Example:
```markdown
✏️ 修改页面

- 首页折线图——完整时间线、标签显示在折线点上
- 设计索引——增加"行业观察"分组

📄 增加页面

- All——按时间和标签筛选所有文章
	- 时间筛选：今天 / 最近三天 / 本周 / 本月 / 按年份
	- 标签按父/子分组显示，支持多标签 AND 筛选
```

### Step 4 — Article entries

For 📖 增加笔记 entries, use this format:

**Article date = version date:**
```
- [文章标题](路径)——栏目/分组名
```

**Article date < version date:**
```
- [文章标题](路径)（YYYY-MM-DD）——栏目/分组名
```

The link uses the VitePress base path format: `/<section>/<filename-without-ext>`.
The `——` suffix shows the section sidebar path (栏目/分组).

To determine the sidebar path, read `.vitepress/config.ts` and find where the article is registered.

### Step 5 — Insert the entry

- If the version already exists in changelog.md, **update** its content (merge new groups/items).
- If it's a new version, **insert** it after the `::: info` block, before all existing versions.
- Do not touch other version entries.

## Rules

- Always read the current `changelog.md` before editing.
- Always read `.vitepress/config.ts` to determine sidebar paths for article entries.
- Use Edit, not Write, to modify changelog.md — preserve original formatting.
- Keep entries concise: one line per item, indented details for elaboration only.
- If the user only asks to update a specific section, only modify that section.
- Bump `version` in `package.json` to match the new changelog version.
