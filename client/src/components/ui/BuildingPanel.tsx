import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, X } from "lucide-react";
import { useBuilding } from "../../lib/stores/useBuilding";

interface BuildingType {
  id: string;
  name: string;
  type: "house";
  icon: React.ReactNode;
  description: string;
}

const availableBuildings: BuildingType[] = [
  {
    id: "house",
    name: "House",
    type: "house",
    icon: <Home className="w-6 h-6" />,
    description: "A cozy family home"
  }
];

export default function BuildingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedBuilding, selectBuilding, clearSelection } = useBuilding();

  const handleBuildingSelect = (building: BuildingType) => {
    selectBuilding(building);
    setIsOpen(false);
  };

  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <>
      {/* Panel Toggle Button */}
      <div className="absolute bottom-4 right-4">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Home className="w-5 h-5 mr-2" />
          Buildings
        </Button>
      </div>

      {/* Selected Building Indicator */}
      {selectedBuilding && (
        <div className="absolute bottom-20 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          {selectedBuilding.icon}
          <span>{selectedBuilding.name} selected</span>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearSelection}
            className="text-white hover:bg-green-700 p-1 h-auto"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Building Selection Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-4 w-80">
          <Card className="bg-white bg-opacity-95 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800">Select Building</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableBuildings.map((building) => (
                <div
                  key={building.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                    selectedBuilding?.id === building.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleBuildingSelect(building)}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-blue-600">
                      {building.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{building.name}</h3>
                      <p className="text-sm text-gray-600">{building.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-20 z-[-1]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
