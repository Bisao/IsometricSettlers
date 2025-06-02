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
  aiState?: 'at_home' | 'exploring' | 'returning' | 'socializing';
  aiLastStateChange?: Date;
  aiTargetX?: number;
  aiTargetZ?: number;
  aiPersonality?: 'explorer' | 'homebody' | 'social' | 'worker';
  aiEnergy?: number;
  aiMood?: 'happy' | 'sad' | 'neutral';
  aiMemory?: any[];
  showVision?: boolean;
  visionRange?: number;
  visionAngle?: number;
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
    toggleNPCVision: (npcId: string) => void;
  toggleAllNPCVision: () => void;
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

    createNPC: (npcData: { firstName: string; lastName: string; houseId: string }) => {
    const { npcs, placedBuildings } = get();
    const building = placedBuildings.find(b => b.id === npcData.houseId);

    // Generate personality and traits
    const personalities: ('explorer' | 'homebody' | 'social' | 'worker')[] = ['explorer', 'homebody', 'social', 'worker'];
    const personality = personalities[Math.floor(Math.random() * personalities.length)];

    if (building) {
      set(state => ({
        npcs: [...state.npcs, {
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
          aiPersonality: personality,
          aiEnergy: 80 + Math.floor(Math.random() * 20), // 80-100
          aiMood: 'happy',
          aiMemory: [],
          showVision: false,
          visionRange: personality === 'explorer' ? 4 : personality === 'social' ? 3 : 2,
          visionAngle: 60
        }]
      }));
    }
  },

  toggleNPCVision: (npcId: string) => {
    set(state => {
      const targetNPC = state.npcs.find(npc => npc.id === npcId);
      const newShowVision = !targetNPC?.showVision;
      
      return {
        npcs: state.npcs.map(npc => 
          npc.id === npcId 
            ? { ...npc, showVision: newShowVision }
            : { ...npc, showVision: false } // Desativa visão de outros NPCs
        ),
        // Se estiver ativando a visão, controla o NPC automaticamente
        controlledNPCId: newShowVision ? npcId : (state.controlledNPCId === npcId ? null : state.controlledNPCId)
      };
    });
  },

  toggleAllNPCVision: () => {
    set(state => {
      const anyVisionVisible = state.npcs.some(npc => npc.showVision);
      return {
        npcs: state.npcs.map(npc => ({ ...npc, showVision: !anyVisionVisible }))
      };
    });
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

        const newEnergy = Math.max(0, Math.min(100, (npc.aiEnergy || 80) - 0.1)); // Drains 0.1 energy per tick
        let newMood = npc.aiMood || 'neutral';

        // Mood affects energy drain
        if (newMood === 'sad') {
          // Drains extra energy
        } else if (newMood === 'happy') {
          // Drains less energy
        }
        const timeSinceStateChange = now.getTime() - (npc.aiLastStateChange?.getTime() || 0);
        const personality = npc.aiPersonality || 'explorer';

        // Add memory of current action
        const memory = [...(npc.aiMemory || [])];
        if (memory.length > 10) memory.shift(); // Keep only last 10 memories

        switch (npc.aiState) {
          case 'at_home':
            let stayTime = 5000; // Base stay time

            // Personality affects behavior
            switch (personality) {
              case 'homebody':
                stayTime = 15000 + Math.random() * 10000; // Stays home longer
                break;
              case 'explorer':
                stayTime = 3000 + Math.random() * 3000; // Leaves home quickly
                break;
              case 'social':
                stayTime = 8000 + Math.random() * 5000; // Moderate stay time
                break;
              case 'worker':
                stayTime = 10000 + Math.random() * 5000; // Stays home for "work"
                break;
            }

            // Low energy NPCs stay home longer
            if (newEnergy < 30) {
              stayTime *= 2;
            }

            if (timeSinceStateChange > stayTime) {
              let targetX: number, targetZ: number;

              // Choose target based on personality
              if (personality === 'explorer') {
                // Explorers go to map edges
                const edge = Math.floor(Math.random() * 4);
                switch (edge) {
                  case 0: targetX = 0; targetZ = Math.floor(Math.random() * 15); break;
                  case 1: targetX = 14; targetZ = Math.floor(Math.random() * 15); break;
                  case 2: targetX = Math.floor(Math.random() * 15); targetZ = 0; break;
                  default: targetX = Math.floor(Math.random() * 15); targetZ = 14; break;
                }
              } else if (personality === 'social') {
                // Social NPCs visit other houses
                const otherBuildings = placedBuildings.filter(b => b.id !== npc.houseId);
                if (otherBuildings.length > 0) {
                  const targetBuilding = otherBuildings[Math.floor(Math.random() * otherBuildings.length)];
                  targetX = targetBuilding.gridX;
                  targetZ = targetBuilding.gridZ;
                } else {
                  targetX = 7 + Math.floor(Math.random() * 3) - 1; // Center area
                  targetZ = 7 + Math.floor(Math.random() * 3) - 1;
                }
              } else {
                // Default random movement
                targetX = Math.floor(Math.random() * 15);
                targetZ = Math.floor(Math.random() * 15);
              }

              memory.push({
                type: 'left_home',
                data: { target: [targetX, targetZ], personality },
                timestamp: now
              });

              console.log(`NPC ${npc.firstName} (${personality}) starting exploration to (${targetX}, ${targetZ})`);

              return {
                ...npc,
                aiState: 'exploring',
                aiTargetX: targetX,
                aiTargetZ: targetZ,
                aiLastStateChange: now,
                aiEnergy: newEnergy,
                aiMood: newMood,
                aiMemory: memory
              };
            }
            break;

          case 'exploring':
            // Check if reached destination
            if (npc.gridX === npc.aiTargetX && npc.gridZ === npc.aiTargetZ) {
              memory.push({
                type: 'reached_destination',
                data: { position: [npc.gridX, npc.gridZ], personality },
                timestamp: now
              });

              // Decision based on personality and energy
              let continueExploring = false;

              switch (personality) {
                case 'explorer':
                  continueExploring = newEnergy > 30 && Math.random() < 0.8;
                  break;
                case 'social':
                  // Check if at another house, if so, "socialize" for a bit
                  const atBuilding = placedBuildings.find(b => b.gridX === npc.gridX && b.gridZ === npc.gridZ);
                  if (atBuilding && atBuilding.id !== npc.houseId) {
                    memory.push({
                      type: 'socializing',
                      data: { buildingId: atBuilding.id },
                      timestamp: now
                    });
                    return {
                      ...npc,
                      aiState: 'socializing',
                      aiLastStateChange: now,
                      aiEnergy: newEnergy,
                      aiMood: 'happy',
                      aiMemory: memory
                    };
                  }
                  continueExploring = newEnergy > 40 && Math.random() < 0.6;
                  break;
                case 'worker':
                  continueExploring = newEnergy > 50 && Math.random() < 0.4;
                  break;
                default:
                  continueExploring = newEnergy > 40 && Math.random() < 0.5;
              }

              if (continueExploring) {
                // Continue exploring - choose new destination
                let targetX: number, targetZ: number;

                do {
                  if (personality === 'explorer') {
                    // Explorers prefer unvisited areas
                    targetX = Math.floor(Math.random() * 15);
                    targetZ = Math.floor(Math.random() * 15);
                  } else if (personality === 'social') {
                    // Social NPCs visit other houses
                    const otherBuildings = placedBuildings.filter(b => b.id !== npc.houseId);
                    if (otherBuildings.length > 0 && Math.random() < 0.7) {
                      const targetBuilding = otherBuildings[Math.floor(Math.random() * otherBuildings.length)];
                      targetX = targetBuilding.gridX;
                      targetZ = targetBuilding.gridZ;
                    } else {
                      targetX = Math.floor(Math.random() * 15);
                      targetZ = Math.floor(Math.random() * 15);
                    }
                  } else {
                    targetX = Math.floor(Math.random() * 15);
                    targetZ = Math.floor(Math.random() * 15);
                  }
                } while (targetX === npc.gridX && targetZ === npc.gridZ);

                console.log(`NPC ${npc.firstName} (${personality}) continuing exploration to (${targetX}, ${targetZ})`);

                return {
                  ...npc,
                  aiTargetX: targetX,
                  aiTargetZ: targetZ,
                  aiLastStateChange: now,
                  aiEnergy: newEnergy,
                  aiMood: newMood,
                  aiMemory: memory
                };
              } else {
                // Return home
                console.log(`NPC ${npc.firstName} returning home`);
                return {
                  ...npc,
                  aiState: 'returning',
                  aiTargetX: building.gridX,
                  aiTargetZ: building.gridZ,
                  aiLastStateChange: now,
                  aiEnergy: newEnergy,
                  aiMood: newMood,
                  aiMemory: memory
                };
              }
            }

            // Timeout based on personality and energy
            let maxExploreTime = 20000; // Base 20 seconds
            if (personality === 'explorer') maxExploreTime = 40000;
            else if (personality === 'homebody') maxExploreTime = 10000;

            if (newEnergy < 20) maxExploreTime /= 2; // Tired NPCs return faster

            if (timeSinceStateChange > maxExploreTime + Math.random() * 10000) {
              console.log(`NPC ${npc.firstName} timeout, returning home`);
              return {
                ...npc,
                aiState: 'returning',
                aiTargetX: building.gridX,
                aiTargetZ: building.gridZ,
                aiLastStateChange: now,
                aiEnergy: newEnergy,
                aiMood: newMood,
                aiMemory: memory
              };
            }
            break;

          case 'socializing':
            // Socialize for 3-8 seconds then continue or go home
            if (timeSinceStateChange > 3000 + Math.random() * 5000) {
              if (newEnergy > 30 && Math.random() < 0.5) {
                // Continue exploring
                let targetX = Math.floor(Math.random() * 15);
                let targetZ = Math.floor(Math.random() * 15);

                return {
                  ...npc,
                  aiState: 'exploring',
                  aiTargetX: targetX,
                  aiTargetZ: targetZ,
                  aiLastStateChange: now,
                  aiEnergy: newEnergy,
                  aiMood: 'happy',
                  aiMemory: memory
                };
              } else {
                // Go home
                return {
                  ...npc,
                  aiState: 'returning',
                  aiTargetX: building.gridX,
                  aiTargetZ: building.gridZ,
                  aiLastStateChange: now,
                  aiEnergy: newEnergy,
                  aiMood: newMood,
                  aiMemory: memory
                };
              }
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
                aiLastStateChange: now,
                aiEnergy: newEnergy,
                aiMood: newMood,
                aiMemory: memory
              };
            }
            break;
        }

        // Return updated NPC with energy and mood changes
        return {
          ...npc,
          aiEnergy: newEnergy,
          aiMood: newMood,
          aiMemory: memory
        };
      });

      set({ npcs: updatedNPCs });
    }
  }))
);