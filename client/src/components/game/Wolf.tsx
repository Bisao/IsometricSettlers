
import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { gridToWorld } from "../../lib/gameUtils";

interface WolfProps {
  position: [number, number, number];
  id: string;
  isSelected?: boolean;
  health: number;
  maxHealth: number;
  onDeath?: () => void;
  onAttackNPC?: (npcId: string) => void;
  nearbyNPCs?: Array<{ id: string; distance: number }>;
}

export default function Wolf({ 
  position, 
  id, 
  isSelected = false, 
  health, 
  maxHealth,
  onDeath,
  onAttackNPC,
  nearbyNPCs = []
}: WolfProps) {
  const wolfRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(() => {
    if (position[1] === 0) {
      const worldPos = gridToWorld(position[0], position[2], 1);
      return [worldPos.x, 0, worldPos.z];
    }
    return position;
  });
  
  const [isAttacking, setIsAttacking] = useState(false);
  const [targetRotation, setTargetRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [attackCooldown, setAttackCooldown] = useState(0);

  // Check for nearby NPCs and attack
  useEffect(() => {
    if (nearbyNPCs.length > 0 && attackCooldown <= 0) {
      const closestNPC = nearbyNPCs.find(npc => npc.distance <= 1.5);
      if (closestNPC && onAttackNPC) {
        setIsAttacking(true);
        setAttackCooldown(2000); // 2 second cooldown
        onAttackNPC(closestNPC.id);
        
        setTimeout(() => {
          setIsAttacking(false);
        }, 500);
      }
    }
  }, [nearbyNPCs, attackCooldown, onAttackNPC]);

  // Update cooldown
  useEffect(() => {
    if (attackCooldown > 0) {
      const timer = setTimeout(() => {
        setAttackCooldown(prev => Math.max(0, prev - 16));
      }, 16);
      return () => clearTimeout(timer);
    }
  }, [attackCooldown]);

  // Check if wolf should die
  useEffect(() => {
    if (health <= 0 && onDeath) {
      onDeath();
    }
  }, [health, onDeath]);

  useFrame((state, delta) => {
    if (!wolfRef.current) return;
    
    // Breathing animation
    wolfRef.current.position.y = currentPosition[1] + Math.sin(state.clock.elapsedTime * 2) * 0.03;
    
    // Look at nearest NPC
    if (nearbyNPCs.length > 0) {
      const closest = nearbyNPCs[0];
      // Calculate direction to NPC (this would need NPC position data)
      const lookDirection = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
      setTargetRotation(lookDirection);
    }
    
    // Smooth rotation
    const rotationSpeed = 5.0;
    const newRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, rotationSpeed * delta);
    setCurrentRotation(newRotation);
    wolfRef.current.rotation.y = newRotation;
    
    // Attack animation
    if (isAttacking && headRef.current) {
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 20) * 0.3;
    } else if (headRef.current) {
      headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }

    // Eye blinking
    if (eyesRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 0.08) > 0.95 ? 0.2 : 1;
      eyesRef.current.scale.y = blinkTime;
    }
  });

  const healthPercentage = (health / maxHealth) * 100;

  return (
    <group ref={wolfRef} position={currentPosition}>
      {/* Shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshLambertMaterial color="#000000" transparent opacity={0.3} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.6, 0.4, 0.8]} />
        <meshLambertMaterial color="#4A4A4A" />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 0.6, 0.3]} castShadow>
        <boxGeometry args={[0.35, 0.3, 0.4]} />
        <meshLambertMaterial color="#5A5A5A" />
      </mesh>

      {/* Snout */}
      <mesh position={[0, 0.55, 0.6]} castShadow>
        <boxGeometry args={[0.15, 0.15, 0.2]} />
        <meshLambertMaterial color="#3A3A3A" />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.12, 0.75, 0.25]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshLambertMaterial color="#4A4A4A" />
      </mesh>
      <mesh position={[0.12, 0.75, 0.25]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.1, 0.15, 0.05]} />
        <meshLambertMaterial color="#4A4A4A" />
      </mesh>

      {/* Eyes */}
      <group ref={eyesRef}>
        <mesh position={[-0.08, 0.65, 0.45]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
        <mesh position={[0.08, 0.65, 0.45]} castShadow>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshLambertMaterial color="#FF4500" />
        </mesh>
      </group>

      {/* Nose */}
      <mesh position={[0, 0.58, 0.7]} castShadow>
        <boxGeometry args={[0.04, 0.04, 0.02]} />
        <meshLambertMaterial color="#000000" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.2, 0.1, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshLambertMaterial color="#3A3A3A" />
      </mesh>
      <mesh position={[0.2, 0.1, 0.2]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshLambertMaterial color="#3A3A3A" />
      </mesh>
      <mesh position={[-0.2, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshLambertMaterial color="#3A3A3A" />
      </mesh>
      <mesh position={[0.2, 0.1, -0.2]} castShadow>
        <boxGeometry args={[0.12, 0.2, 0.12]} />
        <meshLambertMaterial color="#3A3A3A" />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0.4, -0.4]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.08, 0.08, 0.3]} />
        <meshLambertMaterial color="#4A4A4A" />
      </mesh>

      {/* Health bar */}
      <group position={[0, 1.0, 0]}>
        <mesh position={[0, 0, 0]}>
          <planeGeometry args={[0.8, 0.08]} />
          <meshLambertMaterial color="#000000" transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.4 + (0.8 * healthPercentage / 100) / 2, 0, 0.001]}>
          <planeGeometry args={[0.8 * healthPercentage / 100, 0.06]} />
          <meshLambertMaterial color="#FF4444" />
        </mesh>
      </group>

      {/* Wolf name */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.12}
        color={isSelected ? "#FFD700" : "#FF6666"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
        fontWeight="bold"
        billboard={true}
      >
        Wolf {health}/{maxHealth}
      </Text>

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.4, 0.45, 32]} />
          <meshLambertMaterial color="#FF6666" transparent opacity={0.8} />
        </mesh>
      )}

      {/* Attack indicator */}
      {isAttacking && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.55, 16]} />
          <meshLambertMaterial color="#FF0000" transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  );
}
