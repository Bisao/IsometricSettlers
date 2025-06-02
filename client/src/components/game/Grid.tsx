import { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Mesh, Vector3, Raycaster } from "three";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useGame } from "../../lib/stores/useGame";
import Building from "./Building";
import NPC from "./NPC";
import Wolf from "./Wolf";
import { useMode } from "../../lib/stores/useMode";
import CombatHUD from "../ui/CombatHUD";

const GRID_SIZE = 15;
const TILE_SIZE = 2;

export default function Grid() {
  const gridRef = useRef<Mesh>(null);
  const { camera, scene, raycaster, pointer } = useThree();
  const { 
    selectedBuilding, 
    placedBuildings, 
    placeBuilding, 
    selectPlacedBuilding, 
    selectedPlacedBuilding,
    clearSelection,
    npcs,
    addNPC,
    selectedNPC,
    selectNPC
  } = useBuilding();

  const { wolves, selectedWolf, selectWolf } = useGame();
  const { mode } = useMode();
  const [hoveredTile, setHoveredTile] = useState<{ x: number; z: number } | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ x: number; z: number } | null>(null);
  // Configure grass texture

  return (
    <group ref={gridRef}>
      {/* Ground plane */}
    </group>
  );
}