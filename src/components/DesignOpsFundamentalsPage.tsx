import React from 'react';
import { buildBlogPostHref, findBlogPostBySlug, type BlogPost } from '@/data/blogPosts';
import { getImageDimensions } from '@/lib/imageDimensions';
import { ROUTE_PATHS } from '@/config/routes';
import { Button } from '@/components/ui/button';

const DESIGN_OPS_POST_SLUGS = [
  'what-is-design-ops-complete-guide',
];

const DESIGN_SYSTEM_POST_SLUGS = [
  'complete-guide-design-systems-figma-2026',
  'design-dev-gap-2026',
  'mastering-design-system-guidelines',
];

const sectionTitleClass = 'text-2xl sm:text-3xl font-semibold text-white leading-[normal]';
const sectionIntroClass = 'text-base sm:text-lg text-white/75 leading-[normal]';

const DesignOpsFundamentalsPage: React.FC = () => {
  const designOpsPosts = DESIGN_OPS_POST_SLUGS
    .map((slug) => findBlogPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post));
  const designSystemPosts = DESIGN_SYSTEM_POST_SLUGS
    .map((slug) => findBlogPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post));

  return (
    <div className="landing-sections-gradient text-white min-h-screen">
      <section
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '72px', paddingBottom: '96px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="relative z-10 section-content text-white">
          <nav
            className="design-ops-breadcrumb w-full text-xs font-semibold uppercase tracking-[0.18em] text-white/60"
            aria-label="Breadcrumb"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <a className="hover:text-white" href={ROUTE_PATHS.HOME}>
                  Home
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a className="hover:text-white" href={ROUTE_PATHS.LEARN}>
                  Learn
                </a>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-white/80">Design Ops Fundamentals</li>
            </ol>
          </nav>
          <div className="max-w-3xl space-y-4 pt-4">
            <h1 className="text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
              Design Ops Fundamentals
            </h1>
            <p className="text-lg sm:text-xl text-white/80">
              Master the fundamentals of design operations. Learn what design ops is, why it matters for modern design teams, and how to build scalable design processes that enable your team to ship faster. Perfect for designers new to design ops.
            </p>
          </div>
        </div>
      </section>

      <section className="section-content pb-20 mt-8 pt-10">
        <div className="w-full space-y-16">
          <section className="space-y-4">
            <div className="space-y-4">
              <h2 className={sectionTitleClass}>What is Design Ops?</h2>
              <p className={sectionIntroClass}>
                Build your foundation by understanding the what, why, and how of design operations.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {designOpsPosts.slice(0, 2).map((post) => {
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
          </section>
          <section className="space-y-4">
            <div className="space-y-4">
              <h2 className={sectionTitleClass}>Design System Foundations</h2>
              <p className={sectionIntroClass}>
                Learn the core concepts of building and maintaining design systems at scale.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {designSystemPosts.map((post) => {
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
          </section>
        </div>
      </section>
    </div>
  );
};

export default DesignOpsFundamentalsPage;
