"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Preload } from "@react-three/drei";
import * as THREE from "three";

import { DeskSetup } from "./DeskSetup";
import { PostProcessing } from "./PostProcessing";

// ═══════════════════════════════════════════════════════════════════════════════
// Loading Fallback - Shown while 3D assets load
// ═══════════════════════════════════════════════════════════════════════════════
function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshBasicMaterial color="#dc2626" wireframe />
    </mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Scene Component - Main 3D Canvas Setup
// ═══════════════════════════════════════════════════════════════════════════════
export function Scene() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.8,
          shadowMap: {
            enabled: true,
            type: THREE.PCFSoftShadowMap,
          },
        }}
        style={{ background: "#020617" }}
      >
        {/* Fixed Top-Down Camera */}
        <PerspectiveCamera
          makeDefault
          position={[0, 8, 4]}
          fov={35}
          near={0.1}
          far={100}
        />

        {/* Locked OrbitControls - Subtle parallax movement only */}
        <OrbitControls
          enableZoom={false}
          enableRotate={true}
          enablePan={false}
          // Lock rotation to subtle head movement
          minPolarAngle={Math.PI / 4}      // ~45° from top
          maxPolarAngle={Math.PI / 3}      // ~60° from top
          minAzimuthAngle={-Math.PI / 12}  // ~15° left
          maxAzimuthAngle={Math.PI / 12}   // ~15° right
          dampingFactor={0.05}
          enableDamping
          rotateSpeed={0.3}
          target={[0, 0, 0]}
        />

        {/* Main Scene Content */}
        <Suspense fallback={<LoadingFallback />}>
          <DeskSetup />
          <Preload all />
        </Suspense>

        {/* Post-processing Effects */}
        <PostProcessing />
      </Canvas>
    </div>
  );
}

export default Scene;

