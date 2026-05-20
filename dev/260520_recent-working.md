---
title: VitePress知识库搭建 - 最近更新 - 勉强能用的方案
date: 2026-05-20
tags:
  - Projects/BlogCTZ
  - Skills/Programming
---

# 最近更新 - 勉强能用的方案

## 版本1

在我的强烈建议下，C老师修改成了这样：

![版本1效果](/PixPin_2026-05-20_17-46-08.png)

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

const formatTags = (tags) => {
  if (!tags) return []
  return tags.map(tag => tag.split('/').pop())
}
</script>

<template>
  <div class="recent-section">
    <div class="recent-list">
      <a v-for="post in recent" :key="post.url" :href="post.url" class="recent-item">
        <div class="recent-main">
          <span class="recent-title">{{ post.title || post.url }}</span>
          <div class="recent-meta">
            <span v-for="tag in formatTags(post.tags)" :key="tag" class="recent-tag">{{ tag }}</span>
          </div>
        </div>
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
  gap: 12px;
}
.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none;
  transition: border-color 0.25s;
}
.recent-item:hover {
  border-color: var(--vp-c-brand-1);
}
.recent-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.recent-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}
.recent-meta {
  display: flex;
  flex-wrap: wrap;
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
  font-size: 13px;
  color: var(--vp-c-text-3);
  flex-shrink: 0;
  margin-left: 16px;
  margin-top: 2px;
}
</style>
```

## 版本2

修改建议：

1. `/Architecture/` 的标题显示为："主题：建筑学"
2. `260331_张利"城市人因：阅读与设计高质量生活".html` 的标题显示为：张利"城市人因：阅读与设计高质量生活"
3. 时间显示为 `YYYY-MM-DD`
4. 一行可以显示三篇文章

修改内容：

1. `.vitepress/posts.data.ts` 修改标题提取
2. `.vitepress/theme/components/RecentUpdates.vue` 更新为三栏

效果：

![版本2效果](/PixPin_2026-05-20_17-55-15.png)

看起来标题并没有被正确显示出来——我发现是需要在frontmatter里设定好title（没想到懒了一下就吃到了偷懒的亏，也是没谁了）。

![修改后](/PixPin_2026-05-20_18-01-58.png)

虽然勉强算成功了，但我觉得还是好丑，于是决定首页只保留tags，"最近更新"进入次级菜单。
