import React, { useState } from 'react';
import { IrlQuestBackground } from '../artwork/IrlQuestBackground';
import { IrlQuestCrest } from '../artwork/IrlQuestCrest';
import { IrlQuestButton } from '../primitives/IrlQuestButton';
import { soundFx } from '../../utils/audio';
import { PlayerClass } from '../../types';
import { PLAYER_CLASSES } from '../../utils/classes';
import { Shield, Sparkles, UserCheck } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  playerClass?: PlayerClass;
  onSelectClass?: (cls: PlayerClass) => void;
  level?: number;
  streak?: number;
  onOpenAuth?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnter,
  playerClass = 'knight',
  onSelectClass,
  level = 1,
  streak = 1,
  onOpenAuth,
}) => {
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  const handleBeginJourney = () => {
    soundFx.playCoin();
    // If onSelectClass is provided, we can offer vocation initiation or jump right in
    if (onSelectClass) {
      setShowJourneyModal(true);
    } else {
      onEnter();
    }
  };

  const handleAlreadyAccount = () => {
    soundFx.playClick();
    setShowAccountModal(true);
  };

  const currentClassInfo = PLAYER_CLASSES[playerClass] || PLAYER_CLASSES.knight;

  return (
    <div
      id="ashen-path-landing-page"
      className="min-h-screen max-w-[480px] w-full mx-auto relative flex flex-col justify-between overflow-hidden shadow-2xl select-none"
    >
      {/* BACKGROUND ARTWORK (Dark Souls Bonfire, Knight & Eclipsed Sun) */}
      <IrlQuestBackground />

      {/* TOP SECTION: BRANDING, CREST & TITLE */}
      <div className="relative z-10 pt-8 sm:pt-10 px-4 text-center">
        {/* Top Astrolabe Cross-Sword Emblem */}
        <IrlQuestCrest className="mx-auto mb-1" />

        {/* Title: ASHEN PATH */}
        <h1
          id="landing-title"
          className="font-ornate font-bold text-3xl sm:text-4xl tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DC] via-[#E8BE6B] to-[#996D25] drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]"
        >
          ASHEN PATH
        </h1>

        {/* Subtitle: TURN YOUR LIFE INTO A HEROIC JOURNEY. */}
        <p
          id="landing-subtitle"
          className="font-display text-[10.5px] sm:text-[11.5px] tracking-[0.24em] text-[#D1BD93] uppercase font-semibold mt-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
        >
          TURN YOUR LIFE INTO A HEROIC JOURNEY.
        </p>

        {/* Diamond Divider: ────── ◇ ────── */}
        <div className="flex items-center justify-center space-x-3 mt-2.5 opacity-80">
          <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#C99A3D]/70 to-[#C99A3D]" />
          <span className="text-[#D5A441] text-[10px] leading-none">◇</span>
          <div className="h-[1px] w-12 bg-gradient-to-l from-transparent via-[#C99A3D]/70 to-[#C99A3D]" />
        </div>
      </div>

      {/* MID-LEFT ATMOSPHERIC QUOTE */}
      <div className="relative z-10 px-6 sm:px-8 my-auto pt-6 pb-28 text-left max-w-[260px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
        <p className="font-body text-sm sm:text-base text-[#C8BEA8] leading-snug tracking-wide font-normal">
          “Small steps.
          <br />
          Light great fires.”
        </p>
        <span className="block text-sm text-[#A8987E] font-serif mt-1">—</span>
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      <div className="relative z-10 px-6 sm:px-8 pb-8 pt-4 space-y-3">
        {/* Primary Button: Begin Your Journey */}
        <IrlQuestButton
          id="btn-begin-journey"
          variant="primary"
          onClick={handleBeginJourney}
          icon={<Sparkles className="w-4 h-4 text-[#F6D075]" />}
        >
          Begin Your Journey
        </IrlQuestButton>

        {/* Secondary Button: I Already Have an Account */}
        <IrlQuestButton
          id="btn-already-account"
          variant="secondary"
          onClick={handleAlreadyAccount}
        >
          I Already Have an Account
        </IrlQuestButton>
      </div>

      {/* MODAL: "I Already Have an Account" (Save Profile Resume) */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0E1317] border-2 border-[#C99A3D] max-w-sm w-full p-6 relative rounded shadow-2xl text-[#E7D8B5]">
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#18232B] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E]">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#F0C75E] tracking-wider uppercase">
                Sanctuary Credentials
              </h3>
              <p className="font-body text-xs text-[#A99D83] mt-1">
                Your ashen flame burns steadily in the records.
              </p>
            </div>

            {/* Character Snapshot Card */}
            <div className="bg-[#141C21] border border-[#59452A] p-3 rounded mb-5 flex items-center justify-between">
              <div>
                <span className="font-display font-bold text-sm text-[#E7D8B5] block">
                  {currentClassInfo.name}
                </span>
                <span className="font-pixel text-[9px] text-[#A99D83]">
                  Level {level} • {streak} Day Streak
                </span>
              </div>
              <div className="font-pixel text-xs text-[#F0C75E] bg-[#0A0D10] px-2 py-1 rounded border border-[#59452A]/50">
                Lvl {level}
              </div>
            </div>

            <div className="space-y-2">
              <IrlQuestButton
                variant="primary"
                onClick={() => {
                  soundFx.playCoin();
                  setShowAccountModal(false);
                  onEnter();
                }}
                icon={<Sparkles className="w-4 h-4 text-[#F6D075]" />}
              >
                Resume Adventure
              </IrlQuestButton>

              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    setShowAccountModal(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2 bg-[#1A2328] hover:bg-[#25333A] border border-[#C99A3D] text-[#F0C75E] font-display text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
                >
                  Log in to Different Soul
                </button>
              )}

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowAccountModal(false);
                }}
                className="w-full text-center py-2 text-xs font-display tracking-wider text-[#A99D83] hover:text-[#E7D8B5] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: "Begin Your Journey" (Choose Starting Vocation) */}
      {showJourneyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0E1317] border-2 border-[#C99A3D] max-w-md w-full p-6 relative rounded shadow-2xl text-[#E7D8B5]">
            <div className="text-center mb-5">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#18232B] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E]">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-[#F0C75E] tracking-wider uppercase">
                Choose Your Vocation
              </h3>
              <p className="font-body text-xs text-[#A99D83] mt-1">
                Before you kindle the bonfire, seal your path.
              </p>
            </div>

            {/* Vocation Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-5">
              {(Object.keys(PLAYER_CLASSES) as PlayerClass[]).map((cls) => {
                const info = PLAYER_CLASSES[cls];
                const isSelected = playerClass === cls;
                return (
                  <button
                    key={cls}
                    onClick={() => {
                      soundFx.playClick();
                      if (onSelectClass) onSelectClass(cls);
                    }}
                    className={`p-3 text-left rounded border transition-all ${
                      isSelected
                        ? 'bg-[#1C2830] border-[#F0C75E] shadow-[0_0_10px_rgba(201,154,61,0.3)]'
                        : 'bg-[#11171A] border-[#59452A] hover:border-[#A99D83]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-xs text-[#E7D8B5]">
                        {info.name}
                      </span>
                      {isSelected && <Sparkles className="w-3.5 h-3.5 text-[#F0C75E]" />}
                    </div>
                    <p className="font-body text-[10px] text-[#A99D83] line-clamp-2">
                      {info.title}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <IrlQuestButton
                variant="primary"
                onClick={() => {
                  soundFx.playCoin();
                  setShowJourneyModal(false);
                  onEnter();
                }}
                icon={<Sparkles className="w-4 h-4 text-[#F6D075]" />}
              >
                Kindle Flame & Enter
              </IrlQuestButton>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowJourneyModal(false);
                }}
                className="w-full text-center py-2 text-xs font-display tracking-wider text-[#A99D83] hover:text-[#E7D8B5] transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
