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
    }
  }))
);