import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { soundFx } from '../../utils/audio';
import { RPGCard } from '../primitives/RPGCard';
import { PixelButton } from '../primitives/PixelButton';
import { Shield, Lock, Mail, User, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlayerClass } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { id: string; email: string; username: string }, character: any) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [playerClass, setPlayerClass] = useState<PlayerClass>('sorcerer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode with initialMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
      setEmail('');
      setUsername('');
      setPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login({
          emailOrUsername: email || username,
          password,
        });
        soundFx.playQuestComplete();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user, res.character);
          onClose();
        }, 500);
      } else {
        const res = await api.register({
          email,
          username,
          password,
          playerClass,
        });
        soundFx.playLevelUp();
        setSuccessMsg(res.message);
        setTimeout(() => {
          onAuthSuccess(res.user, res.character);
          onClose();
        }, 500);
      }
    } catch (err: any) {
      soundFx.playClick();
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <RPGCard
        variant="highlight"
        ornate
        className="w-full max-w-md p-5 sm:p-6 space-y-4 bg-[#0B0E12] border-2 border-[#C99A3D] text-[#E7D8B5] relative my-auto shadow-[0_0_40px_rgba(0,0,0,0.9)]"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-[#A99D83] hover:text-[#E7D8B5] rounded-xs border border-transparent hover:border-[#59452A] transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center pb-2 border-b border-[#59452A]/60">
          <div className="w-10 h-10 mx-auto mb-2 rounded-xs bg-[#1C160B] border border-[#C99A3D] flex items-center justify-center text-[#F0C75E]">
            <Shield className="w-5 h-5" />
          </div>
          <h2 className="font-ornate font-bold text-xl text-[#F0C75E] tracking-wider uppercase">
            Sanctuary Soul Portal
          </h2>
          <p className="font-body text-xs text-[#A99D83] mt-0.5">
            Authenticate to sync your champion across realms & devices.
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex border-b border-[#59452A]">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 font-display text-xs uppercase tracking-wider transition-colors ${
              mode === 'login'
                ? 'text-[#F0C75E] font-bold border-b-2 border-[#F0C75E] bg-[#16120C]'
                : 'text-[#A99D83] hover:text-[#E7D8B5]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-2 font-display text-xs uppercase tracking-wider transition-colors ${
              mode === 'register'
                ? 'text-[#F0C75E] font-bold border-b-2 border-[#F0C75E] bg-[#16120C]'
                : 'text-[#A99D83] hover:text-[#E7D8B5]'
            }`}
          >
            Summon New Soul
          </button>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="p-2.5 bg-[#2B0E0E] border border-[#EF4444] rounded-xs text-xs text-[#FCA5A5] flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-2.5 bg-[#122A1A] border border-[#62A96B] rounded-xs text-xs text-[#86EFAC] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#62A96B] shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          {mode === 'register' && (
            <div>
              <label className="block font-pixel text-[8.5px] uppercase text-[#A99D83] mb-1">
                Champion Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8E7246] absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. AshenHero"
                  className="w-full pl-9 pr-3 py-2 bg-[#06090B] border border-[#59452A] rounded-xs font-body text-xs text-[#E7D8B5] focus:outline-none focus:border-[#F0C75E]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-pixel text-[8.5px] uppercase text-[#A99D83] mb-1">
              {mode === 'login' ? 'Email or Username' : 'Soul Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8E7246] absolute left-3 top-2.5" />
              <input
                type={mode === 'login' ? 'text' : 'email'}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'login' ? 'AshenOne or hero@realm.com' : 'hero@realm.com'}
                className="w-full pl-9 pr-3 py-2 bg-[#06090B] border border-[#59452A] rounded-xs font-body text-xs text-[#E7D8B5] focus:outline-none focus:border-[#F0C75E]"
              />
            </div>
          </div>

          <div>
            <label className="block font-pixel text-[8.5px] uppercase text-[#A99D83] mb-1">
              Secret Passphrase (Min 6 chars)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8E7246] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-[#06090B] border border-[#59452A] rounded-xs font-body text-xs text-[#E7D8B5] focus:outline-none focus:border-[#F0C75E]"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block font-display text-[10px] uppercase tracking-wider text-[#A99D83] mb-1 font-semibold">
                Starting Vocation
              </label>
              <select
                value={playerClass}
                onChange={(e) => setPlayerClass(e.target.value as PlayerClass)}
                className="w-full px-3 py-2 bg-[#06090B] border border-[#8C6F3D]/40 rounded-lg font-serif text-xs text-[#F0C75E] focus:outline-none focus:border-[#F0C75E]"
              >
                <option value="sorcerer">Pyromancer Sorcerer (Intelligence & Focus)</option>
                <option value="knight">Vanguard Knight (Strength & Vitality)</option>
                <option value="ronin">Wandering Ronin (Strength & Focus)</option>
                <option value="rogue">Shadow Assassin (Agility & Focus)</option>
              </select>
            </div>
          )}

          <div className="pt-2">
            <PixelButton
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              disabled={loading}
            >
              {loading
                ? 'Summoning...'
                : mode === 'login'
                ? 'Enter Sanctuary'
                : 'Awaken Champion'}
            </PixelButton>
          </div>
        </form>
      </RPGCard>
    </div>
  );
};
