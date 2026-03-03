'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex flex-col">
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

          {/* Icône erreur */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Une erreur est survenue
          </h1>
          <p className="text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
            Nous sommes désolés, quelque chose ne s&apos;est pas passé comme prévu.
            Veuillez réessayer ou retourner à l&apos;accueil.
          </p>

          {/* Boutons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réessayer
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>

          {/* Info */}
          <div className="bg-white/60 rounded-2xl border border-gray-200/50 p-5 backdrop-blur-sm">
            <p className="text-sm text-gray-500">
              Si le problème persiste, essayez de vider le cache de votre navigateur
              ou contactez-nous à <a href="mailto:contact@orientuniv.cm" className="text-blue-600 hover:underline">contact@orientuniv.cm</a>
            </p>
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
