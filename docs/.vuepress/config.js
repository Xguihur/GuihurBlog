module.exports = {
  title: 'Guihur Blog',
  description: '我的日常个人博客',
  theme: 'reco',
  base: '/GuihurBlog/',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    logo: '/logo1.png',
    // displayAllHeaders: true,把所有层级的目录都展开
    // sidebar: 'auto', //更新文档的标题在浏览器中显示
    lastUpdated: '上次更新',
    smoothScroll: true,
    subSidebar: 'auto',
    // --- 仓库
    repo: 'https://github.com/Xguihur/GuihurBlog.git',
    repoLabel: '查看源码',
    // docsDir: 'docs', // 假如文档不是放在仓库的根目录下：
    editLinks: true,
    // 默认为 "Edit this page"
    editLinkText: '帮助我们改善此页面！',
    // ---
    nav: [
      { text: '首页', link: '/' },
      {
        text: '桂花的关联网站',
        items: [
          { text: 'Github', link: 'https://github.com/Xguihur' },
          { text: '语雀', link: 'https://www.yuque.com/luffy-j7ldi' },
          { text: '算法博客', link: 'http://47.120.44.145:3000/#/' }
        ]
      }
    ],
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, // 不折叠
        children: [{ title: '学前必读', path: '/' }]
      },
      {
        title: '技术分享',
        path: '/technology_sharing/First',
        collapsable: false, // 不折叠
        children: [
          { title: 'One', path: '/technology_sharing/First' },
          { title: 'Two', path: '/technology_sharing/Second' },
          { title: '了解Flutter', path: '/technology_sharing/了解Flutter.md' },
          { title: 'TOTP原理解析', path: '/technology_sharing/TOTP原理解析.md' }
        ]
      },
      {
        title: '生活点滴',
        path: '/life_detail/template',
        collapsable: false, // 不折叠
        children: [{ title: 'life_one', path: '/life_detail/template.md' }]
      },
      {
        title: '自娱自乐',
        path: '/play/template',
        collapsable: false, // 不折叠
        children: [
          { title: 'play_one', path: '/play/template.md' },
          { title: '深圳之旅', path: '/play/travel_sz.md' }
        ]
      }
      // {
      //   title: '思考与感悟',
      //   path: '/think_feel/template',
      //   collapsable: false, // 不折叠
      //   children: [{ title: 'think_one', path: '/think_feel/template.md' }]
      // }
    ]
  }
}
