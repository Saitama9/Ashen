import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Flame, RefreshCw, AlertTriangle } from 'lucide-react';
import { RPGCard } from '../primitives/RPGCard';
import { PixelButton } from '../primitives/PixelButton';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AshenPath Realm Anomaly caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090A] text-[#E7D8B5] flex items-center justify-center p-4">
          <RPGCard ornate variant="highlight" className="max-w-md w-full p-6 text-center space-y-4 bg-[#0E1317]">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#1B120C] border border-[#E25822]/60 flex items-center justify-center text-[#F97316]">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="font-display font-bold text-lg text-[#E7D8B5] tracking-wider uppercase">
                The Flame Flickered
              </h2>
              <p className="font-body text-xs text-[#A99D83] leading-relaxed">
                A temporal rift occurred while rendering the sacred scrolls. The ember remains preserved in your archives.
              </p>
            </div>

            {this.state.error && (
              <div className="p-2.5 bg-[#090C0E] border border-[#59452A] rounded-xs text-left overflow-x-auto">
                <p className="font-pixel text-[10px] text-[#DC2626] font-mono break-all">
                  {this.state.error.message || 'Unknown rift detected'}
                </p>
              </div>
            )}

            <div className="pt-2">
              <PixelButton
                variant="primary"
                fullWidth
                size="md"
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-[#F0C75E]" />
                <span>Rekindle Bonfire & Return</span>
              </PixelButton>
            </div>
          </RPGCard>
        </div>
      );
    }

    return this.props.children;
  }
}
