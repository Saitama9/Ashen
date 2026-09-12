import React from 'react';
import { ScreenId, PlayerClass } from '../../types';
import { soundFx } from '../../utils/audio';
import {
  Flame,
  Swords,
  Shield,
  Backpack,
  User,
  Volume2,
  VolumeX,
  Tv,
  LogIn,
  LogOut,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
} from 'lucide-react';

export interface BottomNavProps {
  currentScreen: ScreenId;
  onSelectScreen: (screen: ScreenId) => void;
  playerClass?: PlayerClass;
  level?: number;
  gold?: number;
  streakDays?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  crtScanlines?: boolean;
  onToggleScanlines?: () => void;
  currentUser?: { id: string; email?: string; username?: string } | null;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onResetToSplash?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onSelectScreen,
  playerClass,
  level,
  gold,
  streakDays,
  soundEnabled,
  onToggleSound,
  crtScanlines,
  onToggleScanlines,
  currentUser,
  onOpenAuth,
  onLogout,
  onResetToSplash,
}) => {
  const navItems: {
    id: ScreenId;
    label: string;
    desc: string;
    icon: (isActive: boolean) => React.ReactNode;
  }[] = [
    {
      id: 'home',
      label: 'Sanctuary',
      desc: 'Quests & Daily Trial',
      icon: (active) => (
        <LayoutDashboard
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            active ? 'text-[#F0C75E]' : 'text-[#8C7D6B] group-hover:text-[#E7D8B5]'
          }`}
        />
      ),
    },
    {
      id: 'character',
      label: 'Attributes',
      desc: 'Stats & Mastery',
      icon: (active) => (
        <Swords
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            active ? 'text-[#F0C75E]' : 'text-[#8C7D6B] group-hover:text-[#E7D8B5]'
          }`}
        />
      ),
    },
    {
      id: 'inventory',
      label: 'Armory',
      desc: 'Vault & Relics',
      icon: (active) => (
        <Backpack
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            active ? 'text-[#F0C75E]' : 'text-[#8C7D6B] group-hover:text-[#E7D8B5]'
          }`}
        />
      ),
    },
    {
      id: 'profile',
      label: 'Chronicles',
      desc: 'Codex, Feats & System',
      icon: (active) => (
        <Sparkles
          className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
            active ? 'text-[#F0C75E]' : 'text-[#8C7D6B] group-hover:text-[#E7D8B5]'
          }`}
        />
      ),
    },
  ];

  return (
    <>
      {/* MOBILE BOTTOM NAVIGATION (< md) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080B0D]/90 backdrop-blur-xl border-t border-[#8C6F3D]/25 shadow-[0_-8px_30px_rgba(0,0,0,0.85)]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)' }}
      >
        <div className="max-w-md sm:max-w-xl mx-auto flex items-center justify-around px-3 py-2">
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.id ||
              (item.id === 'home' &&
                (currentScreen === 'add-quest' ||
                  currentScreen === 'quest-detail' ||
                  currentScreen === 'level-up'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectScreen(item.id);
                }}
                className={`flex flex-col items-center justify-center py-1 px-3.5 rounded-xl transition-all duration-200 relative group ${
                  isActive
                    ? 'text-[#F0C75E] bg-[#F0C75E]/10 shadow-[inset_0_1px_0_rgba(240,199,94,0.3)]'
                    : 'text-[#8C7D6B] hover:text-[#E7D8B5] hover:bg-white/5'
                }`}
              >
                {/* Active Flame Pill Indicator */}
                {isActive && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-gradient-to-r from-[#B84025] via-[#F0C75E] to-[#B84025] shadow-[0_0_8px_rgba(240,199,94,0.6)]" />
                )}
                <div className="mb-1">{item.icon(isActive)}</div>
                <span className="font-display text-[9px] tracking-wider uppercase font-semibold">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* DESKTOP SIDEBAR NAVIGATION (>= md) */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-60 lg:w-64 z-40 bg-[#080B0D]/90 backdrop-blur-2xl border-r border-[#8C6F3D]/25 shadow-[4px_0_30px_rgba(0,0,0,0.85)] select-none overflow-y-auto">
        {/* Top Logo / Sanctum Branding */}
        <div className="p-4 lg:p-5 border-b border-[#8C6F3D]/20 flex items-center gap-3 bg-gradient-to-b from-[#141A1E]/40 to-transparent">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C242A] to-[#0D1215] border border-[#C99A3D]/50 flex items-center justify-center relative shadow-[0_0_16px_rgba(201,154,61,0.2),inset_0_1px_0_rgba(240,199,94,0.2)] shrink-0 group">
            <Flame className="w-5 h-5 text-[#E0522D] group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(224,82,45,0.7)]" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#E0522D] rounded-full animate-ping opacity-75" />
          </div>
          <div className="min-w-0">
            <h1 className="font-ornate font-bold text-sm lg:text-base text-[#F0C75E] tracking-wider truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              ASHEN PATH
            </h1>
            <p className="font-display text-[8px] lg:text-[9px] text-[#A99D83] uppercase tracking-widest truncate">
              Chronicles of Ash
            </p>
          </div>
        </div>

        {/* Hero Quick Status Pill Card */}
        {playerClass && (
          <div className="mx-3.5 my-3.5 p-3 rounded-xl bg-gradient-to-b from-[#141A1E]/90 to-[#0C1013]/90 border border-[#8C6F3D]/30 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(240,199,94,0.1)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#F0C75E] shadow-[0_0_6px_rgba(240,199,94,0.6)] shrink-0" />
                <span className="font-display text-[10px] uppercase tracking-wider text-[#F0C75E] font-bold truncate">
                  {playerClass}
                </span>
              </div>
              <span className="font-pixel text-[8px] text-[#F0C75E] bg-[#1A1610] px-2 py-0.5 rounded-md border border-[#C99A3D]/40 shadow-sm shrink-0">
                Lv.{level || 1}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#A99D83] font-serif pt-2 border-t border-[#8C6F3D]/15">
              <span className="flex items-center gap-1.5">
                <span className="text-xs">🪙</span>
                <span className="text-[#F0C75E] font-mono font-medium text-[11px]">
                  {(gold ?? 0).toLocaleString()}
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#E0522D]" />
                <span className="text-[#E7D8B5] font-mono text-[11px]">
                  {streakDays ?? 0}d
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <div className="px-3 py-2 space-y-1.5 flex-1">
          <div className="px-3 py-1 text-[8px] font-display uppercase tracking-widest text-[#6F695C] font-semibold">
            Sanctuary Realm
          </div>
          {navItems.map((item) => {
            const isActive =
              currentScreen === item.id ||
              (item.id === 'home' &&
                (currentScreen === 'add-quest' ||
                  currentScreen === 'quest-detail' ||
                  currentScreen === 'level-up'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectScreen(item.id);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 text-left group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#2B1F11]/90 via-[#181E22]/90 to-[#12171A]/90 text-[#F0C75E] border border-[#C99A3D]/50 shadow-[0_4px_16px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(240,199,94,0.2)]'
                    : 'text-[#A99D83] hover:text-[#E7D8B5] hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="shrink-0">{item.icon(isActive)}</span>
                  <div>
                    <div
                      className={`font-display text-xs font-bold tracking-wider uppercase leading-snug transition-colors ${
                        isActive ? 'text-[#F0C75E]' : 'text-[#E7D8B5] group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div className="font-serif text-[10px] text-[#6F695C] leading-tight group-hover:text-[#A99D83] transition-colors">
                      {item.desc}
                    </div>
                  </div>
                </div>
                {isActive && (
                  <ChevronRight className="w-4 h-4 text-[#F0C75E] shrink-0 opacity-90 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Desktop Sidebar Controls & Footer */}
        <div className="p-3.5 border-t border-[#8C6F3D]/20 bg-gradient-to-b from-transparent to-[#040608]/90 space-y-2 mt-auto">
          {/* Quick Sound & Scanlines Toggles */}
          <div className="grid grid-cols-2 gap-2">
            {onToggleSound && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onToggleSound();
                }}
                title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#141A1E]/80 hover:bg-[#1C242A] border border-[#8C6F3D]/25 hover:border-[#C99A3D]/50 text-[10px] font-display text-[#A99D83] hover:text-[#E7D8B5] transition-all duration-150 shadow-sm"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#F0C75E]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-[#6F695C]" />
                )}
                <span className="text-[9px] uppercase font-semibold">
                  {soundEnabled ? 'SFX ON' : 'MUTED'}
                </span>
              </button>
            )}
            {onToggleScanlines && (
              <button
                onClick={() => {
                  soundFx.playClick();
                  onToggleScanlines();
                }}
                title="Toggle Retro CRT Scanlines"
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg bg-[#141A1E]/80 hover:bg-[#1C242A] border border-[#8C6F3D]/25 hover:border-[#C99A3D]/50 text-[10px] font-display text-[#A99D83] hover:text-[#E7D8B5] transition-all duration-150 shadow-sm"
              >
                <Tv
                  className={`w-3.5 h-3.5 ${
                    crtScanlines ? 'text-[#F0C75E]' : 'text-[#6F695C]'
                  }`}
                />
                <span className="text-[9px] uppercase font-semibold">
                  {crtScanlines ? 'CRT ON' : 'CRT OFF'}
                </span>
              </button>
            )}
          </div>

          {/* Rest at Bonfire (Return to Title) */}
          {onResetToSplash && (
            <button
              onClick={() => {
                soundFx.playClick();
                onResetToSplash();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#24180E] to-[#17110C] hover:from-[#352213] hover:to-[#221810] border border-[#C99A3D]/40 hover:border-[#F0C75E]/70 text-[#F0C75E] text-[10px] font-display font-semibold uppercase tracking-wider transition-all duration-200 shadow-[0_2px_12px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(240,199,94,0.15)] group"
            >
              <Flame className="w-3.5 h-3.5 text-[#E0522D] group-hover:scale-110 transition-transform" />
              <span>Rest at Bonfire</span>
            </button>
          )}

          {/* Soul / Auth Status & Direct Logout */}
          <div className="pt-2 flex items-center justify-between text-[10px] font-serif text-[#6F695C] px-1 border-t border-[#8C6F3D]/20">
            <div className="flex items-center gap-1.5 truncate max-w-[120px]">
              <User className="w-3 h-3 text-[#8C7D6B] shrink-0" />
              <span className="truncate text-[#A99D83] text-[10px]">
                {currentUser?.username || currentUser?.email || 'Guest Soul'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-1.5">
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onOpenAuth();
                  }}
                  className="text-[#F0C75E] hover:text-[#FFDF7D] hover:underline font-display text-[9px] font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                  title={currentUser ? "Switch Account" : "Sign In / Register"}
                >
                  <span>{currentUser ? "Switch" : "Login"}</span>
                  <LogIn className="w-2.5 h-2.5" />
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    soundFx.playClick();
                    onLogout();
                  }}
                  className="text-[#FCA5A5] hover:text-[#EF4444] hover:underline font-display text-[9px] font-bold uppercase flex items-center gap-0.5 cursor-pointer"
                  title="Sign Out / Logout"
                >
                  <span>Logout</span>
                  <LogOut className="w-2.5 h-2.5 text-[#EF4444]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
