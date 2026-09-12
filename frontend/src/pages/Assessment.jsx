import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import assessmentService from '../services/assessmentService';
import ProgressBar from '../components/Chat/ProgressBar';
import AssessmentChat from '../components/Chat/AssessmentChat';
import VoiceControls from '../components/VoiceAssistant/VoiceControls';
import { RotateCcw, Globe, Sparkles, CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';

export function Assessment() {
  const { language, toggleLanguage, t, speakText } = useLanguage();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(11);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [activeSpeechDraft, setActiveSpeechDraft] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Initialize or fetch current session on load / language change
  useEffect(() => {
    async function initSession() {
      try {
        const res = await assessmentService.startAssessment(false, language);
        if (res.success) {
          setCurrentStep(res.currentIndex || 0);
          setTotalSteps(res.totalQuestions || 11);
          if (res.question) {
            setCurrentQuestion(res.question);
            // Auto voice readout of initial question
            speakText(res.question.prompt);
          } else if (res.status === 'completed') {
            setIsComplete(true);
          }
        }
      } catch (err) {
        console.error('Failed to start assessment session:', err);
      } finally {
        setLoadingInitial(false);
      }
    }
    initSession();
  }, [language]);

  // Handle incoming speech from Web Speech API
  const handleSpeechResult = (transcript, isFinal) => {
    setActiveSpeechDraft(transcript);
    if (isFinal && transcript.trim().length > 0) {
      handleAnswerSubmit(transcript.trim());
      setActiveSpeechDraft('');
      setIsListening(false);
    }
  };

  // Submit answer to backend and get next question
  const handleAnswerSubmit = async (answerText) => {
    if (!answerText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const prevQ = currentQuestion;

    try {
      const res = await assessmentService.submitAnswer(currentStep, answerText, null, language);
      if (res.success) {
        // Record in conversation history
        setConversationHistory((prev) => [
          ...prev,
          {
            questionPrompt: prevQ?.prompt || '',
            userAnswer: answerText,
            acknowledgement: res.acknowledgement || '',
          },
        ]);

        if (res.isComplete) {
          setIsComplete(true);
          setCurrentQuestion(null);
          // Speak completion
          const completeMsg = language === 'hi'
            ? 'आपकी आजीविका प्रोफ़ाइल तैयार है! आइए आपके लिए सर्वोत्तम अवसर देखें।'
            : 'Your livelihood profile is ready. Let us find the best opportunities for you.';
          speakText(completeMsg);
        } else {
          setCurrentStep(res.currentIndex);
          setCurrentQuestion(res.nextQuestion);
          if (res.nextQuestion?.prompt) {
            speakText(res.nextQuestion.prompt);
          }
        }
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = async () => {
    setLoadingInitial(true);
    try {
      const res = await assessmentService.startAssessment(true, language);
      if (res.success) {
        setConversationHistory([]);
        setIsComplete(false);
        setCurrentStep(0);
        setCurrentQuestion(res.question);
        if (res.question?.prompt) {
          speakText(res.question.prompt);
        }
      }
    } catch (err) {
      console.error('Failed to restart assessment:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            {language === 'hi' ? 'AI वॉयस सहायक लोड हो रहा है...' : 'Initializing JeevanVani AI Counselor...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {t.assessment.title}
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {t.assessment.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-xs font-bold text-amber-950 dark:text-amber-200 transition shadow-sm"
              title="Toggle Hindi / English"
            >
              <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>{language === 'hi' ? 'भाषा: हिंदी' : 'Language: English'}</span>
            </button>

            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition"
              title="Restart from Question 1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">{t.assessment.restartBtn}</span>
            </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {/* Completion Card */}
        {isComplete ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fadeIn">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-50 dark:ring-emerald-900/30">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {t.assessment.readyTitle}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.assessment.readyDesc}
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="view-dashboard-btn"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/30 transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>{language === 'hi' ? 'डैशबोर्ड देखें' : 'View Dashboard'}</span>
              </button>

              <button
                id="view-recommendations-btn"
                onClick={() => navigate('/recommendations')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl text-base font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 shadow transition transform hover:-translate-y-0.5 active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{t.assessment.viewRecsBtn}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleRestart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.assessment.retakeAssessment}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Active Conversational Assessment Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Chat stream */}
            <div className="lg:col-span-8 h-[580px] sm:h-[620px]">
              <AssessmentChat
                currentQuestion={currentQuestion}
                conversationHistory={conversationHistory}
                onAnswerSubmit={handleAnswerSubmit}
                isSubmitting={isSubmitting}
                activeSpeechDraft={activeSpeechDraft}
              />
            </div>

            {/* Right: Voice Controller & Guidance */}
            <div className="lg:col-span-4 space-y-4">
              {/* Voice Card */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
                  {t.assessment.voiceInputCenter}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
                  {t.assessment.voiceHint}
                </p>

                <VoiceControls
                  onSpeechResult={handleSpeechResult}
                  isListening={isListening}
                  setIsListening={setIsListening}
                />
              </div>

              {/* Helpful Tips Card */}
              <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 dark:from-amber-950/30 dark:to-orange-950/20 rounded-2xl p-5 border border-amber-200/60 dark:border-amber-800/50 text-xs text-slate-700 dark:text-slate-300 space-y-2.5">
                <p className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5 uppercase tracking-wide">
                  <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>{t.assessment.tipsHeading}</span>
                </p>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 pl-4 list-disc">
                  <li>{t.assessment.tip1}</li>
                  <li>{t.assessment.tip2}</li>
                  <li>{t.assessment.tip3}</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Assessment;
