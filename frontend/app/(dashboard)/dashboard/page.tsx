'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, fetchUser } = useAuthStore();

  useEffect(() => {
    // Check authentication on mount
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!user) {
        await fetchUser();
      }
    };

    checkAuth();
  }, [user, fetchUser, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const profile = user.student_profile;
  const completionPercentage = profile?.completion_percentage || 10;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Bienvenue, <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{profile?.first_name}</span> !
          </h2>
          <p className="text-lg text-gray-600">
            Découvrez votre orientation académique et professionnelle
          </p>
        </div>

        {/* Profile Completion */}
        {completionPercentage < 100 && (
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-primary-200 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <svg
                  className="w-6 h-6 text-primary-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Complétez votre profil
                </h3>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <Link href="/profile" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-md">
                  Compléter mon profil
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/test-riasec" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-riasec-investigative/10 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-riasec-investigative"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Test RIASEC
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Découvrez vos intérêts professionnels en 10 minutes
            </p>
            <span className="text-primary-600 text-sm font-medium">
              Commencer le test →
            </span>
          </Link>

          <Link href="/programs" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-riasec-social/10 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-riasec-social"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Explorer les programmes
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Parcourez les formations disponibles
            </p>
            <span className="text-primary-600 text-sm font-medium">
              Voir les programmes →
            </span>
          </Link>

          <Link href="/recommendations" className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
            <div className="w-12 h-12 bg-riasec-enterprising/10 rounded-lg mb-4 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-riasec-enterprising"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mes recommandations
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Programmes adaptés à votre profil
            </p>
            <span className="text-primary-600 text-sm font-medium">
              Voir les recommandations →
            </span>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Prochaines étapes
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-primary-600">1</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Complétez votre profil académique</p>
                <p className="text-sm text-gray-600">
                  Ajoutez vos notes et informations scolaires
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">2</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Passez le test RIASEC</p>
                <p className="text-sm text-gray-600">
                  Découvrez vos intérêts et aptitudes professionnels
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-semibold text-gray-600">3</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Explorez les recommandations</p>
                <p className="text-sm text-gray-600">
                  Consultez les programmes adaptés à votre profil
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <UBertouaFooter />
    </div>
  );
}
