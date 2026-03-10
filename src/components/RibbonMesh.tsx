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
      
      // Increase wave frequency and amplitude based on scroll (reduced)
      float waveFreq = 2.0 + uScroll * 1.5;
      float waveAmp = 0.2 + uScroll * 0.6;
      
      // Animated distortion along the surface (slower, gentler time multiplier)
      float distortion = sin(pos.x * waveFreq + uTime * 0.8) * waveAmp + cos(pos.z * waveFreq + uTime * 0.5) * (waveAmp * 0.5);
      
      // Add a secondary high-frequency wave that appears on scroll (slower time, reduced amplitude)
      float detailWave = sin(pos.x * 10.0 - uTime * 1.0) * (uScroll * 0.1);
      
      pos.y += distortion + detailWave;

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
    uniform float uScroll;

    void main() {
      // Color palette: Deep Blue to Vibrant Green (GoZoom Palette)
      vec3 darkBlue = vec3(0.01, 0.04, 0.15); // Deeper navy
      vec3 electricBlue = vec3(0.0, 0.64, 1.0); // #00A3FF
      vec3 vibrantGreen = vec3(0.18, 1.0, 0.48); // #2DFF7A
      
      // Base gradient moving along the ribbon
      float gradient = sin(vUv.x * 10.0 - uTime * 0.5) * 0.5 + 0.5;
      vec3 baseColor = mix(electricBlue, vibrantGreen, gradient);
      
      // Fresnel effect for 3D volume and edge highlighting
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      // Sharper fresnel for edges
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 1.5);
      
      // Glowing edge highlight (using fresnel + pulse, slowed down)
      float pulse = sin(vUv.x * 50.0 - uTime * 1.5) * 0.5 + 0.5;
      vec3 edgeGlow = vibrantGreen * fresnel * (0.5 + pulse * 1.5);
      
      // Combine colors
      vec3 finalColor = mix(darkBlue, baseColor, 0.7) + edgeGlow;
      
      // Transparency logic - becomes fully opaque as it engulfs the screen
      float alpha = mix(0.85 + fresnel * 0.15, 1.0, uScroll);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;

  useFrame((state) => {
    let smoothScroll = scrollProgress.current;
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Smoothly interpolate scroll uniform
      materialRef.current.uniforms.uScroll.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uScroll.value,
        scrollProgress.current,
        0.1
      );
      smoothScroll = materialRef.current.uniforms.uScroll.value;
    }

    if (meshRef.current) {
      // Idle floating
      const idleY = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

      // Scale up massively as we scroll down to cover the screen
      // Linear huge growth ensures it completely fills the viewport (reduced rate)
      const scale = 1.0 + smoothScroll * 30.0;
      meshRef.current.scale.set(scale, scale, scale);

      // Move towards the camera to engulf the view
      // Camera ends up at z=8. Ribbon center at z=5. 
      // With scale 30, ribbon z goes from -60 to 60. So camera is well inside it.
      meshRef.current.position.z = smoothScroll * 5.0;
      meshRef.current.position.y = idleY;

      // Rotate exactly 180 degrees (Math.PI) by the end of the scroll
      meshRef.current.rotation.z = smoothScroll * Math.PI;
      meshRef.current.rotation.x = smoothScroll * Math.PI * 0.1; // Keep slight X tilt for depth
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
