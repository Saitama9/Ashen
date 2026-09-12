import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { RPGCard } from '../primitives/RPGCard';
import { GoldBadge } from '../primitives/GoldBadge';
import { PixelButton } from '../primitives/PixelButton';
import { LockIcon } from '../icons/PixelIcons';
import { soundFx } from '../../utils/audio';
import { X } from 'lucide-react';

interface InventoryScreenProps {
  gold: number;
  inventory: InventoryItem[];
  onBuyOrEquip: (item: InventoryItem) => void;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  gold,
  inventory,
  onBuyOrEquip,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'themes' | 'badges' | 'items'>('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const tabs: { id: 'all' | 'themes' | 'badges' | 'items'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'themes', label: 'Themes' },
    { id: 'badges', label: 'Badges' },
    { id: 'items', label: 'Items' },
  ];

  const filteredItems = inventory.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'themes') return item.type === 'armor';
    if (activeTab === 'badges') return item.type === 'badge';
    if (activeTab === 'items') return item.type === 'tome' || item.type === 'relic' || item.type === 'weapon';
    return true;
  });

  const renderItemVisual = (item: InventoryItem) => {
    switch (item.iconType) {
      case 'cloak':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="10,6 22,6 26,26 6,26" fill="#182024" stroke="#59452A" strokeWidth="1" />
            <polygon points="12,6 20,6 22,22 10,22" fill="#243037" />
            <rect x="14" y="6" width="4" height="6" fill="#D5A441" />
          </svg>
        );
      case 'armor':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <polygon points="8,8 24,8 26,26 6,26" fill="#3D4B53" stroke="#D5A441" strokeWidth="1" />
            <rect x="12" y="10" width="8" height="12" fill="#243037" />
            <line x1="16" y1="10" x2="16" y2="24" stroke="#D5A441" strokeWidth="1.5" />
          </svg>
        );
      case 'tome':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="6" width="16" height="20" fill="#68251B" stroke="#D5A441" strokeWidth="1" />
            <rect x="8" y="6" width="4" height="20" fill="#D5A441" />
            <circle cx="17" cy="16" r="3" fill="#D5A441" />
          </svg>
        );
      case 'lantern':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="11" y="8" width="10" height="16" fill="#182024" stroke="#D5A441" strokeWidth="1" />
            <circle cx="16" cy="16" r="4" fill="#F0C75E" />
            <rect x="15" y="4" width="2" height="4" fill="#D5A441" />
          </svg>
        );
      case 'sword':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <line x1="6" y1="26" x2="26" y2="6" stroke="#E7D8B5" strokeWidth="3" />
            <line x1="18" y1="20" x2="22" y2="24" stroke="#D5A441" strokeWidth="3" />
            <circle cx="25" cy="27" r="2" fill="#D5A441" />
          </svg>
        );
      case 'ring':
        return (
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="8" stroke="#D5A441" strokeWidth="3" fill="none" />
            <rect x="14" y="6" width="4" height="4" fill="#4CA7D8" />
          </svg>
        );
      case 'locked':
      default:
        return <LockIcon size={24} color="#6F695C" />;
    }
  };

  return (
    <div className="min-h-screen pb-40 sm:pb-48 md:pb-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-4 sm:p-6 space-y-5 overflow-x-hidden">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="font-display font-bold text-xl text-[#E7D8B5] tracking-wide">
          Inventory
        </h1>
        <GoldBadge amount={gold} />
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-[#59452A] pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClick();
                setActiveTab(tab.id);
              }}
              className={`px-3 py-1.5 font-display text-xs tracking-wider transition-colors relative ${
                isActive
                  ? 'text-[#F0C75E] font-bold border-b-2 border-[#F0C75E]'
                  : 'text-[#A99D83] hover:text-[#E7D8B5]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isLocked = item.iconType === 'locked';
          return (
            <RPGCard
              key={item.id}
              variant={item.equipped ? 'highlight' : 'default'}
              onClick={() => {
                soundFx.playClick();
                setSelectedItem(item);
              }}
              className={`p-3 flex flex-col items-center justify-between min-h-[140px] text-center relative ${
                isLocked ? 'opacity-50' : 'hover:border-[#C99A3D]'
              }`}
            >
              {/* Top Tag: Equipped / Price */}
              <div className="w-full flex justify-between items-center text-[10px]">
                {item.equipped ? (
                  <span className="font-pixel text-[8px] text-[#62A96B] bg-[#173A28] px-1.5 py-0.5 border border-[#62A96B]">
                    EQUIPPED
                  </span>
                ) : item.owned ? (
                  <span className="font-pixel text-[8px] text-[#A99D83]">
                    OWNED
                  </span>
                ) : !isLocked ? (
                  <span className="font-pixel text-[9px] text-[#F0C75E] ml-auto">
                    {item.price} G
                  </span>
                ) : (
                  <span />
                )}
              </div>

              {/* Item Graphic */}
              <div className="my-2">{renderItemVisual(item)}</div>

              {/* Title & Stat Bonus */}
              <div>
                <h3 className="font-display font-semibold text-xs text-[#E7D8B5] truncate max-w-[120px]">
                  {item.name}
                </h3>
                {item.statBonus && item.statBonus.stat && (
                  <p className="font-body text-[10px] text-[#A99D83] mt-0.5">
                    +{item.statBonus.amount}{' '}
                    {item.statBonus.stat.charAt(0).toUpperCase() + item.statBonus.stat.slice(1)}
                  </p>
                )}
                {isLocked && (
                  <p className="font-body italic text-[10px] text-[#6F695C] mt-0.5">
                    Sealed
                  </p>
                )}
              </div>
            </RPGCard>
          );
        })}
      </div>

      {/* Item Detail / Action Drawer or Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <RPGCard
            variant="highlight"
            ornate
            className="w-full max-w-sm p-4 space-y-4 animate-in fade-in zoom-in-95 duration-150 bg-[#11171A] my-auto"
          >
            <div className="flex items-start justify-between border-b border-[#59452A] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#090C0E] border border-[#59452A] flex items-center justify-center">
                  {renderItemVisual(selectedItem)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#E7D8B5]">
                    {selectedItem.name}
                  </h3>
                  {selectedItem.statBonus && (
                    <p className="font-pixel text-[10px] text-[#F0C75E]">
                      +{selectedItem.statBonus.amount}{' '}
                      {selectedItem.statBonus.stat.toUpperCase()}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="text-[#A99D83] hover:text-[#E7D8B5] p-1 rounded-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body text-xs text-[#A99D83] leading-relaxed">
              {selectedItem.description}
            </p>

            {/* Action Button */}
            <div>
              {selectedItem.iconType === 'locked' ? (
                <PixelButton disabled fullWidth size="md">
                  Sealed Relic
                </PixelButton>
              ) : selectedItem.owned ? (
                <PixelButton
                  variant={selectedItem.equipped ? 'secondary' : 'primary'}
                  fullWidth
                  size="md"
                  onClick={() => {
                    onBuyOrEquip(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  {selectedItem.equipped ? 'Unequip Item' : 'Equip Item'}
                </PixelButton>
              ) : (
                <PixelButton
                  variant="primary"
                  fullWidth
                  size="md"
                  disabled={gold < selectedItem.price}
                  onClick={() => {
                    onBuyOrEquip(selectedItem);
                    setSelectedItem(null);
                  }}
                >
                  {gold >= selectedItem.price
                    ? `Purchase for ${selectedItem.price} Gold`
                    : `Need ${selectedItem.price - gold} more Gold`}
                </PixelButton>
              )}
            </div>
          </RPGCard>
        </div>
      )}
    </div>
  );
};
