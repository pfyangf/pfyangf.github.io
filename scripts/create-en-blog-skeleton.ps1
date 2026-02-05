# 自动创建英文博客翻译骨架的 PowerShell 脚本
# 使用方法: .\create-en-blog-skeleton.ps1

$blogDir = "blog"
$enBlogDir = "i18n\en\docusaurus-plugin-content-blog"

# 确保英文博客目录存在
New-Item -ItemType Directory -Path $enBlogDir -Force | Out-Null

# 获取所有中文博客文件
$chineseBlogs = Get-ChildItem -Path $blogDir -Recurse -Filter "*.md" | Where-Object { $_.Name -ne "authors.yml" }

Write-Host "找到 $($chineseBlogs.Count) 篇中文博客" -ForegroundColor Green
Write-Host ""

foreach ($blog in $chineseBlogs) {
    # 计算相对路径
    $relativePath = $blog.FullName.Substring($blogDir.Length + 1)
    $enBlogPath = Join-Path $enBlogDir $relativePath
    
    # 创建目录
    $enBlogFolder = Split-Path $enBlogPath -Parent
    New-Item -ItemType Directory -Path $enBlogFolder -Force | Out-Null
    
    # 读取中文博客内容
    $content = Get-Content $blog.FullName -Raw -Encoding UTF8
    
    # 提取 frontmatter
    if ($content -match '(?s)^---\s*\n(.*?)\n---') {
        $frontmatter = $matches[1]
        
        # 创建英文模板（保持 slug 和 date，其他字段标记为需要翻译）
        $enTemplate = @"
---
$frontmatter
---

[TRANSLATE THIS CONTENT]

<!--truncate-->

## [Section Title]

[Content to translate...]

"@
        
        # 写入英文模板文件
        Set-Content -Path $enBlogPath -Value $enTemplate -Encoding UTF8
        Write-Host "✓ 创建: $relativePath" -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "完成！已创建 $($chineseBlogs.Count) 个英文博客模板" -ForegroundColor Green
Write-Host "请使用 AI 工具翻译 [TRANSLATE THIS CONTENT] 标记的内容" -ForegroundColor Yellow
