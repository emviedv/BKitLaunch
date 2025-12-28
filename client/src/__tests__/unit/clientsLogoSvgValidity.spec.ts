/**
 * Tests for client logo SVG validity
 * Ensures all SVG files have proper structure for rendering
 */
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

describe('Client Logo SVG Validity', () => {
  // Navigate from client/src/__tests__/unit/ to project root, then to public/clients
  const clientsDir = join(__dirname, '../../../../public/clients');
  const svgFiles = readdirSync(clientsDir).filter((f) => f.endsWith('.svg'));

  describe.each(svgFiles)('%s', (filename) => {
    const filepath = join(clientsDir, filename);
    let content: string;

    beforeAll(() => {
      content = readFileSync(filepath, 'utf-8');
    });

    it('should have a viewBox attribute for proper scaling', () => {
      const hasViewBox = /viewBox\s*=\s*["'][^"']+["']/i.test(content);
      expect(hasViewBox).toBe(true);
    });

    it('should be valid XML (no XML declaration for web use)', () => {
      // XML declarations can cause issues in some browsers when loaded as <img>
      const hasXmlDecl = content.trimStart().startsWith('<?xml');
      expect(hasXmlDecl).toBe(false);
    });

    it('should not have excessive width/height attributes', () => {
      // Extract just the opening <svg> tag to avoid matching internal elements like <rect>
      const svgTagMatch = content.match(/<svg([^>]*)>/i);
      const svgAttrs = svgTagMatch ? svgTagMatch[1] : '';

      const widthMatch = svgAttrs.match(/\bwidth\s*=\s*["']?(\d+)/i);
      const heightMatch = svgAttrs.match(/\bheight\s*=\s*["']?(\d+)/i);

      const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
      const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;

      // SVGs should rely on viewBox for scaling, not fixed dimensions
      // If present, dimensions should be reasonable (< 100px for icons)
      if (width > 0) {
        expect(width).toBeLessThanOrEqual(100);
      }
      if (height > 0) {
        expect(height).toBeLessThanOrEqual(100);
      }
    });

    it('should have xmlns attribute', () => {
      const hasXmlns = /xmlns\s*=\s*["']http:\/\/www\.w3\.org\/2000\/svg["']/i.test(content);
      expect(hasXmlns).toBe(true);
    });
  });
});
