# 🚀 Docusaurus v2 博客系统实战搭建指南

## 📚 目录

1. [项目概述](#项目概述)
2. [技术栈与基础要求](#技术栈与基础要求)
3. [项目初始化](#项目初始化)
4. [核心配置详解](#核心配置详解)
5. [博客核心功能实现](#博客核心功能实现)
6. [国际化配置](#国际化配置)
7. [SEO 优化](#seo-优化)
8. [进阶功能](#进阶功能)
9. [部署上线](#部署上线)
10. [最佳实践](#最佳实践)

---

## 项目概述

本项目是一个基于 **Docusaurus v2** 构建的专业博客系统，具备完整的博客功能、标签系统、归档、国际化、SEO 优化等特性。

### 核心特性

✅ 博客系统（列表页、详情页、摘要、代码高亮）  
✅ 标签系统（标签配置、聚合页、标签云）  
✅ 归档功能（按年月归档）  
✅ 国际化（中英文双语）  
✅ SEO 优化（Meta、Sitemap、语义化 HTML）  
✅ 作者系统（多作者支持）  
✅ RSS/Atom 订阅  
✅ 响应式设计  
✅ 深色模式  

---

## 技术栈与基础要求

### 技术栈

- **框架**: Docusaurus v2 (v3.5.2)
- **语言**: TypeScript
- **包管理**: npm / pnpm
- **内容格式**: Markdown / MDX
- **样式**: CSS Variables
- **构建工具**: Webpack (内置)

### 环境要求

- Node.js >= 18.0
- npm >= 8.0 或 pnpm >= 7.0

---

## 项目初始化

### 方式一：使用本项目模板

```bash
# 克隆项目
git clone <your-repo-url> blog-v1
cd blog-v1

# 安装依赖
npm install

# 启动开发服务器
npm start
```

### 方式二：从零开始创建

```bash
# 创建项目目录
mkdir blog-v1
cd blog-v1

# 初始化 package.json
npm init -y

# 安装 Docusaurus 依赖
npm install @docusaurus/core@^3.5.2 @docusaurus/preset-classic@^3.5.2 @mdx-js/react@^3.0.0 clsx@^2.0.0 prism-react-renderer@^2.3.0 react@^18.2.0 react-dom@^18.2.0

# 安装开发依赖
npm install -D @docusaurus/module-type-aliases@^3.5.2 @docusaurus/tsconfig@^3.5.2 @docusaurus/types@^3.5.2 typescript@~5.2.2
```

### 项目目录结构

创建完成后的目录结构：

```
blog-v1/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 自动部署
├── blog/                        # 博客文章目录
│   ├── 2025/                    # 按年份组织
│   │   ├── 01-15-welcome.md
│   │   ├── 01-20-typescript-best-practices.md
│   │   └── 02-01-react-hooks-guide.md
│   ├── authors.yml              # 作者配置
│   └── tags.yml                 # 标签配置
├── i18n/                        # 国际化目录
│   └── en/                      # 英文翻译
│       └── docusaurus-plugin-content-blog/
│           └── 2025/
│               └── 01-15-welcome.md
├── src/
│   ├── css/
│   │   └── custom.css          # 自定义样式
│   └── pages/
│       ├── archive.tsx         # 归档页面
│       └── tags-cloud.tsx      # 标签云页面
├── static/
│   ├── img/                    # 静态图片资源
│   │   ├── logo.svg
│   │   └── README.md
│   └── robots.txt              # SEO 配置
├── .gitignore
├── docusaurus.config.ts        # Docusaurus 核心配置
├── package.json
├── README.md
├── tsconfig.json               # TypeScript 配置
└── vercel.json                 # Vercel 部署配置
```

---

## 核心配置详解

### 1. docusaurus.config.ts

这是 Docusaurus 的核心配置文件，所有功能都在这里配置。

#### 基本信息配置

```typescript
const config: Config = {
  title: '我的技术博客',
  tagline: '分享技术，记录成长',
  favicon: 'img/favicon.ico',
  url: 'https://yourdomain.com',
  baseUrl: '/',
  
  // GitHub Pages 部署配置
  organizationName: 'your-org',
  projectName: 'blog-v1',
  
  // 错误处理
  onBrokenLinks: 'throw',        // 严格模式，有断链就报错
  onBrokenMarkdownLinks: 'warn',
};
```

#### 国际化配置

```typescript
i18n: {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en'],
  localeConfigs: {
    'zh-CN': {
      label: '简体中文',
      direction: 'ltr',
      htmlLang: 'zh-CN',
      calendar: 'gregory',
      path: 'zh-CN',
    },
    en: {
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en-US',
      calendar: 'gregory',
      path: 'en',
    },
  },
},
```

**说明：**
- `defaultLocale`: 默认语言
- `locales`: 支持的语言列表
- `localeConfigs`: 每种语言的详细配置

#### 博客插件配置

```typescript
presets: [
  [
    'classic',
    {
      docs: false,  // 禁用文档功能（纯博客系统）
      
      blog: {
        // 路由配置
        routeBasePath: '/',  // 博客作为首页
        path: './blog',      // 博客文件目录
        
        // 分页配置
        postsPerPage: 10,
        
        // 侧边栏配置
        blogSidebarTitle: '最近文章',
        blogSidebarCount: 10,
        
        // 功能开关
        showReadingTime: true,  // 显示阅读时间
        
        // 摘要分隔符
        truncateMarker: /<!--\s*truncate\s*-->/,
        
        // RSS/Atom 订阅
        feedOptions: {
          type: ['rss', 'atom'],
          title: '我的技术博客',
          description: '分享技术，记录成长',
          copyright: `Copyright © ${new Date().getFullYear()}`,
          language: 'zh-CN',
        },
        
        // 编辑链接
        editUrl: 'https://github.com/your-org/blog-v1/tree/main/',
        
        // 作者和标签配置
        authorsMapPath: 'authors.yml',
        tags: 'tags.yml',
      },
      
      // SEO 配置
      sitemap: {
        changefreq: 'weekly',
        priority: 0.5,
        ignorePatterns: ['/tags/**'],
        filename: 'sitemap.xml',
      },
    },
  ],
],
```

**关键配置说明：**

1. **routeBasePath: '/'**  
   将博客设置为网站首页，访问根路径直接显示博客列表

2. **truncateMarker**  
   使用 `<!--truncate-->` 标记文章摘要的结束位置

3. **feedOptions**  
   自动生成 RSS 和 Atom 订阅源，位于 `/rss.xml` 和 `/atom.xml`

4. **authorsMapPath 和 tags**  
   指定作者和标签的配置文件路径

#### 主题配置

```typescript
themeConfig: {
  // SEO 元数据
  metadata: [
    {name: 'keywords', content: 'blog, 技术博客, Docusaurus'},
    {name: 'author', content: 'Your Name'},
  ],
  
  // 社交分享图片
  image: 'img/social-card.jpg',
  
  // 导航栏
  navbar: {
    title: '我的博客',
    logo: {
      alt: 'Logo',
      src: 'img/logo.svg',
    },
    items: [
      {to: '/', label: '博客', position: 'left'},
      {to: '/tags', label: '标签', position: 'left'},
      {to: '/archive', label: '归档', position: 'left'},
      {type: 'localeDropdown', position: 'right'},
      {
        href: 'https://github.com/your-org/blog-v1',
        label: 'GitHub',
        position: 'right',
      },
    ],
  },
  
  // 页脚
  footer: {
    style: 'dark',
    links: [
      {
        title: '博客',
        items: [
          {label: '最新文章', to: '/'},
          {label: '标签', to: '/tags'},
          {label: '归档', to: '/archive'},
        ],
      },
      {
        title: '社交',
        items: [
          {label: 'GitHub', href: 'https://github.com/your-org'},
          {label: 'Twitter', href: 'https://twitter.com/yourhandle'},
        ],
      },
      {
        title: '更多',
        items: [
          {label: 'RSS', to: '/rss.xml'},
          {label: 'Atom', to: '/atom.xml'},
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} My Blog.`,
  },
  
  // 代码高亮
  prism: {
    theme: prismThemes.github,
    darkTheme: prismThemes.dracula,
    additionalLanguages: ['java', 'python', 'bash', 'json', 'yaml'],
  },
  
  // 颜色模式
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,  // 尊重系统偏好
  },
},
```

### 2. 作者配置 (blog/authors.yml)

```yaml
admin:
  name: 管理员
  title: 全栈工程师
  url: https://github.com/yourusername
  image_url: https://github.com/yourusername.png
  email: admin@example.com
  page: true  # 是否生成作者页面
  socials:
    github: https://github.com/yourusername
    twitter: https://twitter.com/yourhandle

guest:
  name: 访客作者
  title: 技术爱好者
  url: https://example.com
  image_url: /img/default-avatar.png
  page: false
```

**使用方式：**

在博客文章的 frontmatter 中引用：

```yaml
---
authors: [admin]  # 单个作者
# 或
authors: [admin, guest]  # 多个作者
---
```

### 3. 标签配置 (blog/tags.yml)

```yaml
frontend:
  label: 前端开发
  permalink: /frontend
  description: 前端开发相关技术文章

typescript:
  label: TypeScript
  permalink: /typescript
  description: TypeScript 编程语言

react:
  label: React
  permalink: /react
  description: React 框架相关
```

**使用方式：**

```yaml
---
tags: [frontend, typescript, react]
---
```

---

## 博客核心功能实现

### 1. 博客文章编写

#### 文章结构

```markdown
---
slug: article-url-slug
title: 文章标题
authors: [admin]
tags: [javascript, react]
date: 2025-02-04T10:00
description: 文章描述（用于 SEO）
keywords: [关键词1, 关键词2]
image: /img/article-cover.jpg
---

这是文章摘要部分，会显示在博客列表页...

<!--truncate-->

这是文章正文内容...

## 一级标题

### 二级标题

正文内容...
```

#### Frontmatter 字段说明

| 字段 | 必填 | 说明 |
|------|------|------|
| `slug` | 否 | URL 路径，默认使用文件名 |
| `title` | 是 | 文章标题 |
| `authors` | 否 | 作者列表，引用 authors.yml |
| `tags` | 否 | 标签列表，引用 tags.yml |
| `date` | 是 | 发布日期，格式：YYYY-MM-DDTHH:mm |
| `description` | 否 | 文章描述，用于 SEO |
| `keywords` | 否 | 关键词数组，用于 SEO |
| `image` | 否 | 社交分享图片 |
| `draft` | 否 | 是否为草稿（不会发布） |

#### 文件命名规范

推荐使用日期前缀：

```
blog/
├── 2025/
│   ├── 01-15-welcome.md
│   ├── 01-20-typescript-best-practices.md
│   └── 02-01-react-hooks-guide.md
```

### 2. 代码高亮

Docusaurus 使用 Prism.js 进行代码高亮。

#### 基本用法

````markdown
```typescript
const greeting: string = "Hello, World!";
console.log(greeting);
```
````

#### 高亮特定行

````markdown
```typescript {2,4-6}
function example() {
  const a = 1;  // 这行会高亮
  const b = 2;
  const c = 3;  // 这行会高亮
  const d = 4;  // 这行会高亮
  const e = 5;  // 这行会高亮
}
```
````

#### 显示行号

````markdown
```typescript showLineNumbers
function example() {
  console.log("带行号的代码");
}
```
````

#### 添加标题

````markdown
```typescript title="src/example.ts"
export function hello() {
  return "Hello!";
}
```
````

### 3. 标签系统实现

#### 自动标签页

Docusaurus 会自动为每个标签生成聚合页面：

- `/tags` - 所有标签列表
- `/tags/react` - React 标签的文章列表

#### 自定义标签云页面

我们创建了一个增强的标签云页面 (`src/pages/tags-cloud.tsx`)：

```typescript
import {usePluginData} from '@docusaurus/useGlobalData';

export default function TagCloud() {
  const blogData = usePluginData('docusaurus-plugin-content-blog', 'default');
  const tags = Object.values(blogData.blogTags);
  
  // 按文章数量加权显示
  const getTagSize = (count: number) => {
    // 计算字体大小...
  };
  
  return (
    // 渲染标签云...
  );
}
```

**特性：**
- 按文章数量加权显示标签大小
- 标签统计图表
- 响应式设计

### 4. 归档功能实现

创建归档页面 (`src/pages/archive.tsx`)：

```typescript
export default function Archive() {
  const blogData = usePluginData('docusaurus-plugin-content-blog', 'default');
  
  // 按年份分组
  const postsByYear = React.useMemo(() => {
    const groups = new Map();
    blogData.blogPosts.forEach((post) => {
      const year = new Date(post.metadata.date).getFullYear();
      if (!groups.has(year)) {
        groups.set(year, []);
      }
      groups.get(year).push(post);
    });
    return Array.from(groups.entries())
      .sort((a, b) => b[0] - a[0]);
  }, [blogData.blogPosts]);
  
  return (
    // 渲染归档列表...
  );
}
```

**特性：**
- 按年份分组
- 显示发布日期
- 显示标签
- 文章数量统计

### 5. 摘要（Excerpt）

使用 `<!--truncate-->` 标记：

```markdown
---
title: 我的文章
---

这是摘要部分，会显示在列表页。

<!--truncate-->

这是正文部分，只在详情页显示。
```

---

## 国际化配置

### 目录结构设计

```
blog-v1/
├── blog/                    # 默认语言（中文）
│   └── 2025/
│       └── 01-15-welcome.md
├── i18n/
│   └── en/                  # 英文翻译
│       ├── docusaurus-plugin-content-blog/
│       │   └── 2025/
│       │       └── 01-15-welcome.md
│       └── code.json        # UI 文案翻译
```

### 翻译博客内容

1. 在 `i18n/en/docusaurus-plugin-content-blog/` 下创建对应的文章文件
2. 保持文件路径和名称一致
3. 翻译 frontmatter 和正文内容

### 翻译 UI 文案

生成翻译文件：

```bash
npm run write-translations -- --locale en
```

这会生成 `i18n/en/code.json`，编辑该文件进行翻译：

```json
{
  "theme.blog.paginator.newerEntries": {
    "message": "Newer Entries",
    "description": "The label for the button to navigate to newer blog posts"
  }
}
```

### 语言切换

Docusaurus 会自动在导航栏添加语言切换器（配置了 `localeDropdown`）。

### 构建多语言版本

```bash
# 构建所有语言
npm run build

# 只构建特定语言
npm run build -- --locale zh-CN
```

---

## SEO 优化

### 1. Meta 信息配置

#### 全局 Meta

在 `docusaurus.config.ts` 中配置：

```typescript
themeConfig: {
  metadata: [
    {name: 'keywords', content: '技术博客, Docusaurus, TypeScript'},
    {name: 'author', content: 'Your Name'},
    {name: 'description', content: '分享技术，记录成长'},
  ],
}
```

#### 文章级别 Meta

在文章 frontmatter 中配置：

```yaml
---
title: 文章标题
description: 这是一篇关于 React Hooks 的详细教程
keywords: [react, hooks, javascript, tutorial]
image: /img/react-hooks-cover.jpg
---
```

### 2. Sitemap 配置

自动生成，配置在 `docusaurus.config.ts`：

```typescript
sitemap: {
  changefreq: 'weekly',
  priority: 0.5,
  ignorePatterns: ['/tags/**'],
  filename: 'sitemap.xml',
}
```

构建后会生成 `build/sitemap.xml`。

### 3. robots.txt

创建 `static/robots.txt`：

```
User-agent: *
Disallow:

Sitemap: https://yourdomain.com/sitemap.xml
```

### 4. 语义化 HTML

Docusaurus 默认使用语义化 HTML：

- `<article>` 包裹博客文章
- `<header>` 文章头部
- `<main>` 主要内容
- `<nav>` 导航
- `<footer>` 页脚

### 5. 结构化数据

可以通过 swizzle 添加 JSON-LD 结构化数据：

```typescript
// src/theme/BlogPostItem/index.tsx
const structuredData = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": metadata.title,
  "datePublished": metadata.date,
  "author": {
    "@type": "Person",
    "name": metadata.authors[0].name
  }
};
```

---

## 进阶功能

### 1. 自定义首页布局

创建 `src/pages/index.tsx`：

```typescript
import React from 'react';
import Layout from '@theme/Layout';
import BlogListPage from '@theme/BlogListPage';

export default function Home() {
  return (
    <Layout>
      <div className="hero">
        <h1>欢迎来到我的博客</h1>
        <p>分享技术，记录成长</p>
      </div>
      <BlogListPage />
    </Layout>
  );
}
```

### 2. 自定义主题（Swizzle）

查看可 swizzle 的组件：

```bash
npm run swizzle @docusaurus/theme-classic -- --list
```

Swizzle 组件：

```bash
# Wrap 模式（推荐）
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap

# Eject 模式（完全控制）
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --eject
```

### 3. 评论系统集成

#### 使用 Giscus（推荐）

1. 安装依赖：

```bash
npm install @giscus/react
```

2. Swizzle BlogPostItem：

```bash
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap
```

3. 添加 Giscus 组件：

```typescript
// src/theme/BlogPostItem/index.tsx
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

export default function BlogPostItemWrapper(props) {
  const { colorMode } = useColorMode();
  
  return (
    <>
      <BlogPostItem {...props} />
      {props.isBlogPostPage && (
        <Giscus
          repo="your-org/blog-v1"
          repoId="YOUR_REPO_ID"
          category="General"
          categoryId="YOUR_CATEGORY_ID"
          mapping="pathname"
          reactionsEnabled="1"
          emitMetadata="0"
          theme={colorMode}
          lang="zh-CN"
        />
      )}
    </>
  );
}
```

### 4. 自定义 CSS

编辑 `src/css/custom.css`：

```css
:root {
  /* 自定义颜色 */
  --ifm-color-primary: #2e8555;
  
  /* 自定义字体 */
  --ifm-font-family-base: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  
  /* 自定义圆角 */
  --ifm-global-radius: 0.5rem;
}

/* 自定义博客卡片样式 */
.blog-list-item {
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 1.5rem;
  margin-bottom: 2rem;
  transition: box-shadow 0.3s ease;
}

.blog-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
```

### 5. 添加 Google Analytics

在 `docusaurus.config.ts` 中配置：

```typescript
presets: [
  [
    'classic',
    {
      gtag: {
        trackingID: 'G-XXXXXXXXXX',
        anonymizeIP: true,
      },
    },
  ],
],
```

---

## 部署上线

### 1. GitHub Pages

#### 配置

修改 `docusaurus.config.ts`：

```typescript
url: 'https://username.github.io',
baseUrl: '/blog-v1/',
organizationName: 'username',
projectName: 'blog-v1',
deploymentBranch: 'gh-pages',
```

#### 手动部署

```bash
npm run deploy
```

#### 自动部署（GitHub Actions）

已创建 `.github/workflows/deploy.yml`，推送到 main 分支会自动部署。

### 2. Vercel

1. 导入 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置输出目录：`build`
4. 点击部署

已创建 `vercel.json` 配置文件。

### 3. Netlify

1. 连接 GitHub 仓库
2. 设置构建命令：`npm run build`
3. 设置发布目录：`build`
4. 点击部署

### 4. 自托管

```bash
# 构建
npm run build

# 预览
npm run serve

# 部署 build 目录到服务器
rsync -avz build/ user@server:/var/www/blog/
```

---

## 最佳实践

### 1. 内容组织

✅ **推荐：**
- 按年份组织文章：`blog/2025/`
- 使用日期前缀：`01-15-article-name.md`
- 合理使用标签（3-5 个）
- 添加有意义的 slug

❌ **避免：**
- 所有文章放在同一目录
- 使用中文文件名
- 过多或过少的标签
- 缺少 frontmatter 信息

### 2. 写作规范

- 使用清晰的标题层级（H1 → H2 → H3）
- 添加目录（长文章）
- 使用代码高亮
- 添加图片说明
- 内部链接使用相对路径

### 3. 性能优化

- 压缩图片（推荐 WebP 格式）
- 使用 CDN 加速静态资源
- 启用 Gzip/Brotli 压缩
- 懒加载图片

### 4. SEO 优化

- 每篇文章添加 description
- 使用有意义的 slug
- 添加 keywords
- 设置社交分享图片
- 定期更新内容

### 5. 版本控制

```bash
# 初始化 Git
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub
git remote add origin https://github.com/your-org/blog-v1.git
git push -u origin main
```

### 6. 备份策略

- 定期推送到 GitHub
- 导出数据库（如果使用）
- 备份图片资源
- 保存配置文件

---

## 常见问题

### Q: 如何修改博客路径？

A: 修改 `docusaurus.config.ts` 中的 `routeBasePath`：

```typescript
blog: {
  routeBasePath: 'blog',  // 博客路径为 /blog
}
```

### Q: 如何禁用深色模式？

A: 修改 `themeConfig.colorMode`：

```typescript
colorMode: {
  defaultMode: 'light',
  disableSwitch: true,  // 禁用切换开关
}
```

### Q: 如何添加更多代码语言高亮？

A: 修改 `themeConfig.prism.additionalLanguages`：

```typescript
prism: {
  additionalLanguages: ['java', 'python', 'rust', 'go'],
}
```

### Q: 如何自定义 404 页面？

A: 创建 `src/pages/404.tsx`：

```typescript
export default function NotFound() {
  return (
    <Layout title="404 Not Found">
      <h1>页面未找到</h1>
    </Layout>
  );
}
```

---

## 总结

本指南涵盖了从零开始构建 Docusaurus v2 博客系统的完整流程：

1. ✅ 项目初始化和配置
2. ✅ 博客核心功能实现
3. ✅ 标签系统和归档
4. ✅ 国际化配置
5. ✅ SEO 优化
6. ✅ 进阶功能扩展
7. ✅ 部署上线

现在你已经拥有一个功能完整、专业的博客系统！

## 下一步

- 📝 开始写作你的第一篇博客
- 🎨 自定义主题和样式
- 🔌 集成评论系统
- 📊 添加数据分析
- 🚀 优化性能和 SEO

Happy Blogging! 🎉
