# 26.9.10 迁移验收记录

- 分支：`migration/26.9.10`
- 验收日期：2026-09-21
- 目标：以 Astro 7 / Momo 26.9.10 为底座恢复个人内容，同时保留 Expressive Code、`GLACIER` Header 和 `/favicon/icon.png` 兼容接口。

## 环境与安装

- Node.js：`v24.15.0`
- pnpm：`10.33.2`
- `pnpm install --frozen-lockfile`：通过，lockfile 与依赖一致。
- CMS：`pnpm --dir cms build` 通过（Vite 8.2.1）。CMS 仅作为本地工具构建，不部署为公开无认证服务。

## 自动检查与构建矩阵

| 检查 | 结果 |
| --- | --- |
| `pnpm check` | 通过：0 errors、0 warnings、11 hints（既有未使用变量/import 提示） |
| 默认 `pnpm build` | 通过：31 page(s)，Pagefind 索引 2 种语言、24 个页面 |
| `ASTRO_SITE=https://migration.example pnpm build` | 通过；输出包含环境变量站点地址，不包含默认站点地址 |
| `ASTRO_BASE=/subpath/ pnpm build` | 通过；输出内部资源使用 `/subpath/`，favicon 仍使用根路径 `/favicon/icon.png` |
| 最终默认 `pnpm build` | 通过：31 page(s)，Pagefind 成功 |

构建过程中曾发现 Astro 7 会把 `getStaticPaths` 抽离为独立模块；已在两个动态路由生成器内部局部声明 `astroI18n`，并由提交 `766a48e` 修复。之后 `pnpm check` 与所有生产构建均通过。

## 公开路由

迁移前基线 `doc/migration-baseline-routes.txt` 包含 30 个公开 `index.html` 路由。最终默认构建生成 30 个对应 index 路由：

- 缺失：0
- 额外：0
- 另有 Astro 生成的 404 页面和 RSS 页面，因此构建总页面数为 31。

基线包括根页、分页、关于、归档、友链，以及中英文文章 URL；全部保持不变。

## Expressive Code

- 依赖固定在 Astro 7 兼容的 `0.44.2`：`astro-expressive-code`、`@expressive-code/core`、行号插件、折叠插件。
- `expressiveCode()` 位于 integrations 首位；原生 Shiki 高亮配置未恢复，避免同一 fenced block 重复渲染。
- `ec.config.mjs` 保留 `github-light` / `aurora-x` 双主题、行号、terminal/editor frame、文件标题、行高亮、`ins` / `del`、collapse、wrap、`preserveIndent` 与复制按钮配置。
- 真实文章 fixture 覆盖：
  - `src/content/blog/intro/deploy/zh-cn.md`：terminal、标题、行高亮、`ins` / `del`；
  - `src/content/blog/intro/usage/zh-cn.md`：terminal、标题、行高亮、`ins` / `del`、wrap、collapse；
  - `src/content/blog/test/alert/zh-cn.md`：wrap、`preserveIndent`、`preserveIndent=false`、collapse。
- `dist/blog/intro/deploy/index.html`、`usage/index.html` 和 `markdown/index.html` 均生成 `expressive-code` / `data-code` / `ec-line` DOM；没有退回普通 Shiki，也没有发现双套代码块结构。

## GLACIER Header 与字体

- `siteConfig.headerTitle` 固定为 `"GLACIER"`。
- 桌面 Logo 与移动抽屉 Logo 均读取 `siteConfig.headerTitle`。
- 新版移动分类折叠 DOM、`aria-expanded`、展开/收起脚本和键盘可操作的 button 保留。
- Logo 使用 `"Futura LT Pro"` 及 fallback；导航和移动抽屉使用 `"Noto Sans SC"`。
- `public/fonts/FuturaLTPro-Book.otf` 保留，最终页面 head 含该字体 preload。
- `theme.AOS` 为 `false`；最终首页输出未包含 AOS 初始化脚本或样式。

## favicon 兼容

- 源文件：`public/favicon/icon.png`
- 最终产物：`dist/favicon/icon.png`
- 两者 SHA-256 均为：`92735A9A98210FFD3A7CD4718983395DA34064E90C4859EFF5EB3A3F9E016564`
- head 标签为：`<link rel="icon" href="/favicon/icon.png" type="image/png">`
- 本地生产预览请求 `http://127.0.0.1:4321/favicon/icon.png`：HTTP `200`，`Content-Type: image/png`。

## 关键配置

- 默认站点地址：`https://www.glac1er.top`。
- `ASTRO_SITE` 优先于配置默认值。
- `ASTRO_BASE` 默认 `/`，并保留子路径构建支持。
- Typst SSR external 配置保留为 `@myriaddreamin/typst-ts-node-compiler`。
- i18n 使用新版 `i18nConfig` 和类型定义，没有用旧版 `src/i18n` 整体覆盖新版结构。

## 阶段提交

1. `7bbff19` — `chore: migrate theme base to 26.9.10 and Astro 7`
2. `6dbe4a0` — `feat: restore personal content and site configuration`
3. `f5f6406` — `feat: preserve Expressive Code, GLACIER header, and favicon`
4. `1afe3f0` — `chore: verify deployment and Astro 7 compatibility`
5. `766a48e` — `fix: scope i18n config inside static path generators`

验收完成后仍停留在 `migration/26.9.10`，未修改或合并 `main`。
