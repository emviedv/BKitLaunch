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
import { ROUTE_PATHS } from '@/config/routes';
import LandingHero, { type LandingHeroContent } from './LandingHero';
import { Button } from '@/components/ui/button';
import { useDynamicSEO } from '@/hooks/useSEO';
import { createFAQSchema, useSchema } from '@/lib/useSchema';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';
import { debugService } from '@/lib/debugService';
import FAQList from '@/components/FAQList';
import { getImageDimensions } from '@/lib/imageDimensions';

interface BlogArticlePageProps {
  slug: string;
}

const blogCardHoverClass =
  'group flex h-full flex-col transition hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';
const BLOG_HERO_TITLE_CLASS =
  'text-4xl sm:text-5xl md:text-6xl font-sans font-extrabold leading-[1.1] tracking-normal sm:tracking-[-0.01em] text-white';
const BLOG_HERO_CONTENT_WIDTH_CLASS = 'w-full max-w-[70%]';
const BLOG_HERO_TITLE_CLAMP_LINES = 4;
const BLOG_HERO_DESCRIPTION_WIDTH_CLASS = 'max-w-full';
const BLOG_CARD_IMAGE_CLASS = 'h-[140px] w-full object-cover';
const BLOG_CARD_IMAGE_WRAPPER_CLASS = 'mb-4 overflow-hidden rounded-lg bg-white/10';

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

const renderContentBlock = (block: BlogContentBlock, index: number, postSlug?: string, firstImageIndex = -1) => {
  const key = `${block.type}-${index}`;

  switch (block.type) {
    case 'heading': {
      const headingLevel = (block.level || 'h3').toLowerCase();
      const HeadingTag = headingLevel as keyof JSX.IntrinsicElements;
      const headingSizeClasses =
        headingLevel === 'h2'
          ? 'text-3xl sm:text-4xl'
          : headingLevel === 'h3'
            ? 'text-2xl sm:text-3xl'
            : 'text-xl sm:text-2xl';
      return (
        <HeadingTag key={key} className={`${headingSizeClasses} font-semibold text-white`}>
          {renderTextWithLinks(block.text)}
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
    case 'image': {
      const resolvedAlt = block.alt?.trim() || block.caption || 'Blog illustration';
      const isExternalSrc = /^https?:\/\//.test(block.src);
      const imageDimensions = getImageDimensions(block.src);
      const isFirstImage = index === firstImageIndex;

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
              width={imageDimensions?.width}
              height={imageDimensions?.height}
              loading={isFirstImage ? 'eager' : 'lazy'}
              fetchPriority={isFirstImage ? 'high' : undefined}
              decoding="async"
            />
          </div>
          {(block.caption || resolvedAlt) && (
            <figcaption className="text-sm italic text-slate-500">
              {block.caption || resolvedAlt}
            </figcaption>
          )}
        </figure>
      );
    }
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

const dropFirstSentence = (text: string): string => {
  const trimmed = text.trim();
  if (!trimmed) return '';

  const sentences = trimmed.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= 1) {
    return trimmed;
  }

  const firstSentence = sentences[0] ?? '';
  const isGenericLead = /^(BiblioKit|ComponentQA|BiblioClean|RenameVariantsAI|FixTable|BiblioStart|StateBuilder|BiblioScale|BiblioUX|UXBiblio|BiblioMotion|BiblioAttach)\b/i
    .test(firstSentence.trim());
  if (!isGenericLead) {
    return trimmed;
  }

  return sentences.slice(1).join(' ').trim();
};

const renderCardImage = (post: BlogPost) => {
  if (!post?.heroImage) return null;

  const imageDimensions = getImageDimensions(post.heroImage);
  const imageAlt = post.heroImageAlt?.trim() || `${post.title} illustration`;

  return (
    <div className={BLOG_CARD_IMAGE_WRAPPER_CLASS}>
      <img
        src={post.heroImage}
        alt={imageAlt}
        className={BLOG_CARD_IMAGE_CLASS}
        width={imageDimensions?.width}
        height={imageDimensions?.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
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
        <FAQList faqs={faqs} />
      </div>
    </section>
  );
};

const BlogArticlePage: React.FC<BlogArticlePageProps> = ({ slug }) => {
  const post = findBlogPostBySlug(slug);
  const pagePath = `/blog/${slug}`;
  const summary = summarizePost(post);
  const heroSummary = summary ? dropFirstSentence(summary) : '';
  const postIndex = BLOG_POSTS.findIndex((entry) => entry.slug === slug);
  const previousPost = postIndex > 0 ? BLOG_POSTS[postIndex - 1] : null;
  const nextPost = postIndex >= 0 && postIndex < BLOG_POSTS.length - 1 ? BLOG_POSTS[postIndex + 1] : null;
  const firstImageIndex = post?.content ? post.content.findIndex((block) => block.type === 'image') : -1;
  const relatedPosts: BlogPost[] = [];
  if (post && postIndex >= 0 && BLOG_POSTS.length > 1) {
    const seen = new Set([slug]);
    const addRelatedPost = (offset: number) => {
      const candidate = BLOG_POSTS[(postIndex + offset) % BLOG_POSTS.length];
      if (!candidate || seen.has(candidate.slug)) return;
      seen.add(candidate.slug);
      relatedPosts.push(candidate);
    };

    for (let offset = 2; offset <= BLOG_POSTS.length - 2 && relatedPosts.length < 3; offset += 1) {
      addRelatedPost(offset);
    }

    for (let offset = 1; offset < BLOG_POSTS.length && relatedPosts.length < 3; offset += 1) {
      addRelatedPost(offset);
    }
  }

  useDynamicSEO(
    pagePath,
    post
      ? {
          slug: post.slug,
          title: post.title,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription ?? post.excerpt,
          description: post.excerpt,
          ogImage: post.heroImage,
          ogImageAlt: post.heroImageAlt
        }
      : undefined
  );

  const heroDescription = heroSummary ? renderTextWithLinks(heroSummary) : null;
  const updatedDate =
    (post as any)?.lastUpdated ||
    (post as any)?.updatedAt ||
    new Date().toISOString().split('T')[0];

  const resolvedHero: LandingHeroContent = post
    ? {
        badgeLabel: `${post.category} • ${post.readingTime}`,
        title: post.title,
        subtitle: null,
        description: post.slug === 'remove-prototype-links-in-figma' ? null : heroDescription,
        align: 'center',
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
        <LandingHero
          hero={resolvedHero}
          compact
          titleClassName={BLOG_HERO_TITLE_CLASS}
          contentMaxWidthClassName={BLOG_HERO_CONTENT_WIDTH_CLASS}
          titleClampLines={BLOG_HERO_TITLE_CLAMP_LINES}
          descriptionMaxWidthClassName={BLOG_HERO_DESCRIPTION_WIDTH_CLASS}
          descriptionClassName="text-[1.4rem]"
          disableCursorEffects
        />
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
    <div className="landing-sections-gradient text-white min-h-screen">
      <div className="blog-hero">
        <LandingHero
          hero={resolvedHero}
          compact
          titleClassName={BLOG_HERO_TITLE_CLASS}
          contentMaxWidthClassName={BLOG_HERO_CONTENT_WIDTH_CLASS}
          titleClampLines={BLOG_HERO_TITLE_CLAMP_LINES}
          descriptionMaxWidthClassName={BLOG_HERO_DESCRIPTION_WIDTH_CLASS}
          descriptionClassName="text-[1.4rem]"
          disableCursorEffects
        />
      </div>
      <article className="section-content pb-20 pt-6">
        <div className="mx-auto w-full max-w-[780px] mb-4 flex items-start">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/80">
            Updated {updatedDate}
          </span>
        </div>
        <div className="mx-auto w-full max-w-[780px] space-y-8 text-white">
          {post.content ? (
            <div className="space-y-6">
              {post.content.map((block, index) => renderContentBlock(block, index, post.slug, firstImageIndex))}
            </div>
          ) : (
            <p className="text-lg leading-[1.8] text-white/80">
              {renderTextWithLinks(post.excerpt)}
            </p>
          )}
        </div>
        {post.faqs?.length ? <BlogFAQSection faqs={post.faqs} /> : null}
        <section className="mt-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Learn</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Design Ops Fundamentals</h2>
            <p className="mt-2 text-sm text-white/70">
              We built this evergreen mental model so designers, developers, and marketers can
              align design systems, handoff, implementation, launch, and campaigns.
            </p>
            <a
              href={ROUTE_PATHS.LEARN_DESIGN_OPS_FUNDAMENTALS}
              className="mt-4 inline-flex text-sm font-semibold text-[#ff2f87] underline underline-offset-4 transition-colors hover:text-[#ff5ba0]"
            >
              Read the guide
            </a>
          </div>
        </section>
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
                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${blogCardHoverClass}`}
                  aria-label={`Read the previous article: ${previousPost.title}`}
                >
                  {renderCardImage(previousPost)}
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
                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${blogCardHoverClass}`}
                  aria-label={`Read the next article: ${nextPost.title}`}
                >
                  {renderCardImage(nextPost)}
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
                  className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${blogCardHoverClass}`}
                  aria-label={`Read related article: ${relatedPost.title}`}
                >
                  {renderCardImage(relatedPost)}
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
