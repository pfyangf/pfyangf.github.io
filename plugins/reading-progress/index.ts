import type { Plugin, LoadContext } from '@docusaurus/types';

/**
 * 阅读进度条插件
 * 在博客文章页面顶部显示阅读进度条
 */

export interface ReadingProgressPluginOptions {
    color?: string;
    height?: string;
}

export default function readingProgressPlugin(
    context: LoadContext,
    options: ReadingProgressPluginOptions
): Plugin<void> {
    return {
        name: 'docusaurus-plugin-reading-progress',

        getClientModules() {
            return [require.resolve('./reading-progress-client')];
        },

        injectHtmlTags() {
            return {
                headTags: [
                    {
                        tagName: 'style',
                        innerHTML: `
              #reading-progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                height: ${options.height || '3px'};
                background: ${options.color || 'linear-gradient(90deg, #2e8555, #25c2a0)'};
                z-index: 9999;
                transition: width 0.1s ease;
              }
            `,
                    },
                ],
            };
        },
    };
}

export { readingProgressPlugin };
