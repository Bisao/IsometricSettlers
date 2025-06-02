import { useCallback } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { worldToGrid } from "../lib/gameUtils";

interface UseGridPlacementProps {
  gridSize: number;
  tileSize: number;
  camera: THREE.Camera;
  onHover: (gridPos: { x: number; z: number } | null) => void;
  onPlace: (gridX: number, gridZ: number) => void;
}

export function useGridPlacement({ 
  gridSize, 
  tileSize, 
  camera, 
  onHover, 
  onPlace 
}: UseGridPlacementProps) {
  const { gl } = useThree();

  const getGridPosition = useCallback((event: THREE.Event) => {
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Create a ground plane for intersection
    const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const intersectionPoint = new THREE.Vector3();
    
    if (raycaster.ray.intersectPlane(groundPlane, intersectionPoint)) {
      const gridPos = worldToGrid(intersectionPoint.x, intersectionPoint.z, tileSize);
      
      // Check if position is within grid bounds
      if (gridPos.x >= 0 && gridPos.x < gridSize && gridPos.z >= 0 && gridPos.z < gridSize) {
        return gridPos;
      }
    }
    
    return null;
  }, [camera, gl.domElement, gridSize, tileSize]);

  const handlePointerMove = useCallback((event: THREE.Event) => {
    event.stopPropagation();
    const gridPos = getGridPosition(event);
    onHover(gridPos);
  }, [getGridPosition, onHover]);

  const handleClick = useCallback((event: THREE.Event) => {
    event.stopPropagation();
    const gridPos = getGridPosition(event);
    
    if (gridPos) {
      onPlace(gridPos.x, gridPos.z);
    }
  }, [getGridPosition, onPlace]);

  const handleContextMenu = useCallback((event: THREE.Event) => {
    event.stopPropagation();
    const gridPos = getGridPosition(event);
    
    if (gridPos) {
      onPlace(gridPos.x, gridPos.z, true); // Pass true to indicate right-click
    }
  }, [getGridPosition, onPlace]);

  return {
    handlePointerMove,
    handleClick,
    handleContextMenu
  };
}
