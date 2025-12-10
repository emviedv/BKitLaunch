import React from 'react';
import {
  BLOG_POSTS,
  buildBlogPostHref,
  findBlogPostBySlug,
  type BlogContentBlock,
  type BlogFAQ,
  type BlogPost
} from '@/data/blogPosts';
import { LANDING_WAITLIST_PATH } from '@/config/sectionAnchors';
import LandingHero, { type LandingHeroContent } from './LandingHero';
import { Button } from '@/components/ui/button';
import { useDynamicSEO } from '@/hooks/useSEO';
import { createFAQSchema, useSchema } from '@/lib/useSchema';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';
import { debugService } from '@/lib/debugService';

interface BlogArticlePageProps {
  slug: string;
}

const blogCardHoverClass =
  'group flex h-full flex-col transition hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';

const blogImageDebugEnabled = () => {
  if (typeof process !== 'undefined') {
    const flag = process.env?.DEBUG_FIX ?? process.env?.VITE_DEBUG_FIX;
    if (typeof flag !== 'undefined') {
      return flag !== '0';
    }
  }

  if (typeof import.meta !== 'undefined') {
    const flag = (import.meta as any)?.env?.VITE_DEBUG_FIX;
    if (typeof flag !== 'undefined') {
      return flag !== '0';
    }
  }

  return false;
};

const renderListItemText = (item: string) => {
  const match = item.match(/^\s*([^:]+):\s+(.*)$/);

  if (!match) return renderTextWithLinks(item);

  const [, lead, rest] = match;

  return (
    <>
      <strong>{lead}:</strong>
      {rest ? <> {renderTextWithLinks(rest)}</> : ''}
    </>
  );
};

const renderContentBlock = (block: BlogContentBlock, index: number, postSlug?: string) => {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case 'heading': {
      const HeadingTag = block.level || 'h3';
      return (
        <HeadingTag key={key} className="text-2xl font-semibold text-white">
          {block.text}
        </HeadingTag>
      );
    }
    case 'paragraph':
      return (
        <p key={key} className="text-[20px] leading-8 font-light text-white/80">
          {renderTextWithLinks(block.text)}
        </p>
      );
    case 'orderedList':
      return (
        <div key={key} className="space-y-2">
          {block.title ? <p className="text-base font-semibold text-white">{block.title}</p> : null}
          <ol className="list-decimal space-y-2 pl-5 text-[20px] leading-8 text-white/80">
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-item-${itemIndex}`}>{renderListItemText(item)}</li>
            ))}
          </ol>
        </div>
      );
    case 'unorderedList':
      return (
        <div key={key} className="space-y-2">
          {block.title ? <p className="text-base font-semibold text-white">{block.title}</p> : null}
          <ul className="list-disc space-y-2 pl-5 text-[20px] leading-8 text-white/80">
            {block.items.map((item, itemIndex) => (
              <li key={`${key}-item-${itemIndex}`}>{renderListItemText(item)}</li>
            ))}
          </ul>
        </div>
      );
    case 'caption':
      return (
        <p key={key} className="text-sm text-white/60">
          {renderTextWithLinks(block.text)}
        </p>
      );
    case 'image':
      const resolvedAlt = block.alt?.trim() || block.caption || 'Blog illustration';
      const isExternalSrc = /^https?:\/\//.test(block.src);

      if (blogImageDebugEnabled()) {
        debugService.debug('blog:image-block', {
          slug: postSlug,
          index,
          src: block.src,
          isExternalSrc,
          hasCaption: Boolean(block.caption),
          altLength: resolvedAlt.length
        });
      }

      return (
        <figure key={key} className="space-y-3">
          <div className="overflow-hidden">
            <img
              src={block.src}
              alt={resolvedAlt}
              className="w-full object-cover"
              loading="lazy"
            />
          </div>
          {(block.caption || resolvedAlt) && (
            <figcaption className="text-sm text-slate-500">
              {block.caption || resolvedAlt}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
};

const summarizePost = (post: BlogPost | null | undefined, maxSentences = 3): string => {
  if (!post) return '';

  const candidates = [
    post.metaDescription,
    post.excerpt,
    post.content?.find((block) => block.type === 'paragraph')?.text
  ].filter((text): text is string => Boolean(text && text.trim().length > 0));

  const source = candidates.find(Boolean) || '';
  if (!source) return '';

  const sentences = source.split(/(?<=[.!?])\s+/).filter(Boolean);
  const summary = sentences.slice(0, maxSentences).join(' ').trim();
  return summary || source.trim();
};

const BlogFAQSection: React.FC<{ faqs: BlogFAQ[] }> = ({ faqs }) => {
  useSchema(createFAQSchema(faqs), 'blog-faq-schema');

  return (
    <section className="blog-faq-section mt-12">
      <div className="mx-auto w-full max-w-[680px] space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">FAQs</p>
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">Frequently Asked Questions</h2>
          <p className="text-base text-white/70">
            Quick, action-focused answers pulled from this playbook so you can apply it faster.
          </p>
        </div>
        <div className="blog-faq-list divide-y divide-white/10">
          {faqs.map((faq, index) => (
            <div key={`faq-${index}`} className="blog-faq-item py-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f871a0] via-[#b970ff] to-[#5bceff] text-sm font-bold text-white">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{faq.question}</h3>
                  <p className="text-base leading-relaxed text-white/75">
                    {renderTextWithLinks(faq.answer)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug }) => {
  const post = findBlogPostBySlug(slug);
  const pagePath = `/blog/${slug}`;
  const summary = summarizePost(post);
  const postIndex = BLOG_POSTS.findIndex((entry) => entry.slug === slug);
  const previousPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;
  const relatedPosts = BLOG_POSTS.filter((candidate) => candidate.slug !== slug).slice(0, 3);

  useDynamicSEO(
    pagePath,
    post
      ? {
          title: post.title,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription ?? post.excerpt,
          description: post.excerpt,
          ogImage: post.heroImage,
          ogImageAlt: post.heroImageAlt
        }
      : undefined
  );

  const heroDescription = summary ? renderTextWithLinks(summary) : null;

  const resolvedHero: LandingHeroContent = post
    ? {
        badgeLabel: `${post.category} • ${post.readingTime}`,
        title: post.title,
        subtitle: null,
        description: post.slug === 'remove-prototype-links-in-figma' ? null : heroDescription,
        align: 'left',
        primaryButton: null,
        primaryButtonLink: null,
        secondaryButton: null,
        secondaryButtonLink: null,
      }
    : {
        badgeLabel: 'Blog',
        title: 'We couldn’t find that article',
        subtitle: 'Scan the latest playbooks and keep shipping.',
        description:
          'Browse the newest rituals, audits, and cleanup scripts designers use to move faster with BiblioKit.',
        primaryButton: 'Return to blog',
        primaryButtonLink: '/blog',
        secondaryButton: 'Join Designers shipping faster with BiblioKit',
        secondaryButtonLink: LANDING_WAITLIST_PATH,
      };

  if (!post) {
    return (
      <div className="bg-gradient-to-b from-white via-slate-50 to-slate-100/60 text-foreground">
        <LandingHero hero={resolvedHero} compact />
        <section className="section-content pb-16">
          <div className="mx-auto max-w-3xl rounded-[28px] border border-slate-200/70 bg-white/80 p-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-base text-muted-foreground">
              The post you’re looking for might be draft-only. Jump back to the playbook list to keep momentum.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg">
                <a href="/blog">Return to blog</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={LANDING_WAITLIST_PATH}>Join Designers shipping faster with BiblioKit</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-[#0b0816] text-white">
      <LandingHero hero={resolvedHero} compact />
      <article className="section-content pb-20 pt-6">
        <div className="mx-auto w-full max-w-[680px] space-y-8 rounded-[32px] px-0 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur text-white">
          {post.content ? (
            <div className="space-y-6">
              {post.content.map((block, index) => renderContentBlock(block, index, post.slug))}
            </div>
          ) : (
            <p className="text-lg leading-[1.8] text-white/80">
              {renderTextWithLinks(post.excerpt)}
            </p>
          )}
        </div>
        {post.faqs?.length ? <BlogFAQSection faqs={post.faqs} /> : null}
        {(previousPost || nextPost) && (
          <section className="blog-article-nav mt-12 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                  Next & previous
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {previousPost ? (
                <a
                  href={buildBlogPostHref(previousPost.slug)}
                  className={blogCardHoverClass}
                  aria-label={`Read the previous article: ${previousPost.title}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Before</p>
                  <p className="mt-1 text-lg font-normal text-[#ffb3d4]">
                    {previousPost.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-white/70">
                    {renderTextWithLinks(summarizePost(previousPost, 2) || previousPost.excerpt)}
                  </p>
                  <p className="mt-2 text-xs text-white/60">
                    {previousPost.category} • {previousPost.readingTime}
                  </p>
                </a>
              ) : null}
              {nextPost ? (
                <a
                  href={buildBlogPostHref(nextPost.slug)}
                  className={blogCardHoverClass}
                  aria-label={`Read the next article: ${nextPost.title}`}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Next</p>
                  <p className="mt-1 text-lg font-normal text-[#ffb3d4]">
                    {nextPost.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-white/70">
                    {renderTextWithLinks(summarizePost(nextPost, 2) || nextPost.excerpt)}
                  </p>
                  <p className="mt-2 text-xs text-white/60">
                    {nextPost.category} • {nextPost.readingTime}
                  </p>
                </a>
              ) : null}
            </div>
          </section>
        )}
        {relatedPosts.length > 0 && (
          <section className="blog-article-related mt-10 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Related articles</p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <a
                  key={`related-${relatedPost.slug}`}
                  href={buildBlogPostHref(relatedPost.slug)}
                  className={blogCardHoverClass}
                  aria-label={`Read related article: ${relatedPost.title}`}
                >
                  <p className="mt-1 text-lg font-normal text-[#ffb3d4]">
                    {relatedPost.title}
                  </p>
                  <p className="mt-2 line-clamp-3 text-sm text-white/70">
                    {renderTextWithLinks(summarizePost(relatedPost, 2) || relatedPost.excerpt)}
                  </p>
                  <p className="mt-2 text-xs text-white/60">
                    {relatedPost.category} • {relatedPost.readingTime}
                  </p>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
};

export default BlogArticlePage;
