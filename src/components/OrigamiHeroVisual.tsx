import React, { useMemo } from 'react';
import { FileText, Share2, StickyNote, MousePointer2, ThumbsUp } from 'lucide-react';

type NodeConfig = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

const BASE_SIZE = 680;

const nodes: NodeConfig[] = [
  { id: 'note', x: 10, y: 16, w: 160, h: 160 },
  { id: 'logic', x: 44, y: 42, w: 160, h: 160 },
  { id: 'media', x: 78, y: 20, w: 192, h: 128 },
  { id: 'sticky', x: 26, y: 74, w: 160, h: 160 },
];

const getCenter = (node: NodeConfig) => ({
  x: (node.x / 100) * BASE_SIZE + node.w / 2,
  y: (node.y / 100) * BASE_SIZE + node.h / 2,
});

const createCurve = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const distX = Math.abs(end.x - start.x);
  const curvature = Math.max(distX * 0.4, 90);
  const cp1 = { x: start.x + curvature, y: start.y };
  const cp2 = { x: end.x - curvature, y: end.y };
  return `M ${start.x} ${start.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${end.x} ${end.y}`;
};

const OrigamiHeroVisual: React.FC = () => {
  const centers = useMemo(() => {
    const lookup: Record<string, { x: number; y: number }> = {};
    nodes.forEach((node) => {
      lookup[node.id] = getCenter(node);
    });
    return lookup;
  }, []);

  return (
    <div className="origami-visual relative mx-auto w-full max-w-[720px] overflow-hidden rounded-[28px] border border-slate-200 bg-white/90 shadow-[0_30px_120px_rgba(15,23,42,0.14)] backdrop-blur-sm">
      <div className="absolute inset-0 origami-visual__grid" aria-hidden="true" />
      <div className="absolute inset-0 origami-visual__wash" aria-hidden="true" />
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${BASE_SIZE} ${BASE_SIZE}`} role="presentation">
          <defs>
            <linearGradient id="origami-line" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.55" />
            </linearGradient>
          </defs>
          <path
            d={createCurve(centers.note, centers.logic)}
            stroke="url(#origami-line)"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="origami-visual__dash"
          />
          <path
            d={createCurve(centers.logic, centers.media)}
            stroke="#94a3b8"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.65"
          />
          <path
            d={createCurve(centers.sticky, centers.logic)}
            stroke="#94a3b8"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>
      </div>

      <div className="relative z-10 aspect-square min-h-[440px] w-full">
        {/* Note card */}
        <div
          className="origami-visual__card origami-visual__card--note"
          style={{ left: `${nodes[0].x}%`, top: `${nodes[0].y}%`, width: nodes[0].w, height: nodes[0].h }}
        >
          <div className="origami-visual__pill">
            <FileText className="h-5 w-5 text-orange-600" />
          </div>
          <div className="h-2 w-24 rounded-full bg-orange-900/15" />
          <div className="h-2 w-14 rounded-full bg-orange-900/15" />
        </div>

        {/* Logic diamond */}
        <div
          className="origami-visual__card origami-visual__card--logic"
          style={{ left: `${nodes[1].x}%`, top: `${nodes[1].y}%`, width: nodes[1].w, height: nodes[1].h }}
        >
          <div className="-rotate-45 text-center text-sm font-semibold tracking-[0.12em] text-indigo-900/70">Logic</div>
        </div>

        {/* Media card */}
        <div
          className="origami-visual__card origami-visual__card--media group"
          style={{ left: `${nodes[2].x}%`, top: `${nodes[2].y}%`, width: nodes[2].w, height: nodes[2].h }}
        >
          <div className="origami-visual__media-icon">
            <Share2 className="h-8 w-8 text-emerald-500" />
          </div>
          <div className="origami-visual__floating-reaction group-hover:scale-100">
            <ThumbsUp className="h-5 w-5 text-emerald-600 fill-emerald-100" />
          </div>
        </div>

        {/* Sticky note */}
        <div
          className="origami-visual__card origami-visual__card--sticky"
          style={{ left: `${nodes[3].x}%`, top: `${nodes[3].y}%`, width: nodes[3].w, height: nodes[3].h }}
        >
          <StickyNote className="h-12 w-12 text-purple-500" />
          <p className="origami-visual__handwriting">Don&apos;t forget to sync the assets!</p>
          <div className="origami-visual__author">
            <span className="origami-visual__avatar">P</span>
            <span className="text-xs font-medium text-slate-600">Paul</span>
          </div>
        </div>

        {/* Floating cursors */}
        <div className="origami-visual__cursor origami-visual__cursor--primary">
          <MousePointer2 className="h-4 w-4 text-blue-600 fill-blue-600 stroke-white stroke-[2px]" />
          <span className="origami-visual__cursor-label bg-blue-600">You</span>
        </div>
        <div className="origami-visual__cursor origami-visual__cursor--secondary">
          <MousePointer2 className="h-4 w-4 text-orange-500 fill-orange-500 stroke-white stroke-[2px]" />
          <span className="origami-visual__cursor-label bg-orange-500">Gabrielle</span>
        </div>
        <div className="origami-visual__cursor origami-visual__cursor--tertiary">
          <MousePointer2 className="h-4 w-4 text-emerald-600 fill-emerald-600 stroke-white stroke-[2px]" />
          <span className="origami-visual__cursor-label bg-emerald-600">Kristine</span>
        </div>
      </div>

      <style>{`
        .origami-visual__grid {
          background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px);
          background-size: 28px 28px;
          mask-image: radial-gradient(ellipse at center, rgba(15, 23, 42, 0.25), transparent 75%);
        }
        .origami-visual__wash {
          background: radial-gradient(circle at 20% 18%, rgba(6, 182, 212, 0.16) 0%, transparent 32%),
                      radial-gradient(circle at 82% 26%, rgba(124, 58, 237, 0.12) 0%, transparent 34%),
                      radial-gradient(circle at 46% 86%, rgba(37, 99, 235, 0.12) 0%, transparent 36%);
          mix-blend-mode: screen;
        }
        .origami-visual__card {
          position: absolute;
          transform: translate(-50%, -50%);
          border-radius: 24px;
          box-shadow: 0 18px 60px rgba(15, 23, 42, 0.12), 0 6px 18px rgba(15, 23, 42, 0.08);
        }
        .origami-visual__card--note {
          background: #fef3c7;
          border: 4px solid #fff;
          display: grid;
          place-items: center;
          gap: 12px;
        }
        .origami-visual__pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 999px;
          background: rgba(251, 191, 36, 0.2);
          box-shadow: 0 10px 25px rgba(251, 191, 36, 0.25);
        }
        .origami-visual__card--logic {
          background: #e0e7ff;
          border: 4px solid #fff;
          display: grid;
          place-items: center;
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .origami-visual__card--media {
          background: #d1fae5;
          border: 4px solid #fff;
          display: grid;
          place-items: center;
        }
        .origami-visual__media-icon {
          width: 64px;
          height: 64px;
          display: grid;
          place-items: center;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
        }
        .origami-visual__floating-reaction {
          position: absolute;
          top: -18px;
          right: -18px;
          transform: rotate(12deg) scale(0.9);
          transition: transform 220ms ease;
          background: #fff;
          padding: 8px;
          border-radius: 999px;
          box-shadow: 0 14px 32px rgba(16, 185, 129, 0.22);
        }
        .origami-visual__card--sticky {
          background: #f3e8ff;
          border-top: 12px solid rgba(168, 85, 247, 0.35);
          border-left: 3px solid rgba(168, 85, 247, 0.12);
          border-right: 3px solid rgba(168, 85, 247, 0.12);
          border-bottom: 3px solid rgba(168, 85, 247, 0.12);
          padding: 18px;
          gap: 10px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-start;
          transform: translate(-50%, -50%) rotate(-3deg);
        }
        .origami-visual__handwriting {
          font-family: 'Comic Sans MS', 'Chalkboard SE', cursive;
          font-size: 16px;
          color: #6b21a8;
          line-height: 1.3;
          margin: 0;
        }
        .origami-visual__author {
          position: absolute;
          bottom: -18px;
          right: -14px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 13px 18px 13px 13px;
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.12);
          padding: 6px 10px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .origami-visual__avatar {
          width: 24px;
          height: 24px;
          border-radius: 999px;
          display: grid;
          place-items: center;
          background: #7c3aed;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
        }
        .origami-visual__cursor {
          position: absolute;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.9);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
          border: 1px solid #e2e8f0;
        }
        .origami-visual__cursor-label {
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          padding: 4px 8px;
          border-radius: 999px;
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.14);
        }
        .origami-visual__cursor--primary { top: 22%; left: 18%; animation: origami-cursor-1 12s ease-in-out infinite; }
        .origami-visual__cursor--secondary { top: 62%; left: 64%; animation: origami-cursor-2 14s ease-in-out infinite; }
        .origami-visual__cursor--tertiary { top: 44%; left: 32%; animation: origami-cursor-3 16s ease-in-out infinite; }
        @keyframes origami-cursor-1 { 0%,100% { transform: translate3d(0,0,0);} 50% { transform: translate3d(6%, -4%, 0);} }
        @keyframes origami-cursor-2 { 0%,100% { transform: translate3d(0,0,0);} 50% { transform: translate3d(-6%, 6%, 0);} }
        @keyframes origami-cursor-3 { 0%,100% { transform: translate3d(0,0,0);} 50% { transform: translate3d(5%, 5%, 0);} }
        .origami-visual__dash {
          animation: origami-dash 2.6s linear infinite;
          stroke-dasharray: 14 10;
        }
        @keyframes origami-dash {
          to { stroke-dashoffset: -48; }
        }
        @media (max-width: 1024px) {
          .origami-visual__cursor { display: none; }
        }
      `}</style>
    </div>
  );
};

export default OrigamiHeroVisual;
