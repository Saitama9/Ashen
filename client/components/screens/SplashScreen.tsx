import React from 'react';
import { IrlQuestBackground } from '../artwork/IrlQuestBackground';
import { IrlQuestCrest } from '../artwork/IrlQuestCrest';
import { IrlQuestButton } from '../primitives/IrlQuestButton';
import { soundFx } from '../../utils/audio';
import { LogIn, UserPlus } from 'lucide-react';

interface SplashScreenProps {
  onOpenAuthWithMode: (mode: 'login' | 'register') => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onOpenAuthWithMode,
}) => {
  const handleLogin = () => {
    soundFx.playClick();
    onOpenAuthWithMode('login');
  };

  const handleSignUp = () => {
    soundFx.playCoin();
    onOpenAuthWithMode('register');
  };

  return (
    <div
      id="ashen-path-landing-page"
      className="min-h-screen w-full relative flex flex-col overflow-hidden select-none"
    >
      {/* BACKGROUND ARTWORK (Dark Souls Bonfire, Knight & Eclipsed Sun) — fills entire viewport */}
      <IrlQuestBackground />

      {/* Content wrapper — centered on all screen sizes */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen w-full">

        {/* TOP SECTION: BRANDING, CREST & TITLE */}
        <div className="pt-10 sm:pt-14 md:pt-20 lg:pt-28 px-4 text-center w-full max-w-3xl mx-auto">
          {/* Top Astrolabe Cross-Sword Emblem */}
          <IrlQuestCrest className="mx-auto mb-2 md:mb-3" />

          {/* Title: ASHEN PATH */}
          <h1
            id="landing-title"
            className="font-ornate font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5DC] via-[#E8BE6B] to-[#996D25] drop-shadow-[0_3px_10px_rgba(0,0,0,0.95)]"
          >
            ASHEN PATH
          </h1>

          {/* Subtitle: TURN YOUR LIFE INTO A HEROIC JOURNEY. */}
          <p
            id="landing-subtitle"
            className="font-display text-[10.5px] sm:text-[11.5px] md:text-sm lg:text-base tracking-[0.24em] text-[#D1BD93] uppercase font-semibold mt-1 md:mt-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
          >
            TURN YOUR LIFE INTO A HEROIC JOURNEY.
          </p>

          {/* Diamond Divider: ────── ◇ ────── */}
          <div className="flex items-center justify-center space-x-3 mt-3 md:mt-4 opacity-80">
            <div className="h-[1px] w-12 md:w-20 bg-gradient-to-r from-transparent via-[#C99A3D]/70 to-[#C99A3D]" />
            <span className="text-[#D5A441] text-[10px] md:text-xs leading-none">◇</span>
            <div className="h-[1px] w-12 md:w-20 bg-gradient-to-l from-transparent via-[#C99A3D]/70 to-[#C99A3D]" />
          </div>
        </div>

        {/* MID ATMOSPHERIC QUOTE */}
        <div className="relative z-10 px-6 sm:px-8 my-auto pt-4 pb-6 md:pb-10 text-center max-w-sm sm:max-w-md md:max-w-xl mx-auto drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
          <p className="font-body text-base sm:text-lg md:text-xl lg:text-2xl text-[#E2D8C3] leading-relaxed tracking-wider font-light italic">
            "Small steps.
            <br />
            Light great fires."
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2 md:mt-3 opacity-75">
            <span className="h-[1px] w-6 md:w-10 bg-[#C99A3D]/60" />
            <span className="text-xs md:text-sm text-[#C99A3D] font-serif tracking-widest uppercase font-semibold">The Ashen Archives</span>
            <span className="h-[1px] w-6 md:w-10 bg-[#C99A3D]/60" />
          </div>
        </div>

        {/* BOTTOM ACTION BUTTONS */}
        <div className="w-full max-w-md sm:max-w-xl md:max-w-2xl mx-auto px-6 sm:px-8 pb-8 md:pb-12 lg:pb-16 pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          {/* Primary Button: Sign Up */}
          <div className="w-full sm:flex-1">
            <IrlQuestButton
              id="btn-sign-up"
              variant="primary"
              onClick={handleSignUp}
              icon={<UserPlus className="w-4 h-4 text-[#F6D075]" />}
            >
              Create Your Champion
            </IrlQuestButton>
          </div>

          {/* Secondary Button: Login */}
          <div className="w-full sm:flex-1">
            <IrlQuestButton
              id="btn-login"
              variant="secondary"
              onClick={handleLogin}
              icon={<LogIn className="w-4 h-4 text-[#C99A3D]" />}
            >
              Sign In to Sanctuary
            </IrlQuestButton>
          </div>
        </div>
      </div>
    </div>
  );
};
