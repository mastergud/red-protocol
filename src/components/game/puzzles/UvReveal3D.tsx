"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - UV Light Reveal Puzzle
// Toggle UV light to reveal hidden text/patterns on objects
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { DayData } from "@/src/types/game.types";
import { useGameStore } from "@/src/store/gameStore";

interface UvReveal3DProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// UV Light Spotlight
// ═══════════════════════════════════════════════════════════════════════════════
function UvLightSource({ isActive }: { isActive: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null);

  const { intensity } = useSpring({
    intensity: isActive ? 50 : 0,
    config: { mass: 1, tension: 200, friction: 30 },
  });

  // Flicker effect when active
  useFrame((state) => {
    if (lightRef.current && isActive) {
      const flicker = Math.sin(state.clock.elapsedTime * 20) * 2;
      lightRef.current.intensity = 50 + flicker;
    }
  });

  return (
    <animated.spotLight
      ref={lightRef}
      position={[0, 3, 2]}
      angle={0.5}
      penumbra={0.5}
      intensity={intensity}
      color="#7c3aed" // Purple UV light
      castShadow={false}
      target-position={[0, 0, 0]}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Business Card with Hidden Text
// ═══════════════════════════════════════════════════════════════════════════════
function BusinessCard({
  isUvActive,
  onReveal,
}: {
  isUvActive: boolean;
  onReveal: () => void;
}) {
  const [hasRevealed, setHasRevealed] = useState(false);
  const cardRef = useRef<THREE.Group>(null);

  // Card floating animation
  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.02;
    }
  });

  // Trigger reveal callback when UV is first activated
  const { hiddenTextOpacity } = useSpring({
    hiddenTextOpacity: isUvActive ? 1 : 0,
    config: { duration: 500 },
    onRest: () => {
      if (isUvActive && !hasRevealed) {
        setHasRevealed(true);
        setTimeout(onReveal, 1000);
      }
    },
  });

  return (
    <group ref={cardRef} position={[0, 0.5, 0]}>
      {/* Card base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.02, 0.8]} />
        <meshStandardMaterial
          color="#f5f5f5"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Hidden text - only visible under UV */}
      <animated.group position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <Text
          fontSize={0.2}
          color="#7c3aed"
          anchorX="center"
          anchorY="middle"
          material-transparent
          material-opacity={hiddenTextOpacity}
        >
          8821
        </Text>
      </animated.group>

      {/* UV reactive border */}
      {isUvActive && (
        <mesh position={[0, 0.011, 0]}>
          <boxGeometry args={[1.35, 0.001, 0.75]} />
          <meshBasicMaterial color="#7c3aed" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Card shadow/depth */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[1.42, 0.01, 0.82]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.95} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// UV Light Toggle Button (3D)
// ═══════════════════════════════════════════════════════════════════════════════
function UvToggleButton({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const { scale, emissive } = useSpring({
    scale: hovered ? 1.1 : 1,
    emissive: isActive ? 0.8 : 0,
    config: { mass: 1, tension: 300, friction: 20 },
  });

  return (
    <animated.mesh
      position={[1.5, 0.2, 0]}
      scale={scale}
      onPointerEnter={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
      <animated.meshStandardMaterial
        color={isActive ? "#7c3aed" : "#333333"}
        emissive="#7c3aed"
        emissiveIntensity={emissive}
        metalness={0.5}
        roughness={0.3}
      />
    </animated.mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main UV Reveal Component
// ═══════════════════════════════════════════════════════════════════════════════
export function UvReveal3D({ dayData, onSolve }: UvReveal3DProps) {
  const { isUvLightActive, toggleUvLight } = useGameStore();

  const handleReveal = () => {
    // The solution is revealed - "8821"
    onSolve(dayData.solution || "8821");
  };

  return (
    <group>
      {/* UV Light source */}
      <UvLightSource isActive={isUvLightActive} />

      {/* The business card */}
      <BusinessCard isUvActive={isUvLightActive} onReveal={handleReveal} />

      {/* UV Toggle button */}
      <UvToggleButton isActive={isUvLightActive} onToggle={toggleUvLight} />

      {/* Desk surface */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#1a1a24" roughness={0.8} />
      </mesh>

      {/* Ambient light (dimmed for UV effect) */}
      <ambientLight intensity={isUvLightActive ? 0.1 : 0.3} />

      {/* Normal desk lamp */}
      <pointLight
        position={[-1.5, 1.5, 1]}
        intensity={isUvLightActive ? 5 : 15}
        color="#ffcc88"
      />
    </group>
  );
}

export default UvReveal3D;

