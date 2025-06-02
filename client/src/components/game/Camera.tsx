import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBuilding } from "../../lib/stores/useBuilding";
import { gridToWorld } from "../../lib/gameUtils";

export default function Camera() {
  const { camera, gl } = useThree();
  const { controlledNPCId, npcs, placedBuildings } = useBuilding();
  
  // Camera state for smooth transitions
  const defaultPosition = useRef(new THREE.Vector3(10, 10, 10));
  const defaultLookAt = useRef(new THREE.Vector3(7, 0, 7));
  const currentLookAt = useRef(new THREE.Vector3(7, 0, 7));
  const isFollowingMode = useRef(false);
  
  // Isometric camera controls for NPC mode
  const zoomLevel = useRef(8); // Distance from target
  const minZoom = useRef(3);
  const maxZoom = useRef(15);

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
    const npcWithVision = npcs.find(npc => npc.showVision);
    if (controlledNPCId || npcWithVision) {
      isFollowingMode.current = true;
    } else {
      isFollowingMode.current = false;
    }
  }, [controlledNPCId, npcs]);

  // Mouse wheel zoom handler for isometric view
  useEffect(() => {
    if (!isFollowingMode.current || !controlledNPCId) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      const zoomSpeed = 0.5;
      const deltaY = event.deltaY;
      
      if (deltaY > 0) {
        // Zoom out
        zoomLevel.current = Math.min(zoomLevel.current + zoomSpeed, maxZoom.current);
      } else {
        // Zoom in
        zoomLevel.current = Math.max(zoomLevel.current - zoomSpeed, minZoom.current);
      }
    };

    const canvas = gl.domElement;
    canvas.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [controlledNPCId, gl.domElement]);

  // Camera animation loop
  useFrame((state, delta) => {
    if (!camera) return;

    const lerpSpeed = 2.0; // Camera movement speed
    
    if (isFollowingMode.current) {
      // Find the NPC to follow (controlled NPC or NPC with vision active)
      const npcWithVision = npcs.find(npc => npc.showVision);
      const targetNPC = controlledNPCId ? npcs.find(npc => npc.id === controlledNPCId) : npcWithVision;
      
      if (targetNPC) {
        // Get NPC position
        let npcWorldPos: THREE.Vector3;
        
        if (targetNPC.gridX !== undefined && targetNPC.gridZ !== undefined) {
          // Use NPC position
          const worldPos = gridToWorld(targetNPC.gridX, targetNPC.gridZ, 1);
          npcWorldPos = new THREE.Vector3(worldPos.x, 0, worldPos.z);
        } else {
          // Use house position as fallback
          const building = placedBuildings.find(b => b.id === targetNPC.houseId);
          if (building) {
            const worldPos = gridToWorld(building.gridX, building.gridZ, 1);
            npcWorldPos = new THREE.Vector3(worldPos.x, 0, worldPos.z);
          } else {
            npcWorldPos = new THREE.Vector3(0, 0, 0);
          }
        }

        // Calculate camera position - different for vision mode
        let targetCameraPos: THREE.Vector3;
        
        if (npcWithVision && npcWithVision.id === targetNPC.id) {
          // Vision mode: position camera closer and lower for better cone view
          const distance = Math.min(zoomLevel.current, 6); // Closer for vision
          const angle = Math.PI / 6; // Lower angle (30 degrees)
          
          const offsetX = distance * Math.cos(angle);
          const offsetY = distance * 0.6; // Lower height
          const offsetZ = distance * Math.cos(angle);
          
          targetCameraPos = npcWorldPos.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));
        } else {
          // Normal isometric view
          const distance = zoomLevel.current;
          const angle = Math.PI / 4; // 45 degrees
          
          const offsetX = distance * Math.cos(angle);
          const offsetY = distance * Math.sin(angle);
          const offsetZ = distance * Math.cos(angle);
          
          targetCameraPos = npcWorldPos.clone().add(new THREE.Vector3(offsetX, offsetY, offsetZ));
        }
        
        // Smooth camera position interpolation
        camera.position.lerp(targetCameraPos, lerpSpeed * delta);
        
        // Smooth look-at interpolation (look at NPC position)
        const targetLookAt = npcWorldPos.clone().add(new THREE.Vector3(0, 0.5, 0)); // Look slightly above ground
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
