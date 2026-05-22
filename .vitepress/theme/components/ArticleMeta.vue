<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

const formatTags = (tags) => {
  if (!tags) return []
  return tags.map(tag => tag.split('/').pop())
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
</script>

<template>
  <div v-if="frontmatter.date || frontmatter.tags" class="article-meta">
    <span v-if="frontmatter.date" class="meta-date">
      {{ formatDate(frontmatter.date) }}
      <template v-if="frontmatter.modified">
        <span class="meta-arrow"> → </span>
        <span class="meta-modified">{{ formatDate(frontmatter.modified) }}</span>
      </template>
    </span>
    <div v-if="frontmatter.tags" class="meta-tags">
      <span v-for="tag in formatTags(frontmatter.tags)" :key="tag" class="meta-tag">{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.meta-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
}
.meta-arrow {
  color: var(--vp-c-text-3);
}
.meta-modified {
  color: #81c784;
}
.meta-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.meta-tag {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border-radius: 4px;
  padding: 2px 8px;
}
</style>
