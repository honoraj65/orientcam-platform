'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import {
  programsAPI,
  Program,
  CompatibilityScore,
  formatCurrency,
  getDurationText,
  getRankingInfo,
} from '@/lib/api/programs';
import { getDimensionColor, getDimensionInfo } from '@/lib/api/riasec';

export default function ProgramDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [program, setProgram] = useState<Program | null>(null);
  const [compatibility, setCompatibility] = useState<CompatibilityScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const programId = params.id as string;

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Program & Compatibility
  // ========================================

  useEffect(() => {
    const loadProgram = async () => {
      if (!user || !programId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [programData, compatibilityData] = await Promise.all([
          programsAPI.getById(programId),
          programsAPI.getCompatibility(programId).catch(() => null), // Compatibility optional
        ]);

        setProgram(programData);
        setCompatibility(compatibilityData);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load program:', err);
        setError('Impossible de charger le programme');
        setIsLoading(false);
      }
    };

    if (user) {
      loadProgram();
    }
  }, [user, programId]);

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

  if (error || !program) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Programme introuvable'}</p>
          <Link href="/programs" className="btn btn-primary">
            Retour aux programmes
          </Link>
        </div>
      </div>
    );
  }

  const primaryDimension = getDimensionInfo(program.riasec_primary);
  const rankingInfo = compatibility ? getRankingInfo(compatibility.total_score) : null;

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

            <Link href="/programs" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour aux programmes
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-8">
        {/* Program Header */}
        <div className="card mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ backgroundColor: getDimensionColor(program.riasec_primary) }}
            >
              {program.riasec_primary}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {program.code}
                </span>
                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded">
                  {program.level}
                </span>
                {program.scholarship_available && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Bourses disponibles
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                {program.name}
              </h2>

              <p className="text-lg text-gray-600 mb-3">
                {program.domain}
              </p>

              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{program.university}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Score */}
        {compatibility && rankingInfo && (
          <div
            className="card mb-8"
            style={{ borderLeftWidth: '4px', borderLeftColor: rankingInfo.color }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-20 h-20 rounded-xl flex flex-col items-center justify-center text-white flex-shrink-0"
                style={{ backgroundColor: rankingInfo.color }}
              >
                <span className="text-3xl font-bold">
                  {compatibility.total_score}
                </span>
                <span className="text-xs">/ 100</span>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{rankingInfo.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {rankingInfo.label}
                  </h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Ce programme correspond à{' '}
                  <strong>{compatibility.total_score}%</strong> à votre profil
                  basé sur votre test RIASEC, vos notes, et vos valeurs professionnelles.
                </p>

                {/* Compatibility Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">RIASEC</div>
                    <div className="font-semibold text-gray-900">
                      {compatibility.components.riasec_score}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Notes</div>
                    <div className="font-semibold text-gray-900">
                      {compatibility.components.grades_score}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Valeurs</div>
                    <div className="font-semibold text-gray-900">
                      {compatibility.components.values_score}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Emploi</div>
                    <div className="font-semibold text-gray-900">
                      {compatibility.components.employment_score}%
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Finance</div>
                    <div className="font-semibold text-gray-900">
                      {compatibility.components.financial_score}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            {(compatibility.strengths.length > 0 || compatibility.weaknesses.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-gray-200">
                {compatibility.strengths.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Points forts
                    </h4>
                    <ul className="space-y-2">
                      {compatibility.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {compatibility.weaknesses.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Points à considérer
                    </h4>
                    <ul className="space-y-2">
                      {compatibility.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-orange-600 mt-0.5">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Description du programme
              </h3>
              <p className="text-gray-700 leading-relaxed">{program.description}</p>
            </div>

            {/* RIASEC Profile */}
            {primaryDimension && (
              <div
                className="card"
                style={{ borderTopWidth: '4px', borderTopColor: primaryDimension.color }}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Profil RIASEC
                </h3>

                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                    style={{ backgroundColor: primaryDimension.color }}
                  >
                    {primaryDimension.code}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {primaryDimension.fullName}
                    </h4>
                    <p className="text-sm text-gray-700">{primaryDimension.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {primaryDimension.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Required Subjects */}
            {program.required_subjects && program.required_subjects.length > 0 && (
              <div className="card">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Matières requises
                </h3>
                <div className="flex flex-wrap gap-2">
                  {program.required_subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-2 bg-primary-50 text-primary-700 text-sm rounded-lg border border-primary-200"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Information */}
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Informations clés</h3>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Durée</div>
                  <div className="font-medium text-gray-900">
                    {getDurationText(program.duration_years)}
                  </div>
                </div>

                {program.tuition_fee_fcfa && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Frais de scolarité</div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(program.tuition_fee_fcfa)}
                      <span className="text-sm text-gray-500">/an</span>
                    </div>
                  </div>
                )}

                {program.minimum_grade && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Note minimale requise</div>
                    <div className="font-medium text-gray-900">
                      {program.minimum_grade}/20
                    </div>
                  </div>
                )}

                {program.employment_rate && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Taux d'emploi</div>
                    <div className="font-medium text-green-600">
                      {program.employment_rate}%
                    </div>
                  </div>
                )}

                {program.average_salary_fcfa && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Salaire moyen</div>
                    <div className="font-medium text-gray-900">
                      {formatCurrency(program.average_salary_fcfa)}
                      <span className="text-sm text-gray-500">/mois</span>
                    </div>
                  </div>
                )}

                {program.capacity && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Capacité d'accueil</div>
                    <div className="font-medium text-gray-900">
                      {program.capacity} places
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* University Info */}
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                {program.university}
              </h3>
              {program.website_url && (
                <a
                  href={program.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-2"
                >
                  Visiter le site web
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="card">
              <div className="flex flex-col gap-4">
                <Link href="/recommendations" className="btn btn-primary w-full">
                  Voir tous mes programmes recommandés
                </Link>
                <Link href="/programs" className="btn btn-outline w-full">
                  Retour à la liste
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
