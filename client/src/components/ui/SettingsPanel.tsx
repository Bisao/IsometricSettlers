
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, X } from "lucide-react";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-40"
        onClick={onClose}
      />

      {/* Settings Panel */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 md:mx-0">
        <Card className="bg-white bg-opacity-95 backdrop-blur-sm shadow-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações
              </CardTitle>
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
          <CardContent className="space-y-6">
            {/* Instructions Section */}
            <div>
              <h3 className="font-bold mb-3 text-gray-800">Instruções do Jogo</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Clique no painel de construção para selecionar estruturas</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Mova o mouse sobre o grid para visualizar a colocação</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Clique em um tile do grid para colocar a construção</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Clique em uma construção colocada para ver detalhes</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Clique com o botão direito ou ESC para cancelar seleção</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Use os botões 🎒 🤖 🕹️ 👁️ para controlar NPCs</span>
                </div>
              </div>
            </div>

            {/* Controls Section */}
            <div>
              <h3 className="font-bold mb-3 text-gray-800">Controles</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>🎒</span>
                  <span>Inventário do NPC</span>
                </div>
                <div className="flex justify-between">
                  <span>🤖</span>
                  <span>Modo Automático</span>
                </div>
                <div className="flex justify-between">
                  <span>🕹️</span>
                  <span>Modo Manual</span>
                </div>
                <div className="flex justify-between">
                  <span>👁️</span>
                  <span>Ver Detalhes</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="absolute top-4 right-4">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          variant="outline"
          className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-700 border-gray-300 shadow-lg"
        >
          <Settings className="w-5 h-5 mr-2" />
          <span className="hidden sm:inline">Configurações</span>
        </Button>
      </div>

      <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
