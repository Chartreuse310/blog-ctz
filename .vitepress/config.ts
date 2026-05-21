import { defineConfig } from 'vitepress'
import mark from 'markdown-it-mark'
import footnote from 'markdown-it-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/blog-ctz/",
  title: "CTZ / Making & Thinking",
  description: "A designer's notes on building things — from code to craft.",
  head: [
    ['link', { rel: 'icon', href: '/blog-ctz/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '建筑学', link: '/architecture/' },
      { text: '设计', link: '/design/' },
      { text: '程序', link: '/dev/' },
      { text: '绘画', link: '/drawing/' },
      { text: '吉他', link: '/guitar/' },
      { text: 'PKM', link: '/pkm/' },
      { text: '读书笔记', link: '/reading/' },
      { text: 'All', link: '/all' }
    ],

    sidebar: {
      '/recent': [
        {
          text: '最近更新',
          items: []
        }
      ],
      '/architecture/': [
        {
          text: '建筑学',
          items: [
            { text: '索引', link: '/architecture/' },
            {
              text: '建筑设计',
              items: [
                { text: '讲座：张利”城市人因”', link: '/architecture/260331_zhang-li_urban-ergonomics' }
              ]
            }
          ]
        }
      ],
      '/design/': [
        {
          text: '设计',
          items: [
            { text: '索引', link: '/design/' },
            {
              text: '鉴赏',
              items: [
                { text: '荒野生存 Into the Wild（2007）', link: '/design/260520_into-the-wild' }
              ]
            }
          ]
        }
      ],
      '/dev/': [
        {
          text: '程序',
          items: [
            { text: '索引', link: '/dev/' },
            {
              text: 'VitePress知识库搭建',
              link: '/dev/260520_vitepress-knowledge-base',
              items: [
                { text: 'Tags - 404方案', link: '/dev/260520_tags-404' },
                { text: 'Tags - 很丑的方案', link: '/dev/260520_tags-ugly' },
                { text: 'Tags - 勉强能跑的方案', link: '/dev/260520_tags-working' },
                { text: '最近更新 - 很丑的方案', link: '/dev/260520_recent-ugly' },
                { text: '最近更新 - 勉强能用的方案', link: '/dev/260520_recent-working' }
              ]
            }
          ]
        }
      ]
    },

    outline: { level: [2, 4], label: '目录' },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Chartreuse310' }
    ]
  },
  markdown: {
    config: (md) => {
      md.use(mark)
      md.use(footnote)
    }
  }
})

