import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">

          {/* Logo */}
          <div className="inline-flex items-center justify-center gap-3 mb-10">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo-ubertoua-alt.png"
                alt="Université de Bertoua"
                width={48}
                height={48}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-700 bg-clip-text text-transparent">
              OrientUniv
            </span>
          </div>

          {/* Illustration 404 */}
          <div className="relative mb-8">
            <div className="text-[10rem] sm:text-[12rem] font-black leading-none tracking-tighter bg-gradient-to-b from-blue-200 to-blue-100 bg-clip-text text-transparent select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/80 shadow-lg flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Page introuvable
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
            La page que vous recherchez n&apos;existe pas ou a été déplacée.
            Vérifiez l&apos;adresse ou retournez à l&apos;accueil.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l&apos;accueil
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Tableau de bord
            </Link>
          </div>

          {/* Liens rapides */}
          <div className="bg-white/60 rounded-2xl border border-gray-200/50 p-6 backdrop-blur-sm">
            <p className="text-sm font-medium text-gray-500 mb-4">Accès rapide</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link href="/test-riasec" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"></span>
                Test RIASEC
              </Link>
              <Link href="/programs" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0"></span>
                Programmes
              </Link>
              <Link href="/recommendations" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-indigo-400 flex-shrink-0"></span>
                Recommandations
              </Link>
              <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></span>
                Mon Profil
              </Link>
              <Link href="/about" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-gray-400 flex-shrink-0"></span>
                À propos
              </Link>
              <Link href="/contact" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                <span className="w-2 h-2 rounded-full bg-rose-400 flex-shrink-0"></span>
                Contact
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-gray-400">
        OrientUniv - Université de Bertoua
      </div>
    </div>
  );
}
