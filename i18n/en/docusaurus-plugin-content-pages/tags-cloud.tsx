import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { usePluginData } from '@docusaurus/useGlobalData';

interface Tag {
    label: string;
    permalink: string;
    count: number;
}

export default function TagCloud(): JSX.Element {
    const blogData = usePluginData('docusaurus-plugin-content-blog', 'default') as {
        blogTags: Record<string, { label: string; permalink: string; count: number }>;
    };

    // Convert tag data and sort by post count
    const tags: Tag[] = React.useMemo(() => {
        return Object.values(blogData.blogTags)
            .sort((a, b) => b.count - a.count);
    }, [blogData.blogTags]);

    // Calculate tag font size (based on post count)
    const getTagSize = (count: number): number => {
        const maxCount = Math.max(...tags.map(t => t.count));
        const minCount = Math.min(...tags.map(t => t.count));
        const minSize = 0.875; // rem
        const maxSize = 2.5; // rem

        if (maxCount === minCount) return (minSize + maxSize) / 2;

        return minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    };

    // Calculate tag color (based on post count)
    const getTagColor = (count: number): string => {
        const maxCount = Math.max(...tags.map(t => t.count));
        const ratio = count / maxCount;

        if (ratio > 0.7) return 'var(--ifm-color-primary-darkest)';
        if (ratio > 0.4) return 'var(--ifm-color-primary-dark)';
        if (ratio > 0.2) return 'var(--ifm-color-primary)';
        return 'var(--ifm-color-primary-light)';
    };

    return (
        <Layout
            title="Tag Cloud"
            description="Tag cloud weighted by post count">
            <main className="container margin-vert--lg">
                <div className="row">
                    <div className="col col--10 col--offset-1">
                        <h1>🏷️ Tag Cloud</h1>
                        <p className="margin-bottom--lg">
                            {tags.length} tags, {Object.values(blogData.blogTags).reduce((sum, tag) => sum + tag.count, 0)} posts
                        </p>

                        <div className="tag-cloud-container">
                            {tags.map((tag) => (
                                <Link
                                    key={tag.permalink}
                                    to={tag.permalink}
                                    className="tag-cloud-item"
                                    style={{
                                        fontSize: `${getTagSize(tag.count)}rem`,
                                        color: getTagColor(tag.count),
                                    }}>
                                    {tag.label}
                                    <span className="tag-count">({tag.count})</span>
                                </Link>
                            ))}
                        </div>

                        <div className="margin-top--xl">
                            <h2>📊 Tag Statistics</h2>
                            <div className="tag-stats">
                                {tags.map((tag, index) => (
                                    <div key={tag.permalink} className="tag-stat-item">
                                        <span className="tag-stat-rank">#{index + 1}</span>
                                        <Link to={tag.permalink} className="tag-stat-name">
                                            {tag.label}
                                        </Link>
                                        <div className="tag-stat-bar-container">
                                            <div
                                                className="tag-stat-bar"
                                                style={{
                                                    width: `${(tag.count / Math.max(...tags.map(t => t.count))) * 100}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="tag-stat-count">{tag.count} posts</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style>{`
        .tag-cloud-container {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, 
            var(--ifm-color-emphasis-100) 0%, 
            var(--ifm-color-emphasis-200) 100%);
          border-radius: var(--ifm-global-radius);
          margin-bottom: 2rem;
        }
        
        .tag-cloud-item {
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .tag-cloud-item:hover {
          transform: scale(1.1);
          background-color: var(--ifm-color-emphasis-200);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .tag-count {
          font-size: 0.75rem;
          opacity: 0.7;
          font-weight: 400;
        }
        
        .tag-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .tag-stat-item {
          display: grid;
          grid-template-columns: 40px 150px 1fr 80px;
          gap: 1rem;
          align-items: center;
          padding: 0.75rem;
          border-radius: var(--ifm-global-radius);
          transition: background-color 0.2s ease;
        }
        
        .tag-stat-item:hover {
          background-color: var(--ifm-color-emphasis-100);
        }
        
        .tag-stat-rank {
          font-weight: 700;
          color: var(--ifm-color-emphasis-600);
          text-align: center;
        }
        
        .tag-stat-name {
          font-weight: 600;
          color: var(--ifm-font-color-base);
          text-decoration: none;
        }
        
        .tag-stat-name:hover {
          color: var(--ifm-color-primary);
        }
        
        .tag-stat-bar-container {
          height: 8px;
          background-color: var(--ifm-color-emphasis-200);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .tag-stat-bar {
          height: 100%;
          background: linear-gradient(90deg, 
            var(--ifm-color-primary-light), 
            var(--ifm-color-primary));
          transition: width 0.3s ease;
        }
        
        .tag-stat-count {
          font-size: 0.875rem;
          color: var(--ifm-color-emphasis-600);
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .tag-cloud-container {
            gap: 1rem;
            padding: 2rem 1rem;
          }
          
          .tag-stat-item {
            grid-template-columns: 30px 1fr 60px;
            gap: 0.5rem;
          }
          
          .tag-stat-bar-container {
            grid-column: 1 / -1;
          }
        }
      `}</style>
        </Layout>
    );
}
