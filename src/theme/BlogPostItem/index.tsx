import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import { useBlogPost } from '@docusaurus/plugin-content-blog/client';
import BlogPostItemContainer from '@theme/BlogPostItem/Container';
import BlogPostItemHeader from '@theme/BlogPostItem/Header';
import BlogPostItemContent from '@theme/BlogPostItem/Content';
import BlogPostItemFooter from '@theme/BlogPostItem/Footer';
import type { Props } from '@theme/BlogPostItem';

// apply a bottom margin in list view
function useContainerClassName() {
  const { isBlogPostPage } = useBlogPost();
  return !isBlogPostPage ? 'margin-bottom--xl' : undefined;
}

export default function BlogPostItem({ children, className }: Props): ReactNode {
  const containerClassName = useContainerClassName();
  const { metadata, isBlogPostPage } = useBlogPost();
  const { frontMatter } = metadata;

  // 如果是列表页，使用自定义布局
  if (!isBlogPostPage) {
    const hasImage = frontMatter.image;

    return (
      <BlogPostItemContainer className={clsx(containerClassName, className)}>
        <div style={{
          display: 'flex',
          flexDirection: hasImage ? 'row' : 'column',
          gap: hasImage ? '1.5rem' : '0'
        }}>
          {/* 左侧图片 (40%) */}
          {hasImage && (
            <div style={{
              flex: '0 0 40%',
              overflow: 'hidden',
              borderRadius: '8px'
            }}>
              <img
                src={frontMatter.image}
                alt={metadata.title}
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '200px',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
            </div>
          )}

          {/* 右侧内容 (60%) */}
          <div style={{
            flex: hasImage ? '0 0 60%' : '1',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <BlogPostItemHeader />
            <BlogPostItemContent>{children}</BlogPostItemContent>
            <BlogPostItemFooter />
          </div>
        </div>
      </BlogPostItemContainer>
    );
  }

  // 详情页保持原样
  return (
    <BlogPostItemContainer className={clsx(containerClassName, className)}>
      <BlogPostItemHeader />
      <BlogPostItemContent>{children}</BlogPostItemContent>
      <BlogPostItemFooter />
    </BlogPostItemContainer>
  );
}
