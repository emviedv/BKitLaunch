import React from 'react';
import { BLOG_POSTS, buildBlogPostHref } from '@/data/blogPosts';
import { LANDING_WAITLIST_PATH } from '@/config/sectionAnchors';
import { Button } from '@/components/ui/button';
import { HERO_PRIMARY_BUTTON_CLASS } from './heroConstants';

const BLOG_LIST_SECTION_ID = 'blog-latest';
const blogCardHoverClass =
  'transition hover:text-[#ffb3d4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6580E1]';

const BlogPage: React.FC = () => {
  return (
    <div className="bg-[#090512] text-white">
      <section
        id={BLOG_LIST_SECTION_ID}
        className="landing-hero-gradient landing-hero-compact section-hero relative overflow-hidden"
        style={{ paddingTop: '120px', paddingBottom: '120px' }}
      >
        <div className="landing-hero-gradient__layer" aria-hidden="true" />
        <div className="landing-hero-column-lines" aria-hidden="true" />
        <div className="landing-hero-noise" aria-hidden="true" />
        <div className="landing-hero-contrast" aria-hidden="true" />
        <div className="relative z-10 section-content pb-0 text-white">
          <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              {BLOG_POSTS[0] && (
                <article className="flex flex-col gap-4 text-left text-white">
                  <h3 className="text-3xl font-semibold leading-tight sm:text-4xl">{BLOG_POSTS[0].title}</h3>
                  <p className="text-base text-white/80">{BLOG_POSTS[0].excerpt}</p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button asChild size="lg" className="w-full sm:w-auto">
                      <a href={buildBlogPostHref(BLOG_POSTS[0].slug)} className="min-w-[12rem] bg-[#ff2f87] text-white shadow-none hover:brightness-110 transition-colors duration-200">
                        Read the article
                      </a>
                    </Button>
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
                    className={`block rounded-lg px-3 py-2 hover:bg-white/10 bg-white/10 ${blogCardHoverClass}`}
                  >
                    <p className="text-base font-semibold text-white">{post.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-white/70">{post.excerpt}</p>
                    <p className="mt-1 text-xs text-white/60">
                      {post.category} • {post.readingTime}
                    </p>
                  </a>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section
        className="bg-[#090512]"
        style={{ paddingTop: '40px', paddingBottom: '40px' }}
      >
        <div className="section-content">
          <div className="space-y-4 text-left">
            <h2 className="text-3xl font-semibold text-white">Browse BiblioKit Articles</h2>
            <p className="text-lg text-white/80">
              Design-focused articles, practical ops templates, and product updates to keep your workflows current.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {BLOG_POSTS.map((post) => {
              const href = buildBlogPostHref(post.slug);
              return (
                <article
                  key={`${post.title}-card`}
                  className="rounded-lg bg-white/80 p-6 text-left shadow-[0_25px_60px_rgba(15,23,42,0.08)] backdrop-blur"
                >
                  <a
                    href={href}
                    className="group flex h-full flex-col rounded-lg"
                    aria-label={`Read ${post.title}`}
                  >
                    <h3 className="text-xl font-semibold text-foreground">{post.title}</h3>
                    <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {post.category} • {post.readingTime}
                    </p>
                    <div className="mt-6">
                      <span
                        className="inline-flex min-w-[12rem] items-center justify-center rounded-lg border border-[#ff2f87] px-4 py-2 text-[#ff2f87] transition-colors duration-200 hover:bg-[#ff2f87]/10"
                      >
                        Read the article
                      </span>
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
