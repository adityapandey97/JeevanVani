import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import TextToSpeechPlayer from '../VoiceAssistant/TextToSpeechPlayer';
import { useLanguage } from '../../context/LanguageContext';

export function AssessmentChat({
  currentQuestion = null,
  conversationHistory = [],
  onAnswerSubmit,
  isSubmitting = false,
  activeSpeechDraft = '',
}) {
  const { language, t } = useLanguage();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef(null);

  // Sync spoken transcript into input field as user speaks
  useEffect(() => {
    if (activeSpeechDraft) {
      setInputText(activeSpeechDraft);
    }
  }, [activeSpeechDraft]);

  // Scroll to bottom smoothly whenever questions or history update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, currentQuestion, isSubmitting]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isSubmitting) return;

    onAnswerSubmit(clean);
    setInputText('');
  };

  const handleQuickReply = (text) => {
    if (isSubmitting) return;
    setInputText(text);
    onAnswerSubmit(text);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Welcome message */}
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none p-4 max-w-xl text-sm leading-relaxed border border-slate-200/60 dark:border-slate-700/60">
            <p className="font-semibold text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wide mb-1">
              {language === 'hi' ? 'जीवनवाणी करियर AI' : 'JeevanVani Career AI'}
            </p>
            <p>
              {language === 'hi'
                ? 'नमस्ते! मैं आपका कौशल और रोजगार सहायक हूँ। मैं आपकी शिक्षा, कौशल और रुचियों के आधार पर आपके लिए सही स्किलिंग और करियर विकल्प खोजने में मदद करूँगा।'
                : 'Namaste! I am your PM-AJAY AI Career and Skilling Counselor. I will help map your livelihood profile and recommend the best NSQF skilling pathways tailored to you.'}
            </p>
          </div>
        </div>

        {/* Conversation History */}
        {conversationHistory.map((item, idx) => (
          <React.Fragment key={idx}>
            {/* AI Question in history */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-tl-none p-4 max-w-xl text-sm leading-relaxed border border-slate-200/60 dark:border-slate-700/60">
                <p>{item.questionPrompt}</p>
              </div>
            </div>

            {/* User Answer in history */}
            <div className="flex items-start justify-end gap-3">
              <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl rounded-tr-none p-3.5 max-w-lg text-sm shadow-sm">
                <p>{item.userAnswer}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            </div>

            {/* AI Acknowledgement */}
            {item.acknowledgement && (
              <div className="flex items-center gap-2 pl-11 text-xs text-slate-500 dark:text-slate-400 italic">
                <span>✓ {item.acknowledgement}</span>
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Active AI Question */}
        {currentQuestion && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-amber-50/80 dark:bg-amber-950/30 border-2 border-amber-200/80 dark:border-amber-800/80 text-slate-900 dark:text-white rounded-2xl rounded-tl-none p-4 max-w-xl text-sm leading-relaxed shadow-sm">
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  {language === 'hi' ? `प्रश्न ${currentQuestion.index + 1}` : `Question ${currentQuestion.index + 1}`}
                </span>
                <TextToSpeechPlayer text={currentQuestion.prompt} />
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-100 text-base">
                {currentQuestion.prompt}
              </p>

              {/* Quick Reply Pills */}
              {currentQuestion.quickReplies && currentQuestion.quickReplies.length > 0 && (
                <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-800/60">
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    {t.assessment.quickOptions}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQuestion.quickReplies.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => handleQuickReply(reply)}
                        className="px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-amber-500 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/50 shadow-sm transition active:scale-95"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="flex items-center gap-3 pl-11">
            <div className="flex gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t.assessment.processingAnswer}
            </span>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            id="assessment-text-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.assessment.typePlaceholder}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow transition"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.assessment.sendBtn}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssessmentChat;
