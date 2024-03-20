module.exports = {
  title: 'Guihur Blog',
  description: '我的日常个人博客',
  theme: 'reco',
  // base: '/GuihurBlog/',
  base: '/',
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
          { title: 'Blog踩坑日志', path: '/technology_sharing/blog踩坑日志.md' },
          { title: '了解Flutter', path: '/technology_sharing/了解Flutter.md' },
          { title: 'TOTP原理解析', path: '/technology_sharing/TOTP原理解析.md' },
          { title: 'Vue响应式原理解析', path: '/technology_sharing/Vue响应式原理解析.md' },
          { title: '盲打速成', path: '/technology_sharing/盲打速成.md' },
          { title: '批量传图中实现同步上传', path: '/technology_sharing/批量上传图片取消并发.md' },
          { title: '域名-备案-SSL申请经历', path: '/technology_sharing/域名备案申请.md' },
          { title: 'Nginx探索之旅', path: '/technology_sharing/学习Nginx自己部署网页.md' },
          { title: '博客自动化免密部署阿里云', path: '/technology_sharing/自动化打包博客并且免密部署阿里云.md' }
        ]
      },
      {
        title: '文摘-语录-思考',
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
          { title: '深圳之旅', path: '/play/travel_sz.md' },
          { title: '太刀修炼', path: '/play/太刀修炼.md' }
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
