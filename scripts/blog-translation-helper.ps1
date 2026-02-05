# 批量创建英文博客翻译的 PowerShell 脚本

# 定义博客文章映射（中文标题 -> 英文标题）
$blogTranslations = @{
    # 2024年
    "2024/03-15-smart-contract-security-basics.md" = @{
        title = "Smart Contract Security Basics"
        tags = @("smart contracts", "security", "Solidity")
    }
    "2024/06-20-defi-security-guide.md" = @{
        title = "DeFi Security Guide"
        tags = @("DeFi", "security", "decentralized finance")
    }
    "2024/08-10-nft-security-tips.md" = @{
        title = "NFT Security Tips"
        tags = @("NFT", "security", "digital assets")
    }
    "2024/10-05-wallet-security-best-practices.md" = @{
        title = "Crypto Wallet Security Best Practices"
        tags = @("wallet", "security", "private key management")
    }
    "2024/12-15-blockchain-security-trends.md" = @{
        title = "2024 Blockchain Security Trends"
        tags = @("blockchain", "security trends", "Web3")
    }
    # 2025年
    "2025/02-10-web3-phishing-attacks.md" = @{
        title = "Web3 Phishing Attack Prevention Guide"
        tags = @("phishing attacks", "Web3 security", "protection")
    }
    "2025/04-18-smart-contract-audit-process.md" = @{
        title = "Smart Contract Audit Process Explained"
        tags = @("audit", "smart contracts", "security")
    }
    "2025/07-22-layer2-security-analysis.md" = @{
        title = "Layer 2 Security Analysis"
        tags = @("Layer2", "scaling", "security")
    }
    "2025/09-30-dao-governance-security.md" = @{
        title = "DAO Governance Security Guide"
        tags = @("DAO", "governance", "security")
    }
    "2025/11-25-crypto-wallet-recovery.md" = @{
        title = "Crypto Wallet Recovery Guide"
        tags = @("wallet recovery", "seed phrase", "security")
    }
    # 2026年
    "2026/01-15-ai-blockchain-security.md" = @{
        title = "AI and Blockchain Security Integration"
        tags = @("AI", "blockchain security", "artificial intelligence")
    }
    "2026/03-20-zero-knowledge-proofs-intro.md" = @{
        title = "Introduction to Zero-Knowledge Proofs"
        tags = @("zero-knowledge proofs", "privacy", "ZK")
    }
    "2026/05-12-mev-protection-strategies.md" = @{
        title = "MEV Protection Strategies"
        tags = @("MEV", "DeFi", "transaction protection")
    }
    "2026/07-08-account-abstraction-security.md" = @{
        title = "Account Abstraction Security Analysis"
        tags = @("account abstraction", "ERC-4337", "security")
    }
    "2026/09-25-web3-security-checklist-2026.md" = @{
        title = "2026 Web3 Security Checklist"
        tags = @("security checklist", "Web3", "best practices")
    }
}

Write-Host "博客翻译映射已定义，共 $($blogTranslations.Count) 篇文章" -ForegroundColor Green
Write-Host ""
Write-Host "使用方法："
Write-Host "1. 手动翻译每篇博客的内容"
Write-Host "2. 将翻译后的内容保存到 i18n/en/docusaurus-plugin-content-blog/ 对应路径"
Write-Host "3. 确保 slug 和 date 与中文版本一致"
Write-Host ""
Write-Host "提示：可以使用 AI 翻译工具（如 ChatGPT, DeepL）来加速翻译过程"
