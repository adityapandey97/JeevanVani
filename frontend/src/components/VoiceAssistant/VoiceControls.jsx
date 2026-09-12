import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, AlertCircle, Check } from 'lucide-react';
import AudioWaveform from '../common/AudioWaveform';
import { useLanguage } from '../../context/LanguageContext';

export function VoiceControls({ onSpeechResult, isListening, setIsListening }) {
  const { language } = useLanguage();
  const [errorMsg, setErrorMsg] = useState(null);
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const onSpeechResultRef = useRef(onSpeechResult);
  const isListeningRef = useRef(isListening);

  // Keep callback refs updated without re-running effects
  useEffect(() => {
    onSpeechResultRef.current = onSpeechResult;
  }, [onSpeechResult]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

  const stopAllMedia = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setIsListening(false);
    setVolumeLevel(0);
  }, [setIsListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAllMedia();
    };
  }, [stopAllMedia]);

  // Start real microphone audio visualizer using Web Audio API
  const startAudioVisualizer = async () => {

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!isListeningRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        setVolumeLevel(Math.min(100, Math.round((avg / 128) * 100)));
        requestAnimationFrame(checkVolume);
      };

      requestAnimationFrame(checkVolume);
      return true;
    } catch (err) {
      console.warn('Microphone permission or stream error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg(
          language === 'hi'
            ? 'माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र पता बार (URL bar) में लॉक आइकन 🔒 पर क्लिक करके माइक्रोफ़ोन की अनुमति "Allow" करें।'
            : 'Microphone permission blocked. Please click the lock icon 🔒 in your browser address bar and set Microphone to "Allow".'
        );
      } else {
        setErrorMsg(
          language === 'hi'
            ? 'माइक्रोफ़ोन नहीं मिल सका। कृपया चेक करें कि माइक कनेक्ट है या नहीं।'
            : 'Could not detect a working microphone. Please check your audio device settings.'
        );
      }
      return false;
    }
  };

  const startListening = async () => {
    setErrorMsg(null);
    setLiveTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMsg(
        language === 'hi'
          ? 'आपका ब्राउज़र वॉयस पहचान का समर्थन नहीं करता है। कृपया Google Chrome या Microsoft Edge का उपयोग करें या नीचे टाइप करें।'
          : 'Speech recognition is not supported in this browser. Please use Chrome or Edge, or type your answer.'
      );
      return;
    }

    // First ensure real microphone permission is granted
    const micGranted = await startAudioVisualizer();
    if (!micGranted) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';

      let accumulatedFinal = '';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event) => {
        let interim = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            accumulatedFinal += ' ' + transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        const currentCombined = (accumulatedFinal + ' ' + interim).trim();
        setLiveTranscript(currentCombined);

        if (onSpeechResultRef.current && currentCombined) {
          onSpeechResultRef.current(currentCombined, false);
        }

        // Reset silence detection timer whenever user speaks
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Auto-complete after 2.8 seconds of silence once speech was recorded
        if (currentCombined.length > 2) {
          silenceTimerRef.current = setTimeout(() => {
            if (isListeningRef.current && onSpeechResultRef.current) {
              onSpeechResultRef.current(currentCombined, true);
              stopListening();
            }
          }, 2800);
        }
      };

      recognition.onerror = (event) => {
        console.warn('[SpeechRecognition Error]', event.error);
        if (event.error === 'no-speech') {
          // Normal when user pauses, ignore or keep listening
          return;
        }
        if (event.error === 'not-allowed') {
          setErrorMsg(
            language === 'hi'
              ? 'माइक्रोफ़ोन अनुमति अस्वीकृत। ब्राउज़र में 🔒 आइकन पर क्लिक कर अनुमति दें।'
              : 'Microphone permission blocked. Please allow mic access in your address bar.'
          );
          stopListening();
        } else if (event.error === 'network') {
          setErrorMsg(
            language === 'hi'
              ? 'नेटवर्क समस्या के कारण वॉयस सेवा बाधित हुई। कृपया इंटरनेट जांचें या नीचे टाइप करें।'
              : 'Speech recognition network error. Please check your internet connection or type below.'
          );
          stopListening();
        }
      };

      recognition.onend = () => {
        // If still flagged as listening and no error, restart recognition to maintain continuous mode
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch {
            setIsListening(false);
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      stopListening();
    }
  };

  const stopListening = () => {
    const finalDraft = liveTranscript.trim();
    if (finalDraft && onSpeechResultRef.current) {
      onSpeechResultRef.current(finalDraft, true);
    }
    stopAllMedia();
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Waveform indicator driven by real volume level */}
      <div className="h-10 mb-2 flex items-center justify-center">
        <AudioWaveform
          active={isListening && volumeLevel > 5}
          color={volumeLevel > 20 ? 'bg-amber-500' : 'bg-amber-400'}
          barCount={16}
        />
      </div>

      {/* Large Accessible Microphone Button */}
      <div className="relative">
        {isListening && (
          <div
            className="absolute inset-0 rounded-full bg-amber-400 opacity-60 animate-ping"
            style={{ animationDuration: volumeLevel > 20 ? '0.8s' : '1.5s' }}
          />
        )}
        <button
          id="voice-mic-button"
          type="button"
          onClick={toggleListening}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-xl ${
            isListening
              ? 'bg-gradient-to-tr from-red-500 to-rose-600 text-white shadow-red-500/50 ring-4 ring-red-300 scale-105'
              : 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white hover:brightness-110 shadow-amber-500/40 hover:scale-105'
          }`}
          title={isListening ? 'Click to stop & submit' : 'Click to speak'}
        >
          {isListening ? (
            <MicOff className="w-9 h-9 sm:w-11 sm:h-11 animate-pulse" />
          ) : (
            <Mic className="w-9 h-9 sm:w-11 sm:h-11" />
          )}
        </button>
      </div>

      {/* Status & Realtime Transcript */}
      <div className="mt-3 text-center max-w-xs">
        {isListening ? (
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-bold text-red-600 flex items-center gap-1.5 justify-center">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
              <span>{language === 'hi' ? 'आपकी आवाज सुन रहा हूँ... बोलिए' : 'Listening... Speak your answer now'}</span>
            </p>
            {liveTranscript ? (
              <p className="text-xs text-slate-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg font-medium italic mt-1 animate-fadeIn">
                "{liveTranscript}"
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                {language === 'hi' ? '(बोलना समाप्त होने पर यह स्वतः दर्ज हो जाएगा)' : '(Will auto-submit on 2.5s silence or tap button to finish)'}
              </p>
            )}
            <button
              type="button"
              onClick={stopListening}
              className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition shadow"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'उत्तर पूरा हुआ (भेजें)' : 'Done Speaking (Submit)'}</span>
            </button>
          </div>
        ) : (
          <p className="text-xs sm:text-sm font-semibold text-slate-600">
            {language === 'hi' ? 'बोलने के लिए माइक बटन दबाएं' : 'Tap microphone button to speak'}
          </p>
        )}
      </div>

      {/* Permission or Device Error Message */}
      {errorMsg && (
        <div className="mt-3 flex flex-col items-center gap-1 text-xs text-red-800 bg-red-50 p-3 rounded-xl border border-red-200 max-w-sm text-center animate-fadeIn">
          <div className="flex items-center gap-1 font-bold">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span>{language === 'hi' ? 'माइक्रोफ़ोन समस्या' : 'Microphone Notice'}</span>
          </div>
          <p className="text-[11px] text-red-700 leading-relaxed">{errorMsg}</p>
        </div>
      )}
    </div>
  );
}

export default VoiceControls;
