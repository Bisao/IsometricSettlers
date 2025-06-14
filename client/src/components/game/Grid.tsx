import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import Building from "./Building";
import NPC from "./NPC";
import Wolf from "./Wolf";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useGridPlacement } from "../../hooks/useGridPlacement";
import { worldToGrid, gridToWorld } from "../../lib/gameUtils";
import { ThreeEvent } from "@react-three/fiber";
import { MouseEvent } from "react";

const GRID_SIZE = 15;
const TILE_SIZE = 1;

export default function Grid() {
  const gridRef = useRef<THREE.Group>(null);
  const { camera, raycaster, mouse, gl } = useThree();

  const { 
    placedBuildings, 
    npcs, 
    selectedBuildingId,
    controlledNPCId,
    wolves,
    selectedWolfId,
    selectWolf,
    attackWolf,
    wolfAttackNPC,
    removeWolf
  } = useBuilding();

  // Configure grass texture
  const grassTexture = useTexture("/textures/grass.png");
  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  grassTexture.repeat.set(GRID_SIZE, GRID_SIZE);

  // Grid placement hook
  const { handlePointerMove, handleClick, handleContextMenu } = useGridPlacement({
    gridSize: GRID_SIZE,
    tileSize: TILE_SIZE,
    camera,
    onHover: setPreviewPosition,
    onPlace: (gridX: number, gridZ: number, isRightClick?: boolean) => {
      if (controlledNPCId && isRightClick) {
        // Only right-click moves the controlled NPC
        moveNPCToPosition(controlledNPCId, gridX, gridZ);
        console.log(`Moving controlled NPC to grid position (${gridX}, ${gridZ})`);
      } else if (!controlledNPCId && !isRightClick) {
        // Only left-click places buildings when no NPC is controlled
        placeBuilding(gridX, gridZ);
      }
      // Do nothing for left-click when NPC is controlled or right-click when no NPC is controlled
    }
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

  const handleGridClick = (event: ThreeEvent<MouseEvent>) => {
    if (!selectedBuilding) return;

    event.stopPropagation();
    const intersectedObject = event.intersections[0]?.object;

    if (intersectedObject?.userData?.gridX !== undefined && intersectedObject?.userData?.gridZ !== undefined) {
      const gridX = intersectedObject.userData.gridX;
      const gridZ = intersectedObject.userData.gridZ;

      placeBuilding(gridX, gridZ);
    }
  };

  const handleWolfClick = (event: ThreeEvent<MouseEvent>, wolfId: string) => {
    event.stopPropagation();
    selectWolf(wolfId);
  };

  const handleWolfAttack = (wolfId: string) => {
    if (selectedWolfId === wolfId) {
      attackWolf(wolfId, 15);
      console.log(`Attacked wolf ${wolfId}!`);
    }
  };

  const calculateDistance = (x1: number, z1: number, x2: number, z2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(z2 - z1, 2));
  };

  const getNearbyNPCs = (wolfX: number, wolfZ: number) => {
    return npcs
      .filter(npc => npc.gridX !== undefined && npc.gridZ !== undefined)
      .map(npc => ({
        id: npc.id,
        distance: calculateDistance(wolfX, wolfZ, npc.gridX!, npc.gridZ!)
      }))
      .filter(npc => npc.distance <= 3)
      .sort((a, b) => a.distance - b.distance);
  };

  // Ensure grid ref stability and prevent null references
  useEffect(() => {
    if (gridRef.current) {
      console.log('Grid ref is available with', gridRef.current.children.length, 'children');
    }
  }, [npcs, placedBuildings, wolves]);

  return (
    <group ref={gridRef}>
      {/* Ground plane */}
      <mesh 
        position={[GRID_SIZE/2 - 0.5, -0.1, GRID_SIZE/2 - 0.5]} 
        receiveShadow
        onPointerMove={controlledNPCId ? undefined : handlePointerMove}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
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

      {/* NPCs */}
      {npcs.map(npc => {
        const building = placedBuildings.find(b => b.id === npc.houseId);
        if (!building) return null;

        let npcGridPos: [number, number, number];

        // Sempre use a posição atual do NPC se disponível, independente do modo
        if (npc.gridX !== undefined && npc.gridZ !== undefined) {
          npcGridPos = [npc.gridX, 0, npc.gridZ];
        } else {
          // Fallback para posição da casa
          npcGridPos = [building.gridX, 0, building.gridZ];
        }

        return (
          <NPC
            key={npc.id}
            position={npcGridPos}
            firstName={npc.firstName}
            lastName={npc.lastName}
            isSelected={selectedBuildingId === npc.houseId}
            isControlled={npc.isControlled}
          />
        );
      })}

      {/* Wolves */}
      {wolves.map(wolf => {
        if (wolf.gridX === undefined || wolf.gridZ === undefined) return null;
        const worldPos = gridToWorld(wolf.gridX, wolf.gridZ, TILE_SIZE);

        return (
          <Wolf
            key={wolf.id}
            wolfId={wolf.id}
            position={[worldPos.x, 0, worldPos.z]}
            isSelected={selectedWolfId === wolf.id}
            onClick={(event) => {
              handleWolfClick(event, wolf.id);
              handleWolfAttack(wolf.id);
            }}
          />
        );
      })}

      {/* Preview building */}
      {previewBuilding}
    </group>
  );
}