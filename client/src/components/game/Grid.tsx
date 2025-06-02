import { useRef, useMemo, useEffect } from "react";
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
  const { camera, raycaster, mouse, gl } = useThree();

  const {
    selectedBuilding,
    placedBuildings,
    previewPosition,
    npcs,
    selectedBuildingId,
    controlledNPCId,
    setPreviewPosition,
    placeBuilding,
    clearSelection,
    moveNPCToPosition
  } = useBuilding();

  // Configure grass texture
  const grassTexture = useTexture("/textures/grass.png");
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
  useEffect(() => {
    if (selectedBuilding) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          clearSelection();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedBuilding, clearSelection]);

  const handleGridClick = (gridX: number, gridZ: number) => {
    if (controlledNPCId) {
      // Move controlled NPC to clicked position
      moveNPCToPosition(controlledNPCId, gridX, gridZ);
      console.log(`Moving controlled NPC to grid position (${gridX}, ${gridZ})`);
    } else if (selectedBuilding) {
      placeBuilding(gridX, gridZ);
    }
  };

  // Ensure grid ref stability and prevent null references
  useEffect(() => {
    if (gridRef.current) {
      console.log('Grid ref is available with', gridRef.current.children.length, 'children');
    }
  }, [npcs, placedBuildings]);

  return (
    <group ref={gridRef}>
      {/* Ground plane */}
      <mesh 
        position={[GRID_SIZE/2 - 0.5, -0.1, GRID_SIZE/2 - 0.5]} 
        receiveShadow
        onPointerMove={handlePointerMove}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
          // Get grid coordinates from click
          try {
            if (gridRef.current && raycaster && raycaster.intersectObjects) {
              // Ensure all objects in the group are valid before raycasting
              const validObjects = gridRef.current.children.filter(child => 
                child && child.type && (child.type === 'Mesh' || child.type === 'Group')
              );
              
              if (validObjects.length > 0) {
                const intersections = raycaster.intersectObjects(validObjects, true);
                const intersection = intersections[0];
                
                if (intersection && intersection.point) {
                  const gridPos = worldToGrid(intersection.point.x, intersection.point.z, TILE_SIZE);
                  handleGridClick(gridPos.x, gridPos.z);
                }
              }
            }
          } catch (error) {
            console.error('Error in grid click handler:', error);
          }
        }}
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

      {/* Render NPCs */}
      {npcs.map((npc) => {
        const building = placedBuildings.find(b => b.id === npc.houseId);
        if (!building) return null;

        // Use controlled position or default house position
        let npcPos: [number, number, number];

        if (npc.isControlled && npc.gridX !== undefined && npc.gridZ !== undefined) {
          // Use controlled position
          npcPos = [npc.gridX, 0, npc.gridZ];
        } else {
          // Default position - spawn on the same tile as the house
          npcPos = [building.gridX, 0, building.gridZ];
        }

        return (
          <NPC
            key={npc.id}
            position={npcPos}
            firstName={npc.firstName}
            lastName={npc.lastName}
            isSelected={selectedBuildingId === npc.houseId}
            isControlled={npc.isControlled}
          />
        );
      })}

      {/* Preview building */}
      {previewBuilding}
    </group>
  );
}