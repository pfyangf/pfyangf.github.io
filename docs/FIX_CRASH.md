# 🔧 问题修复说明

## 问题描述

页面崩溃，错误信息：
```
(0 , _docusaurus_theme_common_internal__WEBPACK_IMPORTED_MODULE_3__.useBlogPost) is not a function
```

## 原因分析

之前创建的自定义主题组件 `src/theme/BlogPostItem/Header/Title/index.tsx` 使用了错误的 Docusaurus 内部 API `useBlogPost`，该 API 在当前版本中不可用或已更改。

## 解决方案

### 1. 删除有问题的组件

已删除 `src/theme/BlogPostItem/Header/Title/` 目录。

### 2. 创建正确的自定义组件

使用 **Wrap 模式** 创建了新的自定义组件：

**文件**: `src/theme/BlogPostItem/index.tsx`

```typescript
import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import type BlogPostItemType from '@theme/BlogPostItem';
import type {WrapperProps} from '@docusaurus/types';

type Props = WrapperProps<typeof BlogPostItemType>;

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  return (
    <>
      <BlogPostItem {...props} />
      {/* 可以在这里添加自定义内容 */}
    </>
  );
}
```

这个组件使用了正确的 Docusaurus Swizzle API，不会导致崩溃。

---

## 如何使用自定义主题组件

### 推荐方式：Wrap 模式

Wrap 模式是最安全的自定义方式，它包装原有组件而不是完全替换。

#### 1. 查看可 Swizzle 的组件

```bash
npm run swizzle @docusaurus/theme-classic -- --list
```

#### 2. 使用 Wrap 模式 Swizzle 组件

```bash
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --wrap
```

这会自动生成正确的包装器组件。

#### 3. 自定义组件

在生成的组件中添加你的自定义逻辑：

```typescript
export default function BlogPostItemWrapper(props: Props): JSX.Element {
  return (
    <>
      {/* 在原组件之前添加内容 */}
      <div>自定义内容</div>
      
      {/* 原组件 */}
      <BlogPostItem {...props} />
      
      {/* 在原组件之后添加内容 */}
      <div>评论系统等</div>
    </>
  );
}
```

### 不推荐：Eject 模式

Eject 模式会完全复制组件代码，升级时可能会有问题：

```bash
npm run swizzle @docusaurus/theme-classic BlogPostItem -- --eject
```

⚠️ **警告**：只在必要时使用 Eject 模式。

---

## 常见的自定义场景

### 1. 添加评论系统（Giscus）

```typescript
import Giscus from '@giscus/react';
import { useColorMode } from '@docusaurus/theme-common';

export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const { colorMode } = useColorMode();
  
  return (
    <>
      <BlogPostItem {...props} />
      {props.children && (
        <Giscus
          repo="your-org/blog-v1"
          repoId="YOUR_REPO_ID"
          category="General"
          categoryId="YOUR_CATEGORY_ID"
          mapping="pathname"
          theme={colorMode}
          lang="zh-CN"
        />
      )}
    </>
  );
}
```

### 2. 添加阅读时间提示

```typescript
export default function BlogPostItemWrapper(props: Props): JSX.Element {
  return (
    <>
      <div style={{
        padding: '0.5rem 1rem',
        background: 'var(--ifm-color-emphasis-100)',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        ☕ 建议阅读时间：5 分钟
      </div>
      <BlogPostItem {...props} />
    </>
  );
}
```

### 3. 添加分享按钮

```typescript
export default function BlogPostItemWrapper(props: Props): JSX.Element {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      });
    }
  };
  
  return (
    <>
      <BlogPostItem {...props} />
      <button onClick={handleShare} style={{marginTop: '1rem'}}>
        📤 分享这篇文章
      </button>
    </>
  );
}
```

---

## 自定义 CSS

如果只需要修改样式，不需要 Swizzle 组件，直接在 `src/css/custom.css` 中添加：

```css
/* 自定义博客文章样式 */
article.blog-post-item {
  border: 1px solid var(--ifm-color-emphasis-200);
  border-radius: var(--ifm-global-radius);
  padding: 2rem;
  margin-bottom: 2rem;
}

article.blog-post-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}

/* 自定义标题样式 */
.markdown h1 {
  color: var(--ifm-color-primary);
  border-bottom: 3px solid var(--ifm-color-primary);
  padding-bottom: 0.5rem;
}
```

---

## 验证修复

### 1. 重启开发服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
npm start
```

### 2. 访问博客

访问 http://localhost:3000

### 3. 确认页面正常

- ✅ 博客列表页正常显示
- ✅ 博客详情页正常显示
- ✅ 没有崩溃错误

---

## 总结

### 问题
- ❌ 使用了错误的内部 API `useBlogPost`
- ❌ 组件导致页面崩溃

### 解决
- ✅ 删除有问题的组件
- ✅ 创建正确的 Wrap 模式组件
- ✅ 使用官方推荐的 Swizzle API

### 建议
- ✅ 优先使用 Wrap 模式
- ✅ 避免使用内部 API
- ✅ 参考官方文档进行自定义

---

## 相关文档

- [Docusaurus Swizzling 文档](https://docusaurus.io/docs/swizzling)
- [主题组件列表](https://docusaurus.io/docs/api/themes/configuration)
- [自定义 CSS](https://docusaurus.io/docs/styling-layout)

---

**问题已修复！重启服务器后页面应该正常显示。🎉**
