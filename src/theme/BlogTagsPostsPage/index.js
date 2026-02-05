import React from 'react';
import clsx from 'clsx';
import {
    PageMetadata,
    HtmlClassNameProvider,
    ThemeClassNames,
} from '@docusaurus/theme-common';
import { useBlogTagsPostsPageTitle } from '@docusaurus/theme-common/internal';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import Unlisted from '@theme/ContentVisibility/Unlisted';
import Heading from '@theme/Heading';

function BlogTagsPostsPageMetadata({ tag }) {
    const title = useBlogTagsPostsPageTitle(tag);
    return (
        <>
            <PageMetadata title={title} description={tag.description} />
            <SearchMetadata tag="blog_tags_posts" />
        </>
    );
}

function BlogTagsPostsPageContent({ tag, items, sidebar, listMetadata }) {
    // 将标签名称首字母大写
    const formatTagName = (tagLabel) => {
        return tagLabel
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const displayTitle = formatTagName(tag.label);

    return (
        <BlogLayout>
            {tag.unlisted && <Unlisted />}
            <header className="margin-bottom--xl" style={{ textAlign: 'center' }}>
                <Heading as="h1">{displayTitle}</Heading>
                {tag.description && <p>{tag.description}</p>}
            </header>
            <BlogPostItems items={items} />
            <BlogListPaginator metadata={listMetadata} />
        </BlogLayout>
    );
}

export default function BlogTagsPostsPage(props) {
    return (
        <HtmlClassNameProvider
            className={clsx(
                ThemeClassNames.wrapper.blogPages,
                ThemeClassNames.page.blogTagPostListPage,
            )}>
            <BlogTagsPostsPageMetadata {...props} />
            <BlogTagsPostsPageContent {...props} />
        </HtmlClassNameProvider>
    );
}
