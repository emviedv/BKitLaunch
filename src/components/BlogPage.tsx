import React from 'react';
import { BLOG_POSTS, buildBlogPostHref } from '@/data/blogPosts';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';
const BLOG_LIST_SECTION_ID = 'blog-latest';
const blogCardHoverClass =
  'transition hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';
const blogCtaButtonClass =
  'w-full sm:w-auto inline-flex min-w-[12rem] items-center justify-center rounded-[2px] bg-[#ff2f87] px-4 py-[10px] text-sm font-semibold text-white shadow-none transition-colors duration-200 hover:bg-[#e02074]';

const BlogPage: React.FC = () => {
  const featuredPost = BLOG_POSTS[0];

  return (
    <div className="bg-[#0c0d10] text-white">
      <section
        id={BLOG_LIST_SECTION_ID}
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '120px', paddingBottom: '120px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="relative z-10 section-content pb-0 text-white">
          <div className="max-w-3xl pb-10">
            <h1 className="text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
              BiblioKit Blog | Design Ops Playbooks
            </h1>
            <p className="mt-3 text-lg text-white/80">
              Field notes, rituals, and Figma plugin tips that help designers and developers ship cleaner files faster with BiblioKit.
            </p>
          </div>
          <div className="grid gap-10 lg:gap-[168px] lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              {featuredPost && (
                <article className="flex flex-col gap-4 text-left text-white">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 shadow-[0_0_30px_rgba(250,174,255,0.25)] supports-[backdrop-filter]:bg-white/10">
                    <span className="inline-flex h-2 w-2 rounded-full bg-[#F1A0FF]" />
                    <span>Latest Post</span>
                  </span>
                  {featuredPost.heroImage && (
                    <div className="overflow-hidden rounded-[2px]">
                      <img
                        src={featuredPost.heroImage}
                        alt={featuredPost.heroImageAlt || `${featuredPost.title} illustration`}
                        className="h-auto w-full max-h-[484px] rounded-[2px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <p className="mt-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    {featuredPost.category} • {featuredPost.readingTime}
                  </p>
                  <h2 className="text-[48px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[64px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
                    {featuredPost.title}
                  </h2>
                  <p className="text-base text-white/80">
                    {renderTextWithLinks(featuredPost.excerpt)}
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <a href={buildBlogPostHref(featuredPost.slug)} className={blogCtaButtonClass}>
                      Read the article
                    </a>
                  </div>
                </article>
              )}
            </div>

            <aside className="text-white space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">Recent articles</p>
              <div className="space-y-4">
                {BLOG_POSTS.slice(1).map((post) => (
                  <a
                    key={`recent-${post.slug}`}
                    href={buildBlogPostHref(post.slug)}
                    className={`block rounded-lg px-3 py-2 bg-white/10 hover:bg-white/20 ${blogCardHoverClass}`}
                  >
                    <p className="pb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60">
                      {post.category} • {post.readingTime}
                    </p>
                    <p className="text-base font-semibold text-white">{post.title}</p>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="landing-sections-gradient text-white"
        style={{ paddingTop: '56px', paddingBottom: '72px' }}
      >
        <div className="section-content">
          <div className="space-y-4 text-left">
            <h2 className="text-2xl font-semibold text-white">Browse BiblioKit Articles</h2>
            <p className="text-base text-white/80">
              Design-focused articles, practical ops templates, and product updates to keep your workflows current.
            </p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => {
              const href = buildBlogPostHref(post.slug);
                  return (
                    <article
                      key={`${post.title}-card`}
                      className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_25px_60px_rgba(7,5,16,0.38)] backdrop-blur"
                    >
                      <a
                        href={href}
                        className="group flex h-full flex-col rounded-lg"
                        aria-label={`Read ${post.title}`}
                      >
                        <p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                          {post.category} • {post.readingTime}
                        </p>
                        <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                        <p className="mt-2 flex-1 text-sm text-white/75">
                          {renderTextWithLinks(post.excerpt)}
                        </p>
                        <div className="mt-6">
                          <span className={blogCtaButtonClass}>Read the article</span>
                        </div>
                      </a>
                    </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
