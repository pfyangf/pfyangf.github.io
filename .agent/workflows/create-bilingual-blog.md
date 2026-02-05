---
description: 如何创建中英文双语博客文章
---

# 创建中英文双语博客文章教程

本教程将指导您如何在 Docusaurus 博客中创建中英文双语文章。

## 📁 目录结构说明

```
blog-v1/
├── blog/                          # 中文博客（默认语言 zh-CN）
│   ├── 2026/
│   │   └── 02-06-web3-security.md
│   └── authors.yml
└── i18n/
    └── en/
        └── docusaurus-plugin-content-blog/  # 英文博客翻译
            ├── 2026/
            │   └── 02-06-web3-security.md
            └── authors.yml (可选)
```

## 📝 步骤 1: 创建中文博客文章

在 `blog/` 目录下创建您的中文博客文章。

### 文件命名规范

- **格式**: `YYYY/MM-DD-slug.md`
- **示例**: `2026/02-06-web3-security.md`

### 中文文章模板

在 `blog/2026/02-06-web3-security.md` 创建文件：

```markdown
---
slug: web3-security-guide
title: Web3 安全完整指南
authors: [autosec]
tags: [Web3安全, 智能合约, 区块链安全, 最佳实践]
date: 2026-02-06T10:00
description: 深入探讨 Web3 安全的各个方面，包括智能合约安全、钱包安全和最佳实践
---

这是一篇关于 Web3 安全的完整指南，涵盖智能合约审计、常见漏洞和安全最佳实践。

<!--truncate-->

## 什么是 Web3 安全？

Web3 安全是指保护去中心化应用（DApps）、智能合约和区块链生态系统免受攻击的实践...

## 常见的 Web3 安全威胁

### 1. 智能合约漏洞

智能合约一旦部署就无法修改，因此安全至关重要...

### 2. 私钥管理

私钥是访问加密资产的唯一凭证...

## 安全最佳实践

1. **代码审计**: 在部署前进行全面的安全审计
2. **多重签名**: 使用多签钱包管理重要资产
3. **访问控制**: 实施严格的权限管理

## 总结

Web3 安全需要多层防护...
```

## 📝 步骤 2: 创建英文翻译版本

在 `i18n/en/docusaurus-plugin-content-blog/` 目录下创建对应的英文版本。

### 创建目录（如果不存在）

```bash
mkdir -p i18n/en/docusaurus-plugin-content-blog/2026
```

### 英文文章模板

在 `i18n/en/docusaurus-plugin-content-blog/2026/02-06-web3-security.md` 创建文件：

```markdown
---
slug: web3-security-guide
title: Complete Guide to Web3 Security
authors: [autosec]
tags: [Web3 security, smart contracts, blockchain security, best practices]
date: 2026-02-06T10:00
description: An in-depth exploration of Web3 security aspects, including smart contract security, wallet security, and best practices
---

This is a comprehensive guide to Web3 security, covering smart contract audits, common vulnerabilities, and security best practices.

<!--truncate-->

## What is Web3 Security?

Web3 security refers to the practices of protecting decentralized applications (DApps), smart contracts, and blockchain ecosystems from attacks...

## Common Web3 Security Threats

### 1. Smart Contract Vulnerabilities

Smart contracts cannot be modified once deployed, making security critical...

### 2. Private Key Management

Private keys are the only credentials for accessing crypto assets...

## Security Best Practices

1. **Code Audits**: Conduct comprehensive security audits before deployment
2. **Multi-Signature**: Use multi-sig wallets for managing important assets
3. **Access Control**: Implement strict permission management

## Conclusion

Web3 security requires multi-layered protection...
```

## ⚙️ 步骤 3: 重要配置说明

### Frontmatter 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `slug` | URL 路径（**中英文必须相同**） | `web3-security-guide` |
| `title` | 文章标题（中英文不同） | 中文: "Web3 安全完整指南"<br>英文: "Complete Guide to Web3 Security" |
| `authors` | 作者（使用 `authors.yml` 中定义的 key） | `[autosec]` |
| `tags` | 标签（中英文可以不同） | 中文: `[Web3安全, 智能合约]`<br>英文: `[Web3 security, smart contracts]` |
| `date` | 发布日期（**中英文必须相同**） | `2026-02-06T10:00` |
| `description` | 文章描述（用于 SEO） | 简短描述文章内容 |

### ⚠️ 关键注意事项

1. **slug 必须相同**: 中英文文章的 `slug` 必须完全一致，这样 Docusaurus 才能正确关联两个版本
2. **date 必须相同**: 确保中英文版本的日期一致
3. **文件路径对应**: 中英文文件的相对路径必须一致
   - 中文: `blog/2026/02-06-web3-security.md`
   - 英文: `i18n/en/docusaurus-plugin-content-blog/2026/02-06-web3-security.md`

## 🏷️ 步骤 4: 标签管理（可选）

如果您想在 `tags.yml` 中定义标签的元数据：

在 `blog/tags.yml` 中添加：

```yaml
Web3安全:
  label: 'Web3安全'
  permalink: /web3-security
  description: 'Web3 和区块链安全相关文章'

智能合约:
  label: '智能合约'
  permalink: /smart-contracts
  description: '智能合约开发和安全'
```

## 🧪 步骤 5: 测试和验证

### 本地测试

```bash
# 启动开发服务器
npm start

# 测试中文版本
# 访问: http://localhost:3000/

# 测试英文版本
# 访问: http://localhost:3000/en/

# 或者切换语言选择器
```

### 构建测试

```bash
# 构建生产版本
npm run build

# 本地预览构建结果
npm run serve
```

### 验证清单

- [ ] 中文文章可以正常访问
- [ ] 英文文章可以正常访问
- [ ] 语言切换器可以在中英文版本之间切换
- [ ] 标签正确显示
- [ ] 作者信息正确显示
- [ ] 日期格式正确
- [ ] 图片和链接正常工作

## 📊 快速创建工作流

### 方法 1: 手动创建

1. 在 `blog/YYYY/` 下创建中文 `.md` 文件
2. 在 `i18n/en/docusaurus-plugin-content-blog/YYYY/` 下创建对应的英文 `.md` 文件
3. 确保 `slug` 和 `date` 一致
4. 翻译内容

### 方法 2: 使用脚本（推荐）

创建一个辅助脚本 `scripts/create-blog.js`:

```javascript
// 待实现：自动创建中英文博客模板的脚本
```

## 🎯 最佳实践

1. **先写中文，后翻译**: 先完成中文版本，确保内容质量，然后翻译成英文
2. **保持结构一致**: 中英文版本的章节结构应该保持一致
3. **使用专业术语**: 技术术语保持一致（如 "smart contract" 不要翻译成多个不同的词）
4. **代码示例**: 代码注释可以翻译，但代码本身保持一致
5. **图片路径**: 使用相对路径，中英文可以共用同一张图片

## 📚 示例文件对比

### 中文版本 (`blog/2026/02-06-web3-security.md`)

```markdown
---
slug: web3-security-guide
title: Web3 安全完整指南
authors: [autosec]
tags: [Web3安全, 智能合约, 区块链安全]
date: 2026-02-06T10:00
---

## 智能合约安全

智能合约是运行在区块链上的代码...

```solidity
// 安全的智能合约示例
contract SecureContract {
    // 使用 OpenZeppelin 的安全库
    using SafeMath for uint256;
}
```
```

### 英文版本 (`i18n/en/.../2026/02-06-web3-security.md`)

```markdown
---
slug: web3-security-guide
title: Complete Guide to Web3 Security
authors: [autosec]
tags: [Web3 security, smart contracts, blockchain security]
date: 2026-02-06T10:00
---

## Smart Contract Security

Smart contracts are code running on the blockchain...

```solidity
// Secure smart contract example
contract SecureContract {
    // Using OpenZeppelin's security library
    using SafeMath for uint256;
}
```
```

## 🔧 常见问题

### Q1: 为什么我的英文版本没有显示？

**A**: 检查以下几点：
- `slug` 是否与中文版本完全一致
- 文件路径是否正确对应
- 是否在正确的目录 `i18n/en/docusaurus-plugin-content-blog/`

### Q2: 如何只发布中文版本，暂不发布英文版本？

**A**: 只创建中文版本即可。英文用户访问时会自动回退到中文版本。

### Q3: 标签可以中英文不同吗？

**A**: 可以！标签是独立的，中英文可以使用不同的标签名称。

### Q4: 作者信息如何国际化？

**A**: 在 `blog/authors.yml` 中定义作者，该文件会被所有语言共享。如需不同语言显示不同的作者信息，可以在 `i18n/en/docusaurus-plugin-content-blog/authors.yml` 中覆盖。

## 🚀 部署

确保 GitHub Actions 配置正确，推送到 GitHub 后会自动构建和部署中英文版本。

```bash
git add .
git commit -m "Add new bilingual blog post: Web3 Security Guide"
git push origin main
```

## 📖 相关文档

- [Docusaurus i18n 官方文档](https://docusaurus.io/docs/i18n/introduction)
- [博客插件文档](https://docusaurus.io/docs/blog)
- [Markdown 功能](https://docusaurus.io/docs/markdown-features)

---

**提示**: 如果您需要帮助创建博客文章，可以使用 AI 助手来帮助翻译和优化内容！
