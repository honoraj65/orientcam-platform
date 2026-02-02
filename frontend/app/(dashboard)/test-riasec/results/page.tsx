'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import {
  riasecAPI,
  RiasecTestResult,
  CareersByCode,
  parseHollandCode,
  getDimensionColor,
  RIASEC_DIMENSIONS,
} from '@/lib/api/riasec';
import { recommendationsAPI, RecommendationWithDetails } from '@/lib/api/recommendations';
import { getRankingInfo } from '@/lib/api/programs';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function RiasecResultsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [result, setResult] = useState<RiasecTestResult | null>(null);
  const [careers, setCareers] = useState<CareersByCode[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Result
  // ========================================

  useEffect(() => {
    const loadResult = async () => {
      if (!user) return;

      try {
        const data = await riasecAPI.getLatestResult();
        console.log('Raw RIASEC result data:', data);

        // Transform scores object to array if needed
        let transformedData = data;
        if (data.scores && !Array.isArray(data.scores)) {
          // Backend returns scores as percentages (0-100), no need to recalculate
          const scoresObj = data.scores as any;
          const scoresArray = [
            { dimension_code: 'R', dimension_name: 'Réaliste', score: scoresObj.realistic, percentage: scoresObj.realistic },
            { dimension_code: 'I', dimension_name: 'Investigateur', score: scoresObj.investigative, percentage: scoresObj.investigative },
            { dimension_code: 'A', dimension_name: 'Artistique', score: scoresObj.artistic, percentage: scoresObj.artistic },
            { dimension_code: 'S', dimension_name: 'Social', score: scoresObj.social, percentage: scoresObj.social },
            { dimension_code: 'E', dimension_name: 'Entreprenant', score: scoresObj.enterprising, percentage: scoresObj.enterprising },
            { dimension_code: 'C', dimension_name: 'Conventionnel', score: scoresObj.conventional, percentage: scoresObj.conventional },
          ];
          // Sort by score descending
          scoresArray.sort((a, b) => b.score - a.score);
          transformedData = { ...data, scores: scoresArray } as RiasecTestResult;
        }

        setResult(transformedData);

        // Load careers for each code in Holland Code
        const codes = transformedData.holland_code.split('');
        const careersPromises = codes.map((code) =>
          riasecAPI.getCareersByCode(code)
        );
        const careersData = await Promise.all(careersPromises);
        setCareers(careersData);

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load result:', err);
        setError('Aucun résultat trouvé. Veuillez passer le test.');
        setIsLoading(false);
      }
    };

    if (user) {
      loadResult();
    }
  }, [user]);

  // ========================================
  // Load Recommendations
  // ========================================

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user) return;

      try {
        const data = await recommendationsAPI.getAll();
        // Filter to keep only "à considérer" and better (score >= 50)
        const filtered = data.filter(rec => rec.compatibility_score >= 50);
        setRecommendations(filtered);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
        // Don't show error, just leave empty
      }
    };

    if (user) {
      loadRecommendations();
    }
  }, [user]);

  // ========================================
  // Download PDF Handler
  // ========================================

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Utiliser le client API au lieu de fetch hardcodé
      const blob = await riasecAPI.downloadPDF();

      // Créer un URL pour le blob
      const url = window.URL.createObjectURL(blob);

      // Créer un lien temporaire et déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.download = `RIASEC_${user?.student_profile?.first_name}_${user?.student_profile?.last_name}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();

      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      alert('Impossible de télécharger le PDF. Veuillez réessayer.');
    } finally {
      setIsDownloading(false);
    }
  };

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des résultats...</p>
        </div>
      </div>
    );
  }

  if (error || !result || !Array.isArray(result.scores)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erreur de chargement des résultats'}</p>
          <Link href="/test-riasec" className="btn btn-primary">
            Passer le test
          </Link>
        </div>
      </div>
    );
  }

  const hollandDimensions = parseHollandCode(result.holland_code);
  const topScore = result.scores[0];

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

            <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour au tableau de bord
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Félicitations !
          </h2>
          <p className="text-lg text-gray-600">
            Vous avez terminé le test RIASEC
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complété le {new Date(result.completed_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>

          {/* Bouton de téléchargement PDF */}
          <div className="mt-6">
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Téléchargement...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Télécharger en PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Holland Code */}
        <div className="card mb-8 text-center bg-gradient-to-br from-primary-50 to-purple-50 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Votre Code Holland
          </h3>
          <div className="flex justify-center items-center gap-2 mb-4">
            {result.holland_code.split('').filter(c => c.trim()).map((code, index) => {
              const dimension = RIASEC_DIMENSIONS[code as keyof typeof RIASEC_DIMENSIONS];
              return (
                <div
                  key={index}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex flex-col items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: getDimensionColor(code) }}
                >
                  <span className="text-2xl sm:text-3xl font-bold">{code}</span>
                  <span className="text-xs hidden sm:block">{dimension?.name || code}</span>
                </div>
              );
            })}
          </div>
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-gray-700">
              Vos trois dimensions dominantes représentent les environnements professionnels
              dans lesquels vous vous épanouirez le mieux.
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="card mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Vos Scores par Dimension
          </h3>

          <div className="space-y-4">
            {result.scores.map((score, index) => {
              const dimension = RIASEC_DIMENSIONS[score.dimension_code as keyof typeof RIASEC_DIMENSIONS];

              return (
                <div key={score.dimension_code} className="relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: getDimensionColor(score.dimension_code) }}
                      >
                        {score.dimension_code}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {score.dimension_name}
                        </h4>
                        {index < 3 && (
                          <span className="text-xs text-primary-600 font-medium">
                            Dimension dominante #{index + 1}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {score.percentage}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {score.score}/25
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="h-3 rounded-full transition-all"
                      style={{
                        width: `${score.percentage}%`,
                        backgroundColor: getDimensionColor(score.dimension_code),
                      }}
                    ></div>
                  </div>

                  {/* Description */}
                  {dimension && (
                    <p className="mt-2 text-sm text-gray-600">
                      {dimension.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Dimension Detail */}
        {topScore && (
          <div className="card mb-8" style={{ borderLeftWidth: '4px', borderLeftColor: getDimensionColor(topScore.dimension_code) }}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Votre Dimension Principale : {topScore.dimension_name}
            </h3>

            {RIASEC_DIMENSIONS[topScore.dimension_code as keyof typeof RIASEC_DIMENSIONS] && (
              <>
                <p className="text-gray-700 mb-4">
                  {RIASEC_DIMENSIONS[topScore.dimension_code as keyof typeof RIASEC_DIMENSIONS].description}
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Traits caractéristiques :</h4>
                  <div className="flex flex-wrap gap-2">
                    {RIASEC_DIMENSIONS[topScore.dimension_code as keyof typeof RIASEC_DIMENSIONS].traits.map((trait) => (
                      <span
                        key={trait}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Exemples de métiers :</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {RIASEC_DIMENSIONS[topScore.dimension_code as keyof typeof RIASEC_DIMENSIONS].careers.map((career) => (
                      <li key={career} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-primary-600">•</span>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {/* Career Recommendations */}
        {careers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Carrières Recommandées
            </h3>

            <div className="space-y-6">
              {careers.filter(careerData => careerData?.dimension?.code).map((careerData) => (
                <div
                  key={careerData.dimension.code}
                  className="card"
                  style={{ borderTopWidth: '4px', borderTopColor: getDimensionColor(careerData.dimension.code) }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: getDimensionColor(careerData.dimension.code) }}
                    >
                      {careerData.dimension.code}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Métiers {careerData.dimension.name}s
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {careerData.careers.map((career, index) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h5 className="font-semibold text-gray-900 mb-2">{career.name}</h5>
                        <p className="text-sm text-gray-600 mb-3">{career.description}</p>

                        <div className="space-y-1 text-xs text-gray-600">
                          <div>
                            <span className="font-medium">Formation :</span> {career.required_education}
                          </div>
                          <div>
                            <span className="font-medium">Salaire :</span> {career.average_salary_range}
                          </div>
                          <div>
                            <span className="font-medium">Marché :</span> {career.job_market_outlook}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="card bg-blue-50 border-blue-200 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Prochaines étapes</h3>

          <div className="space-y-3">
            <Link
              href="/programs"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Explorer les programmes</h4>
                <p className="text-sm text-gray-600">
                  Découvrez les formations compatibles avec votre profil
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <Link
              href="/recommendations"
              className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Voir mes recommandations</h4>
                <p className="text-sm text-gray-600">
                  Programmes personnalisés basés sur votre profil RIASEC
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Programmes Recommandés</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Basés sur votre profil RIASEC · {recommendations.length} programme{recommendations.length > 1 ? 's' : ''}
                </p>
              </div>
              <Link href="/recommendations" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Voir tout →
              </Link>
            </div>

            <div className="space-y-4">
              {recommendations.map((rec) => {
                const program = rec.program;
                const rankingInfo = getRankingInfo(rec.compatibility_score);

                return (
                  <div
                    key={rec.id}
                    className="card border-l-4"
                    style={{ borderLeftColor: rankingInfo.color }}
                  >
                    {/* Score Badge */}
                    <div className="flex items-center justify-between mb-3">
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

                    {/* University Header */}
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

                    {/* Academic Path - Show Licence + Master or just program */}
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
                          <Link href={`/programs/${program.id}`} className="block group/link">
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
                          <h3 className="text-lg font-bold">{program.master_program.name}</h3>
                          <p className="text-xs text-indigo-100 mt-1">
                            ✓ Poursuite optionnelle • Spécialisation avancée
                          </p>
                        </div>

                        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
                          <strong>💡 Flexibilité :</strong> Obtenez votre Licence en {program.duration_years} ans et décidez ensuite si vous voulez continuer {program.master_program.duration_years} ans de plus pour le Master.
                        </div>
                      </div>
                    ) : (
                      /* Single program (Ingenieur or Licence without Master) */
                      <Link href={`/programs/${program.id}`} className="block group/link mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover/link:text-primary-600 transition-colors leading-tight">
                          {program.name}
                        </h3>
                      </Link>
                    )}

                    {/* Score Display */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold" style={{ color: rankingInfo.color }}>
                        {rec.compatibility_score}%
                      </div>
                      <div className="text-sm text-gray-600">
                        Score de compatibilité avec votre profil RIASEC
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/test-riasec" className="btn btn-outline flex-1">
            Repasser le test
          </Link>
          <Link href="/dashboard" className="btn btn-primary flex-1">
            Retour au tableau de bord
          </Link>
        </div>
      </main>

      {/* Footer */}
      <UBertouaFooter />
    </div>
  );
}
