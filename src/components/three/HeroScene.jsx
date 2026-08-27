import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import { EffectComposer, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

import ParticleNetwork from './ParticleNetwork';
/**
 * Home page hero 3D scene (Light Mode).
 * Features subtle floating shapes, a refined particle network,
 * and mouse-reactive camera movement without blowing out the white background.
 */
export default function HeroScene({ gpuTier }) {
  return (
    <>
      {/* Lighting - Bright for light mode */}
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={1.0} color="#f8f9fc" />
      <pointLight position={[0, 0, 5]} intensity={0.8} color="#eef2f9" />

      {/* Environment for reflections (studio is good for light themes) */}
      {gpuTier === 'high' && (
        <Environment preset="studio" environmentIntensity={0.8} />
      )}

      {/* 3D Shapes Removed per user request */}

      {/* Particle Network - subtle structural lines */}
      <ParticleNetwork
        gpuTier={gpuTier}
        count={80}
        spread={12}
        connectionDistance={3.0}
        particleSize={0.02}
        color="#2d5a8e"
        connectionColor="#1e3a5f"
      />

      {/* Sparkles - Very subtle dust effect */}
      {gpuTier !== 'low' && (
        <Sparkles
          count={30}
          scale={15}
          size={1}
          speed={0.2}
          color="#b8860b"
          opacity={0.3}
        />
      )}

      {/* Mouse-Reactive Camera */}
      <MouseCamera />

      {/* Post-Processing (high-end only) */}
      {gpuTier === 'high' && (
        <EffectComposer>
          {/* Subtle vignette to frame the content without darkening too much */}
          <Vignette eskil={false} offset={0.05} darkness={0.3} />
        </EffectComposer>
      )}
    </>
  );
}

/**
 * Subtly moves the camera based on mouse position for parallax depth.
 */
function MouseCamera() {
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useFrame(() => {
    // Smoothly interpolate camera position toward mouse
    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.2;

    camera.position.x += (targetX - camera.position.x) * 0.02;
    camera.position.y += (targetY - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);
  });

  // Track mouse on window
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  return null;
}