import React, { useState } from "react";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";
import NPCCreationPanel from "./NPCCreationPanel";
import { FantasyPanel, FantasyButton } from "./fantasy-ui";

interface BuildingDetailsPanelProps {
  buildingId: string;
  onClose: () => void;
}

export default function BuildingDetailsPanel({ buildingId, onClose }: BuildingDetailsPanelProps) {
  const [showNPCCreation, setShowNPCCreation] = useState(false);
  const { placedBuildings, npcs, removeBuilding } = useBuilding();
  const isMobile = useIsMobile();

  const building = placedBuildings.find(b => b.id === buildingId);
  const buildingNPCs = npcs.filter(npc => npc.houseId === buildingId);

  if (!building) return null;

  const handleRemoveBuilding = () => {
    if (confirm("Tem certeza que deseja remover esta estrutura?")) {
      removeBuilding(buildingId);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Panel */}
        <div className={`relative ${isMobile ? 'w-11/12 max-w-sm' : 'w-96'} max-h-[80vh] overflow-y-auto`}>
          <FantasyPanel title="🏠 Detalhes da Estrutura" onClose={onClose}>
            <div className="space-y-4">
              {/* Building Info */}
              <div className="text-center">
                <div className="text-4xl mb-2">🏠</div>
                <h3 className="text-xl font-bold text-amber-800">Casa</h3>
                <p className="text-sm text-amber-600">
                  Posição: ({building.gridX}, {building.gridZ})
                </p>
              </div>

              {/* NPCs Section */}
              <div className="bg-amber-50 p-3 rounded-lg border-2 border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">👥 Moradores ({buildingNPCs.length})</h4>

                {buildingNPCs.length === 0 ? (
                  <p className="text-amber-600 text-sm italic">
                    Nenhum morador ainda. Crie um NPC para habitar esta casa!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {buildingNPCs.map(npc => (
                      <div key={npc.id} className="bg-white p-2 rounded border border-amber-300">
                        <p className="font-medium text-amber-800">
                          {npc.firstName} {npc.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <FantasyButton
                  onClick={() => setShowNPCCreation(true)}
                  variant="success"
                  size="md"
                  className="w-full"
                >
                  <span>👤</span>
                  <span>Criar Novo Morador</span>
                </FantasyButton>

                <FantasyButton
                  onClick={handleRemoveBuilding}
                  variant="danger"
                  size="md"
                  className="w-full"
                >
                  <span>🗑️</span>
                  <span>Remover Estrutura</span>
                </FantasyButton>

                <FantasyButton
                  onClick={onClose}
                  variant="secondary"
                  size="md"
                  className="w-full"
                >
                  Fechar
                </FantasyButton>
              </div>
            </div>
          </FantasyPanel>
        </div>
      </div>

      {/* NPC Creation Panel */}
      {showNPCCreation && (
        <NPCCreationPanel
          houseId={buildingId}
          onClose={() => setShowNPCCreation(false)}
        />
      )}
    </>
  );
}