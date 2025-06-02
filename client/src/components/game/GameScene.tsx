import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import Grid from "./Grid";
import Camera from "./Camera";
import { useAudio } from "../../lib/stores/useAudio";
import { useNPCAI } from "../../hooks/useNPCAI";
import BuildingPanel from "../ui/BuildingPanel";
import BuildingDetailsPanel from "../ui/BuildingDetailsPanel";
import SettingsPanel from "../ui/SettingsPanel";
import CombatHUD from "../ui/CombatHUD";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useMode } from "../../lib/stores/useMode";

export default function GameScene() {
  useAudio();
  useNPCAI();
  const sceneRef = useRef<THREE.Group>(null);
  const { placedBuildings, selectedBuildingId, controlledNPCId, npcs } = useBuilding();
  const { mode } = useMode();

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