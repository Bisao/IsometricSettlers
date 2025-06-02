
import React, { useState } from "react";
import { X, Package, Sword, Shield, ShirtIcon, HardHat } from "lucide-react";
import { useIsMobile } from "../../hooks/use-is-mobile";

interface InventoryItem {
  id: string;
  name: string;
  type: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  icon: string;
  quantity: number;
  isEquipped: boolean;
  slot?: string;
  value: number;
}

interface NPCInventoryPanelProps {
  npcId: string;
  npcName: string;
  onClose: () => void;
}

const EQUIPMENT_SLOTS = [
  { id: "head", name: "Head Slot", icon: "🎩" },
  { id: "chest", name: "Chest Slot", icon: "👕" },
  { id: "legs", name: "Leg Slot", icon: "👖" },
  { id: "feet", name: "Foot Slot", icon: "👟" },
  { id: "main_hand", name: "Main Hand", icon: "⚔️" },
  { id: "off_hand", name: "Off-Hand", icon: "🛡️" },
  { id: "cape", name: "Cape", icon: "🧥" },
  { id: "bag", name: "Bag", icon: "🎒" },
  { id: "potion", name: "Potion", icon: "🧪" },
  { id: "food", name: "Food", icon: "🍖" },
  { id: "mount", name: "Mount", icon: "🐎" },
];

const RARITY_COLORS = {
  common: "bg-gray-100 border-gray-300 text-gray-700",
  rare: "bg-blue-100 border-blue-300 text-blue-700",
  epic: "bg-purple-100 border-purple-300 text-purple-700",
  legendary: "bg-orange-100 border-orange-300 text-orange-700",
};

export default function NPCInventoryPanel({ npcId, npcName, onClose }: NPCInventoryPanelProps) {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState<"inventory" | "details">("inventory");
  
  // Mock data - in a real app, this would come from your store/API
  const [npcStats] = useState({
    gold: 1250,
    silver: 75,
    level: 12,
    experience: 2847,
    maxExperience: 3000,
  });

  const [inventoryItems] = useState<InventoryItem[]>([
    {
      id: "1",
      name: "Iron Sword",
      type: "weapon",
      rarity: "common",
      icon: "⚔️",
      quantity: 1,
      isEquipped: true,
      slot: "main_hand",
      value: 100,
    },
    {
      id: "2",
      name: "Leather Armor",
      type: "armor",
      rarity: "common",
      icon: "👕",
      quantity: 1,
      isEquipped: true,
      slot: "chest",
      value: 50,
    },
    {
      id: "3",
      name: "Health Potion",
      type: "consumable",
      rarity: "common",
      icon: "🧪",
      quantity: 5,
      isEquipped: false,
      value: 25,
    },
    {
      id: "4",
      name: "Mystic Cape",
      type: "armor",
      rarity: "epic",
      icon: "🧥",
      quantity: 1,
      isEquipped: false,
      value: 500,
    },
  ]);

  const equippedItems = inventoryItems.filter(item => item.isEquipped);
  const unequippedItems = inventoryItems.filter(item => !item.isEquipped);

  const getEquippedItemForSlot = (slotId: string) => {
    return equippedItems.find(item => item.slot === slotId);
  };

  const renderEquipmentSlot = (slot: typeof EQUIPMENT_SLOTS[0]) => {
    const equippedItem = getEquippedItemForSlot(slot.id);
    
    return (
      <div
        key={slot.id}
        className="w-16 h-16 bg-amber-50 border-2 border-amber-200 rounded-lg flex items-center justify-center relative hover:bg-amber-100 transition-colors cursor-pointer"
        title={slot.name}
      >
        {equippedItem ? (
          <div className={`w-full h-full rounded-lg flex items-center justify-center text-2xl ${RARITY_COLORS[equippedItem.rarity]}`}>
            {equippedItem.icon}
          </div>
        ) : (
          <span className="text-2xl opacity-50">{slot.icon}</span>
        )}
      </div>
    );
  };

  const renderInventorySlot = (item?: InventoryItem, index?: number) => {
    return (
      <div
        key={item?.id || `empty-${index}`}
        className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center relative cursor-pointer transition-colors ${
          item
            ? `${RARITY_COLORS[item.rarity]} hover:opacity-80`
            : "bg-amber-50 border-amber-200 hover:bg-amber-100"
        }`}
        title={item ? `${item.name} (${item.quantity})` : "Empty slot"}
      >
        {item ? (
          <>
            <span className="text-2xl">{item.icon}</span>
            {item.quantity > 1 && (
              <span className="absolute bottom-0 right-0 bg-yellow-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            )}
          </>
        ) : null}
      </div>
    );
  };

  // Create empty slots to fill inventory grid (8x6 = 48 slots)
  const inventorySlots = Array.from({ length: 48 }, (_, index) => {
    const item = unequippedItems[index];
    return renderInventorySlot(item, index);
  });

  return (
    <div className="fixed inset-0 z-[80] flex">
      {/* Panel - Left side */}
      <div className={`${isMobile ? 'w-full' : 'w-1/3 min-w-[400px]'} h-full overflow-hidden`}>
        <div className="bg-gradient-to-br from-amber-50 to-orange-100 h-full border-r-4 border-amber-400 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-400 p-4 border-b-4 border-amber-500 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-300">
                  <Package className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-amber-900">Inventory</h2>
                  <p className="text-amber-800 text-sm">{npcName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setSelectedTab("inventory")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTab === "inventory"
                    ? "bg-amber-400 text-amber-900"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                🎒 Inventory
              </button>
              <button
                onClick={() => setSelectedTab("details")}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  selectedTab === "details"
                    ? "bg-amber-400 text-amber-900"
                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                }`}
              >
                📋 Details
              </button>
            </div>

            {selectedTab === "inventory" ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Equipment Panel */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-4">Equipment</h3>
                  
                  {/* Currency */}
                  <div className="mb-4 p-3 bg-amber-100 rounded-lg border border-amber-300">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-600">🪙</span>
                        <span className="font-bold text-amber-900">{npcStats.gold}</span>
                        <span className="text-amber-700 text-sm">Gold</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-gray-400">🪙</span>
                        <span className="font-bold text-amber-900">{npcStats.silver}</span>
                        <span className="text-amber-700 text-sm">Silver</span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment Slots Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {EQUIPMENT_SLOTS.slice(0, 9).map(renderEquipmentSlot)}
                  </div>

                  {/* Mount slot */}
                  <div className="mt-4 space-y-2">
                    {EQUIPMENT_SLOTS.slice(9).map(renderEquipmentSlot)}
                  </div>
                </div>

                {/* Inventory Grid */}
                <div className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-amber-900">Inventory Slots (48)</h3>
                    <div className="text-sm text-amber-700">
                      Used: {unequippedItems.length}/48
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1 p-4 bg-amber-100 rounded-lg border border-amber-300">
                    {inventorySlots}
                  </div>

                  {/* Market Value */}
                  <div className="mt-4 text-center">
                    <span className="text-sm text-amber-700">Est. Market Value: </span>
                    <span className="font-bold text-amber-900">
                      {inventoryItems.reduce((total, item) => total + (item.value * item.quantity), 0)} 🪙
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* Details Tab */
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Character Stats */}
                  <div className="p-4 bg-amber-100 rounded-lg border border-amber-300">
                    <h3 className="text-lg font-bold text-amber-900 mb-3">Character Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-amber-700">Level:</span>
                        <span className="font-bold text-amber-900">{npcStats.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-700">Experience:</span>
                        <span className="font-bold text-amber-900">{npcStats.experience}/{npcStats.maxExperience}</span>
                      </div>
                      <div className="w-full bg-amber-200 rounded-full h-2">
                        <div 
                          className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(npcStats.experience / npcStats.maxExperience) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Equipped Items Summary */}
                  <div className="p-4 bg-amber-100 rounded-lg border border-amber-300">
                    <h3 className="text-lg font-bold text-amber-900 mb-3">Equipped Items</h3>
                    <div className="space-y-2">
                      {equippedItems.length > 0 ? (
                        equippedItems.map(item => (
                          <div key={item.id} className="flex items-center gap-2">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-amber-900">{item.name}</span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              item.rarity === 'legendary' ? 'bg-orange-200 text-orange-700' :
                              item.rarity === 'epic' ? 'bg-purple-200 text-purple-700' :
                              item.rarity === 'rare' ? 'bg-blue-200 text-blue-700' :
                              'bg-gray-200 text-gray-700'
                            }`}>
                              {item.rarity}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-amber-700 text-sm">No items equipped</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Backdrop - Right side for closing */}
      <div 
        className="flex-1 bg-black/50 backdrop-blur-sm cursor-pointer"
        onClick={onClose}
      />
    </div>
  );
}
