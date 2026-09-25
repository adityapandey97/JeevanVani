import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Mic, MicOff, Sparkles, ExternalLink, ShieldCheck, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import api from '../../services/api';

export function AIAssistantWidget() {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: language === 'hi'
        ? 'नमस्ते! मैं जीवनवाणी PM-AJAY करियर और कौशल सलाहकार हूँ। आप मुझसे PM-AJAY योजना, NSQF कोर्स, नौकरी पात्रता या कौशल अंतराल (Skill Gaps) के बारे में पूछ सकते हैं।'
        : 'Namaste! I am your JeevanVaani PM-AJAY Career & Skilling Counselor. Ask me about PM-AJAY GIA benefits, NSQF courses, eligibility, or your career roadmap.',
      sources: [
        { title: 'PM-AJAY GIA Guidelines', url: 'https://pmajay.dosje.gov.in' }
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Suggested prompt chips
  const quickPrompts = language === 'hi' ? [
    'PM-AJAY में क्या लाभ मिलता है?',
    'क्या सरकारी नौकरी की पक्की गारंटी है?',
    'RPL प्रमाणन क्या होता है?',
    'मुफ्त टूल-किट सब्सिडी कैसे मिलती है?'
  ] : [
    'What benefits does PM-AJAY GIA provide?',
    'Does any course guarantee a job?',
    'What is RPL certification?',
    'How to get tool-kit enterprise subsidy?'
  ];

  // Voice speech recognition for assistant input
  const toggleSpeechRecognition = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(language === 'hi' ? 'आपके ब्राउज़र में वॉइस इनपुट समर्थित नहीं है। कृपया लिखकर पूछें।' : 'Voice input not supported in your browser. Please type your query.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        handleSendMessage(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsLoading(true);

    try {
      const res = await api.post('/assistant/message', {
        message: query,
        language
      });

      if (res.data?.success && res.data?.data) {
        const { reply, groundedFacts, sources, suggestedActions } = res.data.data;
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: reply,
            groundedFacts,
            sources,
            suggestedActions
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: language === 'hi'
              ? 'वर्तमान में इस प्रश्न का उत्तर सत्यापित अभिलेखों में उपलब्ध नहीं है। कृपया आधिकारिक पोर्टल pmajay.dosje.gov.in पर देखें।'
              : 'Verified information is currently unavailable for this specific query. Please consult official PM-AJAY guidelines at pmajay.dosje.gov.in.'
          }
        ]);
      }
    } catch {
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: language === 'hi'
            ? 'नेटवर्क समस्या या सहायक अस्थायी रूप से अनुपलब्ध है। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
            : 'Service temporarily unavailable. Please try again shortly or check your network.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        id="ai-assistant-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open JeevanVaani AI Assistant"
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 group border-2 border-white/30"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="hidden sm:inline font-bold text-sm tracking-wide pr-1">
              {language === 'hi' ? 'पूछें जीवनवाणी' : 'Ask JeevanVaani'}
            </span>
          </>
        )}
      </button>

      {/* Assistant Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-x-4 bottom-24 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[420px] max-h-[75vh] h-[580px] z-50 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white flex items-center justify-between border-b border-amber-900/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  <span>{language === 'hi' ? 'जीवनवाणी AI सलाहकार' : 'JeevanVaani AI Counselor'}</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </h3>
                <p className="text-[11px] text-amber-200/80 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>{language === 'hi' ? 'सत्यापित PM-AJAY GIA RAG' : 'Verified PM-AJAY GIA RAG'}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition"
              aria-label="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950/60">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  <p>{m.text}</p>

                  {/* Grounded Sources */}
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {language === 'hi' ? 'आधिकारिक स्रोत:' : 'Official Sources:'}
                      </p>
                      {m.sources.map((src, sIdx) => (
                        <a
                          key={sIdx}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 hover:underline mr-2"
                        >
                          <span>{src.title}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Suggested Actions */}
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act, aIdx) => (
                        <a
                          key={aIdx}
                          href={act.url}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-semibold text-[11px] border border-amber-200 dark:border-amber-800/50 hover:bg-amber-100 transition"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 p-3 bg-white dark:bg-slate-900 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-800 w-32 shadow-sm">
                <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                <span className="text-xs text-slate-500">{language === 'hi' ? 'सोच रहा है...' : 'Verifying...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-slate-100 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 overflow-x-auto flex gap-1.5 scrollbar-none">
            {quickPrompts.map((qp, qIdx) => (
              <button
                key={qIdx}
                onClick={() => handleSendMessage(qp)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 dark:hover:text-amber-300 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              aria-label="Toggle Voice Input"
              className={`p-2.5 rounded-xl transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ पूछें...' : 'Ask your career question...'}
              className="flex-1 px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 border border-transparent dark:border-slate-700"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold transition shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default AIAssistantWidget;
