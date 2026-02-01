import Link from 'next/link';
import ModernHeader from '@/components/layout/ModernHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ModernHeader />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200 mb-6">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
                Notre Mission
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Guider les étudiants vers leur <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">avenir</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed">
                Une plateforme d'orientation académique et professionnelle
                conçue pour les étudiants camerounais
              </p>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-8 sm:p-12 rounded-2xl border border-primary-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  OrientCam a pour mission d'aider les étudiants camerounais à faire des choix
                  éclairés concernant leur parcours académique et professionnel. Nous croyons que
                  chaque étudiant mérite d'avoir accès à des outils d'orientation de qualité,
                  adaptés au contexte local.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Grâce à des méthodes scientifiquement validées comme le test RIASEC et un
                  algorithme de recommandation personnalisé, nous guidons les étudiants vers
                  les formations qui correspondent le mieux à leurs intérêts, compétences et
                  aspirations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Comment Ça Fonctionne ?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Un parcours simple en 4 étapes pour trouver votre orientation idéale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">1</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Créez votre profil</h3>
                <p className="text-sm text-gray-600 text-center">Renseignez vos informations académiques, vos notes et vos aspirations</p>
              </div>

              {/* Step 2 */}
              <div className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">2</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Passez le test RIASEC</h3>
                <p className="text-sm text-gray-600 text-center">Découvrez vos intérêts professionnels en 10 minutes grâce à un test scientifique</p>
              </div>

              {/* Step 3 */}
              <div className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">3</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Obtenez des recommandations</h3>
                <p className="text-sm text-gray-600 text-center">Recevez des suggestions de programmes personnalisées avec des explications détaillées</p>
              </div>

              {/* Step 4 */}
              <div className="relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white font-bold text-2xl">4</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-center">Faites votre choix</h3>
                <p className="text-sm text-gray-600 text-center">Explorez les programmes en détail et prenez une décision éclairée</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Nos Fonctionnalités
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group relative bg-gradient-to-br from-white to-primary-50 p-8 rounded-2xl border border-gray-200 hover:border-primary-300 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Test RIASEC Adapté</h3>
                <p className="text-gray-600 leading-relaxed">
                  Test d'orientation basé sur la théorie de Holland, adapté au contexte
                  camerounais avec des exemples locaux pertinents.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Algorithme Intelligent</h3>
                <p className="text-gray-600 leading-relaxed">
                  Analyse multi-critères prenant en compte vos résultats RIASEC, vos notes,
                  vos valeurs et votre situation pour des recommandations précises.
                </p>
              </div>

              <div className="group relative bg-gradient-to-br from-white to-green-50 p-8 rounded-2xl border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-6 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Base de Données Locale</h3>
                <p className="text-gray-600 leading-relaxed">
                  Programmes universitaires camerounais avec informations complètes :
                  frais, débouchés, taux d'emploi, bourses disponibles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIASEC Explanation */}
        <section className="py-20 bg-gradient-to-br from-primary-50 to-purple-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Le Test RIASEC : Une Méthode Scientifique
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Le modèle RIASEC (aussi appelé code Holland) a été développé par le psychologue
                John Holland dans les années 1970. Il identifie 6 types de personnalités
                professionnelles :
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {[
                  { letter: 'R', label: 'Réaliste', color: 'bg-riasec-realistic' },
                  { letter: 'I', label: 'Investigateur', color: 'bg-riasec-investigative' },
                  { letter: 'A', label: 'Artistique', color: 'bg-riasec-artistic' },
                  { letter: 'S', label: 'Social', color: 'bg-riasec-social' },
                  { letter: 'E', label: 'Entrepreneur', color: 'bg-riasec-enterprising' },
                  { letter: 'C', label: 'Conventionnel', color: 'bg-riasec-conventional' }
                ].map((type) => (
                  <div key={type.letter} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center text-white font-bold shadow-md`}>
                      {type.letter}
                    </div>
                    <span className="font-medium text-gray-700">{type.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-lg">
                Ce test est utilisé mondialement par les conseillers d'orientation et les
                services d'emploi pour aider les personnes à identifier les carrières qui
                correspondent à leur personnalité.
              </p>
            </div>
          </div>
        </section>

        {/* University Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">Université de Bertoua</h2>
              <p className="text-lg text-gray-700 mb-6">
                OrientCam est une initiative de l'Université de Bertoua visant à améliorer
                l'orientation académique et professionnelle des étudiants camerounais.
              </p>
              <p className="text-lg text-gray-700 mb-8">
                Notre plateforme combine recherche universitaire, expertise en orientation
                et technologie pour offrir un service gratuit et accessible à tous les
                étudiants du Cameroun.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-xl">
                Commencer Gratuitement
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UBertouaFooter />
    </div>
  );
}
