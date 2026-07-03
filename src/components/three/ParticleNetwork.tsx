'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { GPUTier } from '@/hooks/useGPUDetect';

interface ParticleNetworkProps {
  gpuTier: GPUTier;
  count?: number;
  spread?: number;
  connectionDistance?: number;
  particleSize?: number;
  color?: string;
  connectionColor?: string;
}

/**
 * A particle network that renders points connected by lines when close enough.
 * Used as a background element representing the venture ecosystem interconnections.
 * Uses InstancedMesh for optimal performance.
 */
export default function ParticleNetwork({
  gpuTier,
  count = 80,
  spread = 8,
  connectionDistance = 2,
  particleSize = 0.03,
  color = '#4d7cff',
  connectionColor = '#4d7cff',
}: ParticleNetworkProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const actualCount =
    gpuTier === 'high' ? count : gpuTier === 'medium' ? Math.floor(count * 0.6) : Math.floor(count * 0.3);

  // Generate particle positions and velocities
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const vel = new Float32Array(actualCount * 3);

    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * spread;
      pos[i3 + 1] = (Math.random() - 0.5) * spread;
      pos[i3 + 2] = (Math.random() - 0.5) * spread;

      vel[i3] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.005;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.003;
    }

    return { positions: pos, velocities: vel };
  }, [actualCount, spread]);

  // Pre-allocate line geometry (max possible connections)
  const maxConnections = actualCount * 6; // rough upper bound
  const linePositions = useMemo(
    () => new Float32Array(maxConnections * 6),
    [maxConnections]
  );
  const lineOpacities = useMemo(
    () => new Float32Array(maxConnections * 2),
    [maxConnections]
  );

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;

    const posArray = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const halfSpread = spread / 2;

    // Animate particles
    for (let i = 0; i < actualCount; i++) {
      const i3 = i * 3;
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Bounce within bounds
      if (Math.abs(posArray[i3]) > halfSpread) velocities[i3] *= -1;
      if (Math.abs(posArray[i3 + 1]) > halfSpread) velocities[i3 + 1] *= -1;
      if (Math.abs(posArray[i3 + 2]) > halfSpread) velocities[i3 + 2] *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Calculate connections
    let lineIndex = 0;
    for (let i = 0; i < actualCount; i++) {
      for (let j = i + 1; j < actualCount; j++) {
        const i3 = i * 3;
        const j3 = j * 3;
        const dx = posArray[i3] - posArray[j3];
        const dy = posArray[i3 + 1] - posArray[j3 + 1];
        const dz = posArray[i3 + 2] - posArray[j3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < connectionDistance && lineIndex < maxConnections) {
          const li = lineIndex * 6;
          linePositions[li] = posArray[i3];
          linePositions[li + 1] = posArray[i3 + 1];
          linePositions[li + 2] = posArray[i3 + 2];
          linePositions[li + 3] = posArray[j3];
          linePositions[li + 4] = posArray[j3 + 1];
          linePositions[li + 5] = posArray[j3 + 2];

          const opacity = 1 - dist / connectionDistance;
          lineOpacities[lineIndex * 2] = opacity;
          lineOpacities[lineIndex * 2 + 1] = opacity;

          lineIndex++;
        }
      }
    }

    // Update line geometry
    const lineGeom = linesRef.current.geometry;
    lineGeom.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions.slice(0, lineIndex * 6), 3)
    );
    lineGeom.setDrawRange(0, lineIndex * 2);
    lineGeom.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={actualCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={particleSize}
          color={color}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Connection Lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial
          color={connectionColor}
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}
