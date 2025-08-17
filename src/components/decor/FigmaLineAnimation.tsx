import React from 'react';

interface FigmaLineAnimationProps {
  className?: string;
  height?: number | string;
  strokeWidth?: number;
  speedMs?: number;
  colorClassName?: string;
}

export const FigmaLineAnimation: React.FC<FigmaLineAnimationProps> = ({
  className = '',
  height = 88,
  strokeWidth = 1.5,
  speedMs = 7000,
  colorClassName = 'text-primary/70'
}) => {
  const containerClasses = `w-full pointer-events-none select-none ${colorClassName} ${className}`.trim();
  const dur = `${speedMs}ms`;
  const iconTypes: Array<'diamond' | 'cluster'> = ['diamond','diamond','cluster','diamond','diamond','diamond','diamond','diamond','diamond'];
  const iconCount = iconTypes.length;
  const stepMs = Math.max(400, Math.round(speedMs / iconCount));
  const stepDur = `${stepMs}ms`;

  return (
    <div className={containerClasses} aria-hidden="true" role="presentation" style={{ height }}>
      <svg
        viewBox="0 0 800 120"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradients and filters */}
        <defs>
          <linearGradient id="dashStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id="blobGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
          </radialGradient>
          <linearGradient id="iconFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Moving opaque blob behind the icons */}
        <g opacity="0.22">
          <rect x="-180" y="18" width="260" height="86" rx="44" fill="url(#blobGrad)">
            <animate attributeName="x" values="-180; 740; -180" dur={`${Math.round(speedMs * 1.8)}ms`} repeatCount="indefinite" />
          </rect>
        </g>

        {/* Dashed rounded container */}
        <rect x="22" y="18" width="756" height="84" rx="14" stroke="url(#dashStroke)" strokeWidth={strokeWidth}
          strokeDasharray="12 14" fill="none">
          <animate attributeName="stroke-dashoffset" values="0;-120" dur={dur} repeatCount="indefinite" />
        </rect>

        {/* Inline icon row with sequential recreate → disappear → behind-version reveal */}
        <g>
          {(() => {
            const xMin = 40;
            const xMax = 760;
            const span = xMax - xMin;
            const items = iconTypes.map((t, i) => {
              const cx = xMin + (span * i) / (iconCount - 1);
              const beginOffset = `-${i * stepMs}ms`;

              if (t === 'cluster') {
                // 2x2 mini diamonds
                const size = 14;
                const gap = 16;
                return (
                  <g key={i} transform={`translate(${cx}, 60)`}>
                    {/* front (stroke) */}
                    <g transform="translate(0,0)">
                      {[[-gap/2, -gap/2], [gap/2, -gap/2], [-gap/2, gap/2], [gap/2, gap/2]].map(([dx, dy], k) => (
                        <rect key={k} x={-size/2 + dx} y={-size/2 + dy} width={size} height={size} transform="rotate(45)" fill="none" stroke="currentColor" strokeWidth={strokeWidth} pathLength={100} strokeDasharray="100 100">
                          <animate attributeName="stroke-dashoffset" values="100;0;0;100" keyTimes="0;0.55;0.7;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                          <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.55;0.7;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                        </rect>
                      ))}
                    </g>
                    {/* back (filled) */}
                    <g opacity={0.0}>
                      {[[-gap/2, -gap/2], [gap/2, -gap/2], [-gap/2, gap/2], [gap/2, gap/2]].map(([dx, dy], k) => (
                        <g key={k} transform={`translate(${dx}, ${dy})`}>
                          <g transform="rotate(45)">
                            <rect x={-size/2} y={-size/2} width={size} height={size} fill="url(#iconFill)">
                              <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.55;0.9;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                              <animateTransform attributeName="transform" type="scale" values="0.85;0.85;1;1" keyTimes="0;0.55;0.9;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" additive="sum" />
                            </rect>
                          </g>
                        </g>
                      ))}
                    </g>
                  </g>
                );
              }

              // diamond
              const frontSize = 20;
              const backSize = 24;
              return (
                <g key={i} transform={`translate(${cx}, 60)`}>
                  {/* front (outline drawing) */}
                  <rect x={-frontSize/2} y={-frontSize/2} width={frontSize} height={frontSize} transform="rotate(45)" fill="none" stroke="currentColor" strokeWidth={strokeWidth} pathLength={100} strokeDasharray="100 100">
                    <animate attributeName="stroke-dashoffset" values="100;0;0;100" keyTimes="0;0.55;0.7;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;0.55;0.7;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                  </rect>
                  {/* back (filled rising from behind) */}
                  <g transform="rotate(45)">
                    <rect x={-backSize/2} y={-backSize/2} width={backSize} height={backSize} fill="url(#iconFill)" opacity={0}>
                      <animate attributeName="opacity" values="0;0;1;0" keyTimes="0;0.55;0.9;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" />
                      <animateTransform attributeName="transform" type="scale" values="0.85;0.85;1;1" keyTimes="0;0.55;0.9;1" dur={stepDur} begin={beginOffset} repeatCount="indefinite" additive="sum" />
                    </rect>
                  </g>
                </g>
              );
            });
            return items;
          })()}
        </g>
      </svg>
    </div>
  );
};


