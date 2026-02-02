import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Header */}
      <header className="container-mobile py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary-600">OrientUniv</h1>
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="btn btn-outline text-sm">
              Connexion
            </Link>
            <Link href="/register" className="btn btn-primary text-sm">
              S'inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-mobile py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            À Propos d'OrientUniv
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Une plateforme d'orientation académique et professionnelle
            conçue pour les étudiants camerounais
          </p>
        </div>

        {/* Mission */}
        <div className="card mb-12 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Notre Mission</h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-4">
            OrientUniv a pour mission d'aider les étudiants camerounais à faire des choix
            éclairés concernant leur parcours académique et professionnel. Nous croyons que
            chaque étudiant mérite d'avoir accès à des outils d'orientation de qualité,
            adaptés au contexte local.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed">
            Grâce à des méthodes scientifiquement validées comme le test RIASEC et un
            algorithme de recommandation personnalisé, nous guidons les étudiants vers
            les formations qui correspondent le mieux à leurs intérêts, compétences et
            aspirations.
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Comment Ça Fonctionne ?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Créez votre profil</h4>
              <p className="text-sm text-gray-600">
                Renseignez vos informations académiques, vos notes et vos aspirations
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Passez le test RIASEC</h4>
              <p className="text-sm text-gray-600">
                Découvrez vos intérêts professionnels en 10 minutes grâce à un test scientifique
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Obtenez des recommandations</h4>
              <p className="text-sm text-gray-600">
                Recevez des suggestions de programmes personnalisées avec des explications détaillées
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-600 font-bold text-2xl">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Faites votre choix</h4>
              <p className="text-sm text-gray-600">
                Explorez les programmes en détail et prenez une décision éclairée
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Nos Fonctionnalités
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <div className="w-12 h-12 bg-riasec-investigative/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-riasec-investigative" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Test RIASEC Adapté</h4>
              <p className="text-gray-600">
                Test d'orientation basé sur la théorie de Holland, adapté au contexte
                camerounais avec des exemples locaux pertinents.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-riasec-social/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-riasec-social" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Algorithme Intelligent</h4>
              <p className="text-gray-600">
                Analyse multi-critères prenant en compte vos résultats RIASEC, vos notes,
                vos valeurs et votre situation pour des recommandations précises.
              </p>
            </div>

            <div className="card">
              <div className="w-12 h-12 bg-riasec-enterprising/10 rounded-lg mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-riasec-enterprising" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-3">Base de Données Locale</h4>
              <p className="text-gray-600">
                Programmes universitaires camerounais avec informations complètes :
                frais, débouchés, taux d'emploi, bourses disponibles.
              </p>
            </div>
          </div>
        </div>

        {/* RIASEC Explanation */}
        <div className="card mb-16 max-w-4xl mx-auto bg-gradient-to-br from-primary-50 to-purple-50">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Le Test RIASEC : Une Méthode Scientifique
          </h3>
          <p className="text-gray-700 mb-4">
            Le modèle RIASEC (aussi appelé code Holland) a été développé par le psychologue
            John Holland dans les années 1970. Il identifie 6 types de personnalités
            professionnelles :
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-realistic rounded flex items-center justify-center text-white font-bold text-sm">
                R
              </div>
              <span className="text-sm text-gray-700">Réaliste</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-investigative rounded flex items-center justify-center text-white font-bold text-sm">
                I
              </div>
              <span className="text-sm text-gray-700">Investigateur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-artistic rounded flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <span className="text-sm text-gray-700">Artistique</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-social rounded flex items-center justify-center text-white font-bold text-sm">
                S
              </div>
              <span className="text-sm text-gray-700">Social</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-enterprising rounded flex items-center justify-center text-white font-bold text-sm">
                E
              </div>
              <span className="text-sm text-gray-700">Entrepreneur</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-riasec-conventional rounded flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="text-sm text-gray-700">Conventionnel</span>
            </div>
          </div>
          <p className="text-gray-700">
            Ce test est utilisé mondialement par les conseillers d'orientation et les
            services d'emploi pour aider les personnes à identifier les carrières qui
            correspondent à leur personnalité.
          </p>
        </div>

        {/* Team/University */}
        <div className="card mb-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Université de Bertoua</h3>
          <p className="text-gray-700 mb-4">
            OrientUniv est une initiative de l'Université de Bertoua visant à améliorer
            l'orientation académique et professionnelle des étudiants camerounais.
          </p>
          <p className="text-gray-700">
            Notre plateforme combine recherche universitaire, expertise en orientation
            et technologie pour offrir un service gratuit et accessible à tous les
            étudiants du Cameroun.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à Découvrir Votre Voie ?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Rejoignez des centaines d'étudiants qui ont déjà trouvé leur orientation
            grâce à OrientUniv
          </p>
          <Link href="/register" className="btn btn-primary text-lg px-8 py-3 inline-block">
            Commencer Gratuitement
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="container-mobile py-8 mt-16 border-t border-gray-200">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; 2024 OrientUniv. Université de Bertoua.</p>
          <p className="mt-2">Plateforme d'orientation académique et professionnelle</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="hover:text-primary-600">Accueil</Link>
            <Link href="/about" className="hover:text-primary-600">À propos</Link>
            <Link href="/login" className="hover:text-primary-600">Connexion</Link>
            <Link href="/register" className="hover:text-primary-600">S'inscrire</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
