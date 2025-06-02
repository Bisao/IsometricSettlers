
import { useEffect, useRef } from 'react';
import { useBuilding } from '../lib/stores/useBuilding';

export function useNPCAI() {
  const { npcs, updateNPCAI, moveNPCToPosition } = useBuilding();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Atualizar IA a cada 2 segundos
    intervalRef.current = setInterval(() => {
      updateNPCAI();
      
      // Mover NPCs que estão em modo automático para seus destinos
      npcs.forEach(npc => {
        if (!npc.isAutoMode || npc.isControlled) return;
        
        const currentX = npc.gridX ?? 0;
        const currentZ = npc.gridZ ?? 0;
        
        // Se não tem destino, não move
        if (npc.aiTargetX === undefined || npc.aiTargetZ === undefined) return;
        
        const targetX = npc.aiTargetX;
        const targetZ = npc.aiTargetZ;

        // Pathfinding simples - move um passo por vez em direção ao destino
        if (currentX !== targetX || currentZ !== targetZ) {
          let nextX = currentX;
          let nextZ = currentZ;

          // Movimento mais inteligente - prioriza maior diferença
          const deltaX = targetX - currentX;
          const deltaZ = targetZ - currentZ;
          
          if (Math.abs(deltaX) >= Math.abs(deltaZ) && deltaX !== 0) {
            // Mover em X primeiro quando a diferença em X é maior ou igual
            nextX = currentX + (deltaX > 0 ? 1 : -1);
          } else if (deltaZ !== 0) {
            // Mover em Z
            nextZ = currentZ + (deltaZ > 0 ? 1 : -1);
          }

          // Garantir que não saia dos limites do grid
          nextX = Math.max(0, Math.min(14, nextX));
          nextZ = Math.max(0, Math.min(14, nextZ));

          // Debug log
          if (nextX !== currentX || nextZ !== currentZ) {
            console.log(`Moving NPC ${npc.firstName} from (${currentX}, ${currentZ}) to (${nextX}, ${nextZ}), target: (${targetX}, ${targetZ})`);
          }

          moveNPCToPosition(npc.id, nextX, nextZ);
        }
      });
    }, 2000); // Movimento a cada 2 segundos para ser mais visível

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [npcs, updateNPCAI, moveNPCToPosition]);
}
