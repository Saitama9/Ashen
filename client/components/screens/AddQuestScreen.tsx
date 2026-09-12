import React, { useState } from 'react';
import { Quest, QuestCategory, StatType } from '../../types';
import { PixelButton } from '../primitives/PixelButton';
import { RPGCard } from '../primitives/RPGCard';
import {
  FitnessIcon,
  WorkIcon,
  HealthIcon,
  IntelligenceIcon,
  CustomDotsIcon,
} from '../icons/PixelIcons';
import { soundFx } from '../../utils/audio';

interface AddQuestScreenProps {
  onBack: () => void;
  onAddQuest: (quest: Omit<Quest, 'id' | 'completed'>) => void;
}

export const AddQuestScreen: React.FC<AddQuestScreenProps> = ({ onBack, onAddQuest }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<QuestCategory>('study');
  const [xpReward, setXpReward] = useState<number>(50);
  const [statType, setStatType] = useState<StatType>('intelligence');
  const [statAmount, setStatAmount] = useState<number>(10);
  const [repeat, setRepeat] = useState<'daily' | 'weekly' | 'none'>('daily');
  const [repeatEnabled, setRepeatEnabled] = useState(true);

  const categories: { id: QuestCategory; label: string; icon: React.ReactNode; defaultStat: StatType }[] = [
    { id: 'study', label: 'Study', icon: <IntelligenceIcon size={16} color="#4CA7D8" />, defaultStat: 'intelligence' },
    { id: 'fitness', label: 'Fitness', icon: <FitnessIcon size={16} color="#D94B38" />, defaultStat: 'strength' },
    { id: 'work', label: 'Work', icon: <WorkIcon size={16} color="#4CA7D8" />, defaultStat: 'intelligence' },
    { id: 'health', label: 'Health', icon: <HealthIcon size={16} color="#62A96B" />, defaultStat: 'vitality' },
    { id: 'custom', label: 'Custom', icon: <CustomDotsIcon size={16} color="#D5A441" />, defaultStat: 'focus' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddQuest({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      xpReward: Number(xpReward) || 50,
      statType,
      statAmount: Number(statAmount) || 10,
      repeat: repeatEnabled ? repeat : 'none',
      flavorQuote:
        category === 'study'
          ? '“Knowledge kindles the ember of mastery.”'
          : category === 'fitness'
          ? '“The forge demands physical resolve.”'
          : category === 'work'
          ? '“Mastery is won with persistent craft.”'
          : '“A steadfast spirit endures all seasons.”',
    });

    onBack();
  };

  return (
    <div className="min-h-screen pb-24 md:pb-16 max-w-md sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto p-4 sm:p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-2">
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
        <h1 className="font-display font-bold text-lg text-[#E7D8B5] tracking-wide">
          Create a New Quest
        </h1>
      </div>

      {/* Atmospheric Quote Banner */}
      <RPGCard variant="dark" className="p-3 text-center border-dashed">
        <p className="font-body italic text-xs text-[#A99D83]">
          “A goal without a plan is a hollow dream.”
        </p>
      </RPGCard>

      {/* Create Quest Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quest Title */}
        <div className="space-y-1.5">
          <label className="block font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
            Quest Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Read a book"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#090C0E] border border-[#59452A] focus:border-[#C99A3D] text-sm text-[#E7D8B5] placeholder-[#6F695C] outline-none font-body transition-colors"
            style={{ borderRadius: '3px' }}
          />
        </div>

        {/* Description (optional) */}
        <div className="space-y-1.5">
          <label className="block font-display font-semibold text-xs tracking-wider text-[#A99D83]">
            Description (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Read any book for 30 minutes"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#090C0E] border border-[#59452A] focus:border-[#C99A3D] text-sm text-[#E7D8B5] placeholder-[#6F695C] outline-none font-body transition-colors"
            style={{ borderRadius: '3px' }}
          />
        </div>

        {/* Category Pills */}
        <div className="space-y-1.5">
          <label className="block font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
            Category
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {categories.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setCategory(cat.id);
                    setStatType(cat.defaultStat);
                  }}
                  className={`p-2 flex flex-col items-center justify-center gap-1 border transition-all ${
                    isSelected
                      ? 'bg-[#182024] border-[#C99A3D] shadow-[0_0_10px_rgba(201,154,61,0.2)] text-[#F0C75E]'
                      : 'bg-[#11171A] border-[#59452A] text-[#A99D83] hover:border-[#C99A3D]'
                  }`}
                  style={{ borderRadius: '3px' }}
                >
                  {cat.icon}
                  <span className="font-display text-[10px] font-semibold tracking-tight">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rewards Row: XP & Stat Increase */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* XP Reward */}
          <div className="space-y-1.5">
            <label className="block font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
              XP Reward
            </label>
            <input
              type="number"
              min="10"
              max="500"
              step="5"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              className="w-full px-3 py-2 bg-[#090C0E] border border-[#59452A] focus:border-[#C99A3D] font-pixel text-xs text-[#F0C75E] outline-none"
              style={{ borderRadius: '3px' }}
            />
          </div>

          {/* Stat Increase Selector */}
          <div className="space-y-1.5">
            <label className="block font-display font-semibold text-xs tracking-wider text-[#E7D8B5]">
              Stat Increase
            </label>
            <select
              value={statType}
              onChange={(e) => setStatType(e.target.value as StatType)}
              className="w-full px-3 py-2 bg-[#090C0E] border border-[#59452A] focus:border-[#C99A3D] font-display text-xs text-[#E7D8B5] outline-none"
              style={{ borderRadius: '3px' }}
            >
              <option value="strength">Strength (STR)</option>
              <option value="intelligence">Intellect (INT)</option>
              <option value="vitality">Vitality (VIT)</option>
              <option value="focus">Focus (FOC)</option>
            </select>
          </div>
        </div>

        {/* Repeat Controls */}
        <RPGCard className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setRepeatEnabled(!repeatEnabled)}
              className={`w-9 h-5 border transition-colors relative flex items-center px-0.5 ${
                repeatEnabled ? 'bg-[#173A28] border-[#62A96B]' : 'bg-[#11171A] border-[#59452A]'
              }`}
              style={{ borderRadius: '10px' }}
            >
              <span
                className={`w-3.5 h-3.5 bg-[#E7D8B5] transition-transform ${
                  repeatEnabled ? 'translate-x-4 bg-[#7ACB83]' : 'translate-x-0'
                }`}
                style={{ borderRadius: '50%' }}
              />
            </button>
            <span className="font-display text-xs font-semibold text-[#E7D8B5]">
              Repeat
            </span>
          </div>

          {repeatEnabled && (
            <select
              value={repeat}
              onChange={(e) => setRepeat(e.target.value as 'daily' | 'weekly')}
              className="px-2.5 py-1 bg-[#090C0E] border border-[#59452A] font-display text-xs text-[#E7D8B5] outline-none"
              style={{ borderRadius: '3px' }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          )}
        </RPGCard>

        {/* Submit CTA */}
        <div className="pt-2">
          <PixelButton type="submit" variant="primary" fullWidth size="md">
            Create Quest
          </PixelButton>
        </div>
      </form>
    </div>
  );
};
