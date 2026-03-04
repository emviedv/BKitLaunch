import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wrench, X, Pipette, Search } from 'lucide-react';

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

const DevTools: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ActiveTool>('none');
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [highlightBox, setHighlightBox] = useState<DOMRect | null>(null);
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

  const handleInspectorClick = useCallback((e: MouseEvent) => {
    if (activeTool !== 'inspector') return;

    const target = e.target as HTMLElement;
    if (overlayRef.current?.contains(target)) return;

    e.preventDefault();
    e.stopPropagation();

    setSelectedElement(getElementInfo(target));
    setActiveTool('none');
    setHighlightBox(null);
  }, [activeTool]);

  const handleInspectorHover = useCallback((e: MouseEvent) => {
    if (activeTool !== 'inspector') return;

    const target = e.target as HTMLElement;
    if (overlayRef.current?.contains(target)) return;

    setHoveredElement(target);
    setHighlightBox(target.getBoundingClientRect());
  }, [activeTool]);

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
              onClick={() => setActiveTool(activeTool === 'inspector' ? 'none' : 'inspector')}
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

          {activeTool === 'inspector' && (
            <div className="text-xs text-slate-400 text-center py-1">
              Click any element to inspect • ESC to cancel
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
