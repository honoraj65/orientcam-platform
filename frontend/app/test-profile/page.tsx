export default function TestProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <h1 className="text-4xl font-bold text-primary-600 mb-8">
        🎯 TEST - Nouveau Design de Profil
      </h1>

      <div className="lg:flex lg:gap-8 max-w-7xl mx-auto">
        {/* Left Sidebar */}
        <aside className="lg:w-80 mb-8 lg:mb-0 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                  TU
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                Test User
              </h2>
              <p className="text-sm text-gray-600">test@example.com</p>
              <span className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                Étudiant
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">10%</div>
                <div className="text-xs text-gray-600 mt-1">Complété</div>
              </div>
              <div className="text-center border-l border-r border-gray-200">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Tests</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-xs text-gray-600 mt-1">Filières</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Complétion du profil</span>
                <span className="text-sm font-bold text-primary-600">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: '10%' }}
                ></div>
              </div>
              <p className="mt-3 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                ⚡ Complétez votre profil pour débloquer toutes les fonctionnalités
              </p>
            </div>

            {/* Quick Links */}
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Notes académiques</span>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Valeurs professionnelles</span>
              </div>
              <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-gray-700">Test RIASEC</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              🎯 Paramètres du profil
            </h2>
            <p className="text-gray-600 mb-8">
              Gérez vos informations personnelles et académiques
            </p>

            <div className="space-y-6">
              <div className="p-6 bg-green-50 border-2 border-green-500 rounded-lg">
                <h3 className="text-xl font-bold text-green-700 mb-2">✅ Le nouveau design fonctionne!</h3>
                <p className="text-green-600">
                  Si vous voyez cette page, cela signifie que:
                </p>
                <ul className="list-disc list-inside mt-2 text-green-600 space-y-1">
                  <li>Le serveur Next.js compile correctement</li>
                  <li>Le cache a été nettoyé</li>
                  <li>Les styles Tailwind fonctionnent</li>
                  <li>Le layout GitHub-style s'affiche</li>
                </ul>
              </div>

              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-bold text-blue-700 mb-2">📋 Caractéristiques du nouveau design:</h3>
                <ul className="list-disc list-inside text-blue-600 space-y-1">
                  <li>Layout à deux colonnes (sidebar + contenu principal)</li>
                  <li>Avatar avec initiales et gradient</li>
                  <li>Statistiques avec icônes colorées</li>
                  <li>Barre de progression animée</li>
                  <li>Liens rapides avec icons SVG</li>
                  <li>Design responsive (mobile/desktop)</li>
                </ul>
              </div>

              <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="text-lg font-bold text-yellow-700 mb-2">🔗 Prochaine étape:</h3>
                <p className="text-yellow-600">
                  Si cette page s'affiche correctement, le problème sur /profile est lié à l'authentification.
                  Essayez de vous reconnecter ou vérifiez votre token dans localStorage.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
