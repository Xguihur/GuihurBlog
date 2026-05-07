---
title: Verdaccio 私服搭建与使用
date: 2026/05/07
aiGenerated: true
tags:
 - Verdaccio
 - npm
 - 私服
 - DevOps
 - AI生成
---

## 背景

Verdaccio 是一个轻量级 npm 私服。它可以在本地快速启动，支持账号注册、登录、发布和安装，适合本地联调与内网测试。

## 快速流程

1. 全局安装并启动 Verdaccio。
2. 打开可视化页面，完成注册和登录。
3. 在目标组件库中执行 `publish`。
4. 在测试项目中通过私服地址安装对应包。

## 参考文档

- GitHub: [https://github.com/verdaccio/verdaccio](https://github.com/verdaccio/verdaccio)
- 官网: [https://www.verdaccio.org/](https://www.verdaccio.org/)

## 安装私服包

### 方式一：命令行指定 registry（适合快速验证）

```bash
npm install @mycpns/ui-lib --registry http://localhost:4873
```

```bash
yarn add @mycpns/ui-lib --registry http://localhost:4873
```

### 方式二：项目内配置 .npmrc（适合长期使用）

在项目根目录创建 `.npmrc`：

```ini
@mycpns:registry=http://localhost:4873
```

配置后，`@mycpns/*` 下的包会走本地 Verdaccio，其他依赖仍走默认 npm 源。安装时可直接执行：

```bash
npm install @mycpns/ui-lib
```

## 建议

1. 团队内统一使用 scope（示例：`@mycpns`），避免包来源混乱。
2. 把 registry 配置写进项目文档，方便新人快速接入。
3. 发布前确认版本号递增，避免覆盖导致联调混乱。
