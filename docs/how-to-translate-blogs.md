# 批量创建英文博客翻译指南

## 方法 1: 使用 Docusaurus CLI（推荐用于界面翻译）

```bash
# 生成英文翻译文件结构
npx docusaurus write-translations --locale en
```

注意：此命令只能生成界面翻译（navbar, footer等），不能翻译博客内容。

## 方法 2: 手动复制并翻译（适合博客内容）

### 步骤：

1. **复制中文博客到英文目录**

```powershell
# PowerShell 命令
# 复制 2024 年博客
Copy-Item -Path "blog\2024\*" -Destination "i18n\en\docusaurus-plugin-content-blog\2024\" -Recurse -Force

# 复制 2025 年博客
Copy-Item -Path "blog\2025\*" -Destination "i18n\en\docusaurus-plugin-content-blog\2025\" -Recurse -Force

# 复制 2026 年博客
Copy-Item -Path "blog\2026\*" -Destination "i18n\en\docusaurus-plugin-content-blog\2026\" -Recurse -Force
```

2. **使用 AI 工具批量翻译**

推荐工具：
- ChatGPT / Claude
- DeepL
- Google Translate

3. **翻译注意事项**

必须保持一致的字段：
- `slug`: 必须与中文版完全相同
- `date`: 必须与中文版完全相同  
- `authors`: 使用相同的作者 key

可以翻译的字段：
- `title`: 翻译为英文
- `tags`: 翻译为英文标签
- `description`: 翻译描述
- 正文内容: 完整翻译

## 方法 3: 一键复制命令（最快）

```powershell
# 创建目录并复制所有博客
New-Item -ItemType Directory -Path "i18n\en\docusaurus-plugin-content-blog\2024" -Force
New-Item -ItemType Directory -Path "i18n\en\docusaurus-plugin-content-blog\2025" -Force  
New-Item -ItemType Directory -Path "i18n\en\docusaurus-plugin-content-blog\2026" -Force

Copy-Item "blog\2024\*.md" "i18n\en\docusaurus-plugin-content-blog\2024\" -Force
Copy-Item "blog\2025\*.md" "i18n\en\docusaurus-plugin-content-blog\2025\" -Force
Copy-Item "blog\2026\*.md" "i18n\en\docusaurus-plugin-content-blog\2026\" -Force
```

然后使用文本编辑器或 AI 工具逐个翻译文件内容。

## 验证翻译

```bash
# 构建测试
npm run build

# 本地预览
npm run serve
```

访问：
- 中文版: http://localhost:3000/
- 英文版: http://localhost:3000/en/

## 翻译检查清单

- [ ] slug 与中文版一致
- [ ] date 与中文版一致
- [ ] title 已翻译
- [ ] tags 已翻译
- [ ] description 已翻译
- [ ] 正文内容已翻译
- [ ] 代码注释已翻译（可选）
- [ ] 链接仍然有效
- [ ] 构建无错误
