import { Canvas } from "@react-three/fiber";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameScene from "./components/game/GameScene";
import BuildingPanel from "./components/ui/BuildingPanel";
import { useGame } from "./lib/stores/useGame";
import { useAudio } from "./lib/stores/useAudio";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  const { initializeGame } = useGame();
  const { initializeAudio } = useAudio();
  const isMobile = useIsMobile();

  useEffect(() => {
    initializeGame();
    initializeAudio();
  }, [initializeGame, initializeAudio]);

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
        <BuildingPanel />
      </div>
    </QueryClientProvider>
  );
}

export default App;