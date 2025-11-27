import React from 'react';
import { BLOG_POSTS, buildBlogPostHref, type BlogPost } from '@/data/blogPosts';

const BLOG_POST_LOOKUP = BLOG_POSTS.reduce<Record<string, BlogPost>>((acc, blogPost) => {
  acc[blogPost.slug] = blogPost;
  return acc;
}, {});

export const blogHighlightLinkClass =
  'text-[#ff2f87] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';

const normalizeSlug = (value?: string) =>
  value?.replace(/^\/?blog\//i, '').replace(/^\//, '').replace(/\/$/, '') || '';

const splitTrailingPunctuation = (href?: string) => {
  if (!href?.startsWith('http')) {
    return { href, trailing: '' };
  }

  const match = href.match(/[),.!?;:]+$/);
  if (!match) {
    return { href, trailing: '' };
  }

  return {
    href: href.slice(0, -match[0].length),
    trailing: match[0]
  };
};

const linkRegex =
  /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/?blog\/[A-Za-z0-9-]+)\)|\[\[([^[\]]+)\]\]|(https?:\/\/[^\s]+)|(?<!\S)(\/?blog\/[A-Za-z0-9-]+)(?=[\s.,!?;:]|$)/gi;

export const renderTextWithLinks = (text: string) => {
  const segments: Array<string | React.ReactElement> = [];
  let lastIndex = 0;

  text.replace(
    linkRegex,
    (match, markdownLabel, markdownTarget, slugToken, urlMatch, relativeBlogPath, offset) => {
      if (offset > lastIndex) {
        segments.push(text.slice(lastIndex, offset));
      }

      const normalizedSlug =
        normalizeSlug(slugToken?.trim()) ||
        normalizeSlug(markdownTarget) ||
        normalizeSlug(relativeBlogPath);

      const linkedPost = normalizedSlug ? BLOG_POST_LOOKUP[normalizedSlug] : undefined;
      const blogHref = normalizedSlug ? buildBlogPostHref(normalizedSlug) : undefined;

      let href: string | undefined;

      if (markdownTarget?.startsWith('http') || urlMatch?.startsWith('http')) {
        href = markdownTarget || urlMatch;
      } else if (linkedPost) {
        href = buildBlogPostHref(linkedPost.slug);
      } else if (markdownTarget) {
        href = markdownTarget;
      } else if (relativeBlogPath) {
        href = relativeBlogPath.startsWith('/') ? relativeBlogPath : `/${relativeBlogPath}`;
      } else if (blogHref) {
        href = blogHref;
      } else {
        href = match;
      }

      const { href: cleanedHref, trailing } = splitTrailingPunctuation(href);
      const finalHref = cleanedHref || href || match;
      const label =
        markdownLabel ||
        (slugToken ? linkedPost?.title || slugToken : linkedPost?.title) ||
        finalHref;

      const isExternal = finalHref.startsWith('http');

      segments.push(
        <a
          href={finalHref}
          className={blogHighlightLinkClass}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          {label}
        </a>
      );

      if (trailing) {
        segments.push(trailing);
      }

      lastIndex = offset + match.length;
      return match;
    }
  );

  if (lastIndex < text.length) {
    segments.push(text.slice(lastIndex));
  }

  return segments.map((segment, index) =>
    typeof segment === 'string' ? (
      <React.Fragment key={`text-${index}`}>{segment}</React.Fragment>
    ) : (
      React.cloneElement(segment, { key: `link-${index}` })
    )
  );
};
