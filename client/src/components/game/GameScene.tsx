import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Grid from "./Grid";
import Camera from "./Camera";
import { useBuilding } from "../../lib/stores/useBuilding";

export default function GameScene() {
  const sceneRef = useRef<THREE.Group>(null);
  const { controlledNPCId } = useBuilding();

  // Prevent default browser context menu on right-click
  useEffect(() => {
    const preventContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.addEventListener('contextmenu', preventContextMenu);
      return () => {
        canvas.removeEventListener('contextmenu', preventContextMenu);
      };
    }
  }, []);

  return (
    <group ref={sceneRef}>
      {/* Lighting setup */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Camera controller */}
      <Camera />

      {/* OrbitControls - Disabled when NPC is being controlled */}
      <OrbitControls 
        enabled={!controlledNPCId} // Disable rotation when NPC is controlled
        enablePan={!controlledNPCId}
        enableZoom={!controlledNPCId}
        enableRotate={!controlledNPCId}
        maxPolarAngle={Math.PI / 2.5} // Limit vertical rotation
        minDistance={5}
        maxDistance={25}
      />

      {/* Game Grid */}
      <Grid />

      {/* Orbit controls for camera movement */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        minDistance={5}
        maxDistance={30}
        target={[0, 0, 0]}
      />
    </group>
  );
}
