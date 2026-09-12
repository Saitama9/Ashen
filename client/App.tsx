/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { ScreenId, Quest } from './types';
import { useGameState } from './hooks/useGameState';
import { SplashScreen } from './components/screens/SplashScreen';
import { HomeScreen } from './components/screens/HomeScreen';
import { AddQuestScreen } from './components/screens/AddQuestScreen';
import { QuestDetailScreen } from './components/screens/QuestDetailScreen';
import { CharacterScreen } from './components/screens/CharacterScreen';
import { InventoryScreen } from './components/screens/InventoryScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { LevelUpModal } from './components/screens/LevelUpModal';
import { AuthModal } from './components/auth/AuthModal';
import { BottomNav } from './components/primitives/BottomNav';
import { EmberParticles } from './components/artwork/EmberParticles';
import { OfflineIndicator } from './components/primitives/OfflineIndicator';
import { ScanlineOverlay } from './components/primitives/ScanlineOverlay';
import { SmoothScrollProvider } from './components/providers/SmoothScrollProvider';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { animateScreenEnter } from './utils/animations';
import { api } from './services/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>(() => {
    if (typeof window !== 'undefined') {
      if (!api.hasToken()) {
        sessionStorage.removeItem('ashen_current_screen');
        return 'splash';
      }
      const saved = sessionStorage.getItem('ashen_current_screen') as ScreenId | null;
      if (saved && saved !== 'splash') return saved;
      return 'home';
    }
    return 'splash';
  });
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const screenContainerRef = useRef<HTMLDivElement>(null);

  const {
    playerClass,
    setPlayerClass,
    unlockedClasses,
    unlockClass,
    heroAction,
    triggerHeroAction,
    level,
    xp,
    maxXp,
    gold,
    stats,
    quests,
    inventory,
    equippedItems,
    streak,
    streakDays,
    levelUpData,
    soundEnabled,
    crtScanlines,
    dailyBoss,
    currentUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    openAuthModal,
    handleAuthSuccess,
    logout,
    toggleSound,
    toggleScanlines,
    toggleQuest,
    addQuest,
    buyOrEquipItem,
    closeLevelUp,
  } = useGameState();

  // Screen selection handler from bottom nav or buttons
  const handleSelectScreen = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      if (screen === 'splash') {
        sessionStorage.removeItem('ashen_current_screen');
      } else {
        sessionStorage.setItem('ashen_current_screen', screen);
      }
    }
  };

  const handleSelectQuest = (quest: Quest) => {
    setSelectedQuest(quest);
    handleSelectScreen('quest-detail');
  };

  // Handle auth success from splash: navigate to home
  const handleAuthSuccessAndNavigate = (user: any, character: any) => {
    handleAuthSuccess(user, character);
    handleSelectScreen('home');
  };

  // Handle logout: clear state and navigate to splash
  const handleLogout = () => {
    logout();
    handleSelectScreen('splash');
  };

  // Guard: unauthenticated users must remain on splash
  useEffect(() => {
    if (!api.hasToken() && currentScreen !== 'splash') {
      setCurrentScreen('splash');
      sessionStorage.removeItem('ashen_current_screen');
    }
  }, [currentScreen]);

  // GSAP screen entrance on screen change
  useEffect(() => {
    if (screenContainerRef.current) {
      animateScreenEnter(screenContainerRef.current);
    }
  }, [currentScreen]);

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-[#080B0D] text-[#E7D8B5] relative overflow-x-hidden selection:bg-[#B84025] selection:text-[#F3E4BF]">
        {/* Ambient 16-bit floating embers */}
        <EmberParticles />

        {/* Vintage CRT Scanlines (Toggleable in Profile & Settings) */}
        <ScanlineOverlay enabled={crtScanlines} />

        {/* Left Sidebar (Desktop) & Bottom Bar (Mobile) Navigation */}
        {currentScreen !== 'splash' && (
          <BottomNav
            currentScreen={currentScreen}
            onSelectScreen={handleSelectScreen}
            playerClass={playerClass}
            level={level}
            gold={gold}
            streakDays={streakDays}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            crtScanlines={crtScanlines}
            onToggleScanlines={toggleScanlines}
            currentUser={currentUser}
            onOpenAuth={() => openAuthModal('login')}
            onLogout={handleLogout}
            onResetToSplash={() => handleSelectScreen('splash')}
          />
        )}

        {/* Main Screen Container with GSAP transition */}
        <main
          ref={screenContainerRef}
          className={`relative z-10 transition-[padding] duration-200 ${
            currentScreen !== 'splash' ? 'md:pl-60 lg:pl-64' : ''
          }`}
        >
          <ErrorBoundary>
            {currentScreen === 'splash' && (
              <SplashScreen
                onOpenAuthWithMode={openAuthModal}
              />
            )}

            {currentScreen === 'home' && (
              <HomeScreen
                playerClass={playerClass}
                onSelectClass={setPlayerClass}
                heroAction={heroAction}
                onTriggerHeroAction={triggerHeroAction}
                dailyBoss={dailyBoss}
                level={level}
                xp={xp}
                maxXp={maxXp}
                gold={gold}
                stats={stats}
                quests={quests}
                onToggleQuest={toggleQuest}
                onSelectQuest={handleSelectQuest}
                onNavigate={handleSelectScreen}
                streakDays={streakDays}
                equippedItems={equippedItems}
                unlockedClasses={unlockedClasses}
              />
            )}

            {currentScreen === 'add-quest' && (
              <AddQuestScreen
                onBack={() => setCurrentScreen('home')}
                onAddQuest={(newQuest) => {
                  addQuest(newQuest);
                  setCurrentScreen('home');
                }}
              />
            )}

            {currentScreen === 'quest-detail' && selectedQuest && (
              <QuestDetailScreen
                quest={quests.find((q) => q.id === selectedQuest.id) || selectedQuest}
                onBack={() => setCurrentScreen('home')}
                onToggleComplete={(id) => toggleQuest(id)}
              />
            )}

            {currentScreen === 'character' && (
              <CharacterScreen
                playerClass={playerClass}
                onSelectClass={setPlayerClass}
                level={level}
                xp={xp}
                maxXp={maxXp}
                gold={gold}
                stats={stats}
                streakDays={streakDays}
                streak={streak}
                unlockedClasses={unlockedClasses}
                onUnlockClass={unlockClass}
                equippedItems={equippedItems}
              />
            )}

            {currentScreen === 'inventory' && (
              <InventoryScreen
                gold={gold}
                inventory={inventory}
                onBuyOrEquip={buyOrEquipItem}
              />
            )}

            {currentScreen === 'profile' && (
              <ProfileScreen
                playerClass={playerClass}
                onSelectClass={setPlayerClass}
                soundEnabled={soundEnabled}
                onToggleSound={toggleSound}
                crtScanlines={crtScanlines}
                onToggleScanlines={toggleScanlines}
                onResetToSplash={() => handleSelectScreen('splash')}
                level={level}
                xp={xp}
                maxXp={maxXp}
                gold={gold}
                stats={stats}
                quests={quests}
                inventory={inventory}
                streakDays={streakDays}
                streak={streak}
                dailyBoss={dailyBoss}
                unlockedClasses={unlockedClasses}
                equippedItems={equippedItems}
                currentUser={currentUser}
                onOpenAuthModal={() => openAuthModal('login')}
                onLogout={handleLogout}
                onNavigate={handleSelectScreen}
              />
            )}
          </ErrorBoundary>
        </main>

        {/* Level Up Modal overlay */}
        {levelUpData && (
          <LevelUpModal
            prevLevel={levelUpData.prevLevel}
            newLevel={levelUpData.newLevel}
            playerClass={playerClass}
            statIncreases={levelUpData.statIncreases}
            onContinue={closeLevelUp}
          />
        )}

        {/* Sanctuary Soul Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccessAndNavigate}
          initialMode={authModalMode}
        />

        {/* PWA / Network Status Indicator */}
        <OfflineIndicator />
      </div>
    </SmoothScrollProvider>
  );
}
