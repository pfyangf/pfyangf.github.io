# 🔍 Algolia DocSearch 集成指南

## 什么是 Algolia DocSearch？

Algolia DocSearch 是一个免费的搜索服务，专为技术文档和博客网站设计。它提供快速、准确的全文搜索功能。

## 申请 Algolia DocSearch

### 1. 访问 DocSearch 官网

访问：https://docsearch.algolia.com/apply/

### 2. 填写申请表单

需要提供：
- **网站 URL**: 你的博客地址
- **邮箱**: 用于接收配置信息
- **GitHub 仓库**（可选）

### 3. 等待审核

Algolia 团队会审核你的申请（通常 1-2 周），审核通过后会发送配置信息到你的邮箱。

## 配置 Algolia DocSearch

### 1. 获取配置信息

审核通过后，你会收到包含以下信息的邮件：
- `appId`: 应用 ID
- `apiKey`: 搜索 API 密钥
- `indexName`: 索引名称

### 2. 更新 docusaurus.config.ts

在 `themeConfig` 中添加 Algolia 配置：

```typescript
themeConfig: {
  // ... 其他配置

  // Algolia DocSearch 配置
  algolia: {
    // Algolia 提供的应用 ID
    appId: 'YOUR_APP_ID',
    
    // 公开的搜索 API 密钥
    apiKey: 'YOUR_SEARCH_API_KEY',
    
    // 索引名称
    indexName: 'YOUR_INDEX_NAME',
    
    // 可选：启用上下文搜索
    contextualSearch: true,
    
    // 可选：搜索页面路径
    // searchPagePath: 'search',
    
    // 可选：自定义搜索参数
    // searchParameters: {},
    
    // 可选：禁用用户洞察
    // insights: false,
  },
}
```

### 3. 完整配置示例

```typescript
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  // ... 其他配置

  themeConfig: {
    // ... 其他主题配置

    algolia: {
      appId: 'BH4D9OD16A',  // 示例 ID
      apiKey: '3c8f3e0e1f1e4b5c8d9e0f1a2b3c4d5e',  // 示例密钥
      indexName: 'my-blog',
      contextualSearch: true,
      
      // 可选：自定义搜索参数
      searchParameters: {
        facetFilters: ['language:zh-CN', 'version:current'],
      },
      
      // 可选：自定义占位符文本
      placeholder: '搜索文档...',
      
      // 可选：搜索按钮文本
      translations: {
        button: {
          buttonText: '搜索',
          buttonAriaLabel: '搜索',
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询',
            resetButtonAriaLabel: '清除查询',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消',
          },
          startScreen: {
            recentSearchesTitle: '最近搜索',
            noRecentSearchesText: '没有最近搜索',
            saveRecentSearchButtonTitle: '保存此搜索',
            removeRecentSearchButtonTitle: '从历史记录中删除此搜索',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中删除此搜索',
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查网络连接',
          },
          footer: {
            selectText: '选择',
            selectKeyAriaLabel: '输入键',
            navigateText: '导航',
            navigateUpKeyAriaLabel: '向上箭头',
            navigateDownKeyAriaLabel: '向下箭头',
            closeText: '关闭',
            closeKeyAriaLabel: 'Escape 键',
            searchByText: '搜索提供',
          },
          noResultsScreen: {
            noResultsText: '没有找到结果',
            suggestedQueryText: '尝试搜索',
            reportMissingResultsText: '相信这个查询应该返回结果？',
            reportMissingResultsLinkText: '让我们知道',
          },
        },
      },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
```

## 自托管 Algolia（高级）

如果你想自己控制索引，可以使用自托管方案。

### 1. 安装依赖

```bash
npm install algoliasearch
```

### 2. 创建索引脚本

创建 `scripts/algolia-index.ts`：

```typescript
import algoliasearch from 'algoliasearch';
import fs from 'fs';
import path from 'path';

// Algolia 配置
const client = algoliasearch('YOUR_APP_ID', 'YOUR_ADMIN_API_KEY');
const index = client.initIndex('YOUR_INDEX_NAME');

// 读取博客文章并创建索引
async function indexBlogPosts() {
  const blogDir = path.join(__dirname, '../blog');
  const posts = [];

  // 遍历博客文件
  // ... 读取和解析 Markdown 文件

  // 批量上传到 Algolia
  await index.saveObjects(posts, { autoGenerateObjectIDIfNotExist: true });
  
  console.log(`✅ 已索引 ${posts.length} 篇文章`);
}

indexBlogPosts().catch(console.error);
```

### 3. 添加到构建流程

在 `package.json` 中添加脚本：

```json
{
  "scripts": {
    "index:algolia": "ts-node scripts/algolia-index.ts",
    "build": "docusaurus build && npm run index:algolia"
  }
}
```

## 测试搜索功能

### 1. 本地测试

启动开发服务器：

```bash
npm start
```

在导航栏会出现搜索框，点击或按 `Ctrl+K` / `Cmd+K` 打开搜索。

### 2. 搜索功能

- **全文搜索**: 搜索标题、内容、标签
- **快捷键**: `Ctrl+K` 或 `Cmd+K`
- **最近搜索**: 自动保存搜索历史
- **键盘导航**: 使用方向键导航结果

## 优化搜索体验

### 1. 自定义搜索排名

在 Algolia 控制台中配置：
- 设置搜索属性权重
- 配置自定义排名规则
- 添加同义词

### 2. 添加搜索分析

```typescript
algolia: {
  // ... 其他配置
  insights: true,  // 启用搜索分析
}
```

### 3. 优化索引

- 定期更新索引
- 删除过时内容
- 优化索引大小

## 常见问题

### Q: 搜索框不显示？

A: 检查：
1. Algolia 配置是否正确
2. API 密钥是否有效
3. 索引是否已创建

### Q: 搜索结果不准确？

A: 尝试：
1. 重新索引内容
2. 调整搜索参数
3. 配置自定义排名

### Q: 如何搜索中文内容？

A: Algolia 支持中文搜索，确保：
1. 内容编码为 UTF-8
2. 配置正确的语言设置

### Q: 免费版有限制吗？

A: DocSearch 免费版限制：
- 每月 10 万次搜索请求
- 10 万条记录
- 对于开源项目完全免费

## 替代方案

如果不想使用 Algolia，可以考虑：

### 1. 本地搜索插件

```bash
npm install @easyops-cn/docusaurus-search-local
```

配置：

```typescript
themes: [
  [
    require.resolve("@easyops-cn/docusaurus-search-local"),
    {
      hashed: true,
      language: ["zh", "en"],
      highlightSearchTermsOnTargetPage: true,
    },
  ],
],
```

### 2. Lunr.js

轻量级的客户端搜索库。

### 3. Typesense

开源的搜索引擎，可自托管。

## 总结

Algolia DocSearch 提供：
- ✅ 快速准确的搜索
- ✅ 免费（开源项目）
- ✅ 易于集成
- ✅ 强大的自定义选项

配置步骤：
1. 申请 DocSearch
2. 获取配置信息
3. 更新 `docusaurus.config.ts`
4. 测试搜索功能

---

**相关链接：**
- [Algolia DocSearch 官网](https://docsearch.algolia.com/)
- [Docusaurus 搜索文档](https://docusaurus.io/docs/search)
- [Algolia 控制台](https://www.algolia.com/dashboard)
