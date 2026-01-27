/**
 * Shared hero typography tokens.
 */
export const HERO_TITLE_CLASS =
  'text-[72px] font-bold tracking-tight leading-[1.05] text-foreground';

export const HERO_DESCRIPTION_CLASS =
  'text-[22px] leading-[1.55] text-muted-foreground';

export const HERO_PRIMARY_BUTTON_CLASS =
  'w-full sm:w-auto min-w-[12rem] px-6 rounded-md bg-[#ff2f87] text-white shadow-md transition-colors duration-200 hover:bg-[#e02074] text-sm font-medium tracking-wide';

export const HERO_HEADLINE_GRADIENT_CLASS = 'hero-gradient-text';

/**
 * Splits a hero headline so the opening sentence can receive gradient styling.
 * Returns both the first sentence (with trailing punctuation) and the remainder.
 */
export const splitHeroHeadline = (text?: string | null): { firstSentence: string; remainder: string } => {
  if (!text) {
    return { firstSentence: '', remainder: '' };
  }

  const trimmed = text.trim();
  if (!trimmed) {
    return { firstSentence: '', remainder: '' };
  }

  const sentenceMatch = trimmed.match(/[^.!?]+[.!?]/);
  if (sentenceMatch && sentenceMatch[0]) {
    const firstSentence = sentenceMatch[0].trim();
    const remainder = trimmed.slice(sentenceMatch[0].length).trimStart();
    return { firstSentence, remainder };
  }

  return { firstSentence: trimmed, remainder: '' };
};

export type HeroHeadlineSegment = {
  text: string;
  gradient: boolean;
  key: string;
};

/**
 * Returns the ordered text fragments that should render inside the hero heading.
 * The leading segment always receives gradient styling.
 */
type BuildHeroHeadlineSegmentsArgs = {
  subtitle?: string | null;
  title?: string | null;
};

export const buildHeroHeadlineSegments = ({
  subtitle,
  title,
}: BuildHeroHeadlineSegmentsArgs): HeroHeadlineSegment[] => {
  const segments: HeroHeadlineSegment[] = [];

  const trimmedSubtitle = subtitle?.trim();
  const trimmedTitle = title?.trim();

  if (!trimmedSubtitle && !trimmedTitle) {
    return segments;
  }

  if (trimmedSubtitle) {
    segments.push({
      text: trimmedSubtitle,
      gradient: true,
      key: 'subtitle',
    });
  }

  if (trimmedTitle) {
    // Split by explicit newlines for manual line control
    const lines = trimmedTitle.split('\n').map((line) => line.trim()).filter(Boolean);

    if (lines.length > 1) {
      lines.forEach((line, index) => {
        segments.push({
          text: line,
          gradient: false,
          key: `title-line-${index}`,
        });
      });
    } else {
      const { firstSentence, remainder } = splitHeroHeadline(trimmedTitle);
      if (firstSentence) {
        segments.push({
          text: firstSentence,
          gradient: !trimmedSubtitle,
          key: 'title-first',
        });
      }

      if (remainder) {
        const remainderPieces = remainder
          .split(/(?<=[.!?])\s+/)
          .map((value) => value.trim())
          .filter(Boolean);

        remainderPieces.forEach((piece, index) => {
          segments.push({
            text: piece,
            gradient: false,
            key: `title-remainder-${index}`,
          });
        });
      }
    }
  }

  return segments;
};
