"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════════
interface InteractiveProps {
  position: [number, number, number];
  onClick?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// The Detective's Desk - Dark wood surface
// ═══════════════════════════════════════════════════════════════════════════════
function Desk() {
  return (
    <group>
      {/* Main desk surface */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[6, 4]} />
        <meshStandardMaterial
          color="#1a0f0a"
          roughness={0.8}
          metalness={0.1}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Desk edge/trim - front */}
      <mesh position={[0, -0.15, 2]} castShadow receiveShadow>
        <boxGeometry args={[6.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Desk edge/trim - left */}
      <mesh position={[-3, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 4]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Desk edge/trim - right */}
      <mesh position={[3, -0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.1, 4]} />
        <meshStandardMaterial color="#0d0705" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Leather desk pad */}
      <mesh
        receiveShadow
        position={[0, 0.001, 0.3]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[3.5, 2.5]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.9}
          metalness={0}
        />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Classified Folder - Interactive Evidence
// ═══════════════════════════════════════════════════════════════════════════════
function ClassifiedFolder({ position, onClick }: InteractiveProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  // Hover animation with react-spring
  const { positionY, rotationZ } = useSpring({
    positionY: hovered ? position[1] + 0.15 : position[1],
    rotationZ: hovered ? 0.05 : 0,
    config: { mass: 1, tension: 280, friction: 20 },
  });

  return (
    <animated.group
      ref={meshRef}
      position-x={position[0]}
      position-y={positionY}
      position-z={position[2]}
      rotation-z={rotationZ}
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
        onClick?.();
      }}
    >
      {/* Folder base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.8, 0.03, 1.1]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.85}
          metalness={0}
        />
      </mesh>

      {/* Folder tab */}
      <mesh castShadow position={[0.25, 0.02, -0.5]}>
        <boxGeometry args={[0.3, 0.02, 0.15]} />
        <meshStandardMaterial color="#8B4513" roughness={0.85} />
      </mesh>

      {/* "CLASSIFIED" stamp */}
      <mesh position={[0, 0.025, 0.1]} rotation={[-Math.PI / 2, 0, 0.1]}>
        <planeGeometry args={[0.5, 0.15]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#dc2626"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          roughness={0.9}
        />
      </mesh>

      {/* Paper edges visible */}
      <mesh castShadow position={[0.02, 0.01, 0.02]}>
        <boxGeometry args={[0.7, 0.02, 1]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.95} />
      </mesh>
    </animated.group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Coffee Mug - Atmospheric detail
// ═══════════════════════════════════════════════════════════════════════════════
function CoffeeMug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.1, 0.25, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Handle */}
      <mesh castShadow position={[0.15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.06, 0.02, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Coffee inside */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
        <meshStandardMaterial color="#1a0f0a" roughness={0.2} metalness={0} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Pen Holder - Desk accessory
// ═══════════════════════════════════════════════════════════════════════════════
function PenHolder({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Holder */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 8]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Pen 1 */}
      <mesh castShadow position={[0.02, 0.15, 0]} rotation={[0.1, 0, 0.05]}>
        <cylinderGeometry args={[0.012, 0.012, 0.25, 6]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Pen 2 */}
      <mesh castShadow position={[-0.02, 0.13, 0.02]} rotation={[-0.05, 0, -0.1]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 6]} />
        <meshStandardMaterial color="#8B0000" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Notepad - Additional evidence
// ═══════════════════════════════════════════════════════════════════════════════
function Notepad({ position }: InteractiveProps) {
  const [hovered, setHovered] = useState(false);

  const { positionY } = useSpring({
    positionY: hovered ? position[1] + 0.08 : position[1],
    config: { mass: 1, tension: 300, friction: 25 },
  });

  return (
    <animated.group
      position-x={position[0]}
      position-y={positionY}
      position-z={position[2]}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerLeave={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Notepad pages */}
      <mesh castShadow receiveShadow rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.4, 0.04, 0.55]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.95} />
      </mesh>
      {/* Spiral binding */}
      <mesh position={[0, 0.025, -0.25]} rotation={[0, 0.2, 0]}>
        <boxGeometry args={[0.42, 0.02, 0.03]} />
        <meshStandardMaterial color="#333333" roughness={0.3} metalness={0.7} />
      </mesh>
    </animated.group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Desk Lamp - Chiaroscuro lighting source
// ═══════════════════════════════════════════════════════════════════════════════
function DeskLamp({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.SpotLight>(null);

  // Subtle light flicker for atmosphere
  useFrame((state) => {
    if (lightRef.current) {
      const flicker = Math.sin(state.clock.elapsedTime * 10) * 0.02;
      lightRef.current.intensity = 80 + flicker * 10;
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
          color="#0d0d0d"
          roughness={0.5}
          metalness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* The spotlight - main light source */}
      <spotLight
        ref={lightRef}
        position={[0, 0.65, -0.15]}
        angle={0.6}
        penumbra={0.5}
        intensity={80}
        color="#ffcc88"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        target-position={[0, 0, 0.5]}
      />

      {/* Warm glow inside shade */}
      <pointLight
        position={[0, 0.6, -0.15]}
        intensity={2}
        color="#ff9944"
        distance={1}
      />
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Ambient Lighting - Fill lights
// ═══════════════════════════════════════════════════════════════════════════════
function AmbientLighting() {
  return (
    <>
      {/* Very dim ambient for deep shadows */}
      <ambientLight intensity={0.02} color="#1a1a2e" />

      {/* Subtle blue rim light from behind (window simulation) */}
      <directionalLight
        position={[2, 3, -5]}
        intensity={0.15}
        color="#4466aa"
      />

      {/* Very subtle red accent from the side */}
      <pointLight
        position={[-4, 2, 0]}
        intensity={0.5}
        color="#661111"
        distance={8}
      />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// Main DeskSetup Component
// ═══════════════════════════════════════════════════════════════════════════════
export function DeskSetup() {
  const handleFolderClick = () => {
    console.log("📁 Classified folder clicked - Opening evidence...");
    // TODO: Connect to Zustand store to open evidence modal
  };

  return (
    <group>
      {/* Lighting */}
      <AmbientLighting />
      <DeskLamp position={[-1.8, 0, -1]} />

      {/* The Desk */}
      <Desk />

      {/* Evidence & Objects */}
      <ClassifiedFolder position={[0.3, 0.05, 0.5]} onClick={handleFolderClick} />
      <Notepad position={[-0.8, 0.02, 0.3]} />

      {/* Atmospheric Details */}
      <CoffeeMug position={[1.5, 0.125, -0.5]} />
      <PenHolder position={[1.8, 0.1, 0.8]} />

      {/* Floor/Background plane */}
      <mesh
        receiveShadow
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#050508" roughness={0.95} />
      </mesh>
    </group>
  );
}

export default DeskSetup;

