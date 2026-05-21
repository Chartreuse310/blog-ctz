<script setup>
import { data as posts } from '../../posts.data'
import { computed } from 'vue'

const chartData = computed(() => {
  if (posts.length === 0) return []

  const sorted = [...posts].sort((a, b) => new Date(a.date) - new Date(b.date))
  const startDate = new Date(sorted[0].date)
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(sorted[sorted.length - 1].date)
  endDate.setHours(0, 0, 0, 0)

  const counts = {}
  const d = new Date(startDate)
  while (d <= endDate) {
    counts[key(d)] = 0
    d.setDate(d.getDate() + 1)
  }

  posts.forEach(p => {
    const k = key(new Date(p.date))
    if (k in counts) counts[k]++
  })

  const entries = []
  const cur = new Date(startDate)
  while (cur <= endDate) {
    entries.push({ date: new Date(cur), count: counts[key(cur)] })
    cur.setDate(cur.getDate() + 1)
  }

  return entries
})

const totalDays = computed(() => Math.max(chartData.value.length, 1))

const maxCount = computed(() => Math.max(1, ...chartData.value.map(d => d.count)))

const width = 700
const height = 120
const padX = 30
const padY = 22
const chartW = width - padX * 2
const chartH = height - padY * 2

const coords = computed(() => {
  return chartData.value.map((d, i) => ({
    x: padX + (i / (totalDays.value - 1)) * chartW,
    y: padY + chartH - (d.count / maxCount.value) * chartH
  }))
})

function toCurve(pts) {
  if (pts.length < 2) return ''
  let d = `M${pts[0].x},${pts[0].y}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[Math.min(i + 2, pts.length - 1)]
    const t = 0.3
    const cp1x = p1.x + (p2.x - p0.x) * t
    const cp1y = p1.y + (p2.y - p0.y) * t
    const cp2x = p2.x - (p3.x - p1.x) * t
    const cp2y = p2.y - (p3.y - p1.y) * t
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
  }
  return d
}

const linePath = computed(() => toCurve(coords.value))

const areaPath = computed(() => {
  const pts = coords.value
  const baseY = padY + chartH
  return `${toCurve(pts)} L${pts[pts.length - 1].x},${baseY} L${pts[0].x},${baseY} Z`
})

const xLabels = computed(() => {
  const data = chartData.value
  if (data.length <= 7) {
    return data.map((d, i) => ({
      x: padX + (i / (totalDays.value - 1)) * chartW,
      label: formatLabel(d.date)
    }))
  }

  const withCount = data.map((d, i) => ({ ...d, i })).filter(d => d.count > 0)
  withCount.sort((a, b) => b.count - a.count)
  const picks = withCount.slice(0, 6)
  picks.push(data[data.length - 1])
  picks.sort((a, b) => a.i - b.i)

  const seen = new Set()
  return picks.filter(d => {
    const k = d.i ?? data.indexOf(d)
    if (seen.has(k)) return false
    seen.add(k)
    return true
  }).map(d => {
    const idx = d.i ?? data.length - 1
    const x = padX + (idx / (totalDays.value - 1)) * chartW
    const y = padY + chartH - (data[idx].count / maxCount.value) * chartH
    return { x, y, label: formatLabel(d.date) }
  })
})

function formatLabel(d) {
  return totalDays.value > 180
    ? `${d.getFullYear()}/${d.getMonth() + 1}`
    : `${d.getMonth() + 1}/${d.getDate()}`
}

function key(d) {
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}
</script>

<template>
  <div class="activity-chart">
    <svg :viewBox="`0 0 ${width} ${height}`" class="chart-svg" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--vp-c-brand-1)" stop-opacity="0.25" />
          <stop offset="100%" stop-color="var(--vp-c-brand-1)" stop-opacity="0.02" />
        </linearGradient>
      </defs>
      <path :d="areaPath" fill="url(#areaGrad)" />
      <path :d="linePath" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5" stroke-linecap="round" />
      <template v-for="label in xLabels" :key="label.x">
        <circle :cx="label.x" :cy="label.y" r="3" fill="var(--vp-c-brand-1)" />
        <text :x="label.x" :y="label.y - 8" text-anchor="middle" class="point-label">{{ label.label }}</text>
      </template>
    </svg>
  </div>
</template>

<style scoped>
.activity-chart {
  max-width: 1152px;
  margin: 0 auto;
  padding: 0 24px 64px;
}
@media (min-width: 640px) {
  .activity-chart { padding: 0 48px 64px; }
}
@media (min-width: 960px) {
  .activity-chart { padding: 0 64px 64px; }
}
.chart-header {
  margin-bottom: 16px;
}
.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.chart-svg {
  width: 100%;
  height: auto;
  display: block;
}
.axis-label {
  font-size: 10px;
  fill: var(--vp-c-text-3);
}
.point-label {
  font-size: 10px;
  fill: var(--vp-c-text-2);
  font-weight: 500;
}
</style>
