import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Shuffle } from "lucide-react";
import { useBuilding } from "../../lib/stores/useBuilding";

interface NPCCreationPanelProps {
  houseId: string;
  onClose: () => void;
}

const firstNames = [
  "João", "Maria", "Pedro", "Ana", "Carlos", "Lucia", "Fernando", "Clara",
  "Roberto", "Isabel", "Ricardo", "Helena", "Miguel", "Sofia", "Paulo",
  "Carmen", "Antonio", "Beatriz", "Manuel", "Julia", "Francisco", "Teresa"
];

const lastNames = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves",
  "Pereira", "Lima", "Gomes", "Ribeiro", "Carvalho", "Almeida", "Lopes",
  "Soares", "Fernandes", "Vieira", "Barbosa", "Rocha", "Dias", "Nunes", "Mendes"
];

export default function NPCCreationPanel({ houseId, onClose }: NPCCreationPanelProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { createNPC } = useBuilding();

  const generateRandomName = () => {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    setFirstName(randomFirstName);
    setLastName(randomLastName);
  };

  const handleCreateNPC = () => {
    if (firstName.trim() && lastName.trim()) {
      createNPC({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        houseId
      });
      console.log(`Created NPC: ${firstName} ${lastName} for house ${houseId}`);
      onClose();
    }
  };

  return (
    <>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 z-60">
        <Card className="bg-white bg-opacity-95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800">Criar Novo NPC</CardTitle>
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
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700">Nome</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Digite o nome..."
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700">Sobrenome</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Digite o sobrenome..."
                className="bg-white"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={generateRandomName}
                variant="outline"
                className="flex-1"
              >
                <Shuffle className="w-4 h-4 mr-2" />
                Nome Aleatório
              </Button>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateNPC}
                disabled={!firstName.trim() || !lastName.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Criar NPC
              </Button>
            </div>
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