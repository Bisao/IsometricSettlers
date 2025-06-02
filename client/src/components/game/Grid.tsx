import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Building from "./Building";
import NPC from "./NPC";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useGridPlacement } from "../../hooks/useGridPlacement";
import { worldToGrid, gridToWorld } from "../../lib/gameUtils";

const GRID_SIZE = 15;
const TILE_SIZE = 1;

export default function Grid() {
  const gridRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const grassTexture = useTexture("/textures/grass.png");

  const { 
    selectedBuilding, 
    previewPosition, 
    placedBuildings, 
    npcs,
    selectedBuildingId,
    placeBuilding, 
    clearSelection,
    setPreviewPosition
  } = useBuilding();

  // Configure grass texture
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(GRID_SIZE, GRID_SIZE);

  // Grid placement hook
  const { handlePointerMove, handleClick } = useGridPlacement({
    gridSize: GRID_SIZE,
    tileSize: TILE_SIZE,
    camera,
    onHover: setPreviewPosition,
    onPlace: placeBuilding
  });

  // Generate grid tiles
  const gridTiles = useMemo(() => {
    const tiles = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        const worldPos = gridToWorld(x, z, TILE_SIZE);
        const isOccupied = placedBuildings.some(
          building => building.gridX === x && building.gridZ === z
        );

        tiles.push(
          <group key={`tile-${x}-${z}`} position={[worldPos.x, 0, worldPos.z]}>
            {/* Ground tile */}
            <mesh receiveShadow>
              <boxGeometry args={[TILE_SIZE, 0.1, TILE_SIZE]} />
              <meshLambertMaterial 
                map={grassTexture} 
                color={isOccupied ? "#ffcccc" : "#ffffff"}
              />
            </mesh>

            {/* Tile border */}
            <mesh position={[0, 0.051, 0]}>
              <boxGeometry args={[TILE_SIZE, 0.01, TILE_SIZE]} />
              <meshBasicMaterial 
                color="#333333" 
                transparent 
                opacity={0.2}
                wireframe
              />
            </mesh>
          </group>
        );
      }
    }
    return tiles;
  }, [placedBuildings, grassTexture]);

  // Preview building
  const previewBuilding = useMemo(() => {
    if (!selectedBuilding || !previewPosition) return null;

    const worldPos = gridToWorld(previewPosition.x, previewPosition.z, TILE_SIZE);
    const isValidPlacement = !placedBuildings.some(
      building => building.gridX === previewPosition.x && building.gridZ === previewPosition.z
    );

    return (
      <Building
        key="preview"
        type={selectedBuilding.type}
        position={[worldPos.x, 0.05, worldPos.z]}
        isPreview={true}
        isValid={isValidPlacement}
      />
    );
  }, [selectedBuilding, previewPosition, placedBuildings]);

  // Handle escape key to cancel selection
  useFrame(() => {
    if (selectedBuilding) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          clearSelection();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <group ref={gridRef}>
      {/* Ground plane */}
      <mesh 
        position={[GRID_SIZE/2 - 0.5, -0.1, GRID_SIZE/2 - 0.5]} 
        receiveShadow
        onPointerMove={handlePointerMove}
        onClick={handleClick}
        onContextMenu={(e) => {
          e.stopPropagation();
          clearSelection();
        }}
      >
        <boxGeometry args={[GRID_SIZE, 0.1, GRID_SIZE]} />
        <meshLambertMaterial map={grassTexture} />
      </mesh>

      {/* Grid tiles */}
      {gridTiles}

      {/* Placed buildings */}
      {placedBuildings.map((building, index) => {
        const worldPos = gridToWorld(building.gridX, building.gridZ, TILE_SIZE);
        return (
          <Building
            key={`placed-${index}`}
            type={building.type}
            position={[worldPos.x, 0.05, worldPos.z]}
            isPreview={false}
            isValid={true}
            buildingId={building.id}
          />
        );
      })}

      {/* NPCs no mundo */}
      {npcs.map((npc) => {
        const building = placedBuildings.find(b => b.id === npc.houseId);
        if (!building) return null;

        const worldPos = gridToWorld(building.gridX, building.gridZ, TILE_SIZE);
        // Posicionar NPC perto da casa
        const npcPos: [number, number, number] = [
          worldPos.x + (Math.random() - 0.5) * 1.5,
          0,
          worldPos.z + (Math.random() - 0.5) * 1.5
        ];

        return (
          <NPC
            key={npc.id}
            position={npcPos}
            firstName={npc.firstName}
            lastName={npc.lastName}
            isSelected={selectedBuildingId === npc.houseId}
          />
        );
      })}

      {/* Preview building */}
      {previewBuilding}
    </group>
  );
}