# Rename & Relink

Rename a file and update all references to it across the project.

## Trigger

When the user says "rename", "重命名", "改名", "重连", or explicitly invokes `/rename-and-relink`.

## Steps

1. **Get the old and new filenames** from the user. The old path must be an existing file. The new path is the desired target. Always preserve the `YYMMDD_` date prefix from the original filename.

2. **Rename the file** using `mv`. Use glob patterns or `--` separator if the filename contains special characters.

3. **Derive the URL changes**:
   - For `.md` files inside the project root: the VitePress URL is the relative path without extension.
     - e.g. `architecture/260331_old-name.md` → URL `/architecture/260331_old-name`
     - e.g. `architecture/260331_new-name.md` → URL `/architecture/260331_new-name`
   - Compute both old URL and new URL.

4. **Search and update all references**. Use `grep` to find every occurrence of the old filename or old URL across the project (excluding `node_modules` and `.vitepress/cache`). Update each file:

   - **`.vitepress/config.ts`**: update `sidebar` links and any `nav` links containing the old URL.
   - **Markdown files** (`.md`): update `[text](old-url)` links and `[text](old-filename.md)` links. Also update bare references to the old filename.
   - **Any other files** that reference the old filename or URL.

5. **Report**: list every file that was modified, showing old → new for each change.

## Rules

- Never modify `node_modules/` or `.vitepress/cache/`.
- If a reference looks ambiguous (e.g. a substring match that might not be the same file), ask the user before changing it.
- If the rename fails (file not found, permission error), stop and report the error — do not proceed to update references.
