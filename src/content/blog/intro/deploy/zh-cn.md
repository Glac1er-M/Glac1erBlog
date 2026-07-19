---
title: 博客部署指南
pubDate: 2026-07-19
description: 从克隆 Momo、完成本地开发，到通过 GitHub Pages 自动发布博客的完整流程。
category: 指南
image: ""
draft: false
slugId: momo/intro/deploy
---

本指南假设你准备把 Momo 部署到自己的 GitHub 仓库。完成后，每次向 `main` 分支推送内容，GitHub Actions 都会自动构建并发布网站。

## 准备环境

需要安装以下工具：

- [Git](https://git-scm.com/)；
- Node.js 20（项目根目录的 `.node-version` 也声明了该版本）；
- pnpm 10。推荐通过 Node.js 自带的 Corepack 安装和管理 pnpm。

```bash frame="terminal" title="启用 pnpm"
corepack enable
corepack prepare pnpm@10.33.2 --activate

node --version
pnpm --version
```

Node.js 版本应为 20.x，pnpm 应为 10.x。项目的 `package.json` 已声明兼容范围，版本不满足时包管理器会给出提示。

## 克隆并启动本地站点

先在 GitHub 上点击 **Use this template** 创建自己的仓库，或 fork 本仓库。然后将仓库克隆到本机：

```bash frame="terminal" title="克隆并启动"
git clone https://github.com/<你的用户名>/<你的仓库名>.git
cd <你的仓库名>
pnpm install
pnpm dev
```

开发服务器默认显示本地地址（通常是 `http://localhost:4321`）。浏览器打开它后，修改任意 Markdown 或组件文件都会自动刷新。

:::tip
首次安装会下载依赖及平台对应的 `sharp` 二进制文件。若网络受限，请配置好 npm 镜像或代理后重新执行 `pnpm install`，不要提交 `node_modules`。
:::

## 改成自己的博客

在发布前至少修改以下两处。

### 网站名称和个人信息

编辑 `src/config.ts` 中的 `siteConfig` 和 `profileConfig`：

```ts title="src/config.ts" {2-4} ins={8-10}
export const siteConfig = {
  title: '我的技术博客',
  subTitle: 'Notes and experiments',
  favicon: '/favicon/favicon.ico',
}

export const profileConfig = {
  name: '你的名字',
  description: '一句简短的个人介绍',
  indexPage: 'https://example.com',
}
```

头像、站点图标、评论服务、友情链接和主题开关也在同一个文件中维护。评论服务尚未部署时，可以将 `siteConfig.comments.enable` 改为 `false`。

### 文章内容

文章放在 `src/content/blog/`。例如新建 `src/content/blog/posts/hello/zh-cn.md`：

````md
---
title: 我的第一篇文章
pubDate: 2026-07-19
description: 博客已经上线
category: 随笔
image: ""
draft: false
slugId: posts/hello
---

这里开始写 Markdown 正文。
````

将 `draft` 改为 `true` 可以保留草稿而不在生产环境发布。完整的 Markdown 和代码块用法请参阅「Momo 网站使用与代码块指南」。

## 在本地验证发布产物

提交前请运行生产构建，而不仅是开发服务器：

```bash frame="terminal" title="生产构建"
pnpm build
pnpm preview
```

`pnpm build` 会输出到 `dist/`，并为站内搜索生成 Pagefind 索引；`pnpm preview` 用本地服务器预览这份产物。构建成功后再提交变更：

```bash frame="terminal" title="提交变更"
git add .
git commit -m "chore: personalize blog"
git push origin main
```

## 启用 GitHub Pages 自动部署

仓库已包含 `.github/workflows/deploy.yml`，会在每次推送到 `main` 时执行 `pnpm install --frozen-lockfile`、构建网站并发布到 GitHub Pages。

1. 打开 GitHub 仓库的 **Settings → Pages**；
2. 在 **Build and deployment** 中选择 **GitHub Actions**；
3. 推送到 `main` 分支；
4. 打开 **Actions** 标签页，等待 `Deploy to GitHub Pages` 工作流完成；
5. 在 **Settings → Pages** 中取得最终访问地址。

对于仓库 `https://github.com/alice/my-blog`，工作流默认生成的地址是 `https://alice.github.io/my-blog/`。它会自动把这个地址和 `/my-blog` 基础路径传给 Astro，因此 CSS、图片、脚本和站内链接都能在项目页地址下正常工作。

:::important
工作流只监听 `main` 分支。若你的默认分支叫 `master`，请将 `.github/workflows/deploy.yml` 中的 `main` 改成 `master`，或者在 GitHub 仓库设置中将默认分支改为 `main`。
:::

## 使用自定义域名

如果绑定了自定义域名，在 GitHub 的 **Settings → Pages → Custom domain** 完成域名配置与 DNS 验证。随后进入 **Settings → Secrets and variables → Actions → Variables**，添加：

| 变量 | 值 |
| --- | --- |
| `ASTRO_SITE` | `https://blog.example.com/` |
| `ASTRO_BASE` | `/` |

`ASTRO_SITE` 用于 RSS、站点链接等绝对 URL；`ASTRO_BASE` 决定静态资源与页面的部署子路径。普通 GitHub 项目页不需要设置它们，工作流会自动推导正确值。

## 常见问题

### `pnpm install` 失败

确认 Node.js 为 20.x、pnpm 为 10.x，然后删除仅本地产生的 `node_modules` 后重新执行 `pnpm install`。不要删除或手动编辑 `pnpm-lock.yaml`，它保证每位协作者安装到相同依赖版本。

### 页面发布后资源 404

先确认 Actions 工作流是否成功，再确认仓库名与 `ASTRO_BASE` 一致。项目页应使用 `/仓库名`，自定义域名应使用 `/`。

### 网站内容没有更新

检查是否推送到了 `main`，并在 Actions 页面查看最新工作流日志。文章的 `draft: true` 也会使它仅在本地开发环境出现。
