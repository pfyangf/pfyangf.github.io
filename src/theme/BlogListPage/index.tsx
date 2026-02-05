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

function BlogListPageMetadata(props: Props): JSX.Element {
    const { metadata } = props;
    return (
        <>
            <PageMetadata
                title="AutoSec - Web3 Security Research & Blockchain Vulnerability Analysis"
                description="Leading Web3 security research platform. Expert analysis on blockchain vulnerabilities, smart contract audits, DeFi security, and cryptocurrency protection."
            />
            <SearchMetadata tag="blog_posts_list" />
        </>
    );
}

function BlogListPageContent(props: Props): JSX.Element {
    const { metadata, items: initialItems, sidebar } = props;
    const [displayedItems, setDisplayedItems] = useState(initialItems.slice(0, 6));
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialItems.length > 6);
    const [loading, setLoading] = useState(false);
    const loaderRef = useRef<HTMLDivElement>(null);

    const ITEMS_PER_PAGE = 6;

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
            const startIndex = nextPage * ITEMS_PER_PAGE;
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

    return (
        <BlogLayout sidebar={sidebar}>
            <Hero />
            <div className="container margin-vert--lg">
                <div className="row">
                    <div className="col col--12">
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
                </div>
            </div>

            <style>{`
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
