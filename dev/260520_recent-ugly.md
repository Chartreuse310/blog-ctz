---
title: VitePress知识库搭建 - 最近更新 - 很丑的方案
date: 2026-05-20
tags:
  - Projects/BlogCTZ
  - Skills/Programming
---

# 最近更新 - 很丑的方案

添加 `.vitepress/theme/components/RecentUpdates.vue`：

```vue
<script setup>
import { data as posts } from '../../posts.data'
import { computed } from 'vue'

const recent = computed(() => {
  return posts
    .filter(post => post.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})
</script>

<template>
  <div class="recent-section">
    <div class="recent-list">
      <a v-for="post in recent" :key="post.url" :href="post.url" class="recent-item">
        <span class="recent-title">{{ post.title || post.url }}</span>
        <span class="recent-date">{{ post.date }}</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.recent-section {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 96px;
}
@media (min-width: 640px) {
  .recent-section {
    padding: 0 48px 96px;
  }
}
@media (min-width: 960px) {
  .recent-section {
    padding: 0 64px 96px;
  }
}
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s;
}
.recent-item:hover {
  border-color: var(--vp-c-brand-1);
}
.recent-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-1);
}
.recent-date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 16px;
}
</style>
```

修改 `.vitepress/theme/index.ts`：

```typescript
import RecentUpdates from './components/RecentUpdates.vue'

'home-features-after': () => [h(RecentUpdates), h(TagTree)]
```
