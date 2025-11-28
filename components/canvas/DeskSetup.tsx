"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Interactive Detective Desk
// The main 3D scene with clickable evidence objects
// ═══════════════════════════════════════════════════════════════════════════════

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { useGameStore } from "@/src/store/gameStore";
import { getDay } from "@/src/data/gameContent";

// ═══════════════════════════════════════════════════════════════════════════════
// The Detective's Desk
// ═══════════════════════════════════════════════════════════════════════════════
function Desk() {
  return (
    <group>
      {/* Main desk surface */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Desk edges */}
      <mesh position={[0, -0.15, 2]} castShadow receiveShadow>
        <boxGeometry args={[6.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[-3, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 4]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh position={[3, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 4]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Leather desk pad */}
      <mesh receiveShadow position={[0, 0.001, 0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Interactive Evidence Object
// ═══════════════════════════════════════════════════════════════════════════════
interface EvidenceProps {
  position: [number, number, number];
  label: string;
  color: string;
  glowColor: string;
  onClick: () => void;
  isCompleted?: boolean;
  isCurrentDay?: boolean;
}

function EvidenceObject({ position, label, color, glowColor, onClick, isCompleted, isCurrentDay }: EvidenceProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  const { positionY, emissiveIntensity, scale } = useSpring({
    positionY: hovered ? position[1] + 0.15 : position[1],
    emissiveIntensity: hovered ? 0.8 : isCurrentDay ? 0.3 : 0,
    scale: hovered ? 1.1 : 1,
    config: { mass: 1, tension: 280, friction: 20 },
  });

  // Subtle floating animation for current day
  useFrame((state) => {
    if (meshRef.current && isCurrentDay && !isCompleted) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <animated.group
      ref={meshRef}
      position-x={position[0]}
      position-y={positionY}
      position-z={position[2]}
      scale={scale}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Folder base */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.04, 1.1]} />
        <animated.meshStandardMaterial
          color={isCompleted ? "#22c55e" : color}
          emissive={glowColor}
          emissiveIntensity={emissiveIntensity}
          roughness={0.85}
        />
      </mesh>

      {/* Label on folder */}
      <mesh position={[0, 0.025, 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.5, 0.15]} />
        <animated.meshStandardMaterial
          color={isCompleted ? "#166534" : "#dc2626"}
          emissive={isCompleted ? "#22c55e" : "#dc2626"}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>

      {/* Text label */}
      {hovered && (
        <Text
          position={[0, 0.3, 0]}
          fontSize={0.1}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {label}
        </Text>
      )}

      {/* Completion checkmark */}
      {isCompleted && (
        <mesh position={[0.3, 0.05, -0.4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
        </mesh>
      )}
    </animated.group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Coffee Mug
// ═══════════════════════════════════════════════════════════════════════════════
function CoffeeMug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.25, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh castShadow position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.2} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Desk Lamp with UV Mode
// ═══════════════════════════════════════════════════════════════════════════════
function DeskLamp({ position }: { position: [number, number, number] }) {
  const { isUvLightActive } = useGameStore();
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.02;
      lightRef.current.intensity = (isUvLightActive ? 30 : 80) + flicker * 10;
    }
  });

  return (
    <group position={position}>
      {/* Lamp base */}
      <mesh castShadow receiveShadow position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.15, 0.18, 0.04, 16]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Lamp arm */}
      <mesh castShadow position={[0, 0.4, -0.1]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.7, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Lamp shade */}
      <mesh castShadow position={[0, 0.7, -0.2]} rotation={[0.4, 0, 0]}>
        <coneGeometry args={[0.2, 0.25, 16, 1, true]} />
        <meshStandardMaterial
          color={isUvLightActive ? "#4c1d95" : "#0d0d0d"}
          roughness={0.5}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Spotlight */}
      <spotLight
        ref={lightRef}
        position={[0, 0.65, -0.15]}
        angle={0.6}
        penumbra={0.5}
        intensity={isUvLightActive ? 30 : 80}
        color={isUvLightActive ? "#7c3aed" : "#ffcc88"}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      {/* UV indicator glow */}
      {isUvLightActive && (
        <pointLight position={[0, 0.6, -0.15]} intensity={5} color="#7c3aed" distance={2} />
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Ambient Lighting
// ═══════════════════════════════════════════════════════════════════════════════
function AmbientLighting() {
  const { isUvLightActive } = useGameStore();

  return (
    <>
      <ambientLight intensity={isUvLightActive ? 0.02 : 0.05} color="#1a1a2e" />
      <directionalLight position={[2, 3, -5]} intensity={0.15} color="#4466aa" />
      <pointLight position={[-4, 2, 0]} intensity={0.5} color="#661111" distance={8} />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main DeskSetup Component
// ═══════════════════════════════════════════════════════════════════════════════
export function DeskSetup() {
  const { currentDay, completedDays, completeDay, setCurrentDay, unlockedDays } = useGameStore();

  // Handle clicking on evidence
  const handleEvidenceClick = (day: number) => {
    if (unlockedDays.includes(day)) {
      if (day === currentDay) {
        // For demo: complete the current day when clicked
        // In full game, this would open the puzzle
        const dayData = getDay(day);
        console.log(`📁 Opening Day ${day}: ${dayData?.title}`);
        
        // Demo: Auto-complete for testing
        // Remove this in production and implement proper puzzles
        if (!completedDays.includes(day)) {
          completeDay(day);
        }
      } else {
        // Switch to that day
        setCurrentDay(day);
      }
    }
  };

  return (
    <group>
      {/* Lighting */}
      <AmbientLighting />
      <DeskLamp position={[-1.8, 0, -1]} />

      {/* The Desk */}
      <Desk />

      {/* Day 1: The Crash */}
      <EvidenceObject
        position={[0.3, 0.05, 0.5]}
        label="DAY 1: L'Épave"
        color="#8B4513"
        glowColor="#dc2626"
        onClick={() => handleEvidenceClick(1)}
        isCompleted={completedDays.includes(1)}
        isCurrentDay={currentDay === 1}
      />

      {/* Day 2: Frozen Door */}
      <EvidenceObject
        position={[-0.8, 0.03, 0.3]}
        label="DAY 2: Portière Gelée"
        color="#4a6fa5"
        glowColor="#3b82f6"
        onClick={() => handleEvidenceClick(2)}
        isCompleted={completedDays.includes(2)}
        isCurrentDay={currentDay === 2}
      />

      {/* Day 3: Blank Card */}
      <EvidenceObject
        position={[1.2, 0.02, -0.2]}
        label="DAY 3: Carte Vierge"
        color="#f5f5dc"
        glowColor="#7c3aed"
        onClick={() => handleEvidenceClick(3)}
        isCompleted={completedDays.includes(3)}
        isCurrentDay={currentDay === 3}
      />

      {/* Day 4: Torn Map */}
      <EvidenceObject
        position={[-0.5, 0.03, -0.5]}
        label="DAY 4: Plan Déchiré"
        color="#d4a574"
        glowColor="#f59e0b"
        onClick={() => handleEvidenceClick(4)}
        isCompleted={completedDays.includes(4)}
        isCurrentDay={currentDay === 4}
      />

      {/* Day 5: Radio */}
      <EvidenceObject
        position={[0.8, 0.04, -0.8]}
        label="DAY 5: Signal Fantôme"
        color="#2a2a2a"
        glowColor="#22c55e"
        onClick={() => handleEvidenceClick(5)}
        isCompleted={completedDays.includes(5)}
        isCurrentDay={currentDay === 5}
      />

      {/* Atmospheric Details */}
      <CoffeeMug position={[1.8, 0.125, 0.8]} />

      {/* Floor */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050508" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default DeskSetup;
