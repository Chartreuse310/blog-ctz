---
title: VitePress知识库搭建
date: 2026-05-20
tags:
  - Projects/BlogCTZ
  - Skills/Programming
---

# VitePress知识库搭建

## 1 开始

### 1.1 新建项目

```zsh
pnpm add -D vitepress
```

### 1.2 初始化

```zsh
pnpm vitepress init
```

↓

```
┌  Welcome to VitePress!
│
◇  Where should VitePress initialize the config?
│  ./
│
◇  Site title:
│  CTZ / Making & Thinking
│
◇  Site description:
│  A designer's notes on building things — from code to craft.
│
◇  Theme:
│  Default Theme + Customization
│
◇  Use TypeScript for config and theme files?
│  Yes
│
◇  Add VitePress npm scripts to package.json?
│  Yes
│
└  Done! Now run pnpm run docs:dev and start writing.
```

1. 创建在当前文件夹（默认）
2. 标题：CTZ / Making & Thinking
3. 一句话描述：A designer's notes on building things — from code to craft.
4. 主题：Default Theme + Customization（随便选了一个，不知道有什么影响）
5. 使用TypeScript（默认）
6. 使用VitePress的npm脚本（默认）

### 1.3 启动

```zsh
pnpm run docs:dev
```

## 2 自定义

### 2.1 首页美化

1. 顶部增加：建筑学、设计、程序、绘画、吉他、PKM、读书笔记，参考 https://docs.bugdesigner.cn/ ✅
2. 增加"tags"：参考 https://pkmer.cn/page/ ✅
3. 增加"最近更新"：参考 https://pkmer.cn/page/ ✅ → 改为单独页面

![首页效果](/PixPin_2026-05-20_18-23-59.png)

#### 2.1.1 增加导航栏

在 `.vitepress/config.ts` 中加入：

```typescript
nav: [
	{ text: '首页', link: '/' },
	{ text: '建筑学', link: '/architecture/' },
	{ text: '设计', link: '/design/' },
	{ text: '程序', link: '/dev/' },
	{ text: '绘画', link: '/drawing/' },
	{ text: '吉他', link: '/guitar/' },
	{ text: 'PKM', link: '/pkm/' },
	{ text: '读书笔记', link: '/reading/' }
]
```

#### 2.1.2 统计tags

::: details 方案
- [404方案](260520_tags-404)
- [很丑的方案](260520_tags-ugly)
- [勉强能跑的方案&分析](260520_tags-working)
:::

#### 2.1.3 最近更新

::: details 方案
- [很丑的方案](260520_recent-ugly)
- [勉强能用的方案](260520_recent-working)
:::

虽然勉强算成功了，但我觉得还是好丑，于是决定首页只保留tags，"最近更新"进入次级菜单。

### 2.2 文章美化

#### 2.2.1 主题页

> 相当于该主体的导读和目录。

1. 左侧文章列表 ✅
2. 右侧目录 ✅

#### 2.2.2 文章页

1. 左侧文章列表 ✅
2. 为文章添加日期 ✅
3. 为文章添加标签，能够在首页统计标签树状图（如"Knowledge/Architecture"同时计入"Knowledge"和"Architecture"，且"Architecture"显示为"Knowledge"的子标签） ✅
4. 正确显示高亮内容 ✅
5. 显示三级（四级）标题 ✅
6. 正确显示尾注 ✅

##### （1）正确显示高亮

方案：通过插件将 `==` 识别为高亮标识。

```zsh
pnpm add -D markdown-it-mark
```

在 `.vitepress/config.ts` 中加入：

```typescript
import mark from 'markdown-it-mark'

export default defineConfig({
	markdown: {
	  config(md) {
		md.use(mark)
	  }
	},
})
```

##### （2）显示日期和tags

建立 `.vitepress/theme/components/ArticleMeta.vue`：

```vue
<script setup>
import { useData } from 'vitepress'

const { frontmatter } = useData()

const formatTags = (tags) => {
  if (!tags) return []
  return tags.map(tag => tag.split('/').pop())
}
</script>

<template>
  <div v-if="frontmatter.date || frontmatter.tags" class="article-meta">
    <span v-if="frontmatter.date" class="meta-date">{{ frontmatter.date }}</span>
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
```

并在 `.vitepress/theme/index.ts` 中引用：

```typescript
import ArticleMeta from './components/ArticleMeta.vue'

export default {
	extends: DefaultTheme,
	Layout: () => {
		return h(DefaultTheme.Layout, null, {
			'home-features-after': () => h(TagTree),
			'doc-before': () => h(ArticleMeta) //增加
		})
	},
	enhanceApp({ app, router, siteData }) {
	// ...
	}
} satisfies Theme
```

##### （3）显示四级标题

![四级标题](/PixPin_2026-05-20_19-50-46.png)

##### （4）正确显示尾注

```zsh
pnpm add -D markdown-it-footnote
```

#### 2.2.3 "最近更新"页

最初版：

![最初版](/PixPin_2026-05-20_18-19-28.png)

修改了一些后：

![修改后](/PixPin_2026-05-20_19-32-06.png)

只能说我尽力了，更多的咱也不会了。

## 参考

- [AlbertZhang的文档网站](https://docs.bugdesigner.cn/docs/Tutorial/vitepress.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%85%8D%E7%BD%AE)：非常简明的入门教程，感谢分享！
- [VitePress - Extending the Default Theme](https://vitepress.dev/guide/extending-default-theme#layout-slots)：官方指导，主要用于给C老师提供参考文献。
