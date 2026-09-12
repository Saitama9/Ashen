import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

// ⚔ Strength Icon (Crossed / pixelated Greatswords in #D94B38)
export const StrengthIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#D94B38' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Crossed Swords Pixel Art */}
    <rect x="2" y="2" width="2" height="2" fill={color} />
    <rect x="4" y="4" width="2" height="2" fill={color} />
    <rect x="6" y="6" width="4" height="4" fill={color} />
    <rect x="10" y="4" width="2" height="2" fill={color} />
    <rect x="12" y="2" width="2" height="2" fill={color} />
    <rect x="3" y="11" width="2" height="2" fill="#D5A441" />
    <rect x="11" y="11" width="2" height="2" fill="#D5A441" />
    <rect x="2" y="13" width="2" height="2" fill="#68251B" />
    <rect x="12" y="13" width="2" height="2" fill="#68251B" />
    <rect x="1" y="9" width="3" height="1" fill="#C99A3D" />
    <rect x="12" y="9" width="3" height="1" fill="#C99A3D" />
    {/* Blade tips */}
    <rect x="1" y="1" width="2" height="1" fill="#F0C75E" />
    <rect x="13" y="1" width="2" height="1" fill="#F0C75E" />
  </svg>
);

// 📖 Intelligence Icon (Open Grimoire with glowing rune in #4CA7D8)
export const IntelligenceIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#4CA7D8' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Book Spine & Pages */}
    <rect x="2" y="3" width="5" height="9" fill={color} opacity="0.9" />
    <rect x="9" y="3" width="5" height="9" fill={color} opacity="0.9" />
    <rect x="7" y="3" width="2" height="10" fill="#2C3840" />
    {/* Page highlights */}
    <rect x="3" y="4" width="3" height="1" fill="#E7D8B5" />
    <rect x="3" y="6" width="3" height="1" fill="#A99D83" />
    <rect x="3" y="8" width="3" height="1" fill="#A99D83" />
    <rect x="10" y="4" width="3" height="1" fill="#E7D8B5" />
    <rect x="10" y="6" width="3" height="1" fill="#A99D83" />
    <rect x="10" y="8" width="3" height="1" fill="#A99D83" />
    {/* Arcane Rune Center */}
    <rect x="7" y="1" width="2" height="2" fill="#72C7F0" />
    <rect x="2" y="12" width="12" height="2" fill="#59452A" />
  </svg>
);

// ♥ Vitality Icon (Pixel Heart in #62A96B)
export const VitalityIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#62A96B' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="2" width="3" height="2" fill={color} />
    <rect x="10" y="2" width="3" height="2" fill={color} />
    <rect x="2" y="4" width="12" height="3" fill={color} />
    <rect x="3" y="7" width="10" height="2" fill={color} />
    <rect x="4" y="9" width="8" height="2" fill={color} />
    <rect x="6" y="11" width="4" height="2" fill={color} />
    <rect x="7" y="13" width="2" height="2" fill={color} />
    {/* Pixel Highlight */}
    <rect x="4" y="3" width="2" height="2" fill="#7ACB83" />
  </svg>
);

// ★ Focus Icon (Four-point Pixel Star in #D5A441)
export const FocusIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#D5A441' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="7" y="1" width="2" height="14" fill={color} />
    <rect x="1" y="7" width="14" height="2" fill={color} />
    <rect x="5" y="5" width="6" height="6" fill={color} />
    {/* Bright center */}
    <rect x="7" y="7" width="2" height="2" fill="#F0C75E" />
    <rect x="6" y="6" width="1" height="1" fill="#F0C75E" />
    <rect x="9" y="6" width="1" height="1" fill="#F0C75E" />
    <rect x="6" y="9" width="1" height="1" fill="#F0C75E" />
    <rect x="9" y="9" width="1" height="1" fill="#F0C75E" />
  </svg>
);

// 🔥 Streak / Fire Icon (Bonfire Ember in #E0522D and #F0C75E)
export const FireIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="7" y="1" width="2" height="2" fill="#F0C75E" />
    <rect x="6" y="3" width="4" height="3" fill="#E0522D" />
    <rect x="4" y="6" width="8" height="3" fill="#B84025" />
    <rect x="3" y="9" width="10" height="4" fill="#B84025" />
    <rect x="4" y="13" width="8" height="2" fill="#68251B" />
    {/* Inner hot core */}
    <rect x="7" y="6" width="2" height="4" fill="#F0C75E" />
    <rect x="6" y="8" width="4" height="3" fill="#F0C75E" />
  </svg>
);

// ✦ XP Sparkle Icon
export const XPIcon: React.FC<IconProps> = ({ className = '', size = 14, color = '#F0C75E' }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="6" y="1" width="2" height="12" fill={color} />
    <rect x="1" y="6" width="12" height="2" fill={color} />
    <rect x="5" y="5" width="4" height="4" fill="#F0C75E" />
  </svg>
);

// ◉ Gold Coin Icon
export const GoldCoinIcon: React.FC<IconProps> = ({ className = '', size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="8" height="12" fill="#D5A441" />
    <rect x="2" y="4" width="12" height="8" fill="#D5A441" />
    <rect x="5" y="4" width="6" height="8" fill="#F0C75E" />
    <rect x="7" y="6" width="2" height="4" fill="#B88A2E" />
    <rect x="3" y="3" width="2" height="2" fill="#FDF4D4" />
  </svg>
);

// ⚒ Inventory / Blacksmith Hammer Icon
export const InventoryIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#E7D8B5' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Hammer Head */}
    <rect x="8" y="2" width="6" height="4" fill="#A99D83" />
    <rect x="7" y="3" width="8" height="2" fill="#D5A441" />
    {/* Handle */}
    <rect x="7" y="6" width="2" height="2" fill="#59452A" />
    <rect x="5" y="8" width="2" height="2" fill="#59452A" />
    <rect x="3" y="10" width="2" height="2" fill="#59452A" />
    <rect x="2" y="12" width="2" height="2" fill="#C99A3D" />
  </svg>
);

// ☰ Menu Icon
export const MenuIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#E7D8B5' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="3" width="12" height="2" fill={color} />
    <rect x="2" y="7" width="12" height="2" fill={color} />
    <rect x="2" y="11" width="12" height="2" fill={color} />
  </svg>
);

// ⚙ Settings Gear Icon
export const SettingsIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#A99D83' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="7" y="1" width="2" height="14" fill={color} />
    <rect x="1" y="7" width="14" height="2" fill={color} />
    <rect x="3" y="3" width="10" height="10" fill={color} />
    <rect x="6" y="6" width="4" height="4" fill="#080B0D" />
  </svg>
);

// 🏆 Achievements Trophy Icon
export const TrophyIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#D5A441' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="3" y="2" width="10" height="5" fill={color} />
    <rect x="4" y="7" width="8" height="3" fill={color} />
    <rect x="6" y="10" width="4" height="3" fill={color} />
    <rect x="4" y="13" width="8" height="2" fill="#59452A" />
    <rect x="1" y="3" width="2" height="3" fill={color} />
    <rect x="13" y="3" width="2" height="3" fill={color} />
    <rect x="5" y="3" width="2" height="2" fill="#F0C75E" />
  </svg>
);

// Notification Bell Icon with Ember dot
export const BellIcon: React.FC<IconProps & { hasUnread?: boolean }> = ({ className = '', size = 16, color = '#A99D83', hasUnread = true }) => (
  <div className="relative inline-flex items-center justify-center">
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="7" y="1" width="2" height="2" fill={color} />
      <rect x="5" y="3" width="6" height="4" fill={color} />
      <rect x="4" y="7" width="8" height="4" fill={color} />
      <rect x="2" y="11" width="12" height="2" fill={color} />
      <rect x="7" y="13" width="2" height="2" fill="#D5A441" />
    </svg>
    {hasUnread && (
      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E0522D] border border-[#F0C75E] rounded-none animate-pulse" />
    )}
  </div>
);

// Category Icons
export const FitnessIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#D94B38' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Dumbbell */}
    <rect x="1" y="4" width="2" height="8" fill={color} />
    <rect x="3" y="5" width="2" height="6" fill={color} />
    <rect x="5" y="7" width="6" height="2" fill="#E7D8B5" />
    <rect x="11" y="5" width="2" height="6" fill={color} />
    <rect x="13" y="4" width="2" height="8" fill={color} />
  </svg>
);

export const WorkIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#4CA7D8' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Computer / Terminal screen */}
    <rect x="2" y="2" width="12" height="9" fill="#182024" stroke={color} strokeWidth="1" />
    <rect x="4" y="4" width="3" height="1" fill="#72C7F0" />
    <rect x="4" y="6" width="6" height="1" fill="#4CA7D8" />
    <rect x="4" y="8" width="4" height="1" fill="#4CA7D8" />
    <rect x="7" y="11" width="2" height="2" fill={color} />
    <rect x="5" y="13" width="6" height="2" fill="#59452A" />
  </svg>
);

export const HealthIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#62A96B' }) => (
  <VitalityIcon className={className} size={size} color={color} />
);

export const CustomDotsIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#A99D83' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="2" y="7" width="2" height="2" fill={color} />
    <rect x="7" y="7" width="2" height="2" fill={color} />
    <rect x="12" y="7" width="2" height="2" fill={color} />
  </svg>
);

// Pixel Checkbox Icon
export const PixelCheck: React.FC<{ checked?: boolean; size?: number }> = ({ checked = false, size = 18 }) => (
  <div
    style={{ width: size, height: size }}
    className={`flex items-center justify-center border transition-colors ${
      checked
        ? 'bg-[#173A28] border-[#62A96B] shadow-[0_0_8px_rgba(98,169,107,0.3)]'
        : 'bg-[#090C0E] border-[#59452A] hover:border-[#C99A3D]'
    }`}
  >
    {checked && (
      <svg width={size - 6} height={size - 6} viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="2" height="2" fill="#A8E6AF" />
        <rect x="4" y="7" width="2" height="2" fill="#A8E6AF" />
        <rect x="6" y="5" width="2" height="2" fill="#A8E6AF" />
        <rect x="8" y="3" width="2" height="2" fill="#A8E6AF" />
      </svg>
    )}
  </div>
);

// Pixel Lock Icon
export const LockIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#41474A' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="5" y="2" width="6" height="6" fill="none" stroke={color} strokeWidth="2" />
    <rect x="3" y="7" width="10" height="7" fill={color} />
    <rect x="7" y="9" width="2" height="3" fill="#080B0D" />
  </svg>
);

// Pixel Skull Boss Icon
export const SkullIcon: React.FC<IconProps> = ({ className = '', size = 16, color = '#E0522D' }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="4" y="2" width="8" height="2" fill={color} />
    <rect x="3" y="4" width="10" height="6" fill={color} />
    <rect x="5" y="6" width="2" height="2" fill="#080B0D" />
    <rect x="9" y="6" width="2" height="2" fill="#080B0D" />
    <rect x="5" y="10" width="6" height="4" fill={color} />
    <rect x="6" y="11" width="1" height="3" fill="#080B0D" />
    <rect x="8" y="11" width="1" height="3" fill="#080B0D" />
  </svg>
);

