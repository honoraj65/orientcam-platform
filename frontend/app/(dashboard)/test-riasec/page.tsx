'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { riasecAPI, RiasecTestResult, RIASEC_DIMENSIONS } from '@/lib/api/riasec';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function TestRiasecPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [latestResult, setLatestResult] = useState<RiasecTestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Latest Result
  // ========================================

  useEffect(() => {
    const loadLatestResult = async () => {
      if (!user) return;

      try {
        const result = await riasecAPI.getLatestResult();
        setLatestResult(result);
      } catch (err: any) {
        // No result yet - that's ok
        console.log('No previous test result');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadLatestResult();
    }
  }, [user]);

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
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

              {/* OrientCam Branding */}
              <Link href="/" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">
                    OrientCam
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

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau de bord
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="inline-block mx-auto mb-8 hover:scale-105 transition-transform">
            <img
              src="/images/logo-ubertoua-alt.png"
              alt="Université de Bertoua"
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </a>

          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Test d'Orientation <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">RIASEC</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez vos intérêts professionnels et les carrières qui vous correspondent le mieux grâce à ce test scientifique reconnu mondialement
          </p>
        </div>

        {/* Previous Result Alert */}
        {latestResult && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Vous avez déjà passé le test !
                  </h3>
                  <p className="text-base text-gray-700 mb-4">
                    Votre code Holland : <strong className="text-green-700">{latestResult.holland_code}</strong>
                    <br />
                    <span className="text-sm text-gray-600">
                      Date : {new Date(latestResult.completed_at).toLocaleDateString('fr-FR')}
                    </span>
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/test-riasec/results"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Voir mes résultats
                    </Link>
                    <button
                      onClick={() => router.push('/test-riasec/quiz')}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:border-primary-500 hover:bg-gray-50 transition-all shadow-sm hover:shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Repasser le test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* What is RIASEC */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 px-6 sm:px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Qu'est-ce que le test RIASEC ?
              </h3>
            </div>
          </div>
          <div className="px-6 sm:px-8 py-6">
            <p className="text-gray-700 mb-4 leading-relaxed">
              Le test RIASEC (ou code Holland) est un outil d'orientation professionnelle reconnu mondialement.
              Il identifie vos intérêts dominants parmi 6 grandes catégories de personnalités professionnelles.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Développé par le psychologue John Holland, ce test vous aide à mieux comprendre vos préférences
              et à choisir une carrière alignée avec votre personnalité.
            </p>
          </div>
        </div>

        {/* 6 RIASEC Dimensions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">
              Les 6 Dimensions <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">RIASEC</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Découvrez les six types de personnalités professionnelles selon la théorie de Holland
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(RIASEC_DIMENSIONS).map((dimension) => (
              <div
                key={dimension.code}
                className="bg-white rounded-2xl shadow-lg border-2 hover:shadow-2xl transition-all transform hover:scale-105 overflow-hidden"
                style={{ borderColor: dimension.color }}
              >
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-2xl shadow-lg"
                      style={{ backgroundColor: dimension.color }}
                    >
                      {dimension.code}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-lg text-gray-900">{dimension.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{dimension.fullName}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4 leading-relaxed">{dimension.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dimension.traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1.5 bg-gray-50 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Exemples de métiers :
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1.5">
                      {dimension.careers.slice(0, 3).map((career) => (
                        <li key={career} className="flex items-start gap-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{career}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How it Works */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 sm:px-8 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Comment ça fonctionne ?
              </h3>
            </div>
          </div>

          <div className="px-6 sm:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-3xl">1</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Répondez aux questions</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  30 questions simples sur vos préférences et intérêts professionnels
                </p>
              </div>

              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-3xl">2</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Obtenez votre code</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Nous calculons vos scores pour chaque dimension et générons votre code Holland
                </p>
              </div>

              <div className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl transform hover:scale-110 transition-transform">
                    <span className="text-white font-bold text-3xl">3</span>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <h4 className="font-bold text-lg text-gray-900 mb-2">Découvrez vos carrières</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Consultez les métiers et programmes qui correspondent à votre profil
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-lg mb-10">
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-bold text-blue-900 mb-4">Informations pratiques</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-blue-800">
                    <span className="text-2xl">⏱️</span>
                    <div>
                      <strong className="font-semibold">Durée :</strong>
                      <span className="ml-2">Environ 10 minutes</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-blue-800">
                    <span className="text-2xl">📝</span>
                    <div>
                      <strong className="font-semibold">Questions :</strong>
                      <span className="ml-2">30 questions (5 par dimension)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-blue-800">
                    <span className="text-2xl">📊</span>
                    <div>
                      <strong className="font-semibold">Échelle :</strong>
                      <span className="ml-2">De 1 (pas du tout) à 5 (énormément)</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 text-blue-800">
                    <span className="text-2xl">✅</span>
                    <div>
                      <strong className="font-semibold">Conseil :</strong>
                      <span className="ml-2">Répondez spontanément, il n'y a pas de bonne ou mauvaise réponse</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/test-riasec/quiz"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white text-lg font-bold rounded-2xl hover:from-primary-700 hover:via-purple-700 hover:to-pink-700 transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            {latestResult ? 'Repasser le test' : 'Commencer le test'}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="mt-6 text-base text-gray-600 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Vos réponses sont enregistrées et confidentielles
          </p>
        </div>
      </main>
      <UBertouaFooter />
    </div>
  );
}
