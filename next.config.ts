import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16+ default bundler)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    // Add custom rules here if needed for GLSL shaders etc.
  },

  // Transpile Three.js related packages for better compatibility
  transpilePackages: [
    "three",
    "@react-three/fiber",
    "@react-three/drei",
    "@react-three/postprocessing",
  ],

  // Image optimization settings
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
