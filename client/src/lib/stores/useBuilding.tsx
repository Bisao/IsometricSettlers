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

interface BuildingState {
  selectedBuilding: BuildingType | null;
  placedBuildings: PlacedBuilding[];
  previewPosition: { x: number; z: number } | null;
  
  // Actions
  selectBuilding: (building: BuildingType) => void;
  clearSelection: () => void;
  setPreviewPosition: (position: { x: number; z: number } | null) => void;
  placeBuilding: (gridX: number, gridZ: number) => void;
  removeBuilding: (id: string) => void;
}

export const useBuilding = create<BuildingState>()(
  subscribeWithSelector((set, get) => ({
    selectedBuilding: null,
    placedBuildings: [],
    previewPosition: null,
    
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
    }
  }))
);
