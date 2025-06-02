
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
  const eyesRef = useRef<THREE.Group>(null);
  
  // Generate consistent appearance based on name
  const nameHash = (firstName + lastName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Clothing colors
  const shirtColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
  const pantsColors = ['#2C3E50', '#34495E', '#8B4513', '#2F4F4F', '#696969', '#556B2F'];
  const hairColors = ['#8B4513', '#654321', '#2F1B14', '#FFD700', '#FF4500', '#000000', '#A0522D'];
  const skinTones = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'];
  
  const shirtColor = shirtColors[nameHash % shirtColors.length];
  const pantsColor = pantsColors[(nameHash + 1) % pantsColors.length];
  const hairColor = hairColors[(nameHash + 2) % hairColors.length];
  const skinTone = skinTones[(nameHash + 3) % skinTones.length];
  const hasGlasses = nameHash % 4 === 0;
  const hasHat = nameHash % 5 === 0;
  
  // Simple breathing and idle animations
  useFrame((state) => {
    if (npcRef.current) {
      npcRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
    }
    
    // Head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
    }
    
    // Eye blinking
    if (eyesRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 0.1) > 0.95 ? 0.3 : 1;
      eyesRef.current.scale.y = blinkTime;
    }
  });

  return (
    <group ref={npcRef} position={position}>
      {/* Enhanced shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 16]} />
        <meshLambertMaterial color="#000000" transparent opacity={0.4} />
      </mesh>

      {/* Torso - Enhanced with shirt details */}
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[0.35, 0.7, 0.2]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>

      {/* Shirt collar */}
      <mesh position={[0, 0.75, 0.08]} castShadow>
        <boxGeometry args={[0.25, 0.1, 0.05]} />
        <meshLambertMaterial color={new THREE.Color(shirtColor).multiplyScalar(0.9)} />
      </mesh>

      {/* Pants */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.32, 0.4, 0.18]} />
        <meshLambertMaterial color={pantsColor} />
      </mesh>

      {/* Belt */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.35, 0.06, 0.19]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Belt buckle */}
      <mesh position={[0, 0.35, 0.1]} castShadow>
        <boxGeometry args={[0.08, 0.04, 0.02]} />
        <meshLambertMaterial color="#FFD700" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.95, 0]} castShadow>
        <boxGeometry args={[0.25, 0.25, 0.22]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>

      {/* Hair/Hat */}
      {hasHat ? (
        <group>
          {/* Hat */}
          <mesh position={[0, 1.08, 0]} castShadow>
            <boxGeometry args={[0.28, 0.08, 0.25]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.32, 0.06, 0.29]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
        </group>
      ) : (
        <mesh position={[0, 1.08, 0]} castShadow>
          <boxGeometry args={[0.27, 0.15, 0.24]} />
          <meshLambertMaterial color={hairColor} />
        </mesh>
      )}

      {/* Eyes */}
      <group ref={eyesRef}>
        <mesh position={[-0.06, 0.98, 0.11]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[0.06, 0.98, 0.11]} castShadow>
          <boxGeometry args={[0.04, 0.04, 0.02]} />
          <meshLambertMaterial color="#FFFFFF" />
        </mesh>
        
        {/* Pupils */}
        <mesh position={[-0.06, 0.98, 0.12]} castShadow>
          <boxGeometry args={[0.02, 0.02, 0.01]} />
          <meshLambertMaterial color="#2D3748" />
        </mesh>
        <mesh position={[0.06, 0.98, 0.12]} castShadow>
          <boxGeometry args={[0.02, 0.02, 0.01]} />
          <meshLambertMaterial color="#2D3748" />
        </mesh>
      </group>

      {/* Nose */}
      <mesh position={[0, 0.94, 0.12]} castShadow>
        <boxGeometry args={[0.03, 0.06, 0.03]} />
        <meshLambertMaterial color={new THREE.Color(skinTone).multiplyScalar(0.95)} />
      </mesh>

      {/* Mouth */}
      <mesh position={[0, 0.89, 0.11]} castShadow>
        <boxGeometry args={[0.08, 0.02, 0.01]} />
        <meshLambertMaterial color="#8B4513" />
      </mesh>

      {/* Glasses (optional) */}
      {hasGlasses && (
        <group>
          <mesh position={[-0.06, 0.98, 0.13]} castShadow>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
          <mesh position={[0.06, 0.98, 0.13]} castShadow>
            <torusGeometry args={[0.04, 0.01, 8, 16]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, 0.98, 0.13]} castShadow>
            <boxGeometry args={[0.04, 0.01, 0.01]} />
            <meshLambertMaterial color="#2C3E50" />
          </mesh>
        </group>
      )}

      {/* Arms */}
      <mesh position={[-0.25, 0.65, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>
      <mesh position={[0.25, 0.65, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>

      {/* Sleeves */}
      <mesh position={[-0.22, 0.75, 0]} rotation={[0, 0, 0.2]} castShadow>
        <boxGeometry args={[0.14, 0.15, 0.14]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>
      <mesh position={[0.22, 0.75, 0]} rotation={[0, 0, -0.2]} castShadow>
        <boxGeometry args={[0.14, 0.15, 0.14]} />
        <meshLambertMaterial color={shirtColor} />
      </mesh>

      {/* Hands */}
      <mesh position={[-0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>
      <mesh position={[0.28, 0.45, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.08]} />
        <meshLambertMaterial color={skinTone} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.1, -0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.14]} />
        <meshLambertMaterial color={pantsColor} />
      </mesh>
      <mesh position={[0.1, -0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.3, 0.14]} />
        <meshLambertMaterial color={pantsColor} />
      </mesh>

      {/* Shoes */}
      <mesh position={[-0.1, -0.25, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.2]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>
      <mesh position={[0.1, -0.25, 0.05]} castShadow>
        <boxGeometry args={[0.14, 0.06, 0.2]} />
        <meshLambertMaterial color="#1A202C" />
      </mesh>

      {/* Shoe laces */}
      <mesh position={[-0.1, -0.22, 0.12]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.06]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.1, -0.22, 0.12]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.06]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Enhanced floating name */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.12}
        color={isSelected ? "#FFD700" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
        fontWeight="bold"
      >
        {firstName} {lastName}
      </Text>

      {/* Enhanced selection indicator */}
      {isSelected && (
        <group>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.35, 0.4, 32]} />
            <meshLambertMaterial color="#FFD700" transparent opacity={0.9} />
          </mesh>
          {/* Animated selection particles */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.42, 0.45, 16]} />
            <meshLambertMaterial color="#FFA500" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* Enhanced control indicator */}
      {isControlled && (
        <group>
          <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.45, 32]} />
            <meshLambertMaterial color="#9F7AEA" transparent opacity={0.95} />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.47, 0.5, 16]} />
            <meshLambertMaterial color="#805AD5" transparent opacity={0.7} />
          </mesh>
        </group>
      )}
    </group>
  );
}
