'use client';

import { Suspense, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useGPUDetect, type GPUTier } from '@/hooks/useGPUDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './SceneWrapper.module.css';

interface SceneWrapperProps {
  children: (gpuTier: GPUTier) => ReactNode;
  /** CSS class for the container */
  className?: string;
  /** Allow pointer events on the canvas (for interactive scenes) */
  interactive?: boolean;
  /** Camera field of view */
  fov?: number;
  /** Camera position */
  cameraPosition?: [number, number, number];
  /** Fallback content when WebGL is unavailable */
  fallback?: ReactNode;
}

/**
 * Wraps a React Three Fiber Canvas with:
 * - GPU tier detection (passes tier to children for adaptive quality)
 * - Reduced motion support (hides 3D entirely)
 * - WebGL fallback (shows 2D content if no WebGL)
 * - Loading suspense boundary
 */
export default function SceneWrapper({
  children,
  className = '',
  interactive = false,
  fov = 45,
  cameraPosition = [0, 0, 5],
  fallback = null,
}: SceneWrapperProps) {
  const gpuTier = useGPUDetect();
  const prefersReduced = useReducedMotion();

  // If user prefers reduced motion or no WebGL, show fallback
  if (prefersReduced || gpuTier === 'fallback') {
    return fallback ? <>{fallback}</> : null;
  }

  return (
    <div
      className={`${styles.container} ${interactive ? styles.interactive : ''} ${className}`}
    >
      <Canvas
        camera={{ position: cameraPosition, fov }}
        dpr={gpuTier === 'high' ? [1, 2] : [1, 1.5]}
        gl={{
          antialias: gpuTier === 'high',
          alpha: true,
          powerPreference: gpuTier === 'high' ? 'high-performance' : 'default',
        }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {children(gpuTier)}
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
