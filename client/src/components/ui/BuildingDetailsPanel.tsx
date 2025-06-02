import React, { useState } from "react";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { FantasyPanel, FantasyButton } from "./fantasy-ui";
import NPCCreationPanel from "./NPCCreationPanel";
import { Canvas } from "@react-three/fiber";
import NPC from "../game/NPC";

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
              <div className="text-center bg-gradient-to-br from-gray-100 to-slate-100 p-4 rounded-xl border border-gray-200">
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
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-1">
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

                          {/* NPC Action Buttons */}
                          <div className="flex gap-1">
                            <button
                              onClick={() => console.log(`Opening inventory for ${npc.firstName} ${npc.lastName}`)}
                              className="w-8 h-8 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg flex items-center justify-center text-amber-700 transition-colors"
                              title="Inventário do NPC"
                            >
                              🎒
                            </button>
                            <button
                              onClick={() => console.log(`Setting auto mode for ${npc.firstName} ${npc.lastName}`)}
                              className="w-8 h-8 bg-green-100 hover:bg-green-200 border border-green-300 rounded-lg flex items-center justify-center text-green-700 transition-colors"
                              title="Modo Automático"
                            >
                              🤖
                            </button>
                            <button
                              onClick={() => console.log(`Setting manual mode for ${npc.firstName} ${npc.lastName}`)}
                              className="w-8 h-8 bg-purple-100 hover:bg-purple-200 border border-purple-300 rounded-lg flex items-center justify-center text-purple-700 transition-colors"
                              title="Modo Manual"
                            >
                              🕹️
                            </button>
                            <button
                              onClick={() => console.log(`Viewing details for ${npc.firstName} ${npc.lastName}`)}
                              className="w-8 h-8 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 transition-colors"
                              title="Ver Detalhes"
                            >
                              👁️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                     {/* 3D NPC rendering */}
                     <Canvas style={{ width: '100%', height: '200px' }}>
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[0, 5, 5]} />
                        {buildingNPCs.map((npc, index) => (
                            <NPC key={npc.id} position={[index * 2 - buildingNPCs.length, 0, 0]} />
                        ))}
                    </Canvas>
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