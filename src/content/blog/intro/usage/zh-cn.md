---
title: Momo 网站使用与代码块指南
pubDate: 2026-07-19
description: 从站点配置、文章发布到 Expressive Code 代码块效果的完整使用说明。
category: 指南
image: ""
draft: false
slugId: momo/intro/usage
---

这篇指南面向站点维护者，说明如何修改网站信息、发布文章，以及如何使用本项目已经配置好的 Expressive Code 代码块环境。

## 先改好网站名称和地址

网站的公开地址在根目录的 `astro.config.mjs` 中设置。将 `site` 改为部署后的完整 HTTPS 地址，并保留末尾路径规则与实际部署环境一致：

```js title="astro.config.mjs" {3}
export default defineConfig({
  // 例如：https://blog.example.com
  site: 'https://blog.example.com',
})
```

站点名称、副标题、图标和个人资料集中在 `src/config.ts`。通常只需要修改下面这些字段：

```ts title="src/config.ts" {2-5} ins={7-10}
export const siteConfig = {
  title: '我的技术博客',
  subTitle: 'Notes and experiments',
  favicon: '/favicon/favicon.ico',
  pageSize: 6,
}

export const profileConfig = {
  name: 'Your name',
  description: '一句简短的个人介绍',
  indexPage: 'https://example.com',
}
```

如果启用了评论，`siteConfig.comments.backendUrl` 也需要改为自己的评论服务地址。部署前运行 `pnpm build`，确认 RSS、站点地图和文章链接都使用了新域名。

## 新建和发布文章

文章存放在 `src/content/blog/`。为一篇中文文章建立目录和 `zh-cn.md` 文件；若需要英文版，在同一目录增加 `en.md`。文件开头必须包含 frontmatter：

````md
---
title: 文章标题
pubDate: 2026-07-19
description: 一句话说明文章内容
category: 技术
image: ""
draft: false
slugId: posts/my-first-post
---
````

其中 `slugId` 必须唯一；将 `draft` 设为 `true` 可以在编写期间隐藏文章。文件路径决定页面路径，例如 `src/content/blog/posts/my-first-post/zh-cn.md` 会生成 `/blog/posts/my-first-post/`。

## 代码块的基础写法

使用三枚反引号开始和结束代码块，并在开头写语言名称。所有代码块都会自动显示行号、语法高亮与复制按钮：

````md
```ts
const greeting = 'Hello, Momo!'
console.log(greeting)
```
````

需要在代码框顶部显示文件名时，增加 `title`：

````md
```ts title="src/utils/greet.ts"
export const greet = (name: string) => `Hello, ${name}!`
```
````

终端命令可用 `frame="terminal"`，这样会以终端窗口而不是编辑器标签页呈现：

````md
```bash frame="terminal" title="构建网站"
pnpm install
pnpm build
```
````

## 展示代码修改、增补和删除

在围栏的元数据中使用行范围，可以清晰表达一次文件修改：

- `{3}`：高亮第 3 行；
- `ins={4-5}`：将第 4 至 5 行标记为新增；
- `del={6}`：将第 6 行标记为删除。

```ts title="src/config.ts" {3} ins={4-5} del={6}
export const siteConfig = {
  title: '我的技术博客',
  subTitle: 'Notes and experiments',
  pageSize: 8,
  toc: { enable: true, depth: 3 },
  legacyTheme: true,
}
```

也可以使用标准 diff 语法，适合直接展示补丁：

```diff title="src/config.ts"
 export const siteConfig = {
-  title: 'Momo',
+  title: '我的技术博客',
 }
```

需要引用大文件中的某一段时，可以使用 `startLineNumber` 调整显示的起始行号；这只影响视觉编号，不会改变高亮行范围的原始计数。

````md
```ts startLineNumber=42
export function renderPost() {
  // 此处在页面上会从第 42 行开始编号
}
```
````

## 折叠冗长的代码

使用 `collapse={起始行-结束行}` 将不重要的区段默认折叠。多个范围以逗号分隔；读者点击提示行即可展开，并可再次收起。

```ts title="src/services/article.ts" collapse={1-4, 12-14}
import { db } from './database'
import { logger } from './logger'

const TABLE_NAME = 'articles'

export async function getArticle(slug: string) {
  const article = await db.findOne(TABLE_NAME, { slug })
  if (!article) {
    throw new Error(`Article not found: ${slug}`)
  }

  logger.debug('Article loaded', { slug })
  return article
}
```

折叠功能应只隐藏读者暂时不需要的样板代码，关键逻辑保持展开；这样文章既紧凑，也不会损失可读性。

## 其他常用效果

长行可按需开启换行：

````md
```ts wrap
const url = 'https://example.com/a-very-long-path-that-should-wrap-on-small-screens'
```
````

对于单个代码块，可用 `showLineNumbers=false` 隐藏行号；本网站的默认值是始终显示，因此仅在展示纯文本或终端输出时建议关闭。更多渲染选项统一维护在根目录的 `ec.config.mjs`，不要在页面组件中重复添加复制按钮或修改代码块 DOM。

