import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { soundFx } from '../../utils/audio';

export const PWAInstallButton: React.FC<{ variant?: 'nav' | 'banner' | 'settings' }> = ({ variant = 'banner' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = () => {
    soundFx.playClick();
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (!isInstallable && !isIOS && variant !== 'settings') {
    return null;
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 border transition-all text-xs font-serif uppercase tracking-wider ${
          variant === 'nav'
            ? 'bg-[#11171A] border-[#59452A] text-[#D5A441] hover:border-[#C99A3D]'
            : 'bg-[#8F3021] border-[#D5A441] text-[#F3E4BF] hover:bg-[#B84025] shadow-[0_0_12px_rgba(213,164,65,0.18)]'
        }`}
        style={{ borderRadius: '3px' }}
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        <span>{isIOS ? 'Install (iOS)' : 'Install App'}</span>
      </button>

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-sm p-5 border border-[#C99A3D] bg-[#11171A] shadow-[0_0_24px_rgba(0,0,0,0.9)] text-[#E7D8B5]" style={{ borderRadius: '3px' }}>
            <div className="flex items-center gap-2 border-b border-[#59452A] pb-3 mb-3">
              <span className="text-[#D5A441] font-display text-base tracking-wider">INSTALL ON IPHONE / IPAD</span>
            </div>
            <p className="text-sm font-body text-[#A99D83] leading-relaxed mb-4">
              1. Tap the <strong className="text-[#E7D8B5]">Share</strong> icon in the Safari navigation bar.<br />
              2. Scroll down and choose <strong className="text-[#F0C75E]">Add to Home Screen</strong>.<br />
              3. Launch <strong className="text-[#E7D8B5]">Ashen Path</strong> in standalone mode anytime.
            </p>
            <button
              onClick={() => {
                soundFx.playClick();
                setShowIOSGuide(false);
              }}
              className="w-full py-2 bg-[#182024] border border-[#59452A] text-[#E7D8B5] hover:border-[#C99A3D] text-xs font-serif uppercase tracking-wider"
              style={{ borderRadius: '3px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
