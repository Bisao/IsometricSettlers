import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameScene from "./components/game/GameScene";
import BuildingDetailsPanel from "./components/ui/BuildingDetailsPanel";
import BuildingPanel from "./components/ui/BuildingPanel";
import { SettingsButton } from "./components/ui/SettingsPanel";
import { useBuilding } from "./lib/stores/useBuilding";
import "@fontsource/inter";
import "./index.css";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useEffect, useState } from "react";
import { FantasyButton } from "./components/ui/fantasy-ui";
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
        <div className="absolute top-4 right-4 z-50 flex gap-3">
          {/* Structures Panel Button */}
          <FantasyButton
            onClick={() => setShowStructures(true)}
            size={isMobile ? "sm" : "md"}
            variant="primary"
          >
            <span className="text-lg">🏗️</span>
            {!isMobile && <span>Estruturas</span>}
          </FantasyButton>

          {/* Settings Button */}
          <FantasyButton
            onClick={() => setShowSettings(true)}
            size={isMobile ? "sm" : "md"}
            variant="secondary"
          >
            <Settings className="w-4 h-4" />
            {!isMobile && <span>Configurações</span>}
          </FantasyButton>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {/* Building Panel */}
        <BuildingPanel 
          isOpen={showStructures}
          onClose={() => setShowStructures(false)}
        />
      </div>
    </QueryClientProvider>
  );
}

export default App;