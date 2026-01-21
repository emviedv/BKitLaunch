import React from 'react';
import { buildBlogPostHref, findBlogPostBySlug, type BlogPost } from '@/data/blogPosts';
import { getImageDimensions } from '@/lib/imageDimensions';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';

const DESIGN_OPS_POST_SLUGS = [
  'what-is-design-ops-complete-guide',
  'complete-guide-design-systems-figma-2026',
  'design-dev-gap-2026',
  'mastering-design-system-guidelines',
];

const getPostTimestamp = (post: BlogPost) => {
  if (!post.lastUpdated) {
    return 0;
  }
  const parsed = Date.parse(post.lastUpdated);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const LearnPage: React.FC = () => {
  const designOpsPosts = DESIGN_OPS_POST_SLUGS
    .map((slug) => findBlogPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post));
  const sortedDesignOpsPosts = [...designOpsPosts].sort(
    (a, b) => getPostTimestamp(b) - getPostTimestamp(a)
  );

  return (
    <div className="landing-sections-gradient text-white min-h-screen">
      <section
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '72px', paddingBottom: '96px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="relative z-10 section-content text-white">
          <div className="max-w-3xl">
            <h1 className="text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
              Master Design Ops.
              <span className="block">Ship Creative Assets Faster.</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-white/80 max-w-[80%]">
              The comprehensive learning hub for design teams using BiblioKit. Learn design system best practices, master each plugin, and build scalable design workflows in Figma.
            </p>
          </div>
        </div>
      </section>

      <section className="section-content pb-20 mt-8">
        <div className="w-full space-y-16">
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-[normal] mt-4">
                Design Ops Fundamentals
              </h2>
              <p className="text-base sm:text-lg text-white/75 leading-[normal]">
                Learn what design ops is, why it matters, and how to build scalable design processes
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 !mt-8">
              {sortedDesignOpsPosts.slice(0, 3).map((post) => {
                const imageDimensions = getImageDimensions(post.heroImage);
                return (
                <a
                  key={`design-ops-learn-${post.slug}`}
                  href={buildBlogPostHref(post.slug)}
                  className="group mb-6 inline-block w-full break-inside-avoid rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white backdrop-blur transform-gpu transition duration-200 hover:-translate-y-1 hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]"
                >
                  <div className="flex h-full flex-col rounded-lg">
                    {post.heroImage ? (
                      <div className="mb-4 overflow-hidden rounded-lg bg-white/10">
                        <img
                          src={post.heroImage}
                          alt={post.heroImageAlt || `${post.title} illustration`}
                            className="h-[160px] w-full object-cover transition duration-200 group-hover:scale-[1.01]"
                            width={imageDimensions?.width}
                            height={imageDimensions?.height}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : null}
                      <p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                        {post.category} • {post.readingTime}
                      </p>
                    <h3 className="text-xl font-semibold text-white group-hover:opacity-90">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-white/75">{post.excerpt}</p>
                    <div className="mt-6">
                      <span className="inline-flex items-center justify-center text-sm font-semibold text-[#ff2f87] underline underline-offset-4 transition duration-200 group-hover:text-[#e02074] hover:text-[#e02074] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]">
                        Read the article
                      </span>
                    </div>
                  </div>
                  </a>
                );
              })}
            </div>
            <div className="flex justify-center">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="min-w-[132px] border-[#ff2f87] rounded-none bg-transparent hover:bg-transparent"
              >
                <a href={ROUTE_PATHS.LEARN_DESIGN_OPS_FUNDAMENTALS}>View More</a>
              </Button>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default LearnPage;
