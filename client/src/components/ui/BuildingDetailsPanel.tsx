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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black/70 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Panel */}
        <div className={`relative ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'} max-h-[90vh] overflow-y-auto`}>
          <FantasyPanel title="🏠 Detalhes da Estrutura" onClose={onClose}>
            <div className="space-y-4">
              {/* Building Info */}
              <div className="text-center bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-xl border border-amber-200">
                <div className="text-5xl mb-3 animate-pulse">🏠</div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">Casa Residencial</h3>
                <div className="inline-flex items-center gap-2 bg-amber-200 px-3 py-1 rounded-full">
                  <span className="text-xs font-medium text-amber-800">📍</span>
                  <span className="text-sm font-semibold text-amber-800">
                    Posição: ({building.gridX}, {building.gridZ})
                  </span>
                </div>
              </div>

              {/* NPCs Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border-2 border-blue-200 shadow-inner">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-blue-900 text-lg">👥 Moradores</h4>
                  <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
                    {buildingNPCs.length}
                  </span>
                </div>

                {buildingNPCs.length === 0 ? (
                  <div className="text-center p-6 bg-blue-100 rounded-lg border border-blue-200">
                    <div className="text-3xl mb-2">🏚️</div>
                    <p className="text-blue-700 text-sm font-medium">
                      Casa vazia! Crie um morador para dar vida a este lar.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {buildingNPCs.map(npc => (
                      <div key={npc.id} className="bg-white p-3 rounded-lg border border-blue-300 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {npc.firstName[0]}{npc.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900">
                              {npc.firstName} {npc.lastName}
                            </p>
                            <p className="text-xs text-blue-600">Morador</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <FantasyButton
                  onClick={() => {
                    console.log('Opening NPC Creation Panel for house:', buildingId);
                    setShowNPCCreation(true);
                  }}
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