import { useEffect, useState } from 'react';

/**
 * Detect GPU capability tier for adaptive 3D quality.
 * - high: Full post-processing, max particles, custom shaders
 * - medium: Reduced particles, no post-processing
 * - low: Minimal 3D, basic geometries only
 * - fallback: No WebGL — use 2D CSS animations
 */
export function useGPUDetect() {
  const [tier, setTier] = useState('high');

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') || canvas.getContext('webgl');

      if (!gl) {
        setTier('fallback');
        return;
      }

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = debugInfo
        ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase()
        : '';

      // Check for software renderers or known weak GPUs
      const isLowEnd =
        renderer.includes('swiftshader') ||
        renderer.includes('llvmpipe') ||
        renderer.includes('software') ||
        renderer.includes('mesa');

      const isMobile = /android|iphone|ipad|ipod/i.test(
        navigator.userAgent
      );

      if (isLowEnd) {
        setTier('low');
      } else if (isMobile) {
        setTier('medium');
      } else {
        // Check max texture size as a rough capability proxy
        const maxTexSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTexSize < 4096) {
          setTier('medium');
        } else {
          setTier('high');
        }
      }

      // Clean up
      const loseContext = gl.getExtension('WEBGL_lose_context');
      if (loseContext) loseContext.loseContext();
    } catch {
      setTier('fallback');
    }
  }, []);

  return tier;
}
