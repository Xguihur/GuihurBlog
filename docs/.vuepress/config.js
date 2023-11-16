module.exports = {
  title: 'Guihur Blog',
  description: '我的日常个人博客',
  themeConfig: {
    logo: '/logo1.png',
    // displayAllHeaders: true,把所有层级的目录都展开
    // sidebar: 'auto', //更新文档的标题在浏览器中显示
    lastUpdated: 'Last Updated',
    smoothScroll: true,
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
          { title: 'Two', path: '/technology_sharing/Second' }
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
        children: [{ title: 'play_one', path: '/play/template.md' }]
      },
      {
        title: '思考与感悟',
        path: '/think_feel/template',
        collapsable: false, // 不折叠
        children: [{ title: 'think_one', path: '/think_feel/template.md' }]
      }
    ]
  }
}
