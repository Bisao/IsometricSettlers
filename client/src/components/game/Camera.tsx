import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBuilding } from "../../lib/stores/useBuilding";
import { gridToWorld } from "../../lib/gameUtils";

export default function Camera() {
  const { camera } = useThree();
  const { controlledNPCId, npcs, placedBuildings } = useBuilding();
  
  // Camera state for smooth transitions
  const defaultPosition = useRef(new THREE.Vector3(10, 10, 10));
  const defaultLookAt = useRef(new THREE.Vector3(7, 0, 7));
  const currentLookAt = useRef(new THREE.Vector3(7, 0, 7));
  const isFollowingMode = useRef(false);

  // Set up initial camera
  useEffect(() => {
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
    }
    
    // Set initial position if not in control mode
    if (!controlledNPCId) {
      camera.position.copy(defaultPosition.current);
      camera.lookAt(defaultLookAt.current);
      currentLookAt.current.copy(defaultLookAt.current);
      isFollowingMode.current = false;
    }
  }, [camera]);

  // Handle camera mode transitions
  useEffect(() => {
    if (controlledNPCId) {
      isFollowingMode.current = true;
    } else {
      isFollowingMode.current = false;
    }
  }, [controlledNPCId]);

  // Camera animation loop
  useFrame((state, delta) => {
    if (!camera) return;

    const lerpSpeed = 2.0; // Camera movement speed
    
    if (isFollowingMode.current && controlledNPCId) {
      // Find the controlled NPC
      const controlledNPC = npcs.find(npc => npc.id === controlledNPCId);
      
      if (controlledNPC) {
        // Get NPC position
        let npcWorldPos: THREE.Vector3;
        
        if (controlledNPC.gridX !== undefined && controlledNPC.gridZ !== undefined) {
          // Use controlled position
          const worldPos = gridToWorld(controlledNPC.gridX, controlledNPC.gridZ, 1);
          npcWorldPos = new THREE.Vector3(worldPos.x, 0, worldPos.z);
        } else {
          // Use house position as fallback
          const building = placedBuildings.find(b => b.id === controlledNPC.houseId);
          if (building) {
            const worldPos = gridToWorld(building.gridX, building.gridZ, 1);
            npcWorldPos = new THREE.Vector3(worldPos.x, 0, worldPos.z);
          } else {
            npcWorldPos = new THREE.Vector3(0, 0, 0);
          }
        }

        // Calculate follow camera position (behind and above the NPC)
        const followOffset = new THREE.Vector3(0, 4, 3); // Behind, above, and slightly back
        const targetCameraPos = npcWorldPos.clone().add(followOffset);
        
        // Smooth camera position interpolation
        camera.position.lerp(targetCameraPos, lerpSpeed * delta);
        
        // Smooth look-at interpolation
        const targetLookAt = npcWorldPos.clone().add(new THREE.Vector3(0, 1, 0)); // Look slightly above NPC
        currentLookAt.current.lerp(targetLookAt, lerpSpeed * delta);
        camera.lookAt(currentLookAt.current);
      }
    } else {
      // Return to default grid view when not in control mode
      camera.position.lerp(defaultPosition.current, lerpSpeed * delta);
      currentLookAt.current.lerp(defaultLookAt.current, lerpSpeed * delta);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}
