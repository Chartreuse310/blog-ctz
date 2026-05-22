<script setup>
import { data as posts } from '../../posts.data'
import { withBase } from 'vitepress'
import { computed, ref } from 'vue'

const selectedTime = ref(null)
const selectedTags = ref([])

const allPosts = computed(() =>
  [...posts].sort((a, b) => new Date(b.modified || b.date) - new Date(a.modified || a.date))
)

const years = computed(() => {
  const set = new Set(allPosts.value.map(p => new Date(p.date).getFullYear()))
  return [...set].sort((a, b) => b - a)
})

const countByTime = (key) => {
  const now = new Date()
  return allPosts.value.filter(p => {
    const d = new Date(p.date)
    switch (key) {
      case 'today':
        return d.toDateString() === now.toDateString()
      case '3days': {
        const ago = new Date(now)
        ago.setDate(ago.getDate() - 3)
        ago.setHours(0, 0, 0, 0)
        return d >= ago
      }
      case 'week': {
        const day = now.getDay() || 7
        const start = new Date(now)
        start.setDate(start.getDate() - day + 1)
        start.setHours(0, 0, 0, 0)
        return d >= start
      }
      case 'month':
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      default:
        return d.getFullYear() === key
    }
  }).length
}

const timeOptions = computed(() => {
  const fixed = [
    { key: 'today', label: '今天' },
    { key: '3days', label: '最近三天' },
    { key: 'week', label: '本周' },
    { key: 'month', label: '本月' },
  ]
  const yearOpts = years.value.map(y => ({ key: y, label: String(y) }))
  return [...fixed, ...yearOpts].map(o => ({ ...o, count: countByTime(o.key) }))
})

const tagTree = computed(() => {
  const tree = {}
  allPosts.value.forEach(p => {
    p.tags?.forEach(tag => {
      const parts = tag.split('/')
      const parent = parts[0]
      const child = parts.length > 1 ? parts[parts.length - 1] : null
      if (!tree[parent]) tree[parent] = { _count: 0, children: {} }
      tree[parent]._count++
      if (child) {
        if (!tree[parent].children[child]) tree[parent].children[child] = 0
        tree[parent].children[child]++
      }
    })
  })
  return Object.entries(tree)
    .sort((a, b) => b[1]._count - a[1]._count)
    .map(([name, { _count, children }]) => {
      const sortedChildren = Object.entries(children)
        .sort((a, b) => b[1] - a[1])
      return { name, count: _count, children: Object.fromEntries(sortedChildren) }
    })
})

const filtered = computed(() => {
  return allPosts.value.filter(p => {
    if (selectedTime.value !== null) {
      const d = new Date(p.date)
      const now = new Date()
      switch (selectedTime.value) {
        case 'today':
          if (d.toDateString() !== now.toDateString()) return false
          break
        case '3days': {
          const ago = new Date(now)
          ago.setDate(ago.getDate() - 3)
          ago.setHours(0, 0, 0, 0)
          if (d < ago) return false
          break
        }
        case 'week': {
          const day = now.getDay() || 7
          const start = new Date(now)
          start.setDate(start.getDate() - day + 1)
          start.setHours(0, 0, 0, 0)
          if (d < start) return false
          break
        }
        case 'month':
          if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false
          break
        default:
          if (d.getFullYear() !== selectedTime.value) return false
      }
    }
    if (selectedTags.value.length > 0) {
      return selectedTags.value.every(tag =>
        p.tags?.some(t => t.endsWith('/' + tag) || t === tag)
      )
    }
    return true
  })
})

const toggleTime = (key) => {
  selectedTime.value = selectedTime.value === key ? null : key
}

const toggleParent = (parent) => {
  const group = tagTree.value.find(g => g.name === parent)
  if (!group) return
  const children = Object.keys(group.children)
  const allSelected = children.every(c => selectedTags.value.includes(c))
  if (allSelected) {
    selectedTags.value = selectedTags.value.filter(t => !children.includes(t))
  } else {
    children.forEach(c => {
      if (!selectedTags.value.includes(c)) selectedTags.value.push(c)
    })
  }
}

const toggleTag = (tag) => {
  const i = selectedTags.value.indexOf(tag)
  if (i === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(i, 1)
}

const clearFilters = () => {
  selectedTime.value = null
  selectedTags.value = []
}

const formatTags = (tags) => {
  if (!tags) return []
  return tags.map(tag => tag.split('/').pop())
}
</script>

<template>
  <div class="all-section">
    <div class="filter-bar">
      <div class="filter-row">
        <span class="filter-label">时间</span>
        <button
          class="filter-chip"
          :class="{ active: selectedTime === null }"
          @click="selectedTime = null"
        >全部</button>
        <button
          v-for="opt in timeOptions" :key="opt.key"
          class="filter-chip"
          :class="{ active: selectedTime === opt.key }"
          @click="toggleTime(opt.key)"
        >{{ opt.label }} <small>{{ opt.count }}</small></button>
      </div>
      <div v-for="group in tagTree" :key="group.name" class="filter-row">
        <button
          class="parent-chip"
          :class="{ active: Object.keys(group.children).every(c => selectedTags.includes(c)) }"
          @click="toggleParent(group.name)"
        >{{ group.name }} <small>{{ group.count }}</small></button>
        <button
          v-for="(count, child) in group.children" :key="child"
          class="filter-chip"
          :class="{ active: selectedTags.includes(child) }"
          @click="toggleTag(child)"
        >{{ child }} <small>{{ count }}</small></button>
      </div>
      <button
        v-if="selectedTime !== null || selectedTags.length > 0"
        class="clear-btn"
        @click="clearFilters"
      >清除筛选</button>
    </div>

    <p class="result-count">{{ filtered.length }} 篇文章</p>

    <div class="recent-grid">
      <a v-for="post in filtered" :key="post.url" :href="withBase(post.url)" class="recent-card">
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
.all-section {
  margin-top: 24px;
}
.filter-bar {
  margin-bottom: 24px;
}
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
  width: 36px;
}
.filter-chip {
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-default-soft);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip:hover {
  color: var(--vp-c-text-1);
  border-color: var(--vp-c-divider);
}
.filter-chip small {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-left: 2px;
}
.parent-chip {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  background: var(--vp-c-default-soft);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 4px 12px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.parent-chip:hover {
  border-color: var(--vp-c-divider);
}
.parent-chip.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-dimm);
  border-color: var(--vp-c-brand-1);
}
.parent-chip small {
  font-size: 11px;
  color: var(--vp-c-text-3);
  margin-left: 2px;
}
.filter-chip.active {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-dimm);
  border-color: var(--vp-c-brand-1);
}
.clear-btn {
  font-size: 12px;
  color: var(--vp-c-text-3);
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px 0;
  margin-top: 4px;
}
.clear-btn:hover {
  color: var(--vp-c-text-1);
}
.result-count {
  font-size: 13px;
  color: var(--vp-c-text-3);
  margin: 0 0 16px;
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
