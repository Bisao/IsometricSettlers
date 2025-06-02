import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameScene from "./components/game/GameScene";
import BuildingPanel from "./components/ui/BuildingPanel";
import BuildingDetailsPanel from "./components/ui/BuildingDetailsPanel";
import { SettingsButton } from "./components/ui/SettingsPanel";
import { useBuilding } from "./lib/stores/useBuilding";
import "@fontsource/inter";
import "./index.css";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

function App() {
  const { initializeAudio } = useAudio();
  const isMobile = useIsMobile();
  const { selectedBuildingId, setSelectedBuildingId } = useBuilding();

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
        {/* Building Panel UI */}
        <BuildingPanel />

        {/* Building Details Panel */}
        {selectedBuildingId && (
          <BuildingDetailsPanel 
            buildingId={selectedBuildingId}
            onClose={() => setSelectedBuildingId(null)}
          />
        )}

        {/* Settings Button */}
        <SettingsButton />
      </div>
    </QueryClientProvider>
  );
}

export default App;