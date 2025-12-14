import React, { useEffect, useMemo } from 'react';

import { usePublishedContent } from '@/hooks/usePublishedContent';
import { CLIENT_LOGO_HEIGHT_PX, CLIENT_LOGO_MAX_WIDTH_PX } from './clientsLogoMetrics';
import { resolveClientLogoSource } from './clientsLogoResolver';
import { buildLoopedClients } from './clientsMarqueeLoop';
import { FEATURED_CLIENTS, CLIENT_LOGO_ASSET_MAP } from './clientsLogoAssets';
import { debugService } from '@/lib/debugService';

type ClientLike = {
  name: string;
  logo?: string;
  href?: string;
};

const MAX_CLIENTS = 10;

const DEFAULT_CLIENTS: ClientLike[] = FEATURED_CLIENTS.slice(0, MAX_CLIENTS).map(({ name, token }) => ({
  name,
  logo: CLIENT_LOGO_ASSET_MAP[token]
}));

const normalizeClientEntry = (value: any): ClientLike | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed ? { name: trimmed } : null;
  }

  if (typeof value === 'object') {
    const name =
      value.name ||
      value.title ||
      value.label ||
      value.company ||
      value.text;

    if (!name || typeof name !== 'string') {
      return null;
    }

    const logo =
      typeof value.logo === 'string'
        ? value.logo
        : typeof value.logoToken === 'string'
          ? value.logoToken
          : value.logoUrl;

    return {
      name: name.trim(),
      logo,
      href: typeof value.href === 'string' ? value.href : value.link
    };
  }

  return null;
};

const extractClientsFromContent = (content: any): ClientLike[] => {
  const source = content?.clients;

  let rawEntries: any[] = [];

  if (Array.isArray(source)) {
    rawEntries = source;
  } else if (source && Array.isArray(source.items)) {
    rawEntries = source.items;
  }

  const normalized = rawEntries
    .map(normalizeClientEntry)
    .filter(Boolean) as ClientLike[];

  return normalized;
};

const ClientsMarquee: React.FC = () => {
  const { content } = usePublishedContent();

  const clientsVisible = (content?.settings as any)?.visibility?.clients;

  const baseClients = useMemo<ClientLike[]>(() => {
    const fromContent = extractClientsFromContent(content);
    const resolvedClients = fromContent.length > 0 ? fromContent : DEFAULT_CLIENTS;
    return resolvedClients.slice(0, MAX_CLIENTS);
  }, [content]);

  const loopedClients = useMemo<ClientLike[]>(() => buildLoopedClients(baseClients).slice(0, MAX_CLIENTS), [baseClients]);

  const debugEnabled = clientsMarqueeDebugEnabled();

  useEffect(() => {
    if (!debugEnabled || typeof window === 'undefined') {
      return;
    }

    debugService.debug('clients-marquee:loop', {
      base: baseClients.length,
      looped: loopedClients.length
    });

    const chips = Array.from(document.querySelectorAll<HTMLSpanElement | HTMLAnchorElement>('.clients-logo-chip'));
    chips.slice(0, 4).forEach((chip, index) => {
      const media = chip.querySelector<SVGElement | HTMLImageElement>('svg, img');
      if (!media) {
        debugService.debug('clients-marquee:missing-media', { index });
        return;
      }
      const rect = media.getBoundingClientRect();
      debugService.debug('clients-marquee:media-size', {
        index,
        width: rect.width,
        height: rect.height,
        expectedHeight: CLIENT_LOGO_HEIGHT_PX
      });
    });
  }, [baseClients.length, loopedClients.length, debugEnabled]);

  if (clientsVisible === false || baseClients.length === 0) {
    return null;
  }

  return (
    <section className="relative isolate h-[280px] flex flex-col justify-center mt-6">
      <div className="mx-auto w-11/12 sm:w-5/6 md:w-[70%] px-6 md:px-10">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            Trusted by modern product teams
          </p>
        </div>
      </div>

      <div className="mt-6 overflow-hidden">
        <div className="px-6 sm:px-8 md:px-10 flex justify-center">
          <div className="clients-marquee">
            <div className="clients-marquee-segment">
              {loopedClients.map((client, index) => {
                const key = `loop-${client.name}-${index}`;
                return renderClientChip(client, key, false);
              })}
            </div>
            <div className="clients-marquee-segment" aria-hidden="true">
              {loopedClients.map((client, index) => {
                const key = `dupe-loop-${client.name}-${index}`;
                return renderClientChip(client, key, true);
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsMarquee;

function clientsMarqueeDebugEnabled(): boolean {
  if (typeof process !== 'undefined' && process.env?.DEBUG_FIX) {
    return process.env.DEBUG_FIX !== '0';
  }
  if (typeof import.meta !== 'undefined' && (import.meta as any)?.env?.VITE_DEBUG_FIX) {
    return (import.meta as any).env.VITE_DEBUG_FIX !== '0';
  }
  return false;
}

type LogoProps = { className?: string; style?: React.CSSProperties };

type TextLogoOptions = {
  width?: number;
  fontSize?: number;
  letterSpacing?: number;
  fontWeight?: number;
};

const DEFAULT_LOGO_FONT_FAMILY =
  '"Space Grotesk", "Inter", "Helvetica Neue", "Segoe UI", sans-serif';

const createTextLogo = (label: string, options: TextLogoOptions = {}): React.FC<LogoProps> => {
  const {
    width = 240,
    fontSize = 26,
    letterSpacing = 2,
    fontWeight = 600
  } = options;
  const upper = label.toUpperCase();

  const Component: React.FC<LogoProps> = ({ className, style }) => (
    <svg
      viewBox={`0 0 ${width} 48`}
      className={className}
      style={style}
      role="presentation"
      aria-hidden="true"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#fff"
        fontFamily={DEFAULT_LOGO_FONT_FAMILY}
        fontSize={fontSize}
        fontWeight={fontWeight}
        letterSpacing={letterSpacing}
      >
        {upper}
      </text>
    </svg>
  );

  return Component;
};

const LogoSuperhuman = createTextLogo('Superhuman', { width: 320, fontSize: 24, letterSpacing: 1 });
const LogoPitch = createTextLogo('Pitch', { width: 180, fontSize: 32, letterSpacing: 6 });
const LogoAARP = createTextLogo('AARP', { width: 200, fontSize: 34, letterSpacing: 8, fontWeight: 700 });
const LogoFisherPrice = createTextLogo('Fisher-Price', {
  width: 360,
  fontSize: 24,
  letterSpacing: 2,
  fontWeight: 600
});
const LogoGEICO = createTextLogo('GEICO', { width: 220, fontSize: 32, letterSpacing: 6, fontWeight: 700 });

const INLINE_LOGOS: Record<string, React.FC<LogoProps>> = {
  superhuman: LogoSuperhuman,
  pitch: LogoPitch,
  aarp: LogoAARP,
  'fisher-price': LogoFisherPrice,
  geico: LogoGEICO
};

const LOGO_WRAPPER_BASE =
  'clients-logo-chip inline-flex items-center justify-center px-8 py-3 min-h-[56px] min-w-[132px] rounded-full text-white/70';

const renderClientChip = (client: ClientLike, key: string, duplicate: boolean) => {
  const resolved = resolveClientLogoSource(client);
  const wrapperClass = `${LOGO_WRAPPER_BASE}${duplicate ? ' opacity-70' : ''}`;
  const sharedStyle = {
    '--clients-logo-height': `${CLIENT_LOGO_HEIGHT_PX}px`,
    '--clients-logo-max-width': `${CLIENT_LOGO_MAX_WIDTH_PX}px`
  } as React.CSSProperties;

  const inner = (() => {
    switch (resolved.type) {
      case 'inline': {
        const Logo = INLINE_LOGOS[resolved.token];
        if (Logo) {
          return (
            <>
              <Logo className="clients-logo text-current" style={sharedStyle} />
              <span className="sr-only">{resolved.label}</span>
            </>
          );
        }
        return (
          <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
            {resolved.label}
          </span>
        );
      }
      case 'image':
        return (
          <>
            <img
              src={resolved.src}
              alt=""
              loading="lazy"
              className="clients-logo clients-logo-image object-contain"
              style={sharedStyle}
              aria-hidden="true"
            />
            <span className="sr-only">{resolved.label}</span>
          </>
        );
      default:
        return (
          <span className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            {resolved.label}
          </span>
        );
    }
  })();

  if (client.href && !duplicate) {
    const external = client.href.startsWith('http');
    return (
      <a
        key={key}
        href={client.href}
        target={external ? '_blank' : '_self'}
        rel={external ? 'noopener noreferrer' : undefined}
        className={wrapperClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <span key={key} className={wrapperClass} aria-hidden={duplicate ? true : undefined}>
      {inner}
    </span>
  );
};
