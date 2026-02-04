import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';
import type BlogPostItemType from '@theme/BlogPostItem';
import type { WrapperProps } from '@docusaurus/types';

type Props = WrapperProps<typeof BlogPostItemType>;

/**
 * 自定义博客文章组件包装器
 * 这是一个 Wrap 模式的 Swizzle 组件示例
 * 在原有组件基础上添加自定义功能
 */
export default function BlogPostItemWrapper(props: Props): JSX.Element {
    return (
        <>
            <BlogPostItem {...props} />
            {/* 可以在这里添加自定义内容，例如评论系统 */}
            {props.children && (
                <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid var(--ifm-color-emphasis-200)' }}>
                    {/* 这里可以添加 Giscus 评论系统或其他自定义内容 */}
                </div>
            )}
        </>
    );
}
