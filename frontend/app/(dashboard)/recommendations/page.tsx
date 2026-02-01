'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import { recommendationsAPI, RecommendationWithDetails } from '@/lib/api/recommendations';
import { formatCurrency, getDurationText, getRankingInfo } from '@/lib/api/programs';
import { getDimensionColor } from '@/lib/api/riasec';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function RecommendationsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [recommendations, setRecommendations] = useState<RecommendationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Recommendations
  // ========================================

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await recommendationsAPI.getAll();
        setRecommendations(data);

        // If no recommendations exist and profile is sufficiently complete, auto-generate
        if (data.length === 0 && (user.student_profile?.completion_percentage ?? 0) >= 50) {
          console.log('No recommendations found, auto-generating...');
          try {
            const generated = await recommendationsAPI.generate();
            setRecommendations(generated);
          } catch (genErr: any) {
            console.error('Auto-generation failed:', genErr);
            // Don't show error, just leave empty - user can click generate button
          }
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load recommendations:', err);

        // If no recommendations exist, try to auto-generate if profile is complete enough
        if (err.response?.status === 404 && (user.student_profile?.completion_percentage ?? 0) >= 50) {
          try {
            console.log('No recommendations found, auto-generating...');
            const generated = await recommendationsAPI.generate();
            setRecommendations(generated);
            setIsLoading(false);
            return;
          } catch (genErr: any) {
            console.error('Auto-generation failed:', genErr);
            // Fall through to show empty state
          }
        }

        if (err.response?.status === 404) {
          setRecommendations([]);
        } else {
          setError('Impossible de charger les recommandations');
        }

        setIsLoading(false);
      }
    };

    if (user) {
      loadRecommendations();
    }
  }, [user]);

  // ========================================
  // Handlers
  // ========================================

  const handleGenerate = async () => {
    console.log('🔄 handleGenerate called - starting generation...');
    setIsGenerating(true);
    setError(null);

    try {
      console.log('📡 Calling API to generate recommendations...');
      const data = await recommendationsAPI.generate();
      console.log('✅ Recommendations generated successfully:', data.length, 'programs');
      setRecommendations(data);
      setIsGenerating(false);
    } catch (err: any) {
      console.error('❌ Failed to generate recommendations:', err);
      console.error('Error details:', err.response?.data);
      setError(
        err.response?.data?.detail ||
          'Erreur lors de la génération des recommandations'
      );
      setIsGenerating(false);
    }
  };

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-flex">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Chargement des recommandations...</p>
        </div>
      </div>
    );
  }

  const profile = user?.student_profile;
  const completionPercentage = profile?.completion_percentage || 0;

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>

        {/* Modern Page Header with Icon */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-800 to-gray-900 bg-clip-text text-transparent mb-3">
            Mes Recommandations
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Programmes personnalisés basés sur votre profil RIASEC, vos notes et vos valeurs
          </p>
        </div>

        {/* Modern Error Message */}
        {error && (
          <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-start gap-3 p-5">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-red-800 font-bold mb-1">Erreur</h4>
                <p className="text-red-700">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="flex-shrink-0 text-red-600 hover:text-red-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Modern Profile Incomplete Warning */}
        {completionPercentage < 50 && (
          <div className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50/50 border-l-4 border-yellow-500 rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-yellow-900 mb-2 text-lg">
                    Profil incomplet - {completionPercentage}%
                  </h3>
                  <div className="w-full bg-yellow-200 rounded-full h-2 mb-3">
                    <div className="bg-yellow-600 h-2 rounded-full transition-all duration-300" style={{ width: `${completionPercentage}%` }}></div>
                  </div>
                  <p className="text-sm text-yellow-800 mb-4 leading-relaxed">
                    Pour obtenir des recommandations plus précises, veuillez compléter votre profil,
                    ajouter vos notes académiques et passer le test RIASEC.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/profile" className="btn btn-primary text-sm hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Compléter mon profil
                    </Link>
                    <Link href="/test-riasec" className="btn btn-outline text-sm hover:scale-105 transition-transform">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Passer le test RIASEC
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modern No Recommendations */}
        {recommendations.length === 0 && !isLoading ? (
          <div className="text-center py-16">
            <div className="card max-w-lg mx-auto p-12 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Aucune recommandation pour le moment
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                Générez vos recommandations personnalisées en fonction de votre profil,
                vos notes et votre test RIASEC.
              </p>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-primary px-8 py-3 text-base hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Générer mes recommandations
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modern Action Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 p-5 bg-gradient-to-r from-white to-gray-50/50 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <span className="text-primary-700 font-bold text-lg">{recommendations.length}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {recommendations.length} programme{recommendations.length > 1 ? 's' : ''} recommandé{recommendations.length > 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500">Basé sur votre profil</p>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn btn-outline text-sm hover:scale-105 transition-transform disabled:opacity-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {isGenerating ? 'Génération...' : 'Actualiser'}
              </button>
            </div>

            {/* Recommendations List */}
            <div className="space-y-6">
              {recommendations.map((rec) => {
                const program = rec.program;
                const rankingInfo = getRankingInfo(rec.compatibility_score);

                return (
                  <div
                    key={rec.id}
                    className="group card hover:shadow-2xl transition-all duration-300 border-l-4 bg-gradient-to-br from-white to-gray-50/30 overflow-hidden"
                    style={{ borderLeftColor: rankingInfo.color }}
                  >
                    {/* Gradient Top Bar */}
                    <div className="h-1 bg-gradient-to-r from-primary-400 via-primary-500 to-primary-600"></div>

                    <div className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Modern Score Badge */}
                        <div className="flex-shrink-0">
                          <div
                            className="w-28 h-28 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: rankingInfo.color }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                            <span className="text-4xl font-bold relative z-10">
                              {rec.compatibility_score}
                            </span>
                            <span className="text-xs opacity-90 relative z-10">/ 100</span>
                          </div>
                          <div className="text-center mt-3">
                            <span className="text-3xl">{rankingInfo.icon}</span>
                          </div>
                        </div>

                        {/* Program Info */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span
                              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                              style={{
                                backgroundColor: getDimensionColor(program.riasec_primary),
                              }}
                            >
                              {program.riasec_primary}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-mono">
                              {program.code}
                            </span>
                            <span
                              className="px-3 py-1.5 text-xs font-bold rounded-lg shadow-sm"
                              style={{
                                backgroundColor: `${rankingInfo.color}20`,
                                color: rankingInfo.color,
                              }}
                            >
                              {rankingInfo.label}
                            </span>
                          </div>

                          {/* University and Department Header */}
                          <div className="mb-3 pb-3 border-b-2 border-emerald-200">
                            <div className="flex items-center gap-2 mb-2">
                              <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                              </svg>
                              <span className="text-lg font-extrabold text-emerald-700 uppercase tracking-wide">{program.university}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold text-primary-700">{program.department}</span>
                            </div>
                          </div>

                          {/* Academic Path - Show Licence + Master as complete journey */}
                          {program.master_program ? (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                                </svg>
                                <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wide">Parcours Complet : Bac+3 → Bac+5</h4>
                              </div>

                              {/* Licence Card */}
                              <div className="mb-3 p-4 bg-blue-100 border-2 border-blue-400 rounded-lg shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">LICENCE</span>
                                  <span className="text-xs text-gray-600">Bac +{program.duration_years}</span>
                                </div>
                                <Link
                                  href={`/programs/${program.id}`}
                                  className="block group/link"
                                >
                                  <h3 className="text-lg font-bold text-gray-900 group-hover/link:text-primary-600 transition-colors">
                                    {program.name}
                                  </h3>
                                </Link>
                                <p className="text-xs text-gray-600 mt-1">
                                  Diplôme de base • Possibilité d'arrêter après {program.duration_years} ans
                                </p>
                              </div>

                              {/* Arrow */}
                              <div className="flex justify-center my-2">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                </svg>
                              </div>

                              {/* Master Card */}
                              <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-lg shadow-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="px-2 py-1 bg-white text-indigo-700 text-xs font-bold rounded">MASTER</span>
                                  <span className="text-xs text-indigo-100">+{program.master_program.duration_years} ans (Bac +5)</span>
                                </div>
                                <h3 className="text-lg font-bold">
                                  {program.master_program.name}
                                </h3>
                                <p className="text-xs text-indigo-100 mt-1">
                                  ✓ Poursuite optionnelle • Spécialisation avancée
                                </p>
                              </div>

                              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
                                <strong>💡 Flexibilité :</strong> Obtenez votre Licence en {program.duration_years} ans et décidez ensuite si vous voulez continuer {program.master_program.duration_years} ans de plus pour le Master.
                              </div>
                            </div>
                          ) : (
                            <Link
                              href={`/programs/${program.id}`}
                              className="block group/link mb-3"
                            >
                              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover/link:text-primary-600 transition-colors leading-tight">
                                {program.name}
                              </h3>
                            </Link>
                          )}

                          <p className="text-sm text-gray-600 mb-4 flex items-center flex-wrap gap-2">
                            <span className="font-medium">{program.level}</span>
                            <span className="text-gray-400">•</span>
                            <span>{program.domain}</span>
                            <span className="text-gray-400">•</span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              {program.university}
                            </span>
                          </p>

                          <p className="text-gray-700 mb-5 line-clamp-2 leading-relaxed">
                            {program.description}
                          </p>

                          {/* Modern Quick Info */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
                            <div className="flex items-center gap-2.5 text-gray-700 bg-blue-50 rounded-lg p-2.5">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-sm font-medium">{getDurationText(program.duration_years)}</span>
                            </div>

                            {program.tuition_fee_fcfa && (
                              <div className="flex items-center gap-2.5 text-gray-700 bg-amber-50 rounded-lg p-2.5">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-sm font-bold">{formatCurrency(program.tuition_fee_fcfa)}</span>
                              </div>
                            )}

                            {program.employment_rate && (
                              <div className="flex items-center gap-2.5 text-gray-700 bg-green-50 rounded-lg p-2.5">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold">{program.employment_rate}%</span>
                              </div>
                            )}
                          </div>

                          {/* Modern Strengths & Weaknesses */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5 border-t border-gray-200">
                            {rec.strengths.length > 0 && (
                              <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <h4 className="text-sm font-bold text-green-900">
                                    Points forts
                                  </h4>
                                </div>
                                <ul className="space-y-2">
                                  {rec.strengths.slice(0, 3).map((strength, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-700 flex items-start gap-2 leading-relaxed"
                                    >
                                      <span className="text-green-600 font-bold mt-0.5">✓</span>
                                      <span>{strength}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {rec.weaknesses.length > 0 && (
                              <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-100">
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <h4 className="text-sm font-bold text-orange-900">
                                    À considérer
                                  </h4>
                                </div>
                                <ul className="space-y-2">
                                  {rec.weaknesses.slice(0, 3).map((weakness, index) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-700 flex items-start gap-2 leading-relaxed"
                                    >
                                      <span className="text-orange-600 font-bold mt-0.5">!</span>
                                      <span>{weakness}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Info Box */}
        <div className="card bg-blue-50 border-blue-200 mt-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                Comment sont calculées les recommandations ?
              </h4>
              <p className="text-sm text-blue-800">
                Les recommandations sont basées sur une combinaison de 5 critères : votre profil
                RIASEC (30%), vos notes académiques (25%), vos valeurs professionnelles (20%),
                le taux d'emploi du programme (15%) et votre situation financière (10%).
                Plus votre profil est complet, plus les recommandations sont précises.
              </p>
            </div>
          </div>
        </div>
      </main>
      <UBertouaFooter />
    </div>
  );
}
