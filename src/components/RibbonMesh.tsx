import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RibbonMeshProps {
  scrollProgress: React.MutableRefObject<number>;
  isMobile: boolean;
}

export default function RibbonMesh({ scrollProgress, isMobile }: RibbonMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Procedural curved geometry
  const curve = useMemo(() => {
    const points = [];
    const segments = 200;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Long sweeping curve spanning across the screen
      const x = (t - 0.5) * 35; 
      const y = Math.sin(t * Math.PI * 3) * 2.5;
      const z = Math.cos(t * Math.PI * 2) * 2.0;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points, false);
  }, []);

  // Smooth subdivisions
  const geometry = useMemo(() => {
    // High segments for smooth distortion
    const geo = new THREE.TubeGeometry(curve, 400, isMobile ? 0.4 : 0.8, 64, false);
    // Flatten the tube to make it a ribbon
    geo.scale(1, 0.02, 1);
    geo.computeVertexNormals();
    return geo;
  }, [curve, isMobile]);

  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    uniform float uTime;
    uniform float uScroll;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Subtle animated distortion along the surface
      float distortion = sin(pos.x * 2.0 + uTime * 2.0) * 0.2 + cos(pos.z * 2.0 + uTime) * 0.1;
      pos.y += distortion;
      
      // Scroll-based movement (moves up and forward)
      pos.y += uScroll * 12.0;
      pos.z += uScroll * 4.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    uniform float uTime;

    void main() {
      // Color palette: Deep Blue to Bright Cyan
      vec3 darkBlue = vec3(0.02, 0.08, 0.25);
      vec3 midBlue = vec3(0.0, 0.3, 0.8);
      vec3 cyan = vec3(0.0, 0.8, 1.0);
      
      // Base gradient moving along the ribbon
      float gradient = sin(vUv.x * 10.0 - uTime * 0.5) * 0.5 + 0.5;
      vec3 baseColor = mix(darkBlue, midBlue, gradient);
      
      // Fresnel effect for 3D volume and edge highlighting
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      // Sharper fresnel for edges
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 1.5);
      
      // Glowing edge highlight (using fresnel + pulse)
      float pulse = sin(vUv.x * 50.0 - uTime * 5.0) * 0.5 + 0.5;
      vec3 edgeGlow = cyan * fresnel * (0.5 + pulse * 1.5);
      
      // Combine colors
      vec3 finalColor = baseColor + edgeGlow;
      
      // Transparency logic
      float alpha = 0.85 + fresnel * 0.15;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate scroll uniform
      materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScroll.value,
        scrollProgress.current,
        0.1
      );
    }

    if (meshRef.current) {
      // Only idle floating, NO mouse rotation
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
        }}
        transparent={true}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
