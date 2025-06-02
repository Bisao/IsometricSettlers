import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";

interface NPCCreationPanelProps {
  houseId: string;
  onClose: () => void;
}

export default function NPCCreationPanel({ houseId, onClose }: NPCCreationPanelProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { addNPC } = useBuilding();
  const isMobile = useIsMobile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      addNPC({
        id: `npc-${Date.now()}`,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        houseId,
        x: 0, // Will be positioned at the house
        z: 0,
      });
      console.log(`Created NPC: ${firstName} ${lastName} for house ${houseId}`);
      onClose();
    }
  };

  return (
    <>
      <div className={`absolute z-60 ${isMobile 
        ? 'inset-x-4 top-1/2 transform -translate-y-1/2' 
        : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80'
      }`}>
        <Card className="bg-white bg-opacity-95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 text-lg">Criar Novo NPC</CardTitle>
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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Nome
                </Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Digite o nome"
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Sobrenome
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Digite o sobrenome"
                  className="mt-1"
                  required
                />
              </div>

              <div className={`flex gap-2 pt-4 ${isMobile ? 'flex-col' : ''}`}>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Criar NPC
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-50"
        onClick={onClose}
      />
    </>
  );
}