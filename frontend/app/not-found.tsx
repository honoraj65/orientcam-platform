import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <svg
            className="w-64 h-64 mx-auto text-primary-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl sm:text-8xl font-bold text-primary-600 mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Page Introuvable
        </h2>

        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn btn-primary px-8 py-3">
            Retour à l'accueil
          </Link>
          <Link href="/dashboard" className="btn btn-outline px-8 py-3">
            Tableau de bord
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-4">Liens utiles :</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/test-riasec" className="text-primary-600 hover:text-primary-700">
              Test RIASEC
            </Link>
            <Link href="/programs" className="text-primary-600 hover:text-primary-700">
              Programmes
            </Link>
            <Link href="/recommendations" className="text-primary-600 hover:text-primary-700">
              Recommandations
            </Link>
            <Link href="/profile" className="text-primary-600 hover:text-primary-700">
              Mon Profil
            </Link>
            <Link href="/about" className="text-primary-600 hover:text-primary-700">
              À propos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
