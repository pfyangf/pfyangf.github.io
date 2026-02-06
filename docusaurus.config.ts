import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
    // 网站基本信息
    title: 'AutoSec',
    tagline: 'Securing the Future of Web3 - Advanced Blockchain Security Research & Insights',
    favicon: 'img/favicon.ico',

    // 部署配置
    url: 'https://pfyangf.github.io',
    baseUrl: '/',

    // GitHub pages 部署配置
    organizationName: 'pfyangf',
    projectName: 'pfyangf.github.io',

    // 错误处理
    onBrokenLinks: 'throw',

    // GitHub Pages 推荐配置
    trailingSlash: true,

    // 国际化配置
    i18n: {
        defaultLocale: 'en',
        locales: ['en', 'zh-CN'],
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

    presets: [
        [
            'classic',
            {
                // 文档配置（如果不需要文档功能，可以设置为 false）
                docs: false,

                // 博客配置 - 核心功能
                blog: {
                    // 博客路由路径
                    routeBasePath: '/',

                    // 禁用插件自带的 archive，使用 src/pages/archive.tsx
                    archiveBasePath: null,

                    // 博客文章目录
                    path: './blog',

                    // 每页显示的文章数
                    postsPerPage: 10,

                    // 博客侧边栏配置
                    blogSidebarTitle: '最近文章',
                    blogSidebarCount: 10,

                    // 博客列表页标题
                    blogTitle: 'Security Research',
                    blogDescription: 'Cutting-edge Web3 security research, smart contract audits, and blockchain vulnerability analysis',

                    // 显示阅读时间
                    showReadingTime: true,

                    // 摘要分隔符
                    truncateMarker: /<!--\s*truncate\s*-->/,

                    // 编辑链接配置
                    editUrl: 'https://github.com/pfyangf/pfyangf.github.io/tree/main/',

                    // 博客作者配置
                    authorsMapPath: 'authors.yml',

                    // 禁用 RSS/Atom feed（避免构建错误）
                    feedOptions: {
                        type: null,
                    },

                    // MDX 配置
                    remarkPlugins: [],
                    rehypePlugins: [],

                    // 标签配置
                    tags: 'tags.yml',
                },

                // 主题配置
                theme: {
                    customCss: './src/css/custom.css',
                },

                // SEO 配置
                sitemap: {
                    changefreq: 'weekly',
                    priority: 0.5,
                    ignorePatterns: ['/tags/**'],
                    filename: 'sitemap.xml',
                },

                // Google Analytics（可选）
                // gtag: {
                //   trackingID: 'G-XXXXXXXXXX',
                //   anonymizeIP: true,
                // },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // SEO 元数据
        metadata: [
            { name: 'keywords', content: 'Web3 Security, Blockchain Security, Smart Contract Audit, DeFi Security, Cryptocurrency Security, Bug Bounty, Vulnerability Research, Ethereum Security, Solidity Security' },
            { name: 'author', content: 'AutoSec Team' },
            { name: 'description', content: 'AutoSec - Leading Web3 security research platform. Expert analysis on blockchain vulnerabilities, smart contract audits, and DeFi security.' },
        ],

        // 网站图片（用于社交媒体分享）
        image: 'img/social-card.jpg',

        // 导航栏配置
        navbar: {
            title: '',
            logo: {
                alt: 'AutoSec - Web3 Security Platform',
                src: 'img/autosec.png',
                srcDark: 'img/autosec.png',
                width: 180,
                height: 60,
            },
            items: [
                {
                    to: '/',
                    label: 'Home',
                    position: 'left',
                },
                {
                    to: '/tags/customers',
                    label: 'Customers',
                    position: 'left',
                },
                {
                    to: '/tags/whitehat-spotlight',
                    label: 'Whitehat Spotlight',
                    position: 'left',
                },
                {
                    to: '/tags/security-guides',
                    label: 'Security Guides',
                    position: 'left',
                },
            ],
        },

        // 页脚配置
        footer: {
            style: 'light',
            links: [
                {
                    title: 'Blog',
                    items: [
                        {
                            label: 'Home',
                            to: '/',
                        },
                        {
                            label: 'Archive',
                            to: '/archive',
                        },
                    ],
                },
                {
                    title: 'Follow',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/pfyangf/pfyangf.github.io',
                        },
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/autosec',
                        },
                    ],
                },
            ],
            copyright: `Copyright © ${new Date().getFullYear()} AutoSec. All rights reserved.`,
        },

        // 代码高亮主题
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
            additionalLanguages: ['java', 'python', 'bash', 'json', 'yaml'],
        },

        // 颜色模式配置
        colorMode: {
            defaultMode: 'light',
            disableSwitch: true,
            respectPrefersColorScheme: false,
        },

        // 公告栏（可选）
        // announcementBar: {
        //   id: 'support_us',
        //   content: '⭐️ 如果这个博客对你有帮助，请在 <a target="_blank" rel="noopener noreferrer" href="https://github.com/your-org/blog-v1">GitHub</a> 上给我们一个 Star！',
        //   backgroundColor: '#fafbfc',
        //   textColor: '#091E42',
        //   isCloseable: true,
        // },

        // 搜索配置（Algolia DocSearch）
        // algolia: {
        //   appId: 'YOUR_APP_ID',
        //   apiKey: 'YOUR_SEARCH_API_KEY',
        //   indexName: 'YOUR_INDEX_NAME',
        //   contextualSearch: true,
        // },
    } satisfies Preset.ThemeConfig,

    // 插件配置
    plugins: [
        // 自定义插件示例 1: 博客分析插件
        // [
        //   './plugins/blog-analytics',
        //   {
        //     enableAnalytics: true,
        //     trackingId: 'YOUR_TRACKING_ID',
        //   },
        // ],

        // 自定义插件示例 2: 阅读进度条插件
        // 注意：本地插件需要有 package.json 才能被识别
        // 如需启用，请先为插件添加 package.json 文件
        // [
        //     './plugins/reading-progress',
        //     {
        //         color: 'linear-gradient(90deg, #2e8555, #25c2a0)',
        //         height: '3px',
        //     },
        // ],
    ],

    // 主题配置
    themes: [],

    // Markdown 配置
    markdown: {
        mermaid: true,
        hooks: {
            onBrokenMarkdownLinks: 'warn',
        },
    },

    // 脚本和样式表
    scripts: [],
    stylesheets: [],
};

export default config;
