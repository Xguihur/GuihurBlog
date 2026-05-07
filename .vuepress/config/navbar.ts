const navbar = [
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
      { text: "Tech Docs", link: "/docs/tech/overview.html" },
      { text: "Sports Docs", link: "/docs/sports/overview.html" },
      { text: "Guide", link: "/blogs/meta/2024/033001.html" },
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
];

export default navbar;
