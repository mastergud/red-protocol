"use client";

// ═══════════════════════════════════════════════════════════════════════════════
// RED PROTOCOL - Visual Search 3D Puzzle
// Find hidden objects in a 3D scene by clicking on them
// ═══════════════════════════════════════════════════════════════════════════════

import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { DayData } from "@/src/types/game.types";

interface VisualSearch3DProps {
  dayData: DayData;
  onSolve: (answer?: string) => boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// Hidden Object Component
// ═══════════════════════════════════════════════════════════════════════════════
function HiddenObject({
  position,
  objectId,
  onFind,
  isFound,
}: {
  position: [number, number, number];
  objectId: string;
  onFind: (id: string) => void;
  isFound: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  // Subtle pulsing animation for undiscovered objects
  useFrame((state) => {
    if (meshRef.current && !isFound) {
      meshRef.current.scale.setScalar(
        1 + Math.sin(state.clock.elapsedTime * 2) * 0.05
      );
    }
  });

  // Spring animation for discovery
  const { scale, emissiveIntensity } = useSpring({
    scale: isFound ? 1.5 : hovered ? 1.2 : 1,
    emissiveIntensity: isFound ? 2 : hovered ? 1 : 0.3,
    config: { mass: 1, tension: 280, friction: 20 },
  });

  if (isFound) {
    return (
      <animated.mesh position={position} scale={scale}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <animated.meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={0.8}
        />
      </animated.mesh>
    );
  }

  return (
    <animated.mesh
      ref={meshRef}
      position={position}
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
        onFind(objectId);
      }}
    >
      {/* Blue Vial geometry */}
      <cylinderGeometry args={[0.05, 0.05, 0.2, 8]} />
      <animated.meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={emissiveIntensity}
        transparent
        opacity={0.9}
        roughness={0.2}
        metalness={0.3}
      />
    </animated.mesh>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Snow/Debris Scene Elements
// ═══════════════════════════════════════════════════════════════════════════════
function CrashSceneElements() {
  return (
    <group>
      {/* Overturned crates */}
      <mesh position={[-1, 0.2, 0.5]} rotation={[0.2, 0.5, 0.1]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.4]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      <mesh position={[0.8, 0.15, -0.3]} rotation={[-0.1, 0.3, 0.4]} castShadow>
        <boxGeometry args={[0.5, 0.35, 0.35]} />
        <meshStandardMaterial color="#5c4033" roughness={0.9} />
      </mesh>

      {/* Scattered debris */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 3,
            0.05,
            (Math.random() - 0.5) * 2,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
          castShadow
        >
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#8B4513" : "#2a2a2a"}
            roughness={0.95}
          />
        </mesh>
      ))}

      {/* Snow ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.95} />
      </mesh>

      {/* Tire tracks in snow */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0.5]}>
        <planeGeometry args={[0.3, 3]} />
        <meshStandardMaterial color="#c0c0c0" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main Visual Search Component
// ═══════════════════════════════════════════════════════════════════════════════
export function VisualSearch3D({ dayData, onSolve }: VisualSearch3DProps) {
  const [foundObjects, setFoundObjects] = useState<string[]>([]);

  const handleFind = (objectId: string) => {
    if (!foundObjects.includes(objectId)) {
      setFoundObjects([...foundObjects, objectId]);

      // Check if this is the solution
      if (objectId === dayData.solution) {
        setTimeout(() => {
          onSolve(objectId);
        }, 500);
      }
    }
  };

  return (
    <group>
      {/* Scene elements */}
      <CrashSceneElements />

      {/* Hidden object - Blue Vial */}
      <HiddenObject
        position={[-0.8, 0.1, 0.2]}
        objectId="BLUE_VIAL"
        onFind={handleFind}
        isFound={foundObjects.includes("BLUE_VIAL")}
      />

      {/* Decoy objects */}
      <HiddenObject
        position={[0.5, 0.08, -0.5]}
        objectId="DECOY_1"
        onFind={handleFind}
        isFound={foundObjects.includes("DECOY_1")}
      />
    </group>
  );
}

export default VisualSearch3D;

