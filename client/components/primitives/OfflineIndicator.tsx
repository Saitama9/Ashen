import React, { useEffect, useState } from 'react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 flex items-center gap-2.5 p-2.5 border border-[#B84025] bg-[#11171A] text-[#E7D8B5] shadow-xl text-xs font-serif" style={{ borderRadius: '3px' }}>
      <span className="w-2 h-2 bg-[#E0522D] border border-[#F0C75E] animate-ping" />
      <span className="flex-1 text-[#A99D83]">
        <strong className="text-[#E7D8B5]">Offline Bonfire</strong> — Quests and progress are saved locally in the ashes.
      </span>
    </div>
  );
};
