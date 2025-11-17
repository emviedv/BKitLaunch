import { test, expect } from '@playwright/test';

const HERO_CSS = `
  body {
    margin: 0;
    font-family: 'Satoshi', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #0b1220;
    display: flex;
    justify-content: center;
  }

  #hero {
    position: relative;
    isolation: isolate;
    background: transparent;
    width: 100%;
    max-width: 1440px;
    padding-top: 6rem;
    overflow: hidden;
  }

  .landing-hero-gradient__layer,
  .landing-hero-noise {
    position: absolute;
    inset: -18%;
    border-radius: 46%;
    pointer-events: none;
    z-index: 0;
  }

  .landing-hero-gradient__layer {
    background-image:
      radial-gradient(38% 38% at 50% 42%, rgba(37, 99, 235, 0.95) 0%, rgba(37, 99, 235, 0.34) 52%, rgba(37, 99, 235, 0.04) 84%, rgba(37, 99, 235, 0) 100%),
      radial-gradient(26% 26% at 72% 32%, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0.16) 65%, rgba(16, 185, 129, 0) 100%),
      radial-gradient(28% 28% at 28% 62%, rgba(173, 126, 255, 0.52) 0%, rgba(173, 126, 255, 0.18) 68%, rgba(173, 126, 255, 0) 100%),
      radial-gradient(32% 32% at 62% 70%, rgba(64, 162, 255, 0.32) 0%, rgba(64, 162, 255, 0.08) 78%, rgba(64, 162, 255, 0) 100%),
      radial-gradient(70% 70% at 50% 92%, rgba(26, 20, 54, 0.92) 0%, rgba(26, 20, 54, 0.08) 68%, rgba(26, 20, 54, 0) 100%),
      radial-gradient(95% 95% at 10% 15%, rgba(110, 80, 210, 0.18) 0%, rgba(110, 80, 210, 0.04) 72%, rgba(110, 80, 210, 0) 100%),
      radial-gradient(95% 95% at 90% 18%, rgba(96, 180, 240, 0.16) 0%, rgba(96, 180, 240, 0.04) 72%, rgba(96, 180, 240, 0) 100%),
      radial-gradient(130% 120% at 50% 100%, rgba(17, 12, 35, 0.98) 0%, rgba(17, 12, 35, 0.08) 65%, rgba(17, 12, 35, 0) 100%),
      linear-gradient(180deg, rgba(9, 14, 26, 0) 0%, rgba(9, 14, 26, 0.72) 75%, rgba(9, 14, 26, 0.98) 100%);
    filter: blur(44px);
    opacity: 0.95;
    transform: scale(1.2) translateY(4%);
  }

  .landing-hero-noise {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.17'/%3E%3C/svg%3E");
    mix-blend-mode: soft-light;
    opacity: 0.45;
  }

  #hero-content {
    position: relative;
    z-index: 10;
    margin: 0 auto;
    width: min(88%, 960px);
    color: #fff;
    padding-bottom: 6rem;
  }

  #hero-content h1 {
    margin: 0;
    font-size: 4.5rem;
    line-height: 1.05;
  }
`;

test('landing hero gradient aspect ratio deviates from a circle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(`
    <style>${HERO_CSS}</style>
    <section id="hero" class="landing-hero-gradient">
      <div class="landing-hero-gradient__layer" data-testid="gradient-layer"></div>
      <div class="landing-hero-noise"></div>
      <div id="hero-content">
        <h1>Build smarter libraries.</h1>
        <p style="max-width: 620px; margin: 1rem auto 0; font-size: 1.125rem;">
          Automate intake, structure your catalog, and deliver polished knowledge bases in record time.
        </p>
        <div style="height: 320px;"></div>
      </div>
    </section>
  `);

  const measure = async () => {
    const gradientBox = await page.locator('[data-testid="gradient-layer"]').boundingBox();
    const sectionBox = await page.locator('#hero').boundingBox();

    expect(gradientBox).not.toBeNull();
    expect(sectionBox).not.toBeNull();

    const gradientAspect = gradientBox!.width / gradientBox!.height;
    const sectionAspect = sectionBox!.width / sectionBox!.height;

    return {
      gradient: {
        width: gradientBox!.width,
        height: gradientBox!.height,
        aspectRatio: Number(gradientAspect.toFixed(2)),
      },
      section: {
        width: sectionBox!.width,
        height: sectionBox!.height,
        aspectRatio: Number(sectionAspect.toFixed(2)),
      },
      gradientAspect,
      sectionAspect,
    };
  };

  const defaultMeasure = await measure();
  console.log(JSON.stringify({ scenario: 'default', ...defaultMeasure }));

  await page.addStyleTag({
    content: '.landing-hero-gradient__layer { transform: none !important; filter: none !important; }',
  });

  const neutralMeasure = await measure();
  console.log(JSON.stringify({ scenario: 'no-transform', ...neutralMeasure }));

  await page.addStyleTag({
    content: '.landing-hero-gradient__layer { border-radius: 50% !important; }',
  });

  const radiusMeasure = await measure();
  console.log(JSON.stringify({ scenario: 'border-radius-50', ...radiusMeasure }));

  // Confirm the gradient deviates materially from a perfect circle (aspect ratio 1)
  expect(Math.abs(defaultMeasure.gradientAspect - 1)).toBeGreaterThan(0.5);
  expect(Math.abs(defaultMeasure.gradientAspect - defaultMeasure.sectionAspect)).toBeLessThan(0.05);

  // Neutralizing transform shouldn't materially change the aspect ratio.
  expect(Math.abs(neutralMeasure.gradientAspect - defaultMeasure.gradientAspect)).toBeLessThan(0.01);

  // Tweaking border radius can't fix aspect ratio because the bounding box stays wide.
  expect(Math.abs(radiusMeasure.gradientAspect - defaultMeasure.gradientAspect)).toBeLessThan(0.01);
});
