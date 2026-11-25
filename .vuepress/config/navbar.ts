const navbar = [
  { text: "首页", link: "/" },
  {
    text: "博客",
    children: [
      { text: "文章列表", link: "/posts" },
      { text: "时间线", link: "/timeline" },
      { text: "网站历程", link: "/blogs/meta/2024/033001.html" },
    ],
  },
  {
    text: "知识库",
    children: [
      { text: "技术文章", link: "/docs/tech/overview.html" },
      { text: "运动文档（筹备中）", link: "/docs/sports/overview.html" },
    ],
  },
  { text: "每日晨报", link: "/news/" },
  {
    text: "友链",
    children: [
      { text: "Github", link: "https://github.com/Xguihur" },
      { text: "语雀", link: "https://www.yuque.com/luffy-j7ldi" },
      { text: "算法博客", link: "http://47.120.44.145:3000/#/" },
    ],
  },
];

export default navbar;
