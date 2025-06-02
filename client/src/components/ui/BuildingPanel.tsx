
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`relative ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'} max-h-[90vh] overflow-y-auto`}>
        <FantasyPanel title="🏗️ Painel de Estruturas" onClose={onClose}>
          <div className="space-y-4">
            <p className="text-gray-800 text-sm font-medium text-center">
              Selecione uma estrutura para posicionar no mundo
            </p>
            
            <div className="grid gap-4">
              {buildings.map((building) => (
                <div key={building.id} className={`
                  relative overflow-hidden rounded-xl border-2 transition-all duration-300
                  ${selectedBuilding?.id === building.id 
                    ? 'border-green-400 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105' 
                    : 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:shadow-md hover:scale-102'
                  }
                `}>
                  {selectedBuilding?.id === building.id && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      ✓ SELECIONADO
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="text-center mb-3">
                      <div className="text-4xl mb-2 animate-bounce">{building.icon}</div>
                      <h3 className="font-bold text-lg text-amber-900">{building.name}</h3>
                    </div>
                    
                    <p className="text-sm text-amber-700 text-center mb-4 leading-relaxed">
                      {building.description}
                    </p>
                    
                    <FantasyButton
                      onClick={() => handleBuildingSelect(building)}
                      variant={selectedBuilding?.id === building.id ? "success" : "primary"}
                      size="md"
                      className="w-full"
                    >
                      {selectedBuilding?.id === building.id ? (
                        <>
                          <span>✓</span>
                          <span>Selecionado</span>
                        </>
                      ) : (
                        <>
                          <span>🎯</span>
                          <span>Selecionar</span>
                        </>
                      )}
                    </FantasyButton>
                  </div>
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
