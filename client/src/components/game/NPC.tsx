
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface NPCProps {
  position: [number, number, number];
  firstName: string;
  lastName: string;
  isSelected?: boolean;
  isControlled?: boolean;
}

export default function NPC({ position, firstName, lastName, isSelected = false, isControlled = false }: NPCProps) {
  const npcRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  
  // Animação simples de respiração
  useFrame((state) => {
    if (npcRef.current) {
      npcRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.05;
    }
    
    // Rotação da cabeça
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <group ref={npcRef} position={position}>
      {/* Sombra */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshLambertMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Corpo */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
        <meshLambertMaterial color="#4A5568" />
      </mesh>

      {/* Cabeça */}
      <mesh ref={headRef} position={[0, 0.9, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>

      {/* Cabelo */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Olhos */}
      <mesh position={[-0.04, 0.9, 0.1]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.04, 0.9, 0.1]} castShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Pupilas */}
      <mesh position={[-0.04, 0.9, 0.12]} castShadow>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>
      <mesh position={[0.04, 0.9, 0.12]} castShadow>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshLambertMaterial color="#2D3748" />
      </mesh>

      {/* Braços */}
      <mesh position={[-0.2, 0.6, 0]} rotation={[0, 0, 0.3]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 16]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      <mesh position={[0.2, 0.6, 0]} rotation={[0, 0, -0.3]} castShadow>
        <capsuleGeometry args={[0.04, 0.3, 8, 16]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>

      {/* Mãos */}
      <mesh position={[-0.25, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>
      <mesh position={[0.25, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshLambertMaterial color="#FDBCB4" />
      </mesh>

      {/* Pernas */}
      <mesh position={[-0.08, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>
      <mesh position={[0.08, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.06, 0.3, 8, 16]} />
        <meshLambertMaterial color="#2B6CB0" />
      </mesh>

      {/* Pés */}
      <mesh position={[-0.08, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[0.08, 0.05, 0.05]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.12]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>

      {/* Nome flutuante */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.1}
        color={isSelected ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter.json"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {firstName} {lastName}
      </Text>

      {/* Indicador de seleção */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshLambertMaterial color="#FFD700" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Indicador de controle manual */}
      {isControlled && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.4, 32]} />
          <meshLambertMaterial color="#9F7AEA" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
