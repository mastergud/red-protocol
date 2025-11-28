#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════════
#  RED PROTOCOL - Dependencies Setup Script
#  Noir Christmas Investigation Game
# ═══════════════════════════════════════════════════════════════════════════════

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo ""
echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║${NC}          RED PROTOCOL - Installing Dependencies             ${RED}║${NC}"
echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Core 3D dependencies
echo -e "${GREEN}[1/3]${NC} Installing 3D Engine (Three.js + R3F)..."
npm install three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing

# Animation & State
echo -e "${GREEN}[2/3]${NC} Installing Animation & State Management..."
npm install zustand framer-motion framer-motion-3d @react-spring/three

# UI & Utilities
echo -e "${GREEN}[3/3]${NC} Installing UI utilities..."
npm install lucide-react leva

echo ""
echo -e "${GREEN}✓ All dependencies installed successfully!${NC}"
echo ""
echo "Run 'npm run dev' to start the investigation..."
echo ""

