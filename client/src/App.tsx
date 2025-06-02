import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import GameScene from "./components/game/GameScene";
import BuildingPanel from "./components/ui/BuildingPanel";
import BuildingDetailsPanel from "./components/ui/BuildingDetailsPanel";
import { useBuilding } from "./lib/stores/useBuilding";
import "@fontsource/inter";
import "./index.css";

const queryClient = new QueryClient();

function App() {
  const { selectedBuildingId, setSelectedBuildingId } = useBuilding();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full h-screen relative overflow-hidden bg-gradient-to-b from-sky-200 to-sky-400">
        {/* 3D Canvas */}
        <Canvas
          shadows
          camera={{
            position: [10, 10, 10],
            fov: 45,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            powerPreference: "high-performance"
          }}
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <GameScene />
          </Suspense>
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

        {/* Instructions */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-sm">
          <h3 className="font-bold mb-2">Instructions</h3>
          <ul className="text-sm space-y-1">
            <li>• Click the Building Panel to select structures</li>
            <li>• Move mouse over grid to preview placement</li>
            <li>• Click on a grid tile to place building</li>
            <li>• Click on a placed building to view details</li>
            <li>• Right-click or ESC to cancel selection</li>
          </ul>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
