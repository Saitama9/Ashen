import React from 'react';
import { Quest } from '../../types';
import { StudyQuestArt } from '../artwork/StudyQuestArt';
import { PixelButton } from '../primitives/PixelButton';
import { RPGCard } from '../primitives/RPGCard';
import { IntelligenceIcon, StrengthIcon, VitalityIcon, FocusIcon } from '../icons/PixelIcons';
import { soundFx } from '../../utils/audio';
import { Check } from 'lucide-react';

interface QuestDetailScreenProps {
  quest: Quest;
  onBack: () => void;
  onToggleComplete: (id: string) => void;
}

export const QuestDetailScreen: React.FC<QuestDetailScreenProps> = ({
  quest,
  onBack,
  onToggleComplete,
}) => {
  const getStatIcon = (type: Quest['statType']) => {
    switch (type) {
      case 'strength':
        return <StrengthIcon size={16} color="#D94B38" />;
      case 'vitality':
        return <VitalityIcon size={16} color="#62A96B" />;
      case 'focus':
        return <FocusIcon size={16} color="#D5A441" />;
      case 'intelligence':
      default:
        return <IntelligenceIcon size={16} color="#4CA7D8" />;
    }
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="w-8 h-8 flex items-center justify-center bg-[#11171A] border border-[#59452A] hover:border-[#C99A3D] text-[#E7D8B5]"
          style={{ borderRadius: '3px' }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7L9 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <span className="font-display font-bold text-xs uppercase tracking-widest text-[#D5A441]">
          QUEST ARCHIVES
        </span>

        <button
          onClick={() => soundFx.playClick()}
          className="w-8 h-8 flex items-center justify-center bg-[#11171A] border border-[#59452A] hover:border-[#C99A3D] text-[#A99D83]"
          style={{ borderRadius: '3px' }}
        >
          •••
        </button>
      </div>

      {/* Atmospheric Pixel Artwork */}
      <StudyQuestArt />

      {/* Quest Title */}
      <div>
        <h1 className="font-display font-bold text-xl text-[#E7D8B5] tracking-wide">
          <span className="text-[#F0C75E]">{quest.title.split(' ')[0]}</span>{' '}
          {quest.title.split(' ').slice(1).join(' ')}
        </h1>
      </div>

      {/* Rewards Badges Row */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-2 bg-[#11171A] border border-[#59452A]"
          style={{ borderRadius: '3px' }}
        >
          <IntelligenceIcon size={16} color="#4CA7D8" />
          <span className="font-pixel text-xs text-[#E7D8B5]">+{quest.xpReward} XP</span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-2 bg-[#11171A] border border-[#59452A]"
          style={{ borderRadius: '3px' }}
        >
          {getStatIcon(quest.statType || (quest as any).attributeTarget || 'focus')}
          <span className="font-pixel text-xs text-[#E7D8B5]">
            +{quest.statAmount || 10}{' '}
            {(() => {
              const s = quest.statType || (quest as any).attributeTarget || 'focus';
              return s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Focus';
            })()}
          </span>
        </div>
      </div>

      {/* Description */}
      <RPGCard variant="flat" className="p-4">
        <p className="font-body text-sm text-[#A99D83] leading-relaxed">
          {quest.description || 'Read any book for at least 30 minutes. Knowledge lights the way through the shadows of the realm.'}
        </p>
      </RPGCard>

      {/* Mark as Complete Button */}
      <PixelButton
        variant={quest.completed ? 'secondary' : 'success'}
        fullWidth
        size="lg"
        onClick={() => {
          onToggleComplete(quest.id);
        }}
        icon={<Check className="w-5 h-5 text-current" />}
      >
        {quest.completed ? 'Completed' : 'Mark as Complete'}
      </PixelButton>

      {/* Ancient Quote Box */}
      <RPGCard variant="dark" ornate className="p-5 text-center mt-6">
        <p className="font-body italic text-sm text-[#A99D83] tracking-wide">
          {quest.flavorQuote || '“A mind once kindled can never be extinguished.”'}
        </p>
      </RPGCard>
    </div>
  );
};
