import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameScene from "./components/game/GameScene";
import BuildingDetailsPanel from "./components/ui/BuildingDetailsPanel";
import { SettingsButton } from "./components/ui/SettingsPanel";
import { useBuilding } from "./lib/stores/useBuilding";
import "@fontsource/inter";
import "./index.css";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { SettingsPanel } from "./components/ui/SettingsPanel";

const queryClient = new QueryClient();

function App() {
  const { initializeAudio } = useAudio();
  const isMobile = useIsMobile();
  const { selectedBuildingId, setSelectedBuildingId } = useBuilding();
  const [showSettings, setShowSettings] = useState(false);
  const [showStructures, setShowStructures] = useState(false);

  useEffect(() => {
    initializeAudio();
  }, [initializeAudio]);

  useEffect(() => {
    // Prevent zoom on mobile
    if (isMobile) {
      const handleTouchStart = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      const handleTouchMove = (e: TouchEvent) => {
        if (e.touches.length > 1) {
          e.preventDefault();
        }
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
  }, [isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-full relative overflow-hidden">
        <Canvas
          camera={{ 
            position: [10, 10, 10], 
            fov: isMobile ? 60 : 45
          }}
          shadows
          className="w-full h-full touch-none"
          gl={{ 
            antialias: !isMobile, // Disable antialiasing on mobile for better performance
            powerPreference: isMobile ? "low-power" : "high-performance"
          }}
        >
          <GameScene />
        </Canvas>
        
        {/* Building Details Panel */}
        {selectedBuildingId && (
          <BuildingDetailsPanel 
            buildingId={selectedBuildingId}
            onClose={() => setSelectedBuildingId(null)}
          />
        )}

        {/* Top Right Buttons */}
        <div className="absolute top-4 right-4 z-50 flex gap-2">
          {/* Structures Panel Button */}
          <Button
            onClick={() => setShowStructures(true)}
            size={isMobile ? "sm" : "default"}
            variant="outline"
            className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg hover:bg-gray-100"
          >
            <span className="text-lg">🏗️</span>
            {!isMobile && <span className="ml-2">Estruturas</span>}
          </Button>

          {/* Settings Button */}
          <Button
            onClick={() => setShowSettings(true)}
            size={isMobile ? "sm" : "default"}
            variant="outline"
            className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
            {!isMobile && <span className="ml-2">Configurações</span>}
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {/* Structures Panel */}
        {showStructures && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={() => setShowStructures(false)} />
            <div className={`relative bg-white rounded-lg shadow-xl ${isMobile ? 'w-11/12 max-w-sm' : 'w-96'} max-h-[80vh] overflow-y-auto`}>
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Painel de Estruturas</h2>
                  <Button
                    onClick={() => setShowStructures(false)}
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm">
                  Aqui você pode gerenciar todas as estruturas do seu mundo virtual.
                </p>
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-gray-50 rounded border">
                    <h3 className="font-medium">🏠 Casas</h3>
                    <p className="text-sm text-gray-600">Construções residenciais para NPCs</p>
                  </div>
                  {/* Removendo as outras construções conforme solicitado */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;