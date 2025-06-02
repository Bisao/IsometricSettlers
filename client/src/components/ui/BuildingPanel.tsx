
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
  isOpen: boolean;
  onClose: () => void;
}

export default function BuildingPanel({ isOpen, onClose }: BuildingPanelProps) {
  const { selectedBuilding, selectBuilding, clearSelection } = useBuilding();
  const isMobile = useIsMobile();

  if (!isOpen) return null;

  const handleBuildingSelect = (building: typeof buildings[0]) => {
    if (selectedBuilding?.id === building.id) {
      clearSelection();
      onClose();
    } else {
      selectBuilding(building);
      onClose();
    }
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
                  
                  <p className="text-xs text-amber-700 text-center italic">
                    {building.description}
                  </p>
                </div>
              ))}
            </div>
            
            {selectedBuilding && (
              <div className="mt-6 p-3 bg-green-100 border-2 border-green-400 rounded-lg">
                <p className="text-green-800 text-sm font-bold text-center">
                  ✨ {selectedBuilding.name} selecionada!
                </p>
                <p className="text-green-700 text-xs text-center mt-1">
                  Clique no mapa para posicionar a estrutura
                </p>
                <p className="text-green-600 text-xs text-center mt-1">
                  Pressione ESC para cancelar
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <FantasyButton
                onClick={onClose}
                variant="secondary"
                size="sm"
                className="flex-1"
              >
                Fechar
              </FantasyButton>
              
              {selectedBuilding && (
                <FantasyButton
                  onClick={() => {
                    clearSelection();
                    onClose();
                  }}
                  variant="danger"
                  size="sm"
                  className="flex-1"
                >
                  Cancelar Seleção
                </FantasyButton>
              )}
            </div>
          </div>
        </FantasyPanel>
      </div>
    </div>
  );
}
