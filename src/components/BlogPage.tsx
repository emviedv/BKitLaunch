import React from 'react';
import { BLOG_POSTS, buildBlogPostHref } from '@/data/blogPosts';
import { renderTextWithLinks } from '@/lib/renderTextWithLinks';
import { getImageDimensions } from '@/lib/imageDimensions';
const BLOG_LIST_SECTION_ID = 'blog-latest';
const blogCardHoverClass =
  'transition hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';
const blogCtaButtonClass =
  'inline-flex items-center justify-center text-sm font-semibold text-[#ff2f87] underline underline-offset-4 transition duration-200 hover:text-[#e02074] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';

const BlogPage: React.FC = () => {
  const featuredPost = BLOG_POSTS[0];
  const featuredImageDimensions = featuredPost?.heroImage
    ? getImageDimensions(featuredPost.heroImage)
    : null;

  return (
    <div className="bg-[#0c0d10] text-white">
      <section
        id={BLOG_LIST_SECTION_ID}
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '72px', paddingBottom: '120px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="relative z-10 section-content pb-0 text-white">
          <div className="grid gap-10 lg:gap-[168px] lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <div className="max-w-3xl pb-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  Build stuff people love
                </p>
                <h1 className="text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
                  BiblioKit Blog: From Kickoff to Ship with Figma Workflows &amp; Tools
                </h1>
                <p className="mt-3 text-lg text-white/80">
                  From kickoff to ship: tools and workflows that keep designers, developers, and marketers on one page. Short, practical playbooks you can apply in the next sprint.
                </p>
              </div>
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
                        width={featuredImageDimensions?.width}
                        height={featuredImageDimensions?.height}
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                      />
                    </div>
                  )}
                  <p className="mt-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    {featuredPost.category} • {featuredPost.readingTime}
                  </p>
                  <h2 className="text-[48px] font-bold leading-[1.05] tracking-tight sm:text-[56px] lg:text-[64px] text-white">
                    <a
                      href={buildBlogPostHref(featuredPost.slug)}
                      className="inline-block bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]"
                    >
                      {featuredPost.title}
                    </a>
                  </h2>
                  <p className="text-base leading-7 text-white/80">
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
            <h2 className="text-2xl font-semibold text-white">Browse BiblioKit articles</h2>
            <p className="text-base leading-7 text-white/80">Workflow tips, state specs, accessibility checks, and system hygiene guides that teams can drop into real projects right now. Use them to clean files, align teams, and ship faster.</p>
          </div>
          <div className="mt-8 columns-1 md:columns-2 xl:columns-3 gap-6 space-y-6">
                {BLOG_POSTS.map((post) => {
                  const href = buildBlogPostHref(post.slug);
                  const previewDimensions = getImageDimensions(post.heroImage);
                  return (
                    <article
                      key={`${post.title}-card`}
                      className="mb-6 inline-block w-full break-inside-avoid rounded-2xl border border-white/10 bg-white/5 p-5 text-left backdrop-blur"
                >
                  <div className="group flex h-full flex-col rounded-lg">
                    {post.heroImage && (
                      <div className="mb-4 overflow-hidden rounded-lg bg-white/10">
                        <img
                          src={post.heroImage}
                          alt={post.heroImageAlt || `${post.title} illustration`}
                          className="h-[160px] w-full object-cover transition duration-200 group-hover:scale-[1.01]"
                          width={previewDimensions?.width}
                          height={previewDimensions?.height}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    )}
                    <p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                      {post.category} • {post.readingTime}
                    </p>
                    <a href={href} className="text-xl font-semibold text-white hover:opacity-90">
                      {post.title}
                    </a>
                    <p className="mt-2 flex-1 text-sm text-white/75">
                      {renderTextWithLinks(post.excerpt)}
                    </p>
                    <div className="mt-6">
                      <span className={blogCtaButtonClass}>Read the article</span>
                    </div>
                  </div>
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
