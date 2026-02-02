import Link from "next/link";
import Image from "next/image";
import UBertouaFooter from "@/components/UBertouaFooter";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Modern Sticky Header - UBertoua Branding */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo avec identité UBertoua */}
            <div className="flex items-center gap-3 group">
              {/* Logo Université de Bertoua */}
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo-ubertoua-alt.png"
                  alt="Université de Bertoua"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </a>

              {/* Divider */}
              <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

              {/* OrientUniv Branding */}
              <Link href="/" className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">
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

            <div className="flex items-center gap-4">
              <Link href="/about" className="hidden md:inline-flex text-gray-700 hover:text-ubertoua-blue font-medium transition-colors">
                À propos
              </Link>
              <Link href="/contact" className="hidden md:inline-flex text-gray-700 hover:text-ubertoua-blue font-medium transition-colors">
                Contact
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-ubertoua-blue font-medium transition-colors">
                Connexion
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-ubertoua-blue to-primary-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-primary-700 hover:to-ubertoua-blue transform hover:scale-105 transition-all shadow-md hover:shadow-lg">
                Commencer
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - GitHub Inspired */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Plateforme d'orientation nouvelle génération
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight tracking-tight">
                Trouvez <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">votre voie</span>
                <br />académique au Cameroun
              </h1>

              {/* University Motto */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-ubertoua-gold"></div>
                <p className="text-lg font-semibold text-ubertoua-blue italic">
                  "Les réussites de demain commencent aujourd'hui"
                </p>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-ubertoua-gold"></div>
              </div>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Orientation académique intelligente basée sur vos intérêts, compétences et aspirations.
                Découvrez le programme universitaire parfait pour vous à l'<span className="font-semibold text-ubertoua-blue">Université de Bertoua</span>.
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-xl hover:shadow-2xl"
                >
                  <span>Commencer mon test RIASEC</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-primary-600 font-semibold text-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Voir comment ça marche</span>
                </Link>
              </div>

              {/* Social Proof */}
              <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">100% Gratuit</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span className="font-medium">Adapté au Cameroun</span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-medium">Basé sur la science</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Simple & Fluide */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir OrientUniv ?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Une approche simple et efficace pour votre orientation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Test RIASEC</h3>
                <p className="text-gray-600 leading-relaxed">
                  Découvrez vos intérêts professionnels en quelques minutes
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-green-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Recommandations Personnalisées</h3>
                <p className="text-gray-600 leading-relaxed">
                  Des suggestions adaptées à votre profil et vos objectifs
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-purple-100 rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Programmes UBertoua</h3>
                <p className="text-gray-600 leading-relaxed">
                  Explorez tous les programmes de l'Université de Bertoua
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Simple */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <div className="text-4xl font-bold text-ubertoua-blue mb-2">4</div>
                <div className="text-gray-600 text-sm">Facultés</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-ubertoua-blue mb-2">4</div>
                <div className="text-gray-600 text-sm">Grandes Écoles</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-ubertoua-blue mb-2">100%</div>
                <div className="text-gray-600 text-sm">Gratuit</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-ubertoua-blue mb-2">24/7</div>
                <div className="text-gray-600 text-sm">Disponible</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Simple & Clair */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Prêt à découvrir votre parcours idéal ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Rejoignez des centaines d'étudiants qui ont trouvé leur voie
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-ubertoua-blue text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Commencer gratuitement</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 text-gray-700 border-2 border-gray-300 px-8 py-4 rounded-lg font-semibold hover:border-gray-400 transition-all"
                >
                  Nous contacter
                </Link>
              </div>

              {/* Simple Trust Badge */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Plateforme officielle de l'Université de Bertoua
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* University Banner - Institutional Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-100 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">
              {/* Section Title */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-ubertoua-blue/10 text-ubertoua-blue rounded-full text-sm font-semibold mb-4 border border-ubertoua-blue/20">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                  Notre Établissement
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Université de Bertoua
                </h2>
                <p className="text-lg text-ubertoua-blue italic font-semibold">
                  "Les réussites de demain commencent aujourd'hui"
                </p>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-shadow">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  {/* University Logo */}
                  <div className="flex-shrink-0">
                    <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="block w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-white to-gray-50 p-6 shadow-lg border-4 border-ubertoua-blue/20 hover:border-ubertoua-blue/40 hover:scale-105 transition-all">
                      <Image
                        src="/images/logo-ubertoua-alt.png"
                        alt="Université de Bertoua"
                        width={192}
                        height={192}
                        className="w-full h-full object-contain rounded-full"
                      />
                    </a>
                  </div>

                  {/* University Info */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-ubertoua-blue/10 to-primary-100 text-ubertoua-blue text-sm font-bold rounded-full mb-4 border border-ubertoua-blue/20">
                      🏛️ Établissement Public d'Enseignement Supérieur
                    </div>
                    <p className="text-gray-700 leading-relaxed max-w-2xl mb-6 text-base">
                      L'Université de Bertoua est un établissement public créé par décret présidentiel,
                      offrant une formation de qualité dans divers domaines à travers ses
                      <span className="font-semibold text-ubertoua-blue"> 4 facultés</span> et
                      <span className="font-semibold text-ubertoua-blue"> 4 grandes écoles</span>.
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-xl font-bold text-gray-900">8</div>
                          <div className="text-xs text-gray-600 font-medium">Filières</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-100">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-xl font-bold text-gray-900">Excellence</div>
                          <div className="text-xs text-gray-600 font-medium">Académique</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-100">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        </div>
                        <div className="text-left">
                          <div className="text-xl font-bold text-gray-900">Qualité</div>
                          <div className="text-xs text-gray-600 font-medium">Certifiée</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <UBertouaFooter />
    </div>
  );
}
