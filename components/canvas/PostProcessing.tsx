"use client";

import {
  EffectComposer,
  Noise,
  Vignette,
  Scanline,
  Bloom,
  ChromaticAberration,
  BrightnessContrast,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// ═══════════════════════════════════════════════════════════════════════════════
// PostProcessing Component - Noir Film Aesthetic
// Creates the 1990s detective thriller visual style
// ═══════════════════════════════════════════════════════════════════════════════
export function PostProcessing() {
  return (
    <EffectComposer multisampling={4}>
      {/* Film Grain - Authentic noir texture */}
      <Noise
        premultiply
        blendFunction={BlendFunction.ADD}
        opacity={0.15}
      />

      {/* Vignette - Dark edges to focus attention on desk center */}
      <Vignette
        offset={0.3}
        darkness={1.1}
        blendFunction={BlendFunction.NORMAL}
      />

      {/* Scanlines - Retro CRT monitor aesthetic */}
      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={2}
        opacity={0.05}
      />

      {/* Bloom - Subtle glow on bright elements (lamp, classified stamp) */}
      <Bloom
        intensity={0.3}
        luminanceThreshold={0.8}
        luminanceSmoothing={0.9}
        mipmapBlur
      />

      {/* Chromatic Aberration - Subtle lens imperfection */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0003, 0.0003)}
      />

      {/* Brightness/Contrast - Enhance the noir feel */}
      <BrightnessContrast
        brightness={-0.05}
        contrast={0.15}
      />
    </EffectComposer>
  );
}

export default PostProcessing;

