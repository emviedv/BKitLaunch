import React from 'react';
import { buildBlogPostHref, findBlogPostBySlug, type BlogPost } from '@/data/blogPosts';
import { getImageDimensions } from '@/lib/imageDimensions';

/**
 * Tutorial post slugs - curated list of how-to guides and step-by-step tutorials.
 * These are blog posts that walk users through specific workflows or techniques.
 */
const TUTORIAL_POST_SLUGS = [
  'mastering-figma-auto-layout-wrap',
  'fix-detached-instances-figma',
  'remove-prototype-links-in-figma',
  'effortless-table-design-figma',
  'effortless-table-design-auto-layout',
  'ui-component-states-guide',
  'figma-workflow-automation-tools',
  'ultimate-figma-plugin-stack',
  'install-uninstall-figma-plugin',
];

const blogCardHoverClass =
  'transform-gpu transition duration-200 hover:-translate-y-1 hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';

const TutorialsPage: React.FC = () => {
  const tutorialPosts = TUTORIAL_POST_SLUGS
    .map((slug) => findBlogPostBySlug(slug))
    .filter((post): post is BlogPost => Boolean(post));

  const featuredPost = tutorialPosts[0];
  const remainingPosts = tutorialPosts.slice(1);
  const featuredImageDimensions = featuredPost?.heroImage
    ? getImageDimensions(featuredPost.heroImage)
    : null;

  return (
    <div className="landing-sections-gradient text-white min-h-screen">
      <section
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '72px', paddingBottom: '96px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="relative z-10 section-content text-white">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 lg:items-start">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                Step-by-step guides
              </p>
              <h1 className="text-[40px] font-bold leading-[1.08] tracking-tight sm:text-[48px] lg:text-[56px] bg-gradient-to-r from-[#F7D6FF] via-[#FF2F87] to-[#7F5AF0] bg-clip-text text-transparent">
                Figma Tutorials
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-white/80">
                Hands-on tutorials to level up your Figma workflow. From auto-layout mastery to design system maintenance, learn practical techniques you can apply today.
              </p>
            </div>

            {featuredPost && (
              <a
                href={buildBlogPostHref(featuredPost.slug)}
                className={`group block rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white backdrop-blur ${blogCardHoverClass}`}
              >
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 mb-4">
                  <span className="inline-flex h-2 w-2 rounded-full bg-[#F1A0FF]" />
                  <span>Featured Tutorial</span>
                </span>
                {featuredPost.heroImage && (
                  <div className="mb-4 overflow-hidden rounded-lg bg-white/10">
                    <img
                      src={featuredPost.heroImage}
                      alt={featuredPost.heroImageAlt || `${featuredPost.title} illustration`}
                      className="h-[180px] w-full object-cover transition duration-200 group-hover:scale-[1.01]"
                      width={featuredImageDimensions?.width}
                      height={featuredImageDimensions?.height}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                    />
                  </div>
                )}
                <p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                  {featuredPost.category} &bull; {featuredPost.readingTime}
                </p>
                <h2 className="text-xl font-semibold text-white group-hover:opacity-90">
                  {featuredPost.title}
                </h2>
                <p className="mt-2 text-sm text-white/75 line-clamp-2">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center justify-center text-sm font-semibold text-[#ff2f87] underline underline-offset-4 transition duration-200 group-hover:text-[#e02074]">
                    Start learning
                  </span>
                </div>
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="section-content pb-20 mt-8">
        <div className="w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-white leading-[normal]">
              All Tutorials
            </h2>
            <p className="text-base sm:text-lg text-white/75 leading-[normal]">
              Practical guides for designers and developers working with Figma and design systems
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {remainingPosts.map((post) => {
              const imageDimensions = getImageDimensions(post.heroImage);
              return (
                <a
                  key={`tutorial-${post.slug}`}
                  href={buildBlogPostHref(post.slug)}
                  className={`group block rounded-2xl border border-white/10 bg-white/5 p-5 text-left text-white backdrop-blur ${blogCardHoverClass}`}
                >
                  <div className="flex h-full flex-col rounded-lg">
                    {post.heroImage && (
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
                    )}
                    <p className="pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-white/60">
                      {post.category} &bull; {post.readingTime}
                    </p>
                    <h3 className="text-xl font-semibold text-white group-hover:opacity-90">
                      {post.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm text-white/75 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="mt-6">
                      <span className="inline-flex items-center justify-center text-sm font-semibold text-[#ff2f87] underline underline-offset-4 transition duration-200 group-hover:text-[#e02074]">
                        Read tutorial
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TutorialsPage;
