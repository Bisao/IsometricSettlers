import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";

const buildings = [
  { name: "House", color: "#8B4513", emoji: "🏠" },
  { name: "Shop", color: "#FF6B6B", emoji: "🏪" },
  { name: "Farm", color: "#4ECDC4", emoji: "🚜" },
  { name: "Factory", color: "#45B7D1", emoji: "🏭" },
];

export default function BuildingPanel() {
  const { selectedBuilding, setSelectedBuilding } = useBuilding();
  const isMobile = useIsMobile();

  return (
    <div className={`absolute z-40 ${isMobile 
      ? 'bottom-4 left-4 right-4' 
      : 'top-4 left-4'
    }`}>
      <Card className="bg-white bg-opacity-90 backdrop-blur-sm shadow-lg">
        <CardHeader className={`${isMobile ? 'pb-2 pt-3' : 'pb-3'}`}>
          <CardTitle className={`text-gray-800 ${isMobile ? 'text-base text-center' : 'text-lg'}`}>
            Construções
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? 'space-y-1' : 'space-y-2'}`}>
          <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'space-y-2'}`}>
            {buildings.map((building) => (
              <Button
                key={building.name}
                onClick={() => setSelectedBuilding(selectedBuilding === building.name ? null : building.name)}
                variant={selectedBuilding === building.name ? "default" : "outline"}
                className={`${isMobile ? 'w-full h-12 text-xs' : 'w-full'} justify-start text-left ${
                  selectedBuilding === building.name 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <span className={`${isMobile ? 'mr-1 text-base' : 'mr-2 text-lg'}`}>
                  {building.emoji}
                </span>
                <span className={isMobile ? 'text-xs' : ''}>{building.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}