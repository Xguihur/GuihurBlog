---
title: 技术文章
date: 2026/05/07
tags:
 - 技术总览
---

这里整理已有的 18 篇技术笔记，按主题查找原理、实践与排查记录。

## 前端

- [Vite 与 Rollup 的 Tree-Shaking 机制](/docs/tech/frontend/Vite与Rollup的Tree-Shaking机制.html)：理解 ESM 静态分析、副作用声明与无用代码消除的关系。
- [Vue 响应式原理](/docs/tech/frontend/Vue响应式原理解析.html)：从数据劫持、模板编译到依赖收集与订阅更新，拆解响应式实现。
- [批量上传图片取消并发](/docs/tech/frontend/批量上传图片取消并发.html)：结合 Element UI 上传钩子与任务队列，将批量图片上传改为串行执行。
- [了解 Flutter](/docs/tech/frontend/了解Flutter.html)：记录 Flutter 渲染方式、跨端特点及首次配置 Android 开发环境的尝试。

## 后端

- [DTO、Entity、Mapper 与 VO 的区别](/docs/tech/backend/DTO、Entity、Mapper与VO的区别.html)：沿请求与响应的数据流区分各类对象及持久层职责。
- [MariaDB 是什么？和 MySQL 的关系](/docs/tech/backend/MySQL与MariaDB关系.html)：梳理两者的历史关系、兼容性与学习阶段的选用建议。
- [Spring 中接口实现类与 Bean 注入关系](/docs/tech/backend/Spring接口实现类与Bean注入关系.html)：解释接口注入、运行时实现类与多个 Bean 的选择方式。
- [前后端接口参数与返回值交互详解](/docs/tech/backend/前后端接口参数与返回值交互详解.html)：对照 JSON、表单、FormData 与文件下载选择接口交互方式。

## 部署与运维

- [博客踩坑日志](/docs/tech/devops/blog踩坑日志.html)：记录博客推送卡住时的排查过程及 SSH 密钥配置实践。
- [Verdaccio 私服搭建与使用](/docs/tech/devops/Verdaccio私服搭建.html)：介绍私有 npm 仓库的搭建流程与项目 registry 配置。
- [域名备案申请](/docs/tech/devops/域名备案申请.html)：记录阿里云域名购买、备案及 SSL 证书申请的经历。
- [定时任务时间设置规范](/docs/tech/devops/定时任务时间设置规范.html)：比较调度方式，整理 Spring/Quartz Cron 模板及其与 crontab 的区别。
- [压缩与未压缩日志查看命令](/docs/tech/devops/压缩与未压缩日志查看命令.html)：速查普通日志与 gzip 日志的关键词检索和截取命令。
- [自动化部署](/docs/tech/devops/自动化打包博客并且免密部署阿里云.html)：记录博客静态构建、部署脚本与阿里云免密发布的实践。
- [Nginx 探索](/docs/tech/devops/学习Nginx自己部署网页.html)：记录通过 Nginx 配置和部署网页的学习过程与问题总结。
- [将域名匹配上对应网站](/docs/tech/devops/域名解析以及备案号悬挂.html)：串联公安报备、备案号展示、DNS 解析与 Nginx 多站点配置。

## 技术杂项

- [TOTP 原理解析](/docs/tech/misc/TOTP原理解析.html)：结合双因素认证流程与 Node.js 代码理解动态验证码和位运算。
- [盲打速成](/docs/tech/misc/盲打速成.html)：记录三天键位练习的过程、易错按键与准确率优先的练习体会。
