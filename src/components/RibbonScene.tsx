import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, PerspectiveCamera, Text } from '@react-three/drei';
import RibbonMesh from './RibbonMesh';
import * as THREE from 'three';

interface RibbonSceneProps {
  scrollProgress: React.MutableRefObject<number>;
  isMobile: boolean;
}

function AnimatedText({ scrollProgress, isMobile }: { scrollProgress: React.MutableRefObject<number>, isMobile: boolean }) {
  const textRef = useRef<any>(null);

  useFrame(() => {
    if (textRef.current) {
      // Move text down slightly as we scroll (medium speed parallax)
      const targetY = -scrollProgress.current * 3;
      textRef.current.position.y = THREE.MathUtils.lerp(textRef.current.position.y, targetY, 0.1);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <Text
        ref={textRef}
        position={[0, 0, -2]}
        fontSize={isMobile ? 1 : 1.8}
        maxWidth={isMobile ? 6 : 12}
        lineHeight={1.1}
        textAlign="center"
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        We turn ideas into{'\n'}software
        <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.8} />
      </Text>
    </Float>
  );
}

function AnimatedCamera({ scrollProgress, isMobile }: { scrollProgress: React.MutableRefObject<number>, isMobile: boolean }) {
  useFrame((state) => {
    // Move camera slightly forward and up during scroll
    const targetZ = 10 - scrollProgress.current * 2;
    const targetY = scrollProgress.current * 1;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.1);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.1);
    state.camera.lookAt(0, 0, 0);
  });
  return <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={isMobile ? 60 : 45} />;
}

export default function RibbonScene({ scrollProgress, isMobile }: RibbonSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-10">
      <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <AnimatedCamera scrollProgress={scrollProgress} isMobile={isMobile} />
          
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00ffff" />
          
          {/* 3D Text that intersects with the ribbon */}
          <AnimatedText scrollProgress={scrollProgress} isMobile={isMobile} />

          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <RibbonMesh scrollProgress={scrollProgress} isMobile={isMobile} />
          </Float>
        </Suspense>
      </Canvas>
    </div>
  );
}
