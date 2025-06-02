import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface BuildingType {
  id: string;
  name: string;
  type: "house";
  icon: React.ReactNode;
  description: string;
}

interface PlacedBuilding {
  id: string;
  type: "house";
  gridX: number;
  gridZ: number;
}

interface NPC {
  id: string;
  firstName: string;
  lastName: string;
  houseId: string;
  gridX?: number;
  gridZ?: number;
  isControlled?: boolean;
  isAutoMode?: boolean;
  aiState?: 'at_home' | 'exploring' | 'returning';
  aiLastStateChange?: Date;
  aiTargetX?: number;
  aiTargetZ?: number;
}

interface BuildingState {
  selectedBuilding: BuildingType | null;
  placedBuildings: PlacedBuilding[];
  previewPosition: { x: number; z: number } | null;
  npcs: NPC[];
  selectedBuildingId: string | null;
  controlledNPCId: string | null;
  openInventoryNPCId: string | null;

  // Actions
  selectBuilding: (building: BuildingType) => void;
  clearSelection: () => void;
  setPreviewPosition: (position: { x: number; z: number } | null) => void;
  placeBuilding: (gridX: number, gridZ: number) => void;
  removeBuilding: (id: string) => void;
  createNPC: (npcData: { firstName: string; lastName: string; houseId: string }) => void;
  setSelectedBuildingId: (id: string | null) => void;
  setControlledNPC: (npcId: string | null) => void;
  moveNPCToPosition: (npcId: string, gridX: number, gridZ: number) => void;
  setOpenInventoryNPCId: (npcId: string | null) => void;
  setNPCAutoMode: (npcId: string, autoMode: boolean) => void;
  updateNPCAI: () => void;
}

export const useBuilding = create<BuildingState>()(
  subscribeWithSelector((set, get) => ({
    selectedBuilding: null,
    placedBuildings: [],
    previewPosition: null,
    npcs: [],
    selectedBuildingId: null,
    controlledNPCId: null,
    openInventoryNPCId: null,

    selectBuilding: (building) => {
      console.log('Selected building:', building.name);
      set({ selectedBuilding: building });
    },

    clearSelection: () => {
      console.log('Cleared building selection');
      set({ selectedBuilding: null, previewPosition: null });
    },

    setPreviewPosition: (position) => {
      set({ previewPosition: position });
    },

    placeBuilding: (gridX, gridZ) => {
      const { selectedBuilding, placedBuildings } = get();

      if (!selectedBuilding) {
        console.log('No building selected for placement');
        return;
      }

      // Check if position is already occupied
      const isOccupied = placedBuildings.some(
        building => building.gridX === gridX && building.gridZ === gridZ
      );

      if (isOccupied) {
        console.log(`Position (${gridX}, ${gridZ}) is already occupied`);
        return;
      }

      // Create new building
      const newBuilding: PlacedBuilding = {
        id: `${selectedBuilding.type}-${Date.now()}`,
        type: selectedBuilding.type,
        gridX,
        gridZ
      };

      console.log(`Placed ${selectedBuilding.name} at (${gridX}, ${gridZ})`);

      set({
        placedBuildings: [...placedBuildings, newBuilding],
        selectedBuilding: null,
        previewPosition: null
      });
    },

    removeBuilding: (id) => {
      set((state) => ({
        placedBuildings: state.placedBuildings.filter(building => building.id !== id)
      }));
    },

    createNPC: (npcData) => {
      const { npcs, placedBuildings } = get();
      const building = placedBuildings.find(b => b.id === npcData.houseId);

      if (!building) {
        console.error('Building not found for NPC creation');
        return;
      }

      const newNPC: NPC = {
        id: `npc-${Date.now()}`,
        firstName: npcData.firstName,
        lastName: npcData.lastName,
        houseId: npcData.houseId,
        gridX: building.gridX,
        gridZ: building.gridZ,
        isControlled: false,
        isAutoMode: false,
        aiState: 'at_home',
        aiLastStateChange: new Date(),
      };

      set({ npcs: [...npcs, newNPC] });
    },

    setSelectedBuildingId: (id) => {
      set({ selectedBuildingId: id });
    },

    setControlledNPC: (npcId) => {
      const { npcs } = get();

      set({ 
        controlledNPCId: npcId,
        npcs: npcs.map(npc => ({
          ...npc,
          isControlled: npc.id === npcId
        }))
      });
    },

    moveNPCToPosition: (npcId, gridX, gridZ) => {
      const { npcs } = get();
      const npc = npcs.find(n => n.id === npcId);
      
      if (npc) {
        console.log(`Store: Moving NPC ${npc.firstName} to (${gridX}, ${gridZ})`);
      }

      set({
        npcs: npcs.map(npc => 
          npc.id === npcId 
            ? { ...npc, gridX, gridZ }
            : npc
        )
      });
    },

    setOpenInventoryNPCId: (npcId) => {
      set({ openInventoryNPCId: npcId });
    },

    setNPCAutoMode: (npcId, autoMode) => {
      const { npcs, placedBuildings } = get();
      const npc = npcs.find(n => n.id === npcId);
      
      if (!npc) return;

      // Se desabilitando auto mode, reseta o NPC para casa
      if (!autoMode) {
        const building = placedBuildings.find(b => b.id === npc.houseId);
        if (building) {
          set({
            npcs: npcs.map(n => 
              n.id === npcId 
                ? { 
                    ...n, 
                    isAutoMode: false, 
                    aiState: 'at_home',
                    gridX: building.gridX,
                    gridZ: building.gridZ,
                    aiTargetX: undefined,
                    aiTargetZ: undefined,
                    aiLastStateChange: new Date()
                  }
                : n
            )
          });
        }
      } else {
        // Se habilitando auto mode, inicia no estado at_home
        set({
          npcs: npcs.map(n => 
            n.id === npcId 
              ? { 
                  ...n, 
                  isAutoMode: true, 
                  aiState: 'at_home',
                  aiLastStateChange: new Date()
                }
              : n
          )
        });
      }
    },

    updateNPCAI: () => {
      const { npcs, placedBuildings } = get();
      const now = new Date();

      const updatedNPCs = npcs.map(npc => {
        if (!npc.isAutoMode || npc.isControlled) return npc;

        const building = placedBuildings.find(b => b.id === npc.houseId);
        if (!building) return npc;

        const timeSinceStateChange = now.getTime() - (npc.aiLastStateChange?.getTime() || 0);
        
        switch (npc.aiState) {
          case 'at_home':
            // Fica em casa por 3-5 segundos, depois sai para explorar
            if (timeSinceStateChange > 3000 + Math.random() * 2000) {
              // Escolhe um ponto aleatório para explorar (evita a própria casa)
              let targetX, targetZ;
              do {
                targetX = Math.floor(Math.random() * 15);
                targetZ = Math.floor(Math.random() * 15);
              } while (targetX === building.gridX && targetZ === building.gridZ);
              
              console.log(`NPC ${npc.firstName} going to explore (${targetX}, ${targetZ})`);
              
              return {
                ...npc,
                aiState: 'exploring',
                aiTargetX: targetX,
                aiTargetZ: targetZ,
                aiLastStateChange: now
              };
            }
            break;
            
          case 'exploring':
            // Verifica se chegou no destino de exploração
            if (npc.gridX === npc.aiTargetX && npc.gridZ === npc.aiTargetZ) {
              // Chegou no destino, escolhe um novo ponto ou volta para casa
              if (Math.random() > 0.3) { // 70% chance de continuar explorando
                let targetX, targetZ;
                do {
                  targetX = Math.floor(Math.random() * 15);
                  targetZ = Math.floor(Math.random() * 15);
                } while (targetX === npc.gridX && targetZ === npc.gridZ);
                
                console.log(`NPC ${npc.firstName} continuing exploration to (${targetX}, ${targetZ})`);
                
                return {
                  ...npc,
                  aiTargetX: targetX,
                  aiTargetZ: targetZ,
                  aiLastStateChange: now
                };
              } else {
                // Volta para casa
                console.log(`NPC ${npc.firstName} returning home`);
                return {
                  ...npc,
                  aiState: 'returning',
                  aiTargetX: building.gridX,
                  aiTargetZ: building.gridZ,
                  aiLastStateChange: now
                };
              }
            }
            
            // Se está explorando há muito tempo (20-30 segundos), força volta para casa
            if (timeSinceStateChange > 20000 + Math.random() * 10000) {
              console.log(`NPC ${npc.firstName} timeout, returning home`);
              return {
                ...npc,
                aiState: 'returning',
                aiTargetX: building.gridX,
                aiTargetZ: building.gridZ,
                aiLastStateChange: now
              };
            }
            break;
            
          case 'returning':
            // Verifica se chegou em casa
            if (npc.gridX === building.gridX && npc.gridZ === building.gridZ) {
              console.log(`NPC ${npc.firstName} arrived home`);
              return {
                ...npc,
                aiState: 'at_home',
                aiTargetX: undefined,
                aiTargetZ: undefined,
                aiLastStateChange: now
              };
            }
            break;
        }

        return npc;
      });

      set({ npcs: updatedNPCs });
    }
  }))
);