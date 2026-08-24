import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Reusable floating glassmorphic geometric shapes.
 * Used in the hero section and across multiple pages.
 * Adapts complexity based on GPU tier.
 */
export default function FloatingShapes({
  gpuTier,
  count = 6,
  spread = 4,
  colors = ['#4d7cff', '#f5c542', '#2dd4bf', '#7ba3ff', '#ffd96a', '#5eead4'],
}) {
  const actualCount = gpuTier === 'low' ? Math.min(count, 3) : count;

  const shapes = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      scale: 0.3 + Math.random() * 0.5,
      geometry: ['icosahedron', 'octahedron', 'torus', 'dodecahedron'][
        i % 4
      ],
      color: colors[i % colors.length],
      speed: 0.2 + Math.random() * 0.3,
      floatIntensity: 0.5 + Math.random() * 1,
    }));
  }, [actualCount, spread, colors]);

  return (
    <group>
      {shapes.map((shape, i) => (
        <FloatingShape
          key={i}
          config={shape}
          gpuTier={gpuTier}
        />
      ))}
    </group>
  );
}

function FloatingShape({
  config,
  gpuTier,
}) {
  const meshRef = useRef(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime * config.speed;
    meshRef.current.rotation.x += 0.003;
    meshRef.current.rotation.y += 0.005;
    meshRef.current.position.y =
      config.position[1] + Math.sin(t) * 0.3 * config.floatIntensity;
  });

  const geometryNode = useMemo(() => {
    switch (config.geometry) {
      case 'icosahedron':
        return <icosahedronGeometry args={[1, gpuTier === 'high' ? 1 : 0]} />;
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />;
      case 'torus':
        return (
          <torusGeometry
            args={[0.7, 0.3, gpuTier === 'high' ? 16 : 8, gpuTier === 'high' ? 32 : 16]}
          />
        );
      case 'dodecahedron':
        return <dodecahedronGeometry args={[1, 0]} />;
      default:
        return <icosahedronGeometry args={[1, 0]} />;
    }
  }, [config.geometry, gpuTier]);

  return (
    <Float
      speed={config.speed * 2}
      rotationIntensity={0.4}
      floatIntensity={config.floatIntensity}
    >
      <mesh
        ref={meshRef}
        position={config.position}
        rotation={config.rotation}
        scale={config.scale}
      >
        {geometryNode}
        {gpuTier === 'high' ? (
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.5}
            chromaticAberration={0.1}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.0}
            color={config.color}
            roughness={0.15}
            transmission={0.8}
            clearcoat={1}
            ior={1.5}
            transparent
            opacity={0.9}
          />
        ) : (
          <meshStandardMaterial
            color={config.color}
            transparent
            opacity={0.6}
            roughness={0.3}
            metalness={0.2}
          />
        )}
      </mesh>
    </Float>
  );
}
