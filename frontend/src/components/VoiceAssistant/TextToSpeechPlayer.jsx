import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function TextToSpeechPlayer({ text, label = null }) {
  const { speakText, stopSpeaking, language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopSpeaking();
      setIsPlaying(false);
    } else {
      if (text) {
        setIsPlaying(true);
        speakText(text);
        // Reset state when speech ends (speechSynthesis takes ~4-6 seconds typically)
        setTimeout(() => setIsPlaying(false), 5000);
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleTogglePlay}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition shadow-sm ${
        isPlaying
          ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300'
          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-amber-600'
      }`}
      title={isPlaying ? 'Stop Audio' : 'Listen to AI question'}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
          <span>{language === 'hi' ? 'आवाज रोकें' : 'Stop Audio'}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
          <span>{label || (language === 'hi' ? 'बोलकर सुनें' : 'Listen')}</span>
        </>
      )}
    </button>
  );
}

export default TextToSpeechPlayer;
