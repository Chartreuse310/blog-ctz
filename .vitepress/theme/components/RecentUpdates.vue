<script setup>
import { data as posts } from '../../posts.data'
import { withBase } from 'vitepress'
import { computed } from 'vue'

const recent = computed(() => {
  return posts
    .sort((a, b) => new Date(b.modified || b.date) - new Date(a.modified || a.date))
    .slice(0, 3)
})

const formatTags = (tags) => {
  if (!tags) return []
  return tags.map(tag => tag.split('/').pop())
}
</script>

<template>
  <div class="recent-section">
    <div class="recent-grid">
      <a v-for="post in recent" :key="post.url" :href="withBase(post.url)" class="recent-card">
        <span class="recent-title">{{ post.title }}</span>
        <div class="recent-bottom">
          <div class="recent-tags">
            <span v-for="tag in formatTags(post.tags)" :key="tag" class="recent-tag">{{ tag }}</span>
          </div>
          <span v-if="post.modified" class="recent-date recent-modified">{{ post.modified }}</span>
          <span v-else class="recent-date">{{ post.date }}</span>
        </div>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recent-section {
  margin-top: 24px;
}
.recent-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.recent-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.25s;
  min-height: 120px;
  flex: 0 0 auto;
}
.recent-card:hover {
  border-color: var(--vp-c-brand-1);
}
.recent-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.5;
}
.recent-bottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 12px;
}
.recent-tags {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
  gap: 6px;
}
.recent-tag {
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border-radius: 4px;
  padding: 2px 8px;
}
.recent-date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 8px;
}
.recent-modified {
  color: #81c784;
}
</style>
