import React from 'react';

import FeatureComparisonPreview, { FeatureComparisonExample } from './AIRenameVariantsFeaturePreview';
import AIRenameBlueprintPreview, { FeatureBlueprintConfig } from './AIRenameBlueprintPreview';
import AIRenameProgressPreview, { FeatureProgressConfig } from './AIRenameProgressPreview';
import AIRenameBatchVisual from './AIRenameBatchVisual';
import UXBiblioAbstractVisual from './UXBiblioAbstractVisual';
import { cn } from '@/lib/utils';
import { debugService } from '@/lib/debugService';
import { mediaDiagnosticsEnabled } from './productContentSectionHelpers';
import { getImageDimensions } from '@/lib/imageDimensions';

type Variant = 'default' | 'showcase';

type FeaturePill = {
  label: string;
  classes: string;
  dotClass: string;
};

type ProductDetail = {
  title: string;
  description?: string;
  items?: string[];
  buttonText?: string;
  buttonLink?: string;
  mediaComponent?: string;
  mediaUrl?: string;
  mediaAlt?: string;
  mediaLoading?: 'lazy' | 'eager';
  mediaExamples?: FeatureComparisonExample[];
  mediaBlueprint?: FeatureBlueprintConfig;
  mediaProgress?: FeatureProgressConfig;
  pill?: FeaturePill | null;
};

type Props = {
  detail: ProductDetail;
  productTitle?: string;
  variant?: Variant;
};

const logFeatureMedia = (detail: ProductDetail, variant: Variant) => {
  if (!mediaDiagnosticsEnabled() || !detail.mediaUrl) {
    return;
  }
  debugService.debug('landing:feature-media', {
    title: detail.title,
    mediaUrl: detail.mediaUrl,
    mediaAlt: detail.mediaAlt,
    variant,
    isLocal: detail.mediaUrl.startsWith('/'),
  });
};

const ProductFeatureMedia: React.FC<Props> = ({ detail, productTitle, variant = 'default' }) => {
  logFeatureMedia(detail, variant);

  const imageDimensions = detail.mediaUrl ? getImageDimensions(detail.mediaUrl) : null;
  const imageLoading = detail.mediaLoading ?? 'lazy';
  const isShowcase = variant === 'showcase';
  const placeholderStroke = 'rgba(148,163,184,0.52)'; // slate-400, ~4 shades lighter than the slate-900 base
  const placeholderSecondaryStroke = 'rgba(148,163,184,0.28)';
  const fallbackWrapperClass = cn(
    'relative flex items-center justify-center overflow-hidden border bg-gradient-to-br from-[#0c1024] via-[#0a081a] to-[#070512] shadow-[0_32px_90px_rgba(7,0,18,0.35)] rounded-[12px]',
    isShowcase ? 'w-full max-w-[640px] min-h-[280px] px-6 py-6' : 'w-full max-w-[520px] min-h-[220px] px-5 py-5'
  );
  const imageWrapperClass = cn(
    'relative inline-flex overflow-hidden border bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/0 rounded-[12px]',
    isShowcase ? 'w-full max-w-[640px]' : 'w-full max-w-[520px]'
  );
  const mediaFrameStyle = { borderColor: placeholderStroke };

  switch (detail.mediaComponent) {
    case 'feature-comparison':
      if (Array.isArray(detail.mediaExamples) && detail.mediaExamples.length > 0) {
        return <FeatureComparisonPreview examples={detail.mediaExamples} />;
      }
      break;
    case 'feature-blueprint':
      if (detail.mediaBlueprint) {
        return <AIRenameBlueprintPreview config={detail.mediaBlueprint} />;
      }
      break;
    case 'feature-progress':
      if (detail.mediaProgress) {
        return <AIRenameProgressPreview config={detail.mediaProgress} />;
      }
      break;
    case 'video':
      if (detail.mediaUrl) {
        const videoWrapperClass = cn(
          'relative inline-flex overflow-hidden border bg-black/40 rounded-[12px]',
          isShowcase ? 'w-full max-w-[640px]' : 'w-full max-w-[520px]'
        );
        const videoLabel =
          detail.mediaAlt ||
          detail.title ||
          `${productTitle || 'Product'} preview`;
        return (
          <div className={videoWrapperClass} style={mediaFrameStyle}>
            <video
              className="w-full h-auto object-cover"
              src={detail.mediaUrl}
              loop
              autoPlay
              muted
              playsInline
              aria-label={videoLabel}
            />
          </div>
        );
      }
      break;
    case 'feature-batch':
      return <AIRenameBatchVisual />;
    case 'uxbiblio-organize':
    case 'uxbiblio-capture':
    case 'uxbiblio-insights':
    case 'uxbiblio-collections':
    case 'uxbiblio-pin':
    case 'uxbiblio-reuse':
      return <UXBiblioAbstractVisual variant={detail.mediaComponent} />;
    case 'image':
      if (detail.mediaUrl) {
        const imageLabel =
          detail.mediaAlt ||
          detail.title ||
          `${productTitle || 'Product'} preview`;
        return (
          <div className={imageWrapperClass} style={mediaFrameStyle}>
            <img
              src={detail.mediaUrl}
              alt={imageLabel}
              className="w-full h-auto object-cover"
              width={imageDimensions?.width}
              height={imageDimensions?.height}
              loading={imageLoading}
              decoding="async"
            />
          </div>
        );
      }
      break;
    default:
      break;
  }

  if (detail.mediaUrl) {
    const imageLabel =
      detail.mediaAlt ||
      detail.title ||
      `${productTitle || 'Product'} preview`;
    return (
      <div className={imageWrapperClass} style={mediaFrameStyle}>
        <img
          src={detail.mediaUrl}
          alt={imageLabel}
          className="w-full h-auto object-cover"
          width={imageDimensions?.width}
          height={imageDimensions?.height}
          loading={imageLoading}
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div className={fallbackWrapperClass} aria-hidden="true" style={{ borderColor: placeholderStroke }}>
      <div
        className="absolute inset-[10%] rounded-[12px] border backdrop-blur-sm"
        style={{ borderColor: placeholderStroke }}
      />
      <div
        className="absolute inset-[16%] rounded-[10px] border border-dashed"
        style={{ borderColor: placeholderSecondaryStroke }}
      />
      <div
        className="absolute left-[18%] top-[22%] h-3 w-24 rounded-full bg-white/[0.12]"
        style={{ boxShadow: '0 12px 36px rgba(0,0,0,0.14)' }}
      />
      <div
        className="absolute right-[18%] bottom-[18%] h-20 w-28 rounded-[10px] border bg-white/[0.08] backdrop-blur"
        style={{ borderColor: placeholderStroke }}
      />
      <div className="absolute inset-0 opacity-70">
        <div className="absolute -left-12 top-6 h-24 w-24 rounded-full bg-[#a855f7]/18 blur-3xl" />
        <div className="absolute right-4 bottom-4 h-24 w-32 rounded-full bg-[#22d3ee]/14 blur-3xl" />
      </div>
    </div>
  );
};

export default ProductFeatureMedia;
