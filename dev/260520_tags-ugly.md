---
title: VitePress知识库搭建 - 统计tags - 很丑的方案
date: 2026-05-20
tags:
  - Projects/BlogCTZ
  - Skills/Programming
---

# 统计tags - 很丑的方案

方案：创建自定义组件

创建组件在 `.vitepress/theme/components/TagTree.vue`：

```vue
<script setup>
  import { data as posts } from '../../posts.data'
  import { computed } from 'vue'

  const tagTree = computed(() => {
    const tree = {}
    posts.forEach(post => {
      post.tags?.forEach(tag => {
        const parts = tag.split('/')
        let node = tree
        parts.forEach(part => {
          if (!node[part]) node[part] = { _count: 0 }
          node[part]._count++
          node = node[part]
        })
      })
    })
    return tree
  })
</script>

<template>
  <div class="tag-tree">
    <h2>Tags</h2>
    <pre>{{ tagTree }}</pre>
  </div>
</template>
```

把 `.vitepress/theme/index.ts` 改成这样：

```typescript
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import TagTree from './components/TagTree.vue' // 增加
import './style.css'

export default {
	extends: DefaultTheme,
	Layout: () => {
	  return h(DefaultTheme.Layout, null, {
		'home-features-after': () => h(TagTree) //增加
	  })
	},
	enhanceApp({ app, router, siteData }) {
	  // ...
	}
} satisfies Theme
```
