---
title: VitePress知识库搭建 - 统计tags - 勉强能跑的方案&分析
date: 2026-05-20
tags:
  - Projects/BlogCTZ
  - Skills/Programming
---

# 统计tags - 勉强能跑的方案&分析

## 原始方案

旧版（VitePress知识库搭建 - 统计tags - 很丑的方案）太丑了，让Claude Code 给我生成了一个方案，`.vitepress/theme/components/TagTree.vue` 中是这样：

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

  const hasChildren = (node) => {
    return Object.keys(node).some(k => k !== '_count')
  }

  const getChildren = (node) => {
    const result = {}
    for (const key in node) {
      if (key !== '_count') result[key] = node[key]
    }
    return result
  }
</script>

<template>
  <div class="tag-section">
    <h2 class="tag-title">Tags</h2>
    <div class="tag-grid">
      <div v-for="(children, parent) in tagTree" :key="parent" class="tag-card">
        <div class="tag-card-header">
          <span class="tag-name">{{ parent }}</span>
          <span class="tag-count">{{ children._count }}</span>
        </div>
        <div v-if="hasChildren(children)" class="tag-children">
          <span v-for="(v, child) in getChildren(children)" :key="child" class="tag-chip">
            {{ child }}<small>{{ v._count }}</small>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
	.tag-section {
	  max-width: 1152px;
	  margin: 0 auto;
	  padding: 0 24px 96px;
	}
	.tag-title {
	  text-align: center;
	  font-size: 24px;
	  font-weight: 600;
	  margin-bottom: 40px;
	}
	.tag-grid {
	  display: grid;
	  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	  gap: 16px;
	}
	.tag-card {
	  border: 1px solid var(--vp-c-divider);
	  border-radius: 12px;
	  padding: 20px;
	  transition: border-color 0.25s;
	}
	.tag-card:hover {
	  border-color: var(--vp-c-brand-1);
	}
	.tag-card-header {
	  display: flex;
	  justify-content: space-between;
	  align-items: center;
	  margin-bottom: 12px;
	}
	.tag-name {
	  font-size: 16px;
	  font-weight: 600;
	  color: var(--vp-c-text-1);
	}
	.tag-count {
	  font-size: 12px;
	  color: var(--vp-c-text-3);
	  background: var(--vp-c-default-soft);
	  border-radius: 10px;
	  padding: 2px 8px;
	}
	.tag-children {
	  display: flex;
	  flex-wrap: wrap;
	  gap: 8px;
	}
	.tag-chip {
	  font-size: 13px;
	  color: var(--vp-c-text-2);
	  background: var(--vp-c-default-soft);
	  border-radius: 6px;
	  padding: 4px 10px;
	  display: flex;
	  align-items: center;
	  gap: 4px;
	}
	.tag-chip small {
	  font-size: 11px;
	  color: var(--vp-c-text-3);
	}
</style>
```

效果如下：

![tags效果](/PixPin_2026-05-20_16-13-52.png)

我只能说……虽然实现了但没有完全实现——"Tags"标题巨丑，统计的内容也没法点击。

## vue代码分析

### scripts

```js
<script setup>
	import { data as posts } from '../../posts.data'
	import { computed } from 'vue'

	const tagTree = computed(() => {
		const tree = {} // tree是一个大括号
		posts.forEach(post => { // 每篇文章
		  post.tags?.forEach(tag => { //每篇文章的tags，如果没有tags就跳过
			const parts = tag.split('/') // parts → 用"/"分割来抓取内容
			let node = tree //node取用tree的值，现在node是一个大括号了
			parts.forEach(part => { // parts中的每一条
			  if (!node[part]) node[part] = { _count: 0 } //如果node里没有part就创建一个part，_count值设为0
			  node[part]._count++ //增加_count，无论有还是没有
			  node = node[part] //node向下取值，node→node[Knowledge]→node[Knowledge][Architecture]
			})
		  })
		})
		return tree
	})

	const hasChildren = (node) => {
		return Object.keys(node).some(k => k !== '_count') // 这个对象里有没有除了_count以外的key，有就返回true
	}

	const getChildren = (node) => {
		const result = {}
		for (const key in node) {
			if (key !== '_count') result[key] = node[key]
		}
	return result
	}
</script>
```

- **tagTree**：获取逐层统计数量的对象
	- 用 `/` 分割标签，比如 `建筑/古典/明清` → `['建筑', '古典', '明清']`
	- 逐层往嵌套对象里塞，每经过一层 `_count + 1`
	- `_count` 表示这个节点（含子节点）一共出现了多少次
- **hasChildren(node)**：判断有没有子标签
- **getChildren(node)** ：获取所有子标签

示例 `tree`：

```javascript
{

	建筑: {
		_count: 4, // 4篇文章都有"建筑"
		古典: {
			_count: 2, // 2篇文章有"建筑/古典"
			明清: { _count: 1 },
			唐宋: { _count: 1 }
		},
		现代: {
		_count: 2 // 2篇文章有"建筑/现代"
		}
	},
	BIM: {
		_count: 1
	}
}
```

> 我感觉我的javascript该回炉重造了……

### template

```vue
<template>
  <div class="tag-section">
    <h2 class="tag-title">Tags</h2>
    <div class="tag-grid">
      <div v-for="(children, parent) in tagTree" :key="parent" class="tag-card">
        <div class="tag-card-header">
          <span class="tag-name">{{ parent }}</span>
          <span class="tag-count">{{ children._count }}</span>
        </div>
        <div v-if="hasChildren(children)" class="tag-children">
          <span v-for="(v, child) in getChildren(children)" :key="child" class="tag-chip">
            {{ child }}<small>{{ v._count }}</small>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
```

- tag-section
	- tag-title: ==Tags==
	- tag-grid
		- tag-card: key = "parent"（上级标签）
			- tag-card-header
				- tag-name：==parent==
				- tag-count：`children._count`
			- tag-children
				- tag-chip: key = "child"（小标签）
					- ==child==
					- `v._count`

## 解决方案

1. 删除"tags"标题
2. 在上级标签的统计数字前后加空格，让这个数字显得不那么逼仄

结果如图：

![修改后效果](/PixPin_2026-05-20_17-32-18.png)
