import React, { useState } from "react";
import { useBuilding } from "../../lib/stores/useBuilding";
import { useIsMobile } from "../../hooks/use-is-mobile";
import { FantasyPanel, FantasyButton } from "./fantasy-ui";

interface NPCCreationPanelProps {
  houseId: string;
  onClose: () => void;
}

export default function NPCCreationPanel({ houseId, onClose }: NPCCreationPanelProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { createNPC } = useBuilding();
  const isMobile = useIsMobile();

  console.log('NPCCreationPanel rendered for house:', houseId);

  const firstNames = [
    "Ana", "João", "Maria", "Pedro", "Carla", "Bruno", "Sofia", "Lucas", 
    "Beatriz", "Gabriel", "Camila", "Rafael", "Juliana", "Diego", "Larissa",
    "Felipe", "Mariana", "Thiago", "Isabela", "Gustavo", "Amanda", "Rodrigo"
  ];

  const lastNames = [
    "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues",
    "Almeida", "Nascimento", "Lima", "Araújo", "Fernandes", "Carvalho", "Gomes",
    "Martins", "Rocha", "Ribeiro", "Alves", "Monteiro", "Mendes", "Cardoso"
  ];

  const generateRandomNames = () => {
    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    setFirstName(randomFirstName);
    setLastName(randomLastName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      createNPC({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        houseId,
      });
      console.log(`Created NPC: ${firstName} ${lastName} for house ${houseId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Panel */}
      <div className={`relative ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-md'}`}>
        <FantasyPanel title="👤 Criar Novo Morador" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-6 bg-gradient-to-r from-gray-100 to-slate-100 p-4 rounded-xl border border-gray-200">
              <div className="text-3xl mb-2">👤✨</div>
              <p className="text-gray-700 font-semibold">
                Crie um novo personagem para habitar esta casa
              </p>
            </div>

            <div className="space-y-5">
              {/* Random Name Generator Button */}
              <div className="text-center">
                <FantasyButton
                  type="button"
                  onClick={generateRandomNames}
                  variant="secondary"
                  size="sm"
                  className="mb-4"
                >
                  <span>🎲</span>
                  <span>Gerar Nomes Aleatórios</span>
                </FantasyButton>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                  <span>👤</span>
                  <span>Nome:</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl 
                           focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-200
                           bg-gradient-to-r from-purple-50 to-pink-50
                           transition-all duration-200 hover:shadow-md"
                  placeholder="Digite o primeiro nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-gray-900 font-bold text-sm">
                  <span>👨‍👩‍👧‍👦</span>
                  <span>Sobrenome:</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl 
                           focus:border-gray-500 focus:outline-none focus:ring-4 focus:ring-gray-200
                           bg-gradient-to-r from-gray-50 to-slate-50
                           transition-all duration-200 hover:shadow-md"
                  placeholder="Digite o sobrenome"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <FantasyButton
                type="submit"
                variant="success"
                size="md"
                className="flex-1"
                disabled={!firstName.trim() || !lastName.trim()}
              >
                <span>✨</span>
                <span>Criar Morador</span>
              </FantasyButton>

              <FantasyButton
                type="button"
                onClick={onClose}
                variant="secondary"
                size="md"
                className="flex-1"
              >
                Cancelar
              </FantasyButton>
            </div>
          </form>
        </FantasyPanel>
      </div>
    </div>
  );
}