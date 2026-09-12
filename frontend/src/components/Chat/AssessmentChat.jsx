import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, CheckCircle, Edit3, Volume2, FastForward } from 'lucide-react';
import TextToSpeechPlayer from '../VoiceAssistant/TextToSpeechPlayer';
import { useLanguage } from '../../context/LanguageContext';

export function AssessmentChat({
  currentQuestion = null,
  conversationHistory = [],
  onAnswerSubmit,
  isSubmitting = false,
  activeSpeechDraft = '',
  pendingConfirmation = null,
  onConfirmAnswer,
  onChangeAnswer,
  onRepeatQuestion,
  onSkipQuestion,
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

  // Scroll to bottom smoothly whenever questions, history, or confirmation update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, currentQuestion, isSubmitting, pendingConfirmation]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = inputText.trim();
    if (!clean || isSubmitting) return;

    onAnswerSubmit(clean);
    setInputText('');
  };

  const handleQuickReply = (text) => {
    if (isSubmitting) return;
    setInputText('');
    onAnswerSubmit(text);
  };

  const isConstraintQuestion =
    currentQuestion?.id === 'constraints' ||
    currentQuestion?.field === 'constraints' ||
    currentQuestion?.index === 13;

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
        {currentQuestion && !pendingConfirmation && (
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
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {t.assessment?.quickOptions || 'Quick Options:'}
                    </p>
                    {isConstraintQuestion && (
                      <button
                        type="button"
                        onClick={onSkipQuestion}
                        className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'छोड़ें (वैकल्पिक)' : 'Skip (Optional)'}</span>
                      </button>
                    )}
                  </div>
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

              {/* If no quick replies but constraint question, show skip option directly */}
              {isConstraintQuestion && (!currentQuestion.quickReplies || currentQuestion.quickReplies.length === 0) && (
                <div className="mt-3 pt-2">
                  <button
                    type="button"
                    onClick={onSkipQuestion}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:text-amber-800 font-semibold flex items-center gap-1 hover:underline"
                  >
                    <FastForward className="w-3.5 h-3.5" />
                    <span>{language === 'hi' ? 'छोड़ें (वैकल्पिक)' : 'Skip this question (Optional)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Visual & Verbal Confirmation Step */}
        {pendingConfirmation && (
          <div className="flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="bg-white dark:bg-slate-800 border-2 border-emerald-400 dark:border-emerald-600/80 rounded-2xl rounded-tl-none p-4 max-w-xl text-sm shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {t.assessment?.confirmTitle || 'Did I understand that correctly?'}
                </span>
                <button
                  type="button"
                  onClick={onRepeatQuestion}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white flex items-center gap-1 transition"
                  title="Repeat Question"
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.assessment?.repeatQuestion || 'Repeat Question'}</span>
                </button>
              </div>

              <div className="p-3 bg-amber-50/70 dark:bg-slate-900/90 rounded-xl border border-amber-200/80 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100 text-base shadow-inner">
                "{pendingConfirmation.answer}"
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {language === 'hi'
                  ? 'पुष्टि करने के लिए "हाँ" बोलें या नीचे बटन दबाएं।'
                  : 'Say "Yes" or click to confirm. Click "Change" to edit.'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  id="confirm-answer-btn"
                  onClick={() => onConfirmAnswer(pendingConfirmation.answer)}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>{t.assessment?.confirmYes || 'Yes, Correct'}</span>
                </button>

                <button
                  type="button"
                  id="change-answer-btn"
                  onClick={onChangeAnswer}
                  disabled={isSubmitting}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition active:scale-95"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{t.assessment?.confirmChange || 'Change Answer'}</span>
                </button>

                <button
                  type="button"
                  onClick={onRepeatQuestion}
                  className="px-3 py-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-medium text-xs flex items-center gap-1 transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{t.assessment?.repeatQuestion || 'Repeat'}</span>
                </button>
              </div>
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
              {t.assessment?.processingAnswer || 'AI is processing your answer...'}
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
            placeholder={t.assessment?.typePlaceholder || 'Or type your answer here...'}
            disabled={isSubmitting || !!pendingConfirmation}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner disabled:opacity-60"
          />

          {isConstraintQuestion && (
            <button
              type="button"
              onClick={onSkipQuestion}
              disabled={isSubmitting}
              className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1 transition shadow-sm"
              title="Skip this question"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'hi' ? 'छोड़ें' : 'Skip'}</span>
            </button>
          )}

          <button
            type="submit"
            disabled={!inputText.trim() || isSubmitting || !!pendingConfirmation}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 shadow transition"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">{t.assessment?.sendBtn || 'Submit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssessmentChat;

