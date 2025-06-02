import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function Camera() {
  const { camera } = useThree();

  useEffect(() => {
    // Set up isometric-style camera
    camera.position.set(10, 10, 10);
    camera.lookAt(7, 0, 7);
    
    // Update camera projection
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = 45;
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  return null;
}
