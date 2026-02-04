import type { Plugin, LoadContext } from '@docusaurus/types';

/**
 * 自定义 Docusaurus 插件示例
 * 这个插件会在构建时注入自定义的全局数据
 */

export interface BlogAnalyticsPluginOptions {
    enableAnalytics?: boolean;
    trackingId?: string;
}

export default function blogAnalyticsPlugin(
    context: LoadContext,
    options: BlogAnalyticsPluginOptions
): Plugin<void> {
    return {
        name: 'docusaurus-plugin-blog-analytics',

        async loadContent() {
            // 加载自定义内容
            console.log('📊 Blog Analytics Plugin: Loading content...');
            return;
        },

        async contentLoaded({ content, actions }) {
            // 内容加载完成后的处理
            const { setGlobalData } = actions;

            // 设置全局数据
            setGlobalData({
                enableAnalytics: options.enableAnalytics ?? true,
                trackingId: options.trackingId ?? '',
                pluginVersion: '1.0.0',
            });

            console.log('✅ Blog Analytics Plugin: Content loaded');
        },

        getClientModules() {
            // 返回客户端模块
            return [];
        },

        injectHtmlTags() {
            // 注入自定义 HTML 标签
            if (options.enableAnalytics && options.trackingId) {
                return {
                    headTags: [
                        {
                            tagName: 'script',
                            attributes: {
                                async: true,
                                src: `https://www.googletagmanager.com/gtag/js?id=${options.trackingId}`,
                            },
                        },
                        {
                            tagName: 'script',
                            innerHTML: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${options.trackingId}');
              `,
                        },
                    ],
                };
            }
            return {};
        },

        getPathsToWatch() {
            // 监听文件变化
            return ['blog/**/*.{md,mdx}'];
        },

        async postBuild({ outDir }) {
            // 构建后处理
            console.log(`🎉 Blog Analytics Plugin: Build completed at ${outDir}`);
        },
    };
}

export { blogAnalyticsPlugin };
