import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, UserPlus } from "lucide-react";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";
import NPCCreationPanel from "./NPCCreationPanel";

interface BuildingDetailsPanelProps {
  buildingId: string;
  onClose: () => void;
}

export default function BuildingDetailsPanel({ buildingId, onClose }: BuildingDetailsPanelProps) {
  const [showNPCCreation, setShowNPCCreation] = useState(false);
  const { placedBuildings, npcs } = useBuilding();
  const isMobile = useIsMobile();
  
  const building = placedBuildings.find(b => b.id === buildingId);
  const buildingNPCs = npcs.filter(npc => npc.houseId === buildingId);

  if (!building) return null;

  return (
    <>
      <div className={`absolute z-50 ${isMobile 
        ? 'inset-x-4 top-4 bottom-20' 
        : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 max-h-[80vh]'
      }`}>
        <Card className={`bg-white bg-opacity-95 backdrop-blur-sm shadow-xl ${isMobile ? 'h-full' : ''}`}>
          <CardHeader className="pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg">Casa Detalhes</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-gray-600 hover:text-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className={`space-y-4 ${isMobile ? 'flex-1 overflow-y-auto' : ''}`}>
            <div className="flex-shrink-0">
              <p className="text-sm text-gray-600 mb-2">
                Posição: ({building.gridX}, {building.gridZ})
              </p>
              <p className="text-sm text-gray-600 mb-4">
                ID: {building.id}
              </p>
            </div>

            {/* NPCs Section */}
            <div className="flex-1">
              <div className={`flex items-center justify-between mb-3 ${isMobile ? 'flex-col gap-2' : ''}`}>
                <h3 className="font-semibold text-gray-800">NPCs na Casa</h3>
                <Button
                  onClick={() => setShowNPCCreation(true)}
                  size={isMobile ? "default" : "sm"}
                  className={`bg-green-600 hover:bg-green-700 text-white ${isMobile ? 'w-full' : ''}`}
                >
                  <UserPlus className="w-4 h-4 mr-1" />
                  Criar NPC
                </Button>
              </div>

              {buildingNPCs.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">Nenhum NPC nesta casa</p>
              ) : (
                <div className="space-y-2">
                  {buildingNPCs.map((npc) => (
                    <div key={npc.id} className="p-3 bg-gray-50 rounded border">
                      <div className={`flex items-center ${isMobile ? 'flex-col gap-3' : 'justify-between'}`}>
                        <div className={`${isMobile ? 'text-center w-full' : 'flex-1'}`}>
                          <p className="font-medium text-gray-800">
                            {npc.firstName} {npc.lastName}
                          </p>
                          <p className="text-xs text-gray-600">ID: {npc.id}</p>
                        </div>
                        <div className={`flex gap-2 ${isMobile ? 'w-full justify-center' : 'ml-2'}`}>
                          <Button
                            size={isMobile ? "default" : "sm"}
                            variant="ghost"
                            className={`${isMobile ? 'flex-1 min-w-0 px-2' : 'w-8 h-8 p-0'} text-lg hover:bg-gray-200`}
                            title="Inventário"
                            onClick={() => console.log(`Inventário do ${npc.firstName}`)}
                          >
                            🎒
                          </Button>
                          <Button
                            size={isMobile ? "default" : "sm"}
                            variant="ghost"
                            className={`${isMobile ? 'flex-1 min-w-0 px-2' : 'w-8 h-8 p-0'} text-lg hover:bg-gray-200`}
                            title="Auto"
                            onClick={() => console.log(`Auto mode para ${npc.firstName}`)}
                          >
                            🤖
                          </Button>
                          <Button
                            size={isMobile ? "default" : "sm"}
                            variant="ghost"
                            className={`${isMobile ? 'flex-1 min-w-0 px-2' : 'w-8 h-8 p-0'} text-lg hover:bg-gray-200`}
                            title="Manual"
                            onClick={() => console.log(`Manual mode para ${npc.firstName}`)}
                          >
                            🕹️
                          </Button>
                          <Button
                            size={isMobile ? "default" : "sm"}
                            variant="ghost"
                            className={`${isMobile ? 'flex-1 min-w-0 px-2' : 'w-8 h-8 p-0'} text-lg hover:bg-gray-200`}
                            title="Ver"
                            onClick={() => console.log(`Ver detalhes do ${npc.firstName}`)}
                          >
                            👁️
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPC Creation Panel */}
      {showNPCCreation && (
        <NPCCreationPanel
          houseId={buildingId}
          onClose={() => setShowNPCCreation(false)}
        />
      )}

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
    </>
  );
}