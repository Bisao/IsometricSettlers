
import { useBuilding } from "../../lib/stores/useBuilding";
import { useEffect } from "react";

interface CombatHUDProps {
  npcId: string;
  isVisible: boolean;
}

interface SkillSlot {
  id: string;
  name: string;
  icon: string;
  cooldown: number;
  maxCooldown: number;
  manaCost: number;
}

export default function CombatHUD({ npcId, isVisible }: CombatHUDProps) {
  const { npcs } = useBuilding();
  
  if (!isVisible) return null;
  
  const npc = npcs.find(n => n.id === npcId);
  if (!npc) return null;

  // Mock combat stats - in a real app, these would come from the NPC data
  const health = 85;
  const maxHealth = 100;
  const mana = 60;
  const maxMana = 100;
  
  const healthPercentage = (health / maxHealth) * 100;
  const manaPercentage = (mana / maxMana) * 100;

  const skills: SkillSlot[] = [
    { id: "1", name: "Sword Strike", icon: "⚔️", cooldown: 0, maxCooldown: 3, manaCost: 10 },
    { id: "2", name: "Shield Block", icon: "🛡️", cooldown: 1.5, maxCooldown: 5, manaCost: 15 },
    { id: "3", name: "Heal", icon: "❤️", cooldown: 0, maxCooldown: 10, manaCost: 25 },
    { id: "4", name: "Power Strike", icon: "💥", cooldown: 2, maxCooldown: 8, manaCost: 30 },
    { id: "5", name: "Dodge Roll", icon: "🌪️", cooldown: 0, maxCooldown: 4, manaCost: 20 },
  ];

  const handleSkillClick = (skill: SkillSlot) => {
    if (skill.cooldown > 0 || mana < skill.manaCost) return;
    
    console.log(`Using skill: ${skill.name}`);
    // Here you would implement the skill logic
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isVisible) return;
      
      const keyNum = parseInt(event.key);
      if (keyNum >= 1 && keyNum <= 5) {
        const skill = skills[keyNum - 1];
        if (skill) {
          handleSkillClick(skill);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isVisible, skills]);

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mb-4 flex items-center gap-4 bg-black/80 rounded-lg p-4 border border-yellow-600/50">
      {/* Health Circle */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-red-500 transition-all duration-300"
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((healthPercentage / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((healthPercentage / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xs font-bold">{health}</div>
            <div className="text-gray-300 text-xs">HP</div>
          </div>
        </div>
      </div>

      {/* Skills Bar */}
      <div className="flex gap-2">
        {skills.map((skill, index) => {
          const isOnCooldown = skill.cooldown > 0;
          const notEnoughMana = mana < skill.manaCost;
          const isDisabled = isOnCooldown || notEnoughMana;
          
          return (
            <div
              key={skill.id}
              onClick={() => handleSkillClick(skill)}
              className={`relative w-12 h-12 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                isDisabled 
                  ? 'border-gray-600 bg-gray-800/50' 
                  : 'border-yellow-600 bg-yellow-900/30 hover:bg-yellow-800/50'
              }`}
              title={`${skill.name} (${skill.manaCost} mana)`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xl">
                {skill.icon}
              </div>
              
              {/* Cooldown overlay */}
              {isOnCooldown && (
                <div 
                  className="absolute inset-0 bg-black/70 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white text-xs font-bold">
                    {skill.cooldown.toFixed(1)}
                  </span>
                </div>
              )}
              
              {/* Hotkey number */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-800 border border-gray-600 rounded text-xs text-white flex items-center justify-center">
                {index + 1}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mana Circle */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
        <div 
          className="absolute inset-0 rounded-full border-4 border-blue-500 transition-all duration-300"
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((manaPercentage / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((manaPercentage / 100) * 2 * Math.PI - Math.PI / 2)}%, 50% 50%)`
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-white text-xs font-bold">{mana}</div>
            <div className="text-gray-300 text-xs">MP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
