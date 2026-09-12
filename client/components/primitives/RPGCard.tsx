import React from 'react';

interface RPGCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'flat' | 'dark';
  ornate?: boolean;
  className?: string;
  onClick?: () => void;
}

export const RPGCard: React.FC<RPGCardProps> = ({
  children,
  variant = 'default',
  ornate = false,
  className = '',
  onClick,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'highlight':
        return 'bg-gradient-to-b from-[#182228]/95 via-[#12191D]/95 to-[#0D1215]/95 border-[#C99A3D]/70 shadow-[0_0_0_1px_rgba(201,154,61,0.2),0_10px_30px_rgba(0,0,0,0.65),0_0_24px_rgba(201,154,61,0.12),inset_0_1px_0_rgba(240,199,94,0.25)]';
      case 'flat':
        return 'bg-[#11171A] border-[#8C6F3D]/30 shadow-md';
      case 'dark':
        return 'bg-gradient-to-b from-[#0E1316]/95 to-[#080B0D]/95 border-[#8C6F3D]/25 shadow-[0_10px_30px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.03)]';
      case 'default':
      default:
        return 'bg-gradient-to-b from-[#13191D]/90 via-[#0E1316]/90 to-[#0A0D0F]/95 border-[#8C6F3D]/35 shadow-[0_8px_28px_-4px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(240,199,94,0.1)] backdrop-blur-md';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border text-[#E7D8B5] transition-all duration-200 ${getVariantStyles()} ${
        onClick ? 'cursor-pointer hover:border-[#C99A3D]/80 hover:shadow-[0_8px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(201,154,61,0.15)] hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {ornate && (
        <>
          {/* Subtle Gilded Corner Brackets */}
          <span className="absolute top-1 left-1 w-2 h-2 border-t-2 border-l-2 border-[#F0C75E]/60 pointer-events-none rounded-tl-sm" />
          <span className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#F0C75E]/60 pointer-events-none rounded-tr-sm" />
          <span className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#F0C75E]/60 pointer-events-none rounded-bl-sm" />
          <span className="absolute bottom-1 right-1 w-2 h-2 border-b-2 border-r-2 border-[#F0C75E]/60 pointer-events-none rounded-br-sm" />
        </>
      )}
      {children}
    </div>
  );
};
