import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { useGPUDetect } from '@/hooks/useGPUDetect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import styles from './SceneWrapper.module.css';

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
}) {
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
