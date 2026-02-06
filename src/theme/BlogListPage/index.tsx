import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import SearchMetadata from '@theme/SearchMetadata';
import type { Props } from '@theme/BlogListPage';
import BlogPostItems from '@theme/BlogPostItems';
import Hero from '@site/src/components/Hero';
import Link from '@docusaurus/Link';

function BlogListPageMetadata(props: Props): JSX.Element {
    const { metadata } = props;
    return (
        <>
            <PageMetadata
                title="The Immunefi Blog - Web3 Security Research"
                description="Your source of news for the Security OS for the onchain economy. Expert analysis on blockchain vulnerabilities and smart contract security."
            />
            <SearchMetadata tag="blog_posts_list" />
        </>
    );
}

function BlogListPageContent(props: Props): JSX.Element {
    const { metadata, items: initialItems, sidebar } = props;
    const [displayedItems, setDisplayedItems] = useState(initialItems.slice(1, 7)); // 从第二篇开始
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialItems.length > 7);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 6;
    const firstItem = initialItems[0]; // 第一篇文章

    // Infinite scroll logic
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading) {
                    loadMore();
                }
            },
            { threshold: 0.1 }
        );

        const currentLoader = loaderRef.current;
        if (currentLoader) {
            observer.observe(currentLoader);
        }

        return () => {
            if (currentLoader) {
                observer.unobserve(currentLoader);
            }
        };
    }, [hasMore, loading, page]);

    const loadMore = () => {
        setLoading(true);

        // Simulate loading delay for smooth UX
        setTimeout(() => {
            const nextPage = page + 1;
            const startIndex = nextPage * ITEMS_PER_PAGE + 1; // +1 因为第一篇单独显示
            const endIndex = startIndex + ITEMS_PER_PAGE;
            const newItems = initialItems.slice(startIndex, endIndex);

            if (newItems.length > 0) {
                setDisplayedItems(prev => [...prev, ...newItems]);
                setPage(nextPage);
                setHasMore(endIndex < initialItems.length);
            } else {
                setHasMore(false);
            }

            setLoading(false);
        }, 500);
    };

    // 标签列表数据
    const tags = [
        { name: 'Announcements', path: '/tags/announcements' },
        { name: 'Bug Fix Reviews', path: '/tags/bug-fix-reviews' },
        { name: 'Customers', path: '/tags/customers' },
        { name: 'Whitehat Spotlight', path: '/tags/whitehat-spotlight' },
        { name: 'Security Guides', path: '/tags/security-guides' },
    ];

    return (
        <BlogLayout>
            <Hero />
            <div className="container margin-vert--lg">
                {/* 第一篇文章 - 特殊展示 */}
                {firstItem && (
                    <div className="featured-post-wrapper">
                        <BlogPostItems items={[firstItem]} />

                        {/* 分割线 */}
                        <div className="featured-divider">
                            <div className="divider-line"></div>
                            <div className="divider-line"></div>
                        </div>

                        {/* CONTINUE EXPLORING 标题 */}
                        <h2 className="continue-exploring">CONTINUE EXPLORING</h2>
                    </div>
                )}

                {/* 其他文章 - 左右布局 */}
                <div className="row">
                    {/* 左侧：博客列表 (8列) */}
                    <div className="col col--8">
                        <BlogPostItems items={displayedItems} />

                        {/* Loading indicator */}
                        <div ref={loaderRef} style={{ padding: '2rem', textAlign: 'center' }}>
                            {loading && (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                    <p style={{ marginTop: '1rem', color: 'var(--ifm-color-emphasis-600)' }}>
                                        Loading more articles...
                                    </p>
                                </div>
                            )}

                            {!hasMore && displayedItems.length > 0 && (
                                <p style={{
                                    color: 'var(--ifm-color-emphasis-600)',
                                    fontSize: '0.95rem',
                                    fontStyle: 'italic'
                                }}>
                                    🎉 You've reached the end! Check back soon for more security research.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 右侧：标签列表 (4列) */}
                    <div className="col col--4">
                        <div className="tags-sidebar">
                            <h3 className="tags-sidebar-title">CONTINUE EXPLORING</h3>
                            <ul className="tags-list">
                                {tags.map((tag, idx) => (
                                    <li key={idx}>
                                        <Link to={tag.path} className="tag-link">
                                            {tag.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>

                            <div className="follow-section">
                                <h3 className="tags-sidebar-title">FOLLOW OUR JOURNEY</h3>
                                <div className="email-subscribe">
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        className="email-input"
                                    />
                                    <button className="subscribe-button">+ Subscribe</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .featured-post-wrapper {
          margin-bottom: 3rem;
        }

        .featured-post-wrapper article {
          max-width: 100%;
        }

        .featured-divider {
          display: flex;
          align-items: center;
          margin: 3rem 0 2rem 0;
          gap: 1rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: var(--ifm-color-emphasis-300);
        }

        .continue-exploring {
          color: var(--ifm-color-emphasis-700);
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          text-transform: uppercase;
        }

        /* 标签侧边栏样式 */
        .tags-sidebar {
          position: sticky;
          top: 2rem;
        }

        .tags-sidebar-title {
          color: var(--ifm-color-emphasis-700);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          text-transform: uppercase;
        }

        .tags-list {
          list-style: none;
          padding: 0;
          margin: 0 0 2rem 0;
        }

        .tags-list li {
          margin-bottom: 0.75rem;
        }

        .tag-link {
          color: var(--ifm-color-emphasis-900);
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .tag-link:hover {
          color: var(--ifm-color-primary);
        }

        .follow-section {
          margin-top: 3rem;
        }

        .email-subscribe {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .email-input {
          padding: 0.75rem;
          border: 1px solid var(--ifm-color-emphasis-300);
          border-radius: 4px;
          font-size: 0.9rem;
          background: var(--ifm-background-color);
          color: var(--ifm-color-emphasis-900);
        }

        .email-input:focus {
          outline: none;
          border-color: var(--ifm-color-primary);
        }

        .subscribe-button {
          padding: 0.75rem 1.5rem;
          background: var(--ifm-color-primary);
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .subscribe-button:hover {
          background: var(--ifm-color-primary-dark);
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid var(--ifm-color-emphasis-200);
          border-top-color: var(--ifm-color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* 响应式设计 */
        @media (max-width: 996px) {
          .tags-sidebar {
            position: static;
            margin-top: 3rem;
          }
        }
      `}</style>
        </BlogLayout>
    );
}

export default function BlogListPage(props: Props): JSX.Element {
    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogListPage,
            )}>
            <BlogListPageMetadata {...props} />
            <BlogListPageContent {...props} />
        </HtmlClassNameProvider>
    );
}
