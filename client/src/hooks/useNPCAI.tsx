
import { useEffect, useRef } from 'react';
import { useBuilding } from '../lib/stores/useBuilding';

export function useNPCAI() {
  const { npcs, updateNPCAI, moveNPCToPosition } = useBuilding();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Atualizar IA a cada 1 segundo
    intervalRef.current = setInterval(() => {
      updateNPCAI();
      
      // Mover NPCs que estão em modo automático para seus destinos
      npcs.forEach(npc => {
        if (!npc.isAutoMode || !npc.aiTargetX || !npc.aiTargetZ) return;
        
        const currentX = npc.gridX ?? 0;
        const currentZ = npc.gridZ ?? 0;
        const targetX = npc.aiTargetX;
        const targetZ = npc.aiTargetZ;

        // Pathfinding simples - move um passo por vez em direção ao destino
        if (currentX !== targetX || currentZ !== targetZ) {
          let nextX = currentX;
          let nextZ = currentZ;

          // Decidir se move primeiro em X ou Z (movimento mais natural)
          if (Math.abs(currentX - targetX) > Math.abs(currentZ - targetZ)) {
            // Mover em X primeiro
            nextX = currentX < targetX ? currentX + 1 : currentX - 1;
          } else if (currentZ !== targetZ) {
            // Mover em Z
            nextZ = currentZ < targetZ ? currentZ + 1 : currentZ - 1;
          } else if (currentX !== targetX) {
            // Mover em X se Z já está correto
            nextX = currentX < targetX ? currentX + 1 : currentX - 1;
          }

          // Garantir que não saia dos limites do grid
          nextX = Math.max(0, Math.min(14, nextX));
          nextZ = Math.max(0, Math.min(14, nextZ));

          moveNPCToPosition(npc.id, nextX, nextZ);
        }
      });
    }, 1000); // Movimento a cada 1 segundo

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [npcs, updateNPCAI, moveNPCToPosition]);
}
