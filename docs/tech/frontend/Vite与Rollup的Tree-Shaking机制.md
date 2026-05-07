---
title: Vite 与 Rollup 的 Tree-Shaking 机制
date: 2026/05/07
aiGenerated: true
tags:
 - Vite
 - Rollup
 - Tree Shaking
 - 前端工程化
 - AI生成
---

## 一句话结论

Vite 在生产构建时会调用 Rollup，基于 ESM 的静态可分析性做 Tree-shaking，删除未被引用且可安全移除的代码，从而减小产物体积。

## 为什么 ESM 能做 Tree-shaking

Tree-shaking 依赖“编译阶段就能看清依赖关系”这件事，而 ESM 的 `import` / `export` 正好是静态结构。

这意味着构建工具在执行代码之前，就能分析出：

- 模块导出了什么
- 实际被谁引用
- 哪些导出在整个依赖图里从未被使用

## Rollup 在构建时做了什么

在 `vite build` 阶段，可以把流程理解成四步：

1. 从入口文件递归解析 `import`，构建模块依赖图。
2. 把每个模块解析成 AST（抽象语法树），记录导入导出关系。
3. 从入口出发做“标记-清除”：
   - 被引用或有副作用的代码标记为存活。
   - 未标记的代码视为死代码。
4. 仅输出存活节点，未使用节点不会进入最终 bundle。

这也是为什么 Tree-shaking 不是“删整个文件”，而是可以细到“删某个未用函数”。

## 一个最小示例

```js
// math.js
export const add = (a, b) => a + b;
export const unused = () => console.log('I am useless');

// main.js
import { add } from './math.js';
console.log(add(1, 2));
```

在这个例子里，`unused` 虽然被导出，但没有被任何路径引用，最终会被移除。

## 常见影响因素

### 1. 副作用（Side Effects）

如果工具无法确认一段代码是否影响外部状态，会保守保留，Tree-shaking 效果就会变差。

### 2. `sideEffects` 声明

在包的 `package.json` 中声明 `"sideEffects": false`，可以帮助构建工具更积极地裁剪无副作用模块。

### 3. `/* @__PURE__ */` 注释

对纯函数调用增加纯注释，可提示压缩/摇树工具：当返回值未使用时，相关调用可安全删除。

## 和 Code Splitting 的关系

Tree-shaking 是“删不用的代码”，Code Splitting 是“把代码拆成多个 chunk 按需加载”。

两者配合时效果更好：

- 先通过 Tree-shaking 精简每个模块内容
- 再通过分包减少首屏必须加载的代码体积

## 实战建议

1. 优先使用 ESM 写法，避免影响静态分析的模式。
2. 业务代码尽量保持模块职责单一，减少副作用代码混在工具函数里。
3. 对库包明确维护 `sideEffects` 字段。
4. 构建后关注产物分析，确认“以为被删的代码”是否真的被删。
