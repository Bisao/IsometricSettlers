
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`relative ${isMobile ? 'w-11/12 max-w-sm' : 'w-96'}`}>
        <FantasyPanel title="👤 Criar Novo Morador" onClose={onClose}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-4">
              <p className="text-amber-700 text-sm">
                Crie um novo personagem para habitar esta casa
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-amber-800 font-semibold mb-1 text-sm">
                  Nome:
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none bg-amber-50"
                  placeholder="Digite o primeiro nome"
                  required
                />
              </div>

              <div>
                <label className="block text-amber-800 font-semibold mb-1 text-sm">
                  Sobrenome:
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-lg focus:border-amber-500 focus:outline-none bg-amber-50"
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
