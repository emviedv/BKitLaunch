import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wrench, X, Pipette, Search, Grid3X3, Ruler } from 'lucide-react';

/**
 * DevTools - Debug overlay for development only
 *
 * Features:
 * - Color picker (eyedropper)
 * - Spacing measurement
 * - DOM element inspector with computed styles
 *
 * Only renders when import.meta.env.DEV is true
 */

interface ElementInfo {
  tagName: string;
  id: string;
  classList: string[];
  dimensions: { width: number; height: number };
  position: { x: number; y: number };
  spacing: {
    margin: string;
    padding: string;
    gap: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    lineHeight: string;
    color: string;
  };
  background: string;
  border: string;
  display: string;
  element: HTMLElement;
}

type ActiveTool = 'none' | 'picker' | 'spacer' | 'inspector';

interface SpacingGuide {
  elementRect: DOMRect;
  containerRect: DOMRect;
  containerLabel: string;
  distances: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface SiblingSpacing {
  direction: 'top' | 'right' | 'bottom' | 'left';
  distance: number;
  siblingRect: DOMRect;
  siblingLabel: string;
}

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);
  const [showGridOverlay, setShowGridOverlay] = useState(false);
  const [showSpacingGuides, setShowSpacingGuides] = useState(false);
  const [spacingGuide, setSpacingGuide] = useState<SpacingGuide | null>(null);
  const [siblingSpacings, setSiblingSpacings] = useState<SiblingSpacing[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Don't render in production
  if (!import.meta.env.DEV) {
    return null;
  }

  const getElementInfo = (el: HTMLElement): ElementInfo => {
    const computed = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();

    return {
      tagName: el.tagName.toLowerCase(),
      id: el.id,
      classList: Array.from(el.classList),
      dimensions: {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      },
      position: {
        x: Math.round(rect.left + window.scrollX),
        y: Math.round(rect.top + window.scrollY),
      },
      spacing: {
        margin: `${computed.marginTop} ${computed.marginRight} ${computed.marginBottom} ${computed.marginLeft}`,
        padding: `${computed.paddingTop} ${computed.paddingRight} ${computed.paddingBottom} ${computed.paddingLeft}`,
        gap: computed.gap || 'n/a',
      },
      typography: {
        fontFamily: computed.fontFamily.split(',')[0].replace(/['"]/g, ''),
        fontSize: computed.fontSize,
        fontWeight: computed.fontWeight,
        lineHeight: computed.lineHeight,
        color: computed.color,
      },
      background: computed.backgroundColor,
      border: computed.border,
      display: computed.display,
      element: el,
    };
  };

  const rgbToHex = (rgb: string): string => {
    const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return rgb;
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`.toUpperCase();
  };

  const handleColorPick = async () => {
    if (!('EyeDropper' in window)) {
      alert('EyeDropper API not supported in this browser');
      return;
    }

    try {
      // @ts-ignore - EyeDropper is experimental
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      setPickedColor(result.sRGBHex);
      navigator.clipboard.writeText(result.sRGBHex);
    } catch (e) {
      console.log('Color picker cancelled');
    }
  };

  const getElementLabel = (el: HTMLElement): string => {
    if (el.id) return `${el.tagName.toLowerCase()}#${el.id}`;
    if (el.classList.length > 0) {
      return `${el.tagName.toLowerCase()}.${Array.from(el.classList).slice(0, 2).join('.')}`;
    }
    return el.tagName.toLowerCase();
  };

  const getSpacingGuide = (target: HTMLElement): SpacingGuide | null => {
    const container = target.parentElement;
    if (!container) return null;

    const elementRect = target.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    return {
      elementRect,
      containerRect,
      containerLabel: getElementLabel(container),
      distances: {
        top: Math.round(elementRect.top - containerRect.top),
        right: Math.round(containerRect.right - elementRect.right),
        bottom: Math.round(containerRect.bottom - elementRect.bottom),
        left: Math.round(elementRect.left - containerRect.left),
      },
    };
  };

  /**
   * Calculate spacing to sibling elements in the DOM
   * Finds the nearest sibling in each direction (top, right, bottom, left)
   */
  const getSiblingSpacings = (target: HTMLElement): SiblingSpacing[] => {
    const container = target.parentElement;
    if (!container) return [];

    const siblings = Array.from(container.children).filter(
      (child) => child !== target && child instanceof HTMLElement
    ) as HTMLElement[];

    if (siblings.length === 0) return [];

    const targetRect = target.getBoundingClientRect();
    const spacings: SiblingSpacing[] = [];

    // Track closest sibling in each direction
    let closestTop: { el: HTMLElement; distance: number } | null = null;
    let closestRight: { el: HTMLElement; distance: number } | null = null;
    let closestBottom: { el: HTMLElement; distance: number } | null = null;
    let closestLeft: { el: HTMLElement; distance: number } | null = null;

    for (const sibling of siblings) {
      const sibRect = sibling.getBoundingClientRect();

      // Skip elements with no dimensions (hidden, display:none)
      if (sibRect.width === 0 || sibRect.height === 0) continue;

      // Check if sibling is above (its bottom edge is above our top edge)
      // and horizontally overlapping
      if (sibRect.bottom <= targetRect.top) {
        const hOverlap = !(sibRect.right < targetRect.left || sibRect.left > targetRect.right);
        if (hOverlap) {
          const distance = targetRect.top - sibRect.bottom;
          if (!closestTop || distance < closestTop.distance) {
            closestTop = { el: sibling, distance };
          }
        }
      }

      // Check if sibling is to the right (its left edge is past our right edge)
      // and vertically overlapping
      if (sibRect.left >= targetRect.right) {
        const vOverlap = !(sibRect.bottom < targetRect.top || sibRect.top > targetRect.bottom);
        if (vOverlap) {
          const distance = sibRect.left - targetRect.right;
          if (!closestRight || distance < closestRight.distance) {
            closestRight = { el: sibling, distance };
          }
        }
      }

      // Check if sibling is below (its top edge is below our bottom edge)
      // and horizontally overlapping
      if (sibRect.top >= targetRect.bottom) {
        const hOverlap = !(sibRect.right < targetRect.left || sibRect.left > targetRect.right);
        if (hOverlap) {
          const distance = sibRect.top - targetRect.bottom;
          if (!closestBottom || distance < closestBottom.distance) {
            closestBottom = { el: sibling, distance };
          }
        }
      }

      // Check if sibling is to the left (its right edge is before our left edge)
      // and vertically overlapping
      if (sibRect.right <= targetRect.left) {
        const vOverlap = !(sibRect.bottom < targetRect.top || sibRect.top > targetRect.bottom);
        if (vOverlap) {
          const distance = targetRect.left - sibRect.right;
          if (!closestLeft || distance < closestLeft.distance) {
            closestLeft = { el: sibling, distance };
          }
        }
      }
    }

    // Build result array with found siblings
    if (closestTop) {
      spacings.push({
        direction: 'top',
        distance: Math.round(closestTop.distance),
        siblingRect: closestTop.el.getBoundingClientRect(),
        siblingLabel: getElementLabel(closestTop.el),
      });
    }
    if (closestRight) {
      spacings.push({
        direction: 'right',
        distance: Math.round(closestRight.distance),
        siblingRect: closestRight.el.getBoundingClientRect(),
        siblingLabel: getElementLabel(closestRight.el),
      });
    }
    if (closestBottom) {
      spacings.push({
        direction: 'bottom',
        distance: Math.round(closestBottom.distance),
        siblingRect: closestBottom.el.getBoundingClientRect(),
        siblingLabel: getElementLabel(closestBottom.el),
      });
    }
    if (closestLeft) {
      spacings.push({
        direction: 'left',
        distance: Math.round(closestLeft.distance),
        siblingRect: closestLeft.el.getBoundingClientRect(),
        siblingLabel: getElementLabel(closestLeft.el),
      });
    }

    console.log('[DevTools] Sibling spacings for', getElementLabel(target), ':', spacings);
    return spacings;
  };

  const handleInspectorClick = useCallback((e: MouseEvent) => {
    if (activeTool !== 'inspector') return;

    const target = e.target as HTMLElement;
    if (overlayRef.current?.contains(target)) return;

    e.preventDefault();
    e.stopPropagation();

    setSelectedElement(getElementInfo(target));
    setActiveTool('none');
    setHighlightBox(null);
    setSpacingGuide(null);
    setSiblingSpacings([]);
  }, [activeTool]);

  const handleInspectorHover = useCallback((e: MouseEvent) => {
    if (activeTool !== 'inspector') return;

    const target = e.target as HTMLElement;
    if (overlayRef.current?.contains(target)) return;

    setHoveredElement(target);
    setHighlightBox(target.getBoundingClientRect());
    if (showSpacingGuides) {
      setSpacingGuide(getSpacingGuide(target));
      setSiblingSpacings(getSiblingSpacings(target));
    } else {
      setSpacingGuide(null);
      setSiblingSpacings([]);
    }
  }, [activeTool, showSpacingGuides]);

  useEffect(() => {
    if (activeTool === 'inspector') {
      document.addEventListener('click', handleInspectorClick, true);
      document.addEventListener('mousemove', handleInspectorHover, true);
      document.body.style.cursor = 'crosshair';
    }

    return () => {
      document.removeEventListener('click', handleInspectorClick, true);
      document.removeEventListener('mousemove', handleInspectorHover, true);
      document.body.style.cursor = '';
    };
  }, [activeTool, handleInspectorClick, handleInspectorHover]);

  // Keyboard shortcut: Ctrl+Shift+D to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setActiveTool('none');
        setHighlightBox(null);
        setSpacingGuide(null);
        setSiblingSpacings([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-[9999] w-10 h-10 bg-ds-pink-600 hover:bg-ds-pink-500 text-white rounded-full shadow-lg flex items-center justify-center text-lg font-bold transition-colors"
        title="Open DevTools (Ctrl+Shift+D)"
      >
        <Wrench className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Global page grid overlay */}
      {showGridOverlay && (
        <div
          className="fixed inset-0 pointer-events-none z-[9994]"
          style={{
            backgroundImage: [
              'linear-gradient(rgba(241,160,255,0.14) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(241,160,255,0.14) 1px, transparent 1px)',
              'linear-gradient(rgba(101,128,225,0.24) 1px, transparent 1px)',
              'linear-gradient(90deg, rgba(101,128,225,0.24) 1px, transparent 1px)',
            ].join(','),
            backgroundSize: '8px 8px, 8px 8px, 64px 64px, 64px 64px',
          }}
        />
      )}

      {/* Highlight overlay for inspector */}
      {highlightBox && activeTool === 'inspector' && (
        <div
          className="fixed pointer-events-none z-[9997] border-2 border-ds-pink-500 bg-ds-pink-500/10"
          style={{
            top: highlightBox.top,
            left: highlightBox.left,
            width: highlightBox.width,
            height: highlightBox.height,
          }}
        >
          <div className="absolute -top-6 left-0 bg-ds-pink-600 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
            {hoveredElement?.tagName.toLowerCase()}
            {hoveredElement?.classList.length ? `.${Array.from(hoveredElement.classList).slice(0, 2).join('.')}` : ''}
          </div>
        </div>
      )}

      {/* Spacing guides: hovered element to parent container */}
      {showSpacingGuides && spacingGuide && activeTool === 'inspector' && (
        <>
          <div
            className="fixed pointer-events-none z-[9995] border border-cyan-400/70 bg-cyan-400/5"
            style={{
              top: spacingGuide.containerRect.top,
              left: spacingGuide.containerRect.left,
              width: spacingGuide.containerRect.width,
              height: spacingGuide.containerRect.height,
            }}
          >
            <div className="absolute -top-6 left-0 rounded bg-cyan-500 px-2 py-0.5 text-[10px] text-slate-900">
              container: {spacingGuide.containerLabel}
            </div>
          </div>

          {/* Top distance */}
          <div
            className="fixed pointer-events-none z-[9996] w-px bg-amber-400/90"
            style={{
              left: spacingGuide.elementRect.left + spacingGuide.elementRect.width / 2,
              top: spacingGuide.containerRect.top,
              height: Math.max(0, spacingGuide.elementRect.top - spacingGuide.containerRect.top),
            }}
          />
          <div
            className="fixed pointer-events-none z-[9996] rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-slate-900"
            style={{
              left: spacingGuide.elementRect.left + spacingGuide.elementRect.width / 2 + 6,
              top: spacingGuide.containerRect.top + (spacingGuide.elementRect.top - spacingGuide.containerRect.top) / 2 - 10,
            }}
          >
            {spacingGuide.distances.top}px
          </div>

          {/* Right distance */}
          <div
            className="fixed pointer-events-none z-[9996] h-px bg-amber-400/90"
            style={{
              top: spacingGuide.elementRect.top + spacingGuide.elementRect.height / 2,
              left: spacingGuide.elementRect.right,
              width: Math.max(0, spacingGuide.containerRect.right - spacingGuide.elementRect.right),
            }}
          />
          <div
            className="fixed pointer-events-none z-[9996] rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-slate-900"
            style={{
              top: spacingGuide.elementRect.top + spacingGuide.elementRect.height / 2 + 6,
              left: spacingGuide.elementRect.right + (spacingGuide.containerRect.right - spacingGuide.elementRect.right) / 2 - 12,
            }}
          >
            {spacingGuide.distances.right}px
          </div>

          {/* Bottom distance */}
          <div
            className="fixed pointer-events-none z-[9996] w-px bg-amber-400/90"
            style={{
              left: spacingGuide.elementRect.left + spacingGuide.elementRect.width / 2,
              top: spacingGuide.elementRect.bottom,
              height: Math.max(0, spacingGuide.containerRect.bottom - spacingGuide.elementRect.bottom),
            }}
          />
          <div
            className="fixed pointer-events-none z-[9996] rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-slate-900"
            style={{
              left: spacingGuide.elementRect.left + spacingGuide.elementRect.width / 2 + 6,
              top: spacingGuide.elementRect.bottom + (spacingGuide.containerRect.bottom - spacingGuide.elementRect.bottom) / 2 - 10,
            }}
          >
            {spacingGuide.distances.bottom}px
          </div>

          {/* Left distance */}
          <div
            className="fixed pointer-events-none z-[9996] h-px bg-amber-400/90"
            style={{
              top: spacingGuide.elementRect.top + spacingGuide.elementRect.height / 2,
              left: spacingGuide.containerRect.left,
              width: Math.max(0, spacingGuide.elementRect.left - spacingGuide.containerRect.left),
            }}
          />
          <div
            className="fixed pointer-events-none z-[9996] rounded bg-amber-500 px-1.5 py-0.5 text-[10px] text-slate-900"
            style={{
              top: spacingGuide.elementRect.top + spacingGuide.elementRect.height / 2 + 6,
              left: spacingGuide.containerRect.left + (spacingGuide.elementRect.left - spacingGuide.containerRect.left) / 2 - 12,
            }}
          >
            {spacingGuide.distances.left}px
          </div>
        </>
      )}

      {/* Sibling spacing guides: distances to adjacent elements */}
      {showSpacingGuides && siblingSpacings.length > 0 && activeTool === 'inspector' && highlightBox && (
        <>
          {siblingSpacings.map((spacing, index) => {
            const targetCenterX = highlightBox.left + highlightBox.width / 2;
            const targetCenterY = highlightBox.top + highlightBox.height / 2;
            const sibCenterX = spacing.siblingRect.left + spacing.siblingRect.width / 2;
            const sibCenterY = spacing.siblingRect.top + spacing.siblingRect.height / 2;

            // Render sibling highlight box (green tint)
            const siblingHighlight = (
              <div
                key={`sib-highlight-${index}`}
                className="fixed pointer-events-none z-[9994] border border-emerald-400/50 bg-emerald-400/10"
                style={{
                  top: spacing.siblingRect.top,
                  left: spacing.siblingRect.left,
                  width: spacing.siblingRect.width,
                  height: spacing.siblingRect.height,
                }}
              />
            );

            // Different rendering based on direction
            if (spacing.direction === 'top') {
              // Vertical line from sibling bottom to target top
              const lineX = Math.max(targetCenterX, sibCenterX);
              return (
                <React.Fragment key={`sib-${index}`}>
                  {siblingHighlight}
                  <div
                    className="fixed pointer-events-none z-[9996] w-0.5 bg-emerald-400"
                    style={{
                      left: lineX,
                      top: spacing.siblingRect.bottom,
                      height: spacing.distance,
                    }}
                  />
                  <div
                    className="fixed pointer-events-none z-[9996] rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-slate-900 font-medium"
                    style={{
                      left: lineX + 6,
                      top: spacing.siblingRect.bottom + spacing.distance / 2 - 8,
                    }}
                  >
                    {spacing.distance}px ↕
                  </div>
                </React.Fragment>
              );
            }

            if (spacing.direction === 'bottom') {
              const lineX = Math.max(targetCenterX, sibCenterX);
              return (
                <React.Fragment key={`sib-${index}`}>
                  {siblingHighlight}
                  <div
                    className="fixed pointer-events-none z-[9996] w-0.5 bg-emerald-400"
                    style={{
                      left: lineX,
                      top: highlightBox.bottom,
                      height: spacing.distance,
                    }}
                  />
                  <div
                    className="fixed pointer-events-none z-[9996] rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-slate-900 font-medium"
                    style={{
                      left: lineX + 6,
                      top: highlightBox.bottom + spacing.distance / 2 - 8,
                    }}
                  >
                    {spacing.distance}px ↕
                  </div>
                </React.Fragment>
              );
            }

            if (spacing.direction === 'right') {
              const lineY = Math.max(targetCenterY, sibCenterY);
              return (
                <React.Fragment key={`sib-${index}`}>
                  {siblingHighlight}
                  <div
                    className="fixed pointer-events-none z-[9996] h-0.5 bg-emerald-400"
                    style={{
                      top: lineY,
                      left: highlightBox.right,
                      width: spacing.distance,
                    }}
                  />
                  <div
                    className="fixed pointer-events-none z-[9996] rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-slate-900 font-medium"
                    style={{
                      top: lineY + 6,
                      left: highlightBox.right + spacing.distance / 2 - 16,
                    }}
                  >
                    {spacing.distance}px ↔
                  </div>
                </React.Fragment>
              );
            }

            if (spacing.direction === 'left') {
              const lineY = Math.max(targetCenterY, sibCenterY);
              return (
                <React.Fragment key={`sib-${index}`}>
                  {siblingHighlight}
                  <div
                    className="fixed pointer-events-none z-[9996] h-0.5 bg-emerald-400"
                    style={{
                      top: lineY,
                      left: spacing.siblingRect.right,
                      width: spacing.distance,
                    }}
                  />
                  <div
                    className="fixed pointer-events-none z-[9996] rounded bg-emerald-500 px-1.5 py-0.5 text-[10px] text-slate-900 font-medium"
                    style={{
                      top: lineY + 6,
                      left: spacing.siblingRect.right + spacing.distance / 2 - 16,
                    }}
                  >
                    {spacing.distance}px ↔
                  </div>
                </React.Fragment>
              );
            }

            return null;
          })}
        </>
      )}

      {/* Main panel */}
      <div
        ref={overlayRef}
        className="fixed bottom-4 right-4 z-[9999] w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl text-white text-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
          <span className="font-semibold text-ds-pink-400">DevTools</span>
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveTool('none');
              setHighlightBox(null);
              setSpacingGuide(null);
              setSiblingSpacings([]);
            }}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tools */}
        <div className="p-3 space-y-3">
          {/* Tool buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleColorPick}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                activeTool === 'picker'
                  ? 'bg-ds-pink-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Pipette className="w-4 h-4" />
              <span>Color Picker</span>
            </button>
            <button
              onClick={() => {
                const nextTool = activeTool === 'inspector' ? 'none' : 'inspector';
                setActiveTool(nextTool);
                if (nextTool !== 'inspector') {
                  setHighlightBox(null);
                  setSpacingGuide(null);
                  setSiblingSpacings([]);
                }
              }}
              className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                activeTool === 'inspector'
                  ? 'bg-ds-pink-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Inspector</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setShowGridOverlay(prev => !prev)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                showGridOverlay
                  ? 'bg-ds-pink-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Grid3X3 className="w-3.5 h-3.5" />
                Grid Overlay
              </span>
            </button>
            <button
              onClick={() => setShowSpacingGuides(prev => !prev)}
              className={`px-3 py-2 rounded text-xs font-medium transition-colors ${
                showSpacingGuides
                  ? 'bg-ds-pink-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <Ruler className="w-3.5 h-3.5" />
                Spacing Guides
              </span>
            </button>
          </div>

          {activeTool === 'inspector' && (
            <div className="text-xs text-slate-400 text-center py-1">
              Click any element to inspect, hover to preview • ESC to cancel
            </div>
          )}

          {/* Picked color display */}
          {pickedColor && (
            <div className="bg-slate-800 rounded p-2">
              <div className="text-xs text-slate-400 mb-1">Picked Color (copied)</div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-slate-600"
                  style={{ backgroundColor: pickedColor }}
                />
                <button
                  onClick={() => copyToClipboard(pickedColor)}
                  className="font-mono text-sm hover:text-ds-pink-400"
                >
                  {pickedColor}
                </button>
              </div>
            </div>
          )}

          {/* Selected element details */}
          {selectedElement && (
            <div className="bg-slate-800 rounded p-2 space-y-2 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Element</span>
                <button
                  onClick={() => setSelectedElement(null)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Clear
                </button>
              </div>

              {/* Tag & ID */}
              <div className="font-mono text-ds-pink-400">
                &lt;{selectedElement.tagName}
                {selectedElement.id && <span className="text-emerald-400">#{selectedElement.id}</span>}
                &gt;
              </div>

              {/* Classes */}
              {selectedElement.classList.length > 0 && (
                <div>
                  <div className="text-xs text-slate-500 mb-1">Classes</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedElement.classList.slice(0, 8).map((cls, i) => (
                      <button
                        key={i}
                        onClick={() => copyToClipboard(cls)}
                        className="text-xs bg-slate-700 px-1.5 py-0.5 rounded hover:bg-slate-600 font-mono truncate max-w-[120px]"
                        title={cls}
                      >
                        .{cls}
                      </button>
                    ))}
                    {selectedElement.classList.length > 8 && (
                      <span className="text-xs text-slate-500">+{selectedElement.classList.length - 8}</span>
                    )}
                  </div>
                </div>
              )}

              {/* Dimensions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Size: </span>
                  <span className="font-mono">{selectedElement.dimensions.width} × {selectedElement.dimensions.height}</span>
                </div>
                <div>
                  <span className="text-slate-500">Display: </span>
                  <span className="font-mono">{selectedElement.display}</span>
                </div>
              </div>

              {/* Spacing */}
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Margin: </span>
                  <span className="font-mono">{selectedElement.spacing.margin}</span>
                </div>
                <div>
                  <span className="text-slate-500">Padding: </span>
                  <span className="font-mono">{selectedElement.spacing.padding}</span>
                </div>
                <div>
                  <span className="text-slate-500">Gap: </span>
                  <span className="font-mono">{selectedElement.spacing.gap}</span>
                </div>
              </div>

              {/* Typography */}
              <div className="text-xs space-y-1">
                <div>
                  <span className="text-slate-500">Font: </span>
                  <span className="font-mono">{selectedElement.typography.fontFamily}</span>
                </div>
                <div>
                  <span className="text-slate-500">Size/Weight: </span>
                  <span className="font-mono">{selectedElement.typography.fontSize} / {selectedElement.typography.fontWeight}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-slate-500">Color: </span>
                  <div
                    className="w-3 h-3 rounded border border-slate-600"
                    style={{ backgroundColor: selectedElement.typography.color }}
                  />
                  <button
                    onClick={() => copyToClipboard(rgbToHex(selectedElement.typography.color))}
                    className="font-mono hover:text-ds-pink-400"
                  >
                    {rgbToHex(selectedElement.typography.color)}
                  </button>
                </div>
              </div>

              {/* Background */}
              {selectedElement.background !== 'rgba(0, 0, 0, 0)' && (
                <div className="text-xs flex items-center gap-1">
                  <span className="text-slate-500">BG: </span>
                  <div
                    className="w-3 h-3 rounded border border-slate-600"
                    style={{ backgroundColor: selectedElement.background }}
                  />
                  <button
                    onClick={() => copyToClipboard(rgbToHex(selectedElement.background))}
                    className="font-mono hover:text-ds-pink-400"
                  >
                    {rgbToHex(selectedElement.background)}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Keyboard shortcut hint */}
          <div className="text-xs text-slate-600 text-center pt-1">
            Ctrl+Shift+D to toggle
          </div>
        </div>
      </div>
    </>
  );
};

export default DevTools;
