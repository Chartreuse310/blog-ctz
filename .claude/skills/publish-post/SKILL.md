---
name: publish-post
description: >
  Format a markdown file, rename it, and register it in the VitePress sidebar.
  Use this skill whenever the user says "publish", "发布", "新文章", "添加文章",
  "整合处理", "格式化并发布", or explicitly invokes /publish-post.
---

# Publish Post

Format a markdown file, give it the correct filename, and register it in the VitePress sidebar — all in one pass.

## Input

The user must specify:
- **Target file**: the `.md` file to process. If not specified, ask.
- **Section** (optional): which topic directory the article belongs to (`architecture`, `design`, `dev`, `drawing`, `guitar`, `pkm`, `reading`). If not specified, infer from the file's current directory.

If any required info is missing, ask before proceeding.

## Steps

### Step 1 — Format the markdown

Perform these three transformations on the file content:

1. **Add frontmatter** — ensure the file has a YAML frontmatter block with `title`, `date`, and `tags`. If any field already exists, keep it. If missing:
   - `title`: derive from the first heading or ask the user.
   - `date`: use today's date (`YYYY-MM-DD`).
   - `tags`: ask the user, or leave as an empty array.
   - Tags use the hierarchical `Parent/Child` format (e.g. `Resources/影`, `Knowledge/Film`).

2. **Shift headings down one level** — insert a new H1 matching the `title` from frontmatter. Then shift all existing headings: H1→H2, H2→H3, etc. Do **not** add a duplicate H1 if one already matches the title exactly.

3. **Remove Obsidian-style `[[…]]` links** — replace `[[Page Name]]` with `Page Name` (plain text). Replace `[[Page Name|Display Text]]` with `Display Text`.

### Step 2 — Rename the file

Rename the file to the standard `YYMMDD_slug.md` format:

- **Date prefix**: `YYMMDD` derived from the `date` field in frontmatter.
- **Slug**: a short, lowercase, hyphenated English slug. If the filename already has a `YYMMDD_` prefix, preserve it and only adjust the slug portion if needed. If no slug exists, generate one from the title (translate/romanize if necessary).
- **Location**: the file should be in the correct section directory (e.g. `design/260520_into-the-wild.md`).

Use `mv` to rename. Then update **all references** to the old filename/URL across the project (same logic as the `rename-and-relink` skill):

- `.vitepress/config.ts`: sidebar links, nav links.
- `.md` files: `[text](old-url)` links.
- Other files referencing the old path.

### Step 3 — Register in sidebar

Add an entry for the new file in `.vitepress/config.ts` under the correct section's sidebar group:

1. Read the current `sidebar` config in `.vitepress/config.ts`.
2. Find the section matching the file's directory (e.g. `/design/`).
3. Determine the appropriate subgroup:
   - If the section already has subgroups, pick the correct one based on tags or ask the user.
   - If no subgroups exist, add the article directly under the section's `items` array.
4. Add a sidebar entry: `{ text: '<title from frontmatter>', link: '<VitePress URL without extension>' }`.
5. The sidebar link format is the relative path without `.md` extension, e.g. `/design/260520_into-the-wild`.

If the section has no sidebar config at all, create one following the existing pattern:
```ts
'/<section>/': [
  {
    text: '<section display name>',
    items: [
      { text: '索引', link: '/<section>/' },
      { text: '<article title>', link: '/<section>/<filename-without-ext>' }
    ]
  }
]
```

Section display name mapping:
- `architecture` → `建筑学`
- `design` → `设计`
- `dev` → `程序`
- `drawing` → `绘画`
- `guitar` → `吉他`
- `pkm` → `PKM`
- `reading` → `读书笔记`

### Step 4 — Report

Summarize all changes:
- File path: old → new
- Formatting changes made (frontmatter added/updated, headings shifted, `[[]]` removed)
- Sidebar entry added (show the exact config line)
- Any other files updated (reference links)

## Rules

- Never modify `node_modules/` or `.vitepress/cache/`.
- If frontmatter already has all fields and headings are already correct, skip those steps.
- If the file is already correctly named and in the right directory, skip Step 2.
- If the sidebar already has an entry for this file, do not duplicate it.
- If anything is ambiguous (e.g. which subgroup to use, what slug to pick), ask the user before proceeding.
- On failure at any step, stop and report — do not continue to the next step.
- **Use Edit, not Write** — in Step 1, apply formatting changes (frontmatter, heading shifts, tag removal) with targeted Edit calls instead of rewriting the entire file with Write. This preserves original characters (e.g. Chinese quotation marks `""`、`《》`) that Write may silently alter.
