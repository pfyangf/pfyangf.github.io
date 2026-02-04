---
slug: welcome-to-my-blog
title: 欢迎来到我的技术博客
authors: [admin]
tags: [tutorial, frontend, backend]
date: 2025-01-15T10:00
---

欢迎来到我的技术博客！这是第一篇博客文章，让我来介绍一下这个博客系统的功能。

<!--truncate-->

## 博客系统特性

这个博客系统基于 Docusaurus v2 构建，具有以下特性：

### 1. 强大的 Markdown 支持

支持标准 Markdown 和 MDX 语法，可以在文章中嵌入 React 组件。

### 2. 代码高亮

支持多种编程语言的代码高亮：

```typescript
// TypeScript 示例
interface BlogPost {
  title: string;
  date: Date;
  tags: string[];
  content: string;
}

const post: BlogPost = {
  title: "我的第一篇博客",
  date: new Date(),
  tags: ["tutorial", "typescript"],
  content: "这是博客内容...",
};
```

```python
# Python 示例
def hello_world():
    print("Hello, World!")
    
if __name__ == "__main__":
    hello_world()
```

### 3. 标签系统

文章可以添加多个标签，方便分类和检索。点击标签可以查看同类文章。

### 4. 国际化支持

博客支持中英文双语，可以轻松扩展到更多语言。

### 5. SEO 优化

- 自动生成 sitemap.xml
- 支持 meta 标签配置
- 语义化 HTML 结构
- RSS/Atom 订阅支持

### 6. 响应式设计

完美适配桌面、平板和移动设备。

## 开始写作

创建新文章非常简单，只需在 `blog` 目录下创建一个新的 Markdown 文件：

```markdown
---
slug: my-new-post
title: 我的新文章
authors: [admin]
tags: [javascript, react]
date: 2025-01-20T10:00
---

文章摘要部分...

<!--truncate-->

文章正文部分...
```

## 下一步

接下来我会分享更多技术文章，敬请期待！

---

**相关链接：**
- [Docusaurus 官方文档](https://docusaurus.io/)
- [Markdown 语法指南](https://www.markdownguide.org/)
