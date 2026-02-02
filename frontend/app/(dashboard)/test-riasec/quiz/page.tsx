'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import {
  riasecAPI,
  RiasecQuestion,
  RiasecDimension,
  RiasecTestAnswers,
  ANSWER_SCALE,
  getDimensionColor,
} from '@/lib/api/riasec';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function RiasecQuizPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [questions, setQuestions] = useState<RiasecQuestion[]>([]);
  const [dimensions, setDimensions] = useState<RiasecDimension[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<RiasecTestAnswers>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [savedProgress, setSavedProgress] = useState<{ answers: RiasecTestAnswers; currentIndex: number } | null>(null);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Questions
  // ========================================

  useEffect(() => {
    const loadQuestions = async () => {
      if (!user) return;

      try {
        const data = await riasecAPI.getQuestions();
        setQuestions(data.questions.sort((a, b) => a.question_number - b.question_number));
        setDimensions(data.dimensions);

        // Check for saved progress on server
        try {
          const draft = await riasecAPI.getDraft();
          const answeredCount = Object.keys(draft.answers || {}).length;
          if (answeredCount > 0) {
            setSavedProgress({
              answers: draft.answers,
              currentIndex: draft.current_question_index,
            });
            setShowRestoreDialog(true);
          }
        } catch (err: any) {
          // No saved progress found - that's ok
          console.log('No saved progress on server');
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load questions:', err);
        setError('Impossible de charger les questions du test');
        setIsLoading(false);
      }
    };

    if (user) {
      loadQuestions();
    }
  }, [user]);

  // ========================================
  // Auto-save Progress to Server
  // ========================================

  useEffect(() => {
    if (Object.keys(answers).length > 0 && user) {
      // Debounce save to avoid too many API calls
      const timer = setTimeout(async () => {
        try {
          await riasecAPI.saveDraft({
            answers,
            current_question_index: currentIndex,
          });
          console.log('Progress saved to server');
        } catch (err) {
          console.error('Failed to save progress:', err);
        }
      }, 1000); // Save 1 second after last change

      return () => clearTimeout(timer);
    }
  }, [answers, currentIndex, user]);

  // ========================================
  // Handlers
  // ========================================

  const handleRestoreProgress = () => {
    if (savedProgress) {
      setAnswers(savedProgress.answers);
      setCurrentIndex(savedProgress.currentIndex);
      setShowRestoreDialog(false);
    }
  };

  const handleStartFresh = async () => {
    try {
      await riasecAPI.deleteDraft();
    } catch (err) {
      console.log('No draft to delete or error deleting:', err);
    }
    setSavedProgress(null);
    setShowRestoreDialog(false);
    setAnswers({});
    setCurrentIndex(0);
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredCount = questions.filter((q) => !(q.id in answers)).length;

    if (unansweredCount > 0) {
      setError(
        `Veuillez répondre à toutes les questions (${unansweredCount} restante${
          unansweredCount > 1 ? 's' : ''
        })`
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Transform answers from object to array format expected by backend
      const answersArray = questions.map((q) => ({
        question_number: q.question_number,
        answer: answers[q.id],
      }));

      await riasecAPI.submitTest({ answers: answersArray });

      // Draft is automatically deleted by backend on successful submission

      // Redirect to results page
      router.push('/test-riasec/results');
    } catch (err: any) {
      console.error('Failed to submit test:', err);
      setError(
        err.response?.data?.detail || 'Erreur lors de la soumission du test'
      );
      setIsSubmitting(false);
    }
  };

  // ========================================
  // Calculate Progress
  // ========================================

  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIndex];
  const currentDimension = dimensions.find(
    (d) => d.id === currentQuestion?.dimension_id
  );

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Aucune question disponible</p>
          <Link href="/test-riasec" className="btn btn-primary">
            Retour
          </Link>
        </div>
      </div>
    );
  }

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo-ubertoua-alt.png"
                  alt="Université de Bertoua"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </a>

              {/* Divider */}
              <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              {/* OrientUniv Branding */}
              <Link href="/" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">
                    OrientUniv
                  </span>
                  <span className="hidden lg:inline-block px-2 py-0.5 bg-ubertoua-blue/10 text-ubertoua-blue text-xs font-semibold rounded-full border border-ubertoua-blue/20">
                    UBertoua
                  </span>
                </div>
                <span className="hidden sm:block text-xs text-gray-600 font-medium">
                  Université de Bertoua
                </span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (confirm('Êtes-vous sûr de vouloir recommencer le test ? Toutes vos réponses seront perdues.')) {
                    handleStartFresh();
                  }
                }}
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-orange-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Recommencer
              </button>

              <Link
                href="/test-riasec"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Abandonner
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Restore Progress Dialog */}
      {showRestoreDialog && savedProgress && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Test en cours détecté
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Vous avez déjà répondu à{' '}
                  <strong className="text-primary-600">
                    {Object.keys(savedProgress.answers).length} question{Object.keys(savedProgress.answers).length > 1 ? 's' : ''}
                  </strong>{' '}
                  sur {questions.length}. Voulez-vous continuer où vous en étiez ?
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleRestoreProgress}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Continuer mon test
              </button>

              <button
                onClick={handleStartFresh}
                className="w-full inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Recommencer à zéro
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              Vos réponses sont automatiquement sauvegardées pendant que vous répondez
            </p>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 border-b border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">{currentIndex + 1}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Question {currentIndex + 1} sur {questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-gray-700">
                {answeredCount}/{questions.length} réponses
              </span>
            </div>
          </div>
          <div className="w-full bg-white rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-3xl mx-auto">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100 max-w-3xl mx-auto">
          {/* Dimension Badge */}
          {currentDimension && (
            <div className="mb-8">
              <div
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-lg"
                style={{ backgroundColor: getDimensionColor(currentDimension.code) }}
              >
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <span className="font-bold text-lg">{currentDimension.code}</span>
                </div>
                <span className="text-base">{currentDimension.name}</span>
              </div>
            </div>
          )}

          {/* Question Text */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {currentQuestion.text}
                </h2>
                <p className="text-base text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  {currentDimension && currentDimension.code === 'R' && "Dans quelle mesure seriez-vous attiré par ce type de travail manuel ou technique ?"}
                  {currentDimension && currentDimension.code === 'I' && "Quel est votre niveau d'intérêt pour ce domaine de recherche ou d'analyse ?"}
                  {currentDimension && currentDimension.code === 'A' && "À quel point vous sentez-vous attiré par cette activité créative ?"}
                  {currentDimension && currentDimension.code === 'S' && "Dans quelle mesure aimeriez-vous aider les autres de cette manière ?"}
                  {currentDimension && currentDimension.code === 'E' && "Quel est votre niveau d'intérêt pour cette activité entrepreneuriale ou de leadership ?"}
                  {currentDimension && currentDimension.code === 'C' && "À quel point seriez-vous à l'aise avec ce type de travail organisé ?"}
                </p>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-10">
            {ANSWER_SCALE.map((option) => {
              const isSelected = answers[currentQuestion.id] === option.value;

              return (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  className={`w-full p-5 rounded-xl border-2 transition-all text-left transform hover:scale-[1.02] ${
                    isSelected
                      ? 'border-primary-600 bg-gradient-to-r from-primary-50 to-purple-50 shadow-lg'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-3xl ${
                        isSelected ? 'bg-white shadow-md' : 'bg-gray-50'
                      }`}>
                        {option.emoji}
                      </div>
                      <div>
                        <div className={`font-semibold text-lg ${
                          isSelected ? 'text-primary-700' : 'text-gray-900'
                        }`}>
                          {option.label}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Note : {option.value}/5
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transform hover:scale-105 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Précédent
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                disabled={!(currentQuestion.id in answers)}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1"
              >
                Suivant
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || answeredCount < questions.length}
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transform hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-1"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Calcul des résultats...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Terminer le test
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Quick Jump (Desktop only) */}
        <div className="hidden md:block mt-10 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-gray-900">Navigation rapide</h3>
            </div>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((q, index) => {
                const isAnswered = q.id in answers;
                const isCurrent = index === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-12 h-12 rounded-lg text-sm font-bold transition-all transform hover:scale-110 ${
                      isCurrent
                        ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg'
                        : isAnswered
                        ? 'bg-gradient-to-br from-green-100 to-green-200 text-green-700 hover:from-green-200 hover:to-green-300'
                        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                    }`}
                    title={`Question ${index + 1}${isAnswered ? ' (répondue)' : ''}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      <UBertouaFooter />
    </div>
  );
}
