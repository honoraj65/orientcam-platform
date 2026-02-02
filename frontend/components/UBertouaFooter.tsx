'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function UBertouaFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-100 via-gray-50 to-slate-100 text-gray-800 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8 items-start">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="relative w-14 h-14 flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo-ubertoua-alt.png"
                  alt="UBertoua"
                  width={56}
                  height={56}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </a>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">OrientUniv</h3>
                  <span className="px-2 py-0.5 bg-ubertoua-blue/10 text-ubertoua-blue text-xs font-semibold rounded-full border border-ubertoua-blue/20">
                    UBertoua
                  </span>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Université de Bertoua
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 pl-8">
              Plateforme d'orientation académique et professionnelle de l'Université de Bertoua
            </p>
            <div className="flex flex-col gap-2 text-sm text-gray-600 pl-8">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-ubertoua-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">Bertoua, Région de l'Est, Cameroun</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-16 mt-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-ubertoua-blue leading-none">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-ubertoua-blue rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></span>
                  <span className="leading-relaxed">Tableau de bord</span>
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-ubertoua-blue rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></span>
                  <span className="leading-relaxed">Programmes d'études</span>
                </Link>
              </li>
              <li>
                <Link href="/test-riasec" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-ubertoua-blue rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></span>
                  <span className="leading-relaxed">Test RIASEC</span>
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 bg-ubertoua-blue rounded-full group-hover:scale-125 transition-transform flex-shrink-0"></span>
                  <span className="leading-relaxed">Mes recommandations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* University Info */}
          <div className="md:pl-16 mt-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-ubertoua-blue leading-none">Université de Bertoua</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-ubertoua-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="leading-relaxed">4 Facultés</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-ubertoua-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="leading-relaxed">4 Grandes Écoles</span>
              </li>
              <li className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-ubertoua-blue flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="leading-relaxed">Fondée en 2022</span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:pl-16 mt-1">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-ubertoua-blue leading-none">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2.5 group">
                  <svg className="w-4 h-4 text-ubertoua-blue flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="leading-relaxed">Nous contacter</span>
                </Link>
              </li>
              <li>
                <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors flex items-center gap-2.5 group">
                  <svg className="w-4 h-4 text-ubertoua-blue flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <span className="leading-relaxed">Site web UBertoua</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Motto Section */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-5 px-6 py-5 bg-gradient-to-r from-ubertoua-blue/5 to-purple-100/30 rounded-2xl border border-ubertoua-blue/20">
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="w-16 h-16 rounded-full bg-white border-2 border-ubertoua-blue/30 p-2.5 flex items-center justify-center shadow-md flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo-ubertoua-alt.png"
                  alt="Université de Bertoua"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </a>
              <div className="text-left flex flex-col justify-center">
                <p className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-snug">
                  "Les réussites de demain commencent aujourd'hui"
                </p>
                <p className="text-sm sm:text-base text-gray-600 italic leading-relaxed">
                  Vos talents nourrissent notre ambition
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
            <p className="text-sm text-gray-600 text-center md:text-left font-medium leading-relaxed">
              © {currentYear} Université de Bertoua. Tous droits réservés.
            </p>
            <div className="flex items-center gap-6 md:gap-8">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors font-medium leading-relaxed">
                Confidentialité
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-ubertoua-blue transition-colors font-medium leading-relaxed">
                Conditions d'utilisation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
