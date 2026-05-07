import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "Guihur Blog",
  description: "Just playing around",
  head: [['link', { rel: 'icon', href: 'http://8.134.197.161:3000/api/images/blog/image-1711220980084.png' }]],
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "http://8.134.197.161:3000/api/images/blog/image-1711218398984.png",
    author: "guihur",
    authorAvatar: "/lt1.jpg",
    repo: "Xguihur/GuihurBlog/",
    docsBranch: "main",
    // docsDir: "example",
    lastUpdatedText: "上次更新",
    catalogTitle: "当前文章目录",
    // series 为原 sidebar
    series: {
      "/docs/w3y/": [
        {
          text: "前端经验",
          children: ["overview.html", "Vue响应式原理解析.html", "批量上传图片取消并发.html", "了解Flutter.html"],
        },
        {
          text: "后端探索",
          children: [],
        },
        {
          text: "云服务器",
          children: ["blog踩坑日志.html", "域名备案申请.html", "自动化打包博客并且免密部署阿里云.html", "学习Nginx自己部署网页.html", "域名解析以及备案号悬挂.html"],
        },
        {
          text: "技术杂货",
          children: ["盲打速成.html", "TOTP原理解析.html"],
        },
      ],
    },
    navbar: [
      { text: "Home", link: "/", icon: "Home" },
      {
        text: "Blogs",
        icon: "Blog",
        children: [
          { text: "Posts", link: "/posts" },
          { text: "Timeline", link: "/timeline" },
        ],
      },
      {
        text: "Docs",
        icon: "Account",
        children: [
          { text: "Docs", link: "/docs/w3y/overview.html" },
          { text: "Guide", link: "/blogs/other/guide.html" },
        ],
      },
      {
        text: "Friendly Links",
        icon: "Link",
        children: [
          { text: "Github", link: "https://github.com/Xguihur" },
          { text: "语雀", link: "https://www.yuque.com/luffy-j7ldi" },
          { text: "算法博客", link: "http://47.120.44.145:3000/#/" },
        ],
      },

      // { text: "Categories", link: "/categories/reco/1/" },
      // { text: "Tags", link: "/tags/tag1/1/" },
      // {
      //   text: "Docs",
      //   children: [
      //     { text: "vuepress-reco", link: "/docs/theme-reco/theme" },
      //     { text: "vuepress-theme-reco", link: "/blogs/other/guide" },
      //   ],
      // },
    ],
    // bulletin: {
    //   body: [
    //     {
    //       type: "text",
    //       content: `🎉🎉🎉 reco 主题 2.x 已经接近 Beta 版本，在发布 Latest 版本之前不会再有大的更新，大家可以尽情尝鲜了，并且希望大家在 QQ 群和 GitHub 踊跃反馈使用体验，我会在第一时间响应。`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "QQ 群",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li>QQ群1：1037296104</li>
    //         <li>QQ群2：1061561395</li>
    //         <li>QQ群3：962687802</li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "title",
    //       content: "GitHub",
    //     },
    //     {
    //       type: "text",
    //       content: `
    //       <ul>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/issues">Issues<a/></li>
    //         <li><a href="https://github.com/vuepress-reco/vuepress-theme-reco-next/discussions/1">Discussions<a/></li>
    //       </ul>`,
    //       style: "font-size: 12px;",
    //     },
    //     {
    //       type: "hr",
    //     },
    //     {
    //       type: "buttongroup",
    //       children: [
    //         {
    //           text: "打赏",
    //           link: "/docs/others/donate.html",
    //         },
    //       ],
    //     },
    //   ],
    // },
    // commentConfig: {
    //   type: 'valine',
    //   // options 与 1.x 的 valineConfig 配置一致
    //   options: {
    //     // appId: 'xxx',
    //     // appKey: 'xxx',
    //     // placeholder: '填写邮箱可以收到回复提醒哦！',
    //     // verify: true, // 验证码服务
    //     // notify: true,
    //     // recordIP: true,
    //     // hideComments: true // 隐藏评论
    //   },
    // },
  }),
  // debug: true,
});
