# 博客与文档编写规范（内部）

> 用途：仅供自己写作时查阅，不对外展示。  
> 适用范围：本仓库 `GuihurBlog`，自 `2026-05-07` 起执行。

## 1. 总体原则

1. 先分内容类型，再分主题：  
   `docs` 放可复用知识；`blogs` 放时间性记录、经历、感受。
2. 分类（`categories`）保持少而稳；标签（`tags`）负责细分。
3. 每篇文章只设 **1 个主分类**，避免分类页混乱。

## 2. 内容分轨规则

### 2.1 docs（知识库）

适合内容：
1. 技术原理、方案总结、排查手册、最佳实践。
2. 可长期复用、可反复检索的内容。
3. 运动中偏“知识型”的内容（例如训练理论、动作笔记）也可进入 docs。

不建议内容：
1. 一次性心情记录、旅行日记、阶段感悟（这些放 blogs）。

### 2.2 blogs（时间流）

适合内容：
1. 生活经历、阶段反思、运动打卡、比赛记录、旅行记录。
2. 与时间强相关、强调叙事和感受的内容。

## 3. 分类与标签规范

## 3.1 blogs 的分类（固定枚举）

`blogs` 只允许以下 `categories`：
1. `life`：生活经历、旅行、日常记录。
2. `thoughts`：思考、复盘、方法论、阶段感悟。
3. `sports`：跑步/力量/球类训练与比赛记录。
4. `meta`：博客站点本身的里程碑、改版、运维变更。

## 3.2 blogs 的标签（自由词）

`tags` 用于细粒度描述，示例：
1. `旅游` `面试` `散心`
2. `跑步` `羽毛球` `力量训练`
3. `复盘` `效率` `习惯`

规则：
1. 每篇建议 1-4 个标签。
2. 优先使用已有标签写法，避免同义词分裂（例如“跑步”与“慢跑”混用）。

## 3.3 docs 的元信息

1. `docs` 不强制使用 `categories`（避免和博客分类体系混在一起）。
2. 可按需加 `tags`，用于补充检索。
3. `docs` 的主要分组依赖目录结构 + `series` 配置。

## 4. 目录结构规范

目标结构（逐步迁移，不要求一次改完）：

```text
blogs/
  life/2026/
  thoughts/2026/
  sports/2026/
  meta/2026/

docs/
  tech/
    overview.md
    frontend/
    backend/
    devops/
  sports/
    theory/
    training/
```

落地规则：
1. `blogs/<category>/<year>/<mmddNN>.md`（按时间归档，便于回溯）。
2. `docs/<domain>/<group>/<topic>.md`（按主题归档，便于检索）。
3. 文件名可先保持中文；如后续迁移英文命名，统一一次性处理。

## 5. Frontmatter 模板

### 5.1 blogs 模板

```yaml
---
title: 文章标题
date: 2026/05/07
categories:
 - life # life | thoughts | sports | meta
tags:
 - 标签1
 - 标签2
---
```

### 5.2 docs 模板

```yaml
---
title: 文档标题
date: 2026/05/07
tags:
 - 可选标签
---
```

## 6. 展示层约束

1. `Docs` 导航只指向文档入口页（如 `overview`）。
2. `Blogs` 展示按时间流 + 分类页 + 标签页。
3. 不在 `blogs` 中使用 `undergraduate`、`w3y` 这类身份/阶段型分类名。

## 7. 存量文章迁移策略

采用“增量迁移”，不阻塞写作：
1. 新文章立即使用新规则。
2. 旧文章分批改：
   1. `undergraduate` / `w3y` / `other` 逐步映射到 `life` / `thoughts` / `sports` / `meta`。
   2. 修正标签同义词。
3. 每次迁移只处理一小批，避免大规模改动影响发布。

## 8. 发布前检查清单

1. 是否放对分轨：`docs` 还是 `blogs`。
2. `blogs` 是否使用了固定分类枚举之一。
3. `tags` 是否复用已有写法，是否过多。
4. `title`、`date` 是否完整。
5. 导航或 `series` 是否需要同步更新。

## 9. 模板位置（内部）

写作模板存放在：
`/.vuepress/private/templates/`

包含：
1. `blog-life.md`
2. `blog-thoughts.md`
3. `blog-sports.md`
4. `blog-meta.md`
5. `doc-tech.md`
6. `doc-sports.md`

使用方式：
1. 复制对应模板到目标目录。
2. 修改 `title`、`date`、`tags`。
3. 博客文章保留模板中的固定 `categories` 值。

脚手架命令（推荐）：
1. `npm run scaffold -- blog <life|thoughts|sports|meta> "<title>"`
2. `npm run scaffold -- doc <tech|sports> <group> "<title>"`

---

维护说明：
1. 本文档为内部规范，按实际写作习惯迭代。
2. 当分类规则变化时，优先更新本文档，再执行批量迁移。
