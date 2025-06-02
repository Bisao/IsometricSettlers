import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { FantasyPanel, FantasyButton } from "./fantasy-ui";

const buildings = [
  { 
    id: "house",
    name: "Casa", 
    type: "house" as const,
    icon: "🏠",
    description: "Casa residencial básica para NPCs"
  }
];

interface BuildingPanelProps {
  onClose: () => void;
}

export default function BuildingPanel({ onClose }: BuildingPanelProps) {
  const { selectedBuilding, setSelectedBuilding } = useBuilding();
  const isMobile = useIsMobile();

  const handleBuildingSelect = (building: typeof buildings[0]) => {
    console.log("Selected building:", building.name);
    setSelectedBuilding(building);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative ${isMobile ? 'w-11/12 max-w-sm' : 'w-96'} max-h-[80vh] overflow-y-auto`}>
        <FantasyPanel title="🏗️ Painel de Estruturas" onClose={onClose}>
          <div className="space-y-4">
            <p className="text-amber-800 text-sm font-medium text-center">
              Selecione uma estrutura para posicionar no mundo
            </p>

            <div className="space-y-3">
              {buildings.map((building) => (
                <div key={building.id} className="space-y-2">
                  <FantasyButton
                    onClick={() => handleBuildingSelect(building)}
                    variant={selectedBuilding?.id === building.id ? "success" : "primary"}
                    size={isMobile ? "sm" : "md"}
                    className="w-full"
                  >
                    <span className="text-xl">{building.icon}</span>
                    <span>{building.name}</span>
                    {selectedBuilding?.id === building.id && (
                      <span className="text-xs bg-green-800 px-2 py-1 rounded-full">
                        SELECIONADO
                      </span>
                    )}
                  </FantasyButton>

                  <p className="text-xs text-amber-600 px-2">
                    {building.description}
                  </p>
                </div>
              ))}
            </div>

            {selectedBuilding && (
              <div className="bg-amber-100 p-3 rounded-lg border-2 border-amber-300">
                <p className="text-amber-800 text-sm font-medium text-center">
                  ✨ {selectedBuilding.name} selecionada!
                </p>
                <p className="text-amber-600 text-xs text-center mt-1">
                  Clique no terreno para posicionar
                </p>
              </div>
            )}
          </div>
        </FantasyPanel>
      </div>
    </div>
  );
}