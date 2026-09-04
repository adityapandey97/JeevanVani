import React from 'react';

export function AudioWaveform({ active = false, color = 'bg-amber-500', barCount = 12 }) {
  const bars = Array.from({ length: barCount });

  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {bars.map((_, i) => {
        const delay = (i * 0.1).toFixed(1);
        const heightMultiplier = Math.sin((i / barCount) * Math.PI) * 0.8 + 0.2;
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-300 ${color} ${
              active ? 'animate-wave' : 'h-1.5 opacity-40'
            }`}
            style={{
              height: active ? `${Math.max(8, heightMultiplier * 28)}px` : '6px',
              animationDelay: `${delay}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export default AudioWaveform;
