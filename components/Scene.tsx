"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Noise,
  Vignette,
  Scanline,
  Bloom,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// Evidence Box - The central rotating mystery object
// ═══════════════════════════════════════════════════════════════════════════════
function EvidenceBox() {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);

  // Slow, mysterious rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.003;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y += 0.003;
      edgesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(2, 1.2, 1.5), []);
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(boxGeometry),
    [boxGeometry]
  );

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <group>
        {/* Main evidence box */}
        <mesh ref={meshRef} geometry={boxGeometry}>
          <meshStandardMaterial
            color="#1a1a24"
            metalness={0.8}
            roughness={0.2}
            envMapIntensity={0.5}
          />
        </mesh>

        {/* Glowing red edges */}
        <lineSegments ref={edgesRef} geometry={edgesGeometry}>
          <lineBasicMaterial color="#dc2626" linewidth={2} />
        </lineSegments>

        {/* Evidence tag on top */}
        <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.8, 0.4]} />
          <meshStandardMaterial
            color="#dc2626"
            emissive="#dc2626"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* "EVIDENCE" text simulation (simplified) */}
        <mesh position={[0, 0.62, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 0.15]} />
          <meshStandardMaterial
            color="#0a0a0f"
            transparent
            opacity={0.9}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Atmospheric particles - Dust in the air
// ═══════════════════════════════════════════════════════════════════════════════
function DustParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      particlesRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#dc2626"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Crime scene tape lines
// ═══════════════════════════════════════════════════════════════════════════════
function CrimeSceneLines() {
  return (
    <group>
      {/* Horizontal grid lines */}
      {[-3, -1.5, 1.5, 3].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y, -5]}>
          <planeGeometry args={[15, 0.005]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={0.15} />
        </mesh>
      ))}
      {/* Vertical grid lines */}
      {[-6, -3, 0, 3, 6].map((x, i) => (
        <mesh key={`v-${i}`} position={[x, 0, -5]}>
          <planeGeometry args={[0.005, 8]} />
          <meshBasicMaterial color="#dc2626" transparent opacity={0.1} />
        </mesh>
      ))}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Spotlight from above - Interrogation room style
// ═══════════════════════════════════════════════════════════════════════════════
function InterrogationLight() {
  return (
    <>
      {/* Main spotlight from above */}
      <spotLight
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={50}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      {/* Subtle red rim light */}
      <pointLight position={[-5, 2, -2]} intensity={2} color="#dc2626" />
      <pointLight position={[5, 2, -2]} intensity={1} color="#3b82f6" />
      {/* Ambient for minimal visibility in shadows */}
      <ambientLight intensity={0.05} color="#1a1a24" />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Post-processing effects - The noir terminal aesthetic
// ═══════════════════════════════════════════════════════════════════════════════
function NoirEffects() {
  return (
    <EffectComposer>
      {/* Film grain for that authentic noir feel */}
      <Noise
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.4}
      />
      
      {/* Dark vignette for focus */}
      <Vignette
        offset={0.3}
        darkness={0.9}
        blendFunction={BlendFunction.NORMAL}
      />
      
      {/* CRT scanlines for the 90s police terminal aesthetic */}
      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={1.5}
        opacity={0.1}
      />
      
      {/* Subtle bloom for the glowing elements */}
      <Bloom
        intensity={0.5}
        luminanceThreshold={0.6}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
      
      {/* Chromatic aberration for that worn VHS look */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0005, 0.0005)}
      />
    </EffectComposer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Scene Component
// ═══════════════════════════════════════════════════════════════════════════════
export default function Scene() {
  return (
    <div className="canvas-container">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [0, 0, 6],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        style={{
          background: "linear-gradient(180deg, #0a0a0f 0%, #1a1a24 50%, #0a0a0f 100%)",
        }}
      >
        {/* Camera controls - drag to rotate, scroll to zoom */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />

        {/* Lighting setup */}
        <InterrogationLight />

        {/* Main evidence object */}
        <EvidenceBox />

        {/* Atmospheric elements */}
        <DustParticles />
        <CrimeSceneLines />

        {/* Environment for reflections */}
        <Environment preset="night" />

        {/* Post-processing for noir aesthetic */}
        <NoirEffects />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top left - Case file header */}
        <div className="absolute top-6 left-6">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Case File Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-wider mt-2 text-evidence">
            RED PROTOCOL
          </h1>
          <p className="text-xs text-slate-600 mt-1 tracking-widest">
            CLASSIFICATION: NOIR-XMAS-2024
          </p>
        </div>

        {/* Top right - Status indicator */}
        <div className="absolute top-6 right-6 text-right">
          <div className="text-xs text-slate-600 uppercase tracking-widest">
            Evidence Status
          </div>
          <div className="text-terminal text-sm mt-1 font-bold">
            ● PROCESSING
          </div>
        </div>

        {/* Bottom left - Instructions */}
        <div className="absolute bottom-6 left-6">
          <p className="text-xs text-slate-700 uppercase tracking-widest">
            [Drag to rotate] [Scroll to zoom]
          </p>
        </div>

        {/* Bottom right - Investigation ID */}
        <div className="absolute bottom-6 right-6 text-right">
          <p className="text-xs text-slate-700 font-mono">
            INV-{new Date().getFullYear()}-
            {String(Math.floor(Math.random() * 9999)).padStart(4, "0")}
          </p>
        </div>

        {/* Center bottom - Encrypted message */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <p className="text-xs text-red-900/50 uppercase tracking-[0.5em] animate-pulse">
            ▓▓▓ DECRYPTING ▓▓▓
          </p>
        </div>
      </div>
    </div>
  );
}

