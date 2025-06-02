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
  health?: number;
  maxHealth?: number;
  mana?: number;
  maxMana?: number;
  isInCombat?: boolean;
}

interface Wolf {
  id: string;
  gridX: number;
  gridZ: number;
  health: number;
  maxHealth: number;
}

interface BuildingState {
  // Buildings
  availableBuildings: BuildingType[];
  placedBuildings: PlacedBuilding[];
  selectedBuildingType: string | null;
  selectedBuildingId: string | null;

  // NPCs
  npcs: NPC[];
  controlledNPCId: string | null;

  // Wolves and Combat
  wolves: Wolf[];
  selectedWolfId: string | null;

  // Actions
  selectBuildingType: (type: string | null) => void;
  selectBuilding: (id: string | null) => void;
  placeBuilding: (type: string, gridX: number, gridZ: number) => void;
  removeBuilding: (id: string) => void;

  // NPC Actions
  createNPC: (firstName: string, lastName: string, houseId: string) => void;
  removeNPC: (id: string) => void;
  moveNPCToPosition: (id: string, gridX: number, gridZ: number) => void;
  setControlledNPC: (id: string | null) => void;
  setNPCAutoMode: (id: string, autoMode: boolean) => void;
  updateNPCAI: () => void;

  // Wolf and Combat Actions
  spawnWolf: (gridX: number, gridZ: number) => void;
  removeWolf: (id: string) => void;
  selectWolf: (id: string | null) => void;
  attackWolf: (wolfId: string, damage: number) => void;
  wolfAttackNPC: (wolfId: string, npcId: string) => void;
}

export const useBuilding = create<BuildingState>()(
  subscribeWithSelector((set, get) => ({
    // Buildings
    availableBuildings: [],
    placedBuildings: [],
    selectedBuildingType: null,
    selectedBuildingId: null,

    // NPCs
    npcs: [],
    controlledNPCId: null,

    // Wolves and Combat
    wolves: [
      // Spawn a few wolves by default
      { id: 'wolf-1', gridX: 2, gridZ: 2, health: 50, maxHealth: 50 },
      { id: 'wolf-2', gridX: 10, gridZ: 8, health: 50, maxHealth: 50 },
      { id: 'wolf-3', gridX: 12, gridZ: 3, health: 50, maxHealth: 50 },
    ],
    selectedWolfId: null,

    // Actions
    selectBuildingType: (type) => set({ selectedBuildingType: type }),
    selectBuilding: (id) => set({ selectedBuildingId: id }),
    placeBuilding: (type, gridX, gridZ) => {
      set((state) => ({
        placedBuildings: [
          ...state.placedBuildings,
          { id: `building-${Date.now()}`, type, gridX, gridZ },
        ],
      }));
    },
    removeBuilding: (id) => {
      set((state) => ({
        placedBuildings: state.placedBuildings.filter(
          (building) => building.id !== id
        ),
      }));
    },

    // NPC Actions
    createNPC: (firstName, lastName, houseId) => {
      const { npcs, placedBuildings } = get();
      const id = `npc-${Date.now()}`;
      const building = placedBuildings.find((b) => b.id === houseId);

      if (!building) {
        console.error("Building not found for NPC creation");
        return;
      }

      const newNPC: NPC = {
        id,
        firstName,
        lastName,
        houseId,
        gridX: building.gridX,
        gridZ: building.gridZ,
        isControlled: false,
        isAutoMode: false,
        aiState: 'at_home',
        aiLastStateChange: new Date(),
        health: 100,
        maxHealth: 100,
        mana: 100,
        maxMana: 100,
        isInCombat: false,
      };

      set({ npcs: [...npcs, newNPC] });
    },
    removeNPC: (id) => {
      set((state) => ({
        npcs: state.npcs.filter((npc) => npc.id !== id),
      }));
    },
    moveNPCToPosition: (id, gridX, gridZ) => {
      set((state) => ({
        npcs: state.npcs.map((npc) =>
          npc.id === id ? { ...npc, gridX, gridZ } : npc
        ),
      }));
    },
    setControlledNPC: (id) => {
      set({ controlledNPCId: id });
    },
    setNPCAutoMode: (id, autoMode) => {
      set((state) => ({
        npcs: state.npcs.map((npc) =>
          npc.id === id ? { ...npc, isAutoMode: autoMode } : npc
        ),
      }));
    },
    updateNPCAI: () => {
      set((state) => ({
        npcs: state.npcs.map((npc) => {
          if (!npc.isAutoMode) return npc;

          // Basic AI logic
          if (npc.aiState === "at_home") {
            // After a delay, start exploring
            setTimeout(() => {
              set((state) => ({
                npcs: state.npcs.map((n) =>
                  n.id === npc.id ? { ...n, aiState: "exploring" } : n
                ),
              }));
            }, 5000);
            return npc;
          }

          // If exploring, move randomly
          if (npc.aiState === "exploring") {
            const newGridX = Math.floor(Math.random() * 10);
            const newGridZ = Math.floor(Math.random() * 10);
            return { ...npc, gridX: newGridX, gridZ: newGridZ };
          }

          return npc;
        }),
      }));
    },

    // Wolf and Combat Actions
    spawnWolf: (gridX: number, gridZ: number) => {
      const id = `wolf-${Date.now()}`;
      const newWolf: Wolf = {
        id,
        gridX,
        gridZ,
        health: 50,
        maxHealth: 50,
      };

      set(state => ({
        wolves: [...state.wolves, newWolf]
      }));
    },

    removeWolf: (id: string) => {
      set(state => ({
        wolves: state.wolves.filter(wolf => wolf.id !== id),
        selectedWolfId: state.selectedWolfId === id ? null : state.selectedWolfId
      }));
    },

    selectWolf: (id: string | null) => {
      set({ selectedWolfId: id });
    },

    attackWolf: (wolfId: string, damage: number) => {
      set(state => {
        const updatedWolves = state.wolves.map(wolf => {
          if (wolf.id === wolfId) {
            const newHealth = Math.max(0, wolf.health - damage);
            return { ...wolf, health: newHealth };
          }
          return wolf;
        });

        return { wolves: updatedWolves };
      });
    },

    wolfAttackNPC: (wolfId: string, npcId: string) => {
      set(state => {
        const updatedNPCs = state.npcs.map(npc => {
          if (npc.id === npcId) {
            const damage = 10;
            const newHealth = Math.max(0, (npc.health || 100) - damage);
            console.log(`Wolf attacks ${npc.firstName}! ${damage} damage dealt.`);
            return { 
              ...npc, 
              health: newHealth,
              isInCombat: true
            };
          }
          return npc;
        });

        return { npcs: updatedNPCs };
      });
    }
  }))
);