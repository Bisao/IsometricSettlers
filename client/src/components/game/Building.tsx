import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useBuilding } from "../../lib/stores/useBuilding";

interface BuildingProps {
  type: "house";
  position: [number, number, number];
  isPreview?: boolean;
  isValid?: boolean;
  buildingId?: string;
}

export default function Building({ type, position, isPreview = false, isValid = true, buildingId }: BuildingProps) {
  const buildingRef = useRef<THREE.Group>(null);
  const woodTexture = useTexture("/textures/wood.jpg");
  const { setSelectedBuildingId } = useBuilding();

  // Configure wood texture
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(2, 2);

  // Animate preview buildings
  useFrame((state) => {
    if (isPreview && buildingRef.current) {
      buildingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  const handleClick = (event: THREE.Event) => {
    if (!isPreview && buildingId) {
      event.stopPropagation();
      console.log('Clicked on building:', buildingId);
      setSelectedBuildingId(buildingId);
    }
  };

  const renderHouse = () => (
    <group ref={buildingRef} position={position} onClick={handleClick}>
      {/* House base */}
      <mesh castShadow position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshLambertMaterial 
          map={woodTexture}
          color={isPreview ? (isValid ? "#aaffaa" : "#ffaaaa") : "#ffffff"}
          transparent={isPreview}
          opacity={isPreview ? 0.7 : 1}
        />
      </mesh>

      {/* Roof */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <coneGeometry args={[0.6, 0.4, 4]} />
        <meshLambertMaterial 
          color={isPreview ? (isValid ? "#006600" : "#660000") : "#8B4513"}
          transparent={isPreview}
          opacity={isPreview ? 0.7 : 1}
        />
      </mesh>

      {/* Door */}
      <mesh position={[0, 0.2, 0.41]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.05]} />
        <meshLambertMaterial 
          color={isPreview ? (isValid ? "#004400" : "#440000") : "#654321"}
          transparent={isPreview}
          opacity={isPreview ? 0.7 : 1}
        />
      </mesh>

      {/* Windows */}
      <mesh position={[-0.25, 0.4, 0.41]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshLambertMaterial 
          color={isPreview ? (isValid ? "#aaccff" : "#ffccaa") : "#87CEEB"}
          transparent={isPreview}
          opacity={isPreview ? 0.7 : 1}
        />
      </mesh>
      <mesh position={[0.25, 0.4, 0.41]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.05]} />
        <meshLambertMaterial 
          color={isPreview ? (isValid ? "#aaccff" : "#ffccaa") : "#87CEEB"}
          transparent={isPreview}
          opacity={isPreview ? 0.7 : 1}
        />
      </mesh>
    </group>
  );

  switch (type) {
    case "house":
      return renderHouse();
    default:
      return null;
  }
}
