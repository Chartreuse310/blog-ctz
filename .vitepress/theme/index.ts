// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import ActivityChart from './components/ActivityChart.vue'
import RecentUpdates from './components/RecentUpdates.vue'
import ArticleMeta from './components/ArticleMeta.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(ActivityChart),
      'doc-before': () => h(ArticleMeta)
    })
  },
  enhanceApp({ app, router, siteData }) {
    // ...
  }
} satisfies Theme
