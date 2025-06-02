import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { gridToWorld } from "../../lib/gameUtils";
import { useBuilding } from "../../lib/stores/useBuilding";

interface NPCProps {
  position: [number, number, number];
  firstName: string;
  lastName: string;
  isSelected?: boolean;
  isControlled?: boolean;
  npcId?: string;
  showVision?: boolean;
  visionRange?: number;
  visionAngle?: number;
  aiPersonality?: 'explorer' | 'homebody' | 'social' | 'worker';
  aiMood?: 'happy' | 'neutral' | 'tired' | 'excited';
  aiEnergy?: number;
}

export default function NPC({ 
  position, 
  firstName, 
  lastName, 
  isSelected = false, 
  isControlled = false,
  npcId,
  showVision = false,
  visionRange = 3,
  visionAngle = 60,
  aiPersonality = 'explorer',
  aiMood = 'neutral',
  aiEnergy = 80
}: NPCProps) {
  const npcRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const eyesRef = useRef<THREE.Group>(null);
  
  // Current world position for smooth movement
  const [currentPosition, setCurrentPosition] = useState<[number, number, number]>(() => {
    // Convert grid position to world position if needed
    if (position[1] === 0) {
      const worldPos = gridToWorld(position[0], position[2], 1);
      return [worldPos.x, 0, worldPos.z];
    }
    return position;
  });
  
  // Target position for interpolation
  const [targetPosition, setTargetPosition] = useState<[number, number, number]>(currentPosition);
  
  // Walking animation state
  const [isWalking, setIsWalking] = useState(false);
  const walkCycleRef = useRef(0);
  
  // Direction tracking for looking where walking
  const [movementDirection, setMovementDirection] = useState<[number, number]>([0, 0]);
  const [targetRotation, setTargetRotation] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);

  // Update target position when position prop changes
  useEffect(() => {
    let newTargetPos: [number, number, number];
    
    if (position[1] === 0) {
      // Convert grid position to world position (center of tile)
      const worldPos = gridToWorld(position[0], position[2], 1);
      newTargetPos = [worldPos.x, 0, worldPos.z];
    } else {
      newTargetPos = position;
    }
    
    // Check if position actually changed
    const hasChanged = Math.abs(newTargetPos[0] - targetPosition[0]) > 0.01 || 
                      Math.abs(newTargetPos[2] - targetPosition[2]) > 0.01;
    
    if (hasChanged) {
      // Calculate movement direction
      const deltaX = newTargetPos[0] - currentPosition[0];
      const deltaZ = newTargetPos[2] - currentPosition[2];
      
      if (Math.abs(deltaX) > 0.01 || Math.abs(deltaZ) > 0.01) {
        setMovementDirection([deltaX, deltaZ]);
        
        // Calculate target rotation based on movement direction
        const angle = Math.atan2(deltaX, deltaZ);
        setTargetRotation(angle);
      }
      
      setTargetPosition(newTargetPos);
      setIsWalking(true);
    }
  }, [position, targetPosition, currentPosition]);

  // Generate consistent appearance based on name and personality
  const nameHash = `${firstName || ''}${lastName || ''}`.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  // Personality-influenced clothing colors
  const personalityColors = {
    explorer: ['#4ECDC4', '#45B7D1', '#96CEB4'], // Cool, adventurous colors
    homebody: ['#DDA0DD', '#98D8C8', '#FFEAA7'], // Warm, comfortable colors  
    social: ['#FF6B6B', '#FFD700', '#FF4500'], // Bright, attention-grabbing
    worker: ['#2C3E50', '#34495E', '#696969'] // Professional, muted colors
  };

  const shirtColors = personalityColors[aiPersonality] || personalityColors.explorer;
  const pantsColors = ['#2C3E50', '#34495E', '#8B4513', '#2F4F4F', '#696969', '#556B2F'];
  const hairColors = ['#8B4513', '#654321', '#2F1B14', '#FFD700', '#FF4500', '#000000', '#A0522D'];
  const skinTones = ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'];

  const shirtColor = shirtColors[nameHash % shirtColors.length];
  const pantsColor = pantsColors[(nameHash + 1) % pantsColors.length];
  const hairColor = hairColors[(nameHash + 2) % hairColors.length];
  const skinTone = skinTones[(nameHash + 3) % skinTones.length];
  const hasGlasses = nameHash % 4 === 0;
  const hasHat = nameHash % 5 === 0;

  // Vision cone geometry
  const visionConeGeometry = new THREE.ConeGeometry(
    visionRange * Math.tan((visionAngle * Math.PI / 180) / 2), 
    visionRange, 
    16, 
    1, 
    true
  );
  
  // Mood-based colors
  const moodColors = {
    happy: '#FFD700',
    excited: '#FF6B6B', 
    neutral: '#FFFFFF',
    tired: '#B0B0B0'
  };
  
  const moodColor = moodColors[aiMood];

  // Animation and movement system
  useFrame((state, delta) => {
    if (!npcRef.current) return;
    
    // Smooth movement interpolation
    const lerpSpeed = 3.0; // Movement speed
    const newPos: [number, number, number] = [
      THREE.MathUtils.lerp(currentPosition[0], targetPosition[0], lerpSpeed * delta),
      currentPosition[1],
      THREE.MathUtils.lerp(currentPosition[2], targetPosition[2], lerpSpeed * delta)
    ];
    
    // Smooth rotation interpolation
    const rotationSpeed = 8.0;
    const newRotation = THREE.MathUtils.lerp(currentRotation, targetRotation, rotationSpeed * delta);
    setCurrentRotation(newRotation);
    
    // Check if we've reached the target
    const distance = Math.sqrt(
      Math.pow(newPos[0] - targetPosition[0], 2) + 
      Math.pow(newPos[2] - targetPosition[2], 2)
    );
    
    if (distance < 0.05) {
      // Snap to target and stop walking
      newPos[0] = targetPosition[0];
      newPos[2] = targetPosition[2];
      setIsWalking(false);
      walkCycleRef.current = 0;
    }
    
    setCurrentPosition(newPos);
    npcRef.current.position.set(newPos[0], newPos[1], newPos[2]);
    
    // Energy-influenced animation speed
    const energyMultiplier = Math.max(0.3, aiEnergy / 100);
    
    // Walking animation
    if (isWalking) {
      walkCycleRef.current += delta * 8 * energyMultiplier; // Energy affects walking speed
      
      // Bob up and down while walking
      npcRef.current.position.y = newPos[1] + Math.sin(walkCycleRef.current) * (0.05 * energyMultiplier);
      
      // Main body rotation to face movement direction + slight sway
      npcRef.current.rotation.y = newRotation + Math.sin(walkCycleRef.current * 0.5) * 0.08;
      
      // Enhanced head movement while walking - look ahead in movement direction
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(walkCycleRef.current * 0.7) * 0.2;
        headRef.current.rotation.x = Math.sin(walkCycleRef.current * 0.8) * 0.08;
      }
    } else {
      // Idle animations - affected by mood and energy
      const idleIntensity = aiMood === 'excited' ? 1.5 : aiMood === 'tired' ? 0.5 : 1.0;
      npcRef.current.position.y = newPos[1] + Math.sin(state.clock.elapsedTime * 1.5 * energyMultiplier) * (0.02 * idleIntensity);
      
      // Keep facing the last movement direction when idle
      npcRef.current.rotation.y = newRotation;
      
      // Gentle head movement when idle - personality affects look around behavior
      if (headRef.current) {
        const lookAroundIntensity = aiPersonality === 'explorer' ? 1.5 : aiPersonality === 'homebody' ? 0.5 : 1.0;
        headRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.8) * (0.15 * lookAroundIntensity);
        headRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6) * 0.05;
      }
    }

    // Eye blinking (always active)
    if (eyesRef.current) {
      const blinkTime = Math.sin(state.clock.elapsedTime * 0.1) > 0.95 ? 0.3 : 1;
      eyesRef.current.scale.y = blinkTime;
    }
  });

  return (
    <group ref={npcRef} position={currentPosition}>
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

      {/* Vision Cone */}
      {showVision && (
        <mesh 
          position={[0, 0.1, 0]} 
          rotation={[-Math.PI / 2, 0, currentRotation]}
        >
          <primitive object={visionConeGeometry} />
          <meshLambertMaterial 
            color="#00FFFF" 
            transparent 
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Enhanced floating name with personality icon */}
      <Text
        position={[0, 1.4, 0]}
        fontSize={0.12}
        color={isSelected ? "#FFD700" : moodColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#000000"
        fontWeight="bold"
      >
        {firstName} {lastName}
      </Text>

      {/* Personality indicator */}
      <Text
        position={[0, 1.25, 0]}
        fontSize={0.08}
        color={shirtColor}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {aiPersonality === 'explorer' ? '🗺️' : 
         aiPersonality === 'social' ? '👥' : 
         aiPersonality === 'worker' ? '⚙️' : '🏠'}
      </Text>

      {/* Energy bar */}
      <group position={[0, 1.55, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.3, 0.03, 0.01]} />
          <meshLambertMaterial color="#333333" />
        </mesh>
        <mesh position={[-(0.3 * (1 - aiEnergy / 100)) / 2, 0, 0.005]}>
          <boxGeometry args={[0.3 * (aiEnergy / 100), 0.025, 0.01]} />
          <meshLambertMaterial color={aiEnergy > 60 ? "#00FF00" : aiEnergy > 30 ? "#FFFF00" : "#FF0000"} />
        </mesh>
      </group>

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