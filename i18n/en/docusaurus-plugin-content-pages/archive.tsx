import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

interface BlogPost {
    id: string;
    metadata: {
        title: string;
        permalink: string;
        date: string;
        formattedDate: string;
        tags: Array<{ label: string; permalink: string }>;
        authors: Array<{ name: string }>;
    };
}

interface YearGroup {
    year: string;
    posts: BlogPost[];
}

export default function Archive(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();

    // Get all blog posts
    const blogData = usePluginData('docusaurus-plugin-content-blog', 'default') as {
        blogPosts: BlogPost[];
    };

    // Group by year
    const postsByYear: YearGroup[] = React.useMemo(() => {
        const groups = new Map<string, BlogPost[]>();

        blogData.blogPosts.forEach((post) => {
            const year = new Date(post.metadata.date).getFullYear().toString();
            if (!groups.has(year)) {
                groups.set(year, []);
            }
            groups.get(year)!.push(post);
        });

        // Convert to array and sort by year descending
        return Array.from(groups.entries())
            .map(([year, posts]) => ({ year, posts }))
            .sort((a, b) => parseInt(b.year) - parseInt(a.year));
    }, [blogData.blogPosts]);

    return (
        <Layout
            title="Blog Archive"
            description="All blog posts organized by time">
            <main className="container margin-vert--lg">
                <div className="row">
                    <div className="col col--8 col--offset-2">
                        <h1>📚 Blog Archive</h1>
                        <p className="margin-bottom--lg">
                            Total {blogData.blogPosts.length} posts
                        </p>

                        {postsByYear.map(({ year, posts }) => (
                            <div key={year} className="margin-bottom--xl">
                                <h2 className="archive-year">{year}</h2>
                                <div className="archive-posts">
                                    {posts.map((post) => (
                                        <div key={post.id} className="archive-post-item">
                                            <div className="archive-post-date">
                                                {new Date(post.metadata.date).toLocaleDateString('en-US', {
                                                    month: '2-digit',
                                                    day: '2-digit',
                                                })}
                                            </div>
                                            <div className="archive-post-content">
                                                <Link
                                                    to={post.metadata.permalink}
                                                    className="archive-post-title">
                                                    {post.metadata.title}
                                                </Link>
                                                <div className="archive-post-tags">
                                                    {post.metadata.tags.map((tag) => (
                                                        <Link
                                                            key={tag.permalink}
                                                            to={tag.permalink}
                                                            className="tag">
                                                            {tag.label}
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <style>{`
        .archive-year {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: var(--ifm-color-primary);
          border-bottom: 3px solid var(--ifm-color-primary);
          padding-bottom: 0.5rem;
        }
        
        .archive-posts {
          margin-left: 1rem;
        }
        
        .archive-post-item {
          display: flex;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--ifm-color-emphasis-200);
        }
        
        .archive-post-item:last-child {
          border-bottom: none;
        }
        
        .archive-post-date {
          flex-shrink: 0;
          width: 60px;
          font-size: 0.875rem;
          color: var(--ifm-color-emphasis-600);
          font-weight: 500;
        }
        
        .archive-post-content {
          flex: 1;
        }
        
        .archive-post-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--ifm-font-color-base);
          text-decoration: none;
          display: block;
          margin-bottom: 0.5rem;
          transition: color 0.2s ease;
        }
        
        .archive-post-title:hover {
          color: var(--ifm-color-primary);
        }
        
        .archive-post-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        @media (max-width: 768px) {
          .archive-post-item {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .archive-post-date {
            width: auto;
          }
        }
      `}</style>
        </Layout>
    );
}
