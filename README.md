# 📝 专业博客系统 - Docusaurus v2

一个基于 Docusaurus v2 构建的专业技术博客系统，支持 TypeScript、国际化、标签系统、归档等完整功能。

## ✨ 功能特性

### 核心功能

- ✅ **博客系统**
  - 博客列表页和详情页
  - Markdown / MDX 支持
  - 代码高亮（支持多种语言）
  - 文章摘要（excerpt）
  - 阅读时间估算

- 🏷️ **标签系统**
  - 标签配置（tags.yml）
  - 标签聚合页
  - 标签云（按文章数量加权展示）
  - 标签统计和可视化

- 📚 **归档功能**
  - 按年份归档
  - 按月份归档
  - 自动生成历史博客导航

- 🌍 **国际化（i18n）**
  - 支持中文（zh-CN）和英文（en）
  - 博客内容多语言支持
  - UI 文案国际化
  - 清晰的多语言目录结构

- 🔍 **SEO 优化**
  - Meta 信息配置
  - 自动生成 sitemap.xml
  - robots.txt 配置
  - 语义化 HTML
  - RSS/Atom 订阅支持

- 👥 **作者系统**
  - 多作者支持
  - 作者信息配置（authors.yml）
  - 作者头像和社交链接

### 进阶功能

- 🎨 **自定义主题**
  - 自定义 CSS 变量
  - 深色/浅色模式切换
  - 响应式设计

- 📊 **数据可视化**
  - 标签统计图表
  - 文章数量趋势

## 🚀 快速开始

### 安装依赖

```bash
npm install
# 或
pnpm install
```

### 本地开发

```bash
npm start
```

这将启动开发服务器，默认访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物将生成在 `build` 目录。

### 本地预览生产版本

```bash
npm run serve
```

### 清理缓存

```bash
npm run clear
```

## 📁 项目结构

```
blog-v1/
├── blog/                          # 博客文章目录
│   ├── 2024/                      # 按年份组织
│   ├── 2025/
│   │   ├── 01-15-welcome.md      # 博客文章
│   │   └── 01-20-typescript-best-practices.md
│   ├── authors.yml                # 作者配置
│   └── tags.yml                   # 标签配置
├── i18n/                          # 国际化目录
│   └── en/                        # 英文翻译
│       └── docusaurus-plugin-content-blog/
│           └── 2025/
│               └── 01-15-welcome.md
├── src/
│   ├── css/
│   │   └── custom.css            # 自定义样式
│   └── pages/
│       ├── archive.tsx           # 归档页面
│       └── tags-cloud.tsx        # 标签云页面
├── static/
│   ├── img/                      # 静态图片资源
│   └── robots.txt                # SEO 配置
├── docusaurus.config.ts          # Docusaurus 配置
├── tsconfig.json                 # TypeScript 配置
└── package.json                  # 项目依赖
```

## ✍️ 写作指南

### 创建新文章

在 `blog/YYYY/` 目录下创建新的 Markdown 文件：

```markdown
---
slug: my-article-slug
title: 文章标题
authors: [admin]
tags: [javascript, react, tutorial]
date: 2025-01-20T10:00
---

这是文章摘要，会显示在列表页...

<!--truncate-->

这是文章正文内容...
```

### Frontmatter 字段说明

- `slug`: 文章 URL 路径（可选，默认使用文件名）
- `title`: 文章标题（必填）
- `authors`: 作者列表，引用 `authors.yml` 中的 key
- `tags`: 标签列表，引用 `tags.yml` 中的 key
- `date`: 发布日期（必填）
- `description`: 文章描述（可选，用于 SEO）
- `keywords`: 关键词（可选，用于 SEO）
- `image`: 社交分享图片（可选）

### 使用代码高亮

````markdown
```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```
````

支持的语言：JavaScript, TypeScript, Python, Java, Bash, JSON, YAML 等。

### 添加图片

```markdown
![图片描述](/img/my-image.png)
```

图片文件放在 `static/img/` 目录下。

## 🌍 国际化配置

### 添加新语言

1. 在 `docusaurus.config.ts` 中添加语言配置：

```typescript
i18n: {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en', 'ja'], // 添加日语
}
```

2. 创建对应的翻译目录：

```bash
mkdir -p i18n/ja/docusaurus-plugin-content-blog
```

3. 翻译博客文章到新语言。

### 翻译 UI 文案

运行以下命令生成翻译文件：

```bash
npm run write-translations -- --locale ja
```

然后编辑生成的 JSON 文件进行翻译。

## 🎨 自定义主题

### 修改颜色

编辑 `src/css/custom.css`：

```css
:root {
  --ifm-color-primary: #2e8555;
  /* 修改其他颜色变量 */
}
```

### Swizzle 组件

如需深度自定义组件：

```bash
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --eject
```

⚠️ 谨慎使用 swizzle，可能影响后续升级。

## 📊 SEO 最佳实践

### 配置 Meta 信息

在 `docusaurus.config.ts` 中配置全局 meta：

```typescript
themeConfig: {
  metadata: [
    {name: 'keywords', content: '技术博客, Docusaurus'},
    {name: 'author', content: 'Your Name'},
  ],
}
```

### 文章级别 SEO

在文章 frontmatter 中添加：

```yaml
---
title: 文章标题
description: 文章描述，用于搜索引擎
keywords: [关键词1, 关键词2]
image: /img/article-cover.jpg
---
```

### 生成 Sitemap

构建时自动生成，配置在 `docusaurus.config.ts`：

```typescript
sitemap: {
  changefreq: 'weekly',
  priority: 0.5,
}
```

## 🔌 扩展功能

### 添加评论系统

推荐使用 Giscus（基于 GitHub Discussions）：

1. 安装插件：

```bash
npm install @giscus/react
```

2. Swizzle BlogPostItem 组件并添加 Giscus。

### 添加搜索功能

使用 Algolia DocSearch：

1. 申请 DocSearch
2. 在 `docusaurus.config.ts` 中配置：

```typescript
themeConfig: {
  algolia: {
    appId: 'YOUR_APP_ID',
    apiKey: 'YOUR_API_KEY',
    indexName: 'YOUR_INDEX_NAME',
  },
}
```

### 添加 Google Analytics

在 `docusaurus.config.ts` 中配置：

```typescript
gtag: {
  trackingID: 'G-XXXXXXXXXX',
  anonymizeIP: true,
}
```

## 🚢 部署

### GitHub Pages

1. 修改 `docusaurus.config.ts`：

```typescript
url: 'https://username.github.io',
baseUrl: '/blog-v1/',
organizationName: 'username',
projectName: 'blog-v1',
```

2. 部署：

```bash
npm run deploy
```

### Vercel

1. 连接 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置输出目录：`build`

### Netlify

1. 连接 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置发布目录：`build`

## 📝 开发建议

### 目录组织

- 按年份组织博客文章：`blog/2025/`
- 使用有意义的文件名：`01-20-article-title.md`
- 图片资源统一放在 `static/img/`

### 性能优化

- 压缩图片（推荐使用 WebP 格式）
- 使用 CDN 加速静态资源
- 启用 Gzip 压缩

### 内容策略

- 定期发布高质量内容
- 合理使用标签（3-5 个为宜）
- 添加有价值的内部链接
- 保持文章结构清晰

## 🛠️ 技术栈

- **框架**: Docusaurus v2
- **语言**: TypeScript
- **样式**: CSS Variables
- **包管理**: npm/pnpm
- **构建**: Webpack (内置)

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📮 联系方式

- GitHub: https://github.com/your-org/blog-v1
- Email: admin@example.com

---

**Happy Blogging! 🎉**
