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
    // Convert to sorted array
    return Object.entries(tree)
      .map(([name, children]) => ({ name, children }))
      .sort((a, b) => b.children._count - a.children._count)
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
    <div class="tag-grid">
      <div v-for="item in tagTree" :key="item.name" class="tag-card">
        <div class="tag-card-header">
          <span class="tag-name">{{ item.name }}</span>
          <span class="tag-count">&nbsp;{{ item.children._count }}&nbsp;</span>
        </div>
        <div v-if="hasChildren(item.children)" class="tag-children">
          <span v-for="(v, child) in getChildren(item.children)" :key="child" class="tag-chip">
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
@media (min-width: 640px) {
  .tag-section {
    padding: 0 48px 96px;
  }
}
@media (min-width: 960px) {
  .tag-section {
    padding: 0 64px 96px;
  }
}
.tag-title {
  text-align: left;
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