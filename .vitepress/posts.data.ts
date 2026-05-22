import { createContentLoader } from 'vitepress'

export default createContentLoader('**/*.md', {
  includeSrc: true,
  transform(rawData) {
    return rawData
      .filter(page => page.frontmatter.tags)
      .map(page => {
        const title = page.frontmatter.title
          || extractH1(page.src)
          || page.url
        return {
          url: page.url,
          title,
          date: formatDate(page.frontmatter.date),
          modified: formatDate(page.frontmatter.modified),
          tags: page.frontmatter.tags as string[]
        }
      })
  }
})

function extractH1(src?: string): string | undefined {
  if (!src) return undefined
  const match = src.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : undefined
}

function formatDate(date: string | Date | undefined): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
