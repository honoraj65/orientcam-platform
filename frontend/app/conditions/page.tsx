import type { Metadata } from 'next';
import Link from 'next/link';
import ModernHeader from '@/components/layout/ModernHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export const metadata: Metadata = {
  title: 'Conditions d\'utilisation - OrientCam',
  description: 'Conditions d\'utilisation de la plateforme OrientCam',
};

export default function ConditionsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ModernHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium border border-primary-200 mb-6">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Conditions d'utilisation
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Conditions <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">d'Utilisation</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <div className="prose prose-lg max-w-none space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Bienvenue sur OrientCam, la plateforme d'orientation académique et professionnelle de l'Université de Bertoua.
              </p>
              <p>
                En utilisant OrientCam, vous acceptez d'être lié par les présentes conditions d'utilisation.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser la plateforme.
              </p>
              <p>
                OrientCam est développé et maintenu par TECH MAINT SERVICES (TMS) en collaboration avec l'Université de Bertoua.
              </p>
            </div>
          </section>

          {/* Services proposés */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Proposés</h2>
            <div className="space-y-3 text-gray-700">
              <p>OrientCam met à votre disposition les services suivants :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Test d'orientation RIASEC adapté au contexte camerounais</li>
                <li>Évaluation de vos intérêts professionnels et académiques</li>
                <li>Recommandations personnalisées de programmes d'études</li>
                <li>Base de données des programmes de l'Université de Bertoua</li>
                <li>Tableau de bord personnel pour suivre votre parcours</li>
                <li>Informations sur les débouchés professionnels</li>
              </ul>
            </div>
          </section>

          {/* Inscription et compte utilisateur */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et Compte Utilisateur</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">3.1. Création de compte</h3>
              <p>
                Pour accéder aux services d'OrientCam, vous devez créer un compte en fournissant des informations
                exactes et à jour. Vous êtes responsable de la confidentialité de vos identifiants de connexion.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">3.2. Conditions d'éligibilité</h3>
              <p>
                OrientCam est destiné principalement aux :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Étudiants de l'enseignement secondaire au Cameroun</li>
                <li>Étudiants actuels de l'Université de Bertoua</li>
                <li>Candidats à l'admission à l'Université de Bertoua</li>
                <li>Conseillers d'orientation et personnels éducatifs</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">3.3. Sécurité du compte</h3>
              <p>
                Vous vous engagez à :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Ne pas partager vos identifiants avec des tiers</li>
                <li>Nous informer immédiatement de toute utilisation non autorisée de votre compte</li>
                <li>Maintenir vos informations personnelles à jour</li>
                <li>Utiliser un mot de passe sécurisé</li>
              </ul>
            </div>
          </section>

          {/* Utilisation acceptable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Utilisation Acceptable</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">4.1. Usages autorisés</h3>
              <p>
                Vous êtes autorisé à utiliser OrientCam uniquement à des fins d'orientation académique et professionnelle personnelle.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">4.2. Usages interdits</h3>
              <p>Il est strictement interdit de :</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Utiliser la plateforme à des fins illégales ou frauduleuses</li>
                <li>Tenter d'accéder à des comptes d'autres utilisateurs</li>
                <li>Diffuser du contenu offensant, discriminatoire ou inapproprié</li>
                <li>Interférer avec le fonctionnement de la plateforme</li>
                <li>Copier, reproduire ou revendre le contenu d'OrientCam sans autorisation</li>
                <li>Utiliser des robots, scripts ou autres moyens automatisés pour accéder à la plateforme</li>
                <li>Extraire des données en masse (scraping) de la plateforme</li>
              </ul>
            </div>
          </section>

          {/* Données personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Protection des Données Personnelles</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">5.1. Collecte de données</h3>
              <p>
                Nous collectons les informations suivantes :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Informations d'inscription (nom, email, téléphone)</li>
                <li>Résultats du test RIASEC</li>
                <li>Notes et parcours académique</li>
                <li>Préférences et interactions avec la plateforme</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">5.2. Utilisation des données</h3>
              <p>
                Vos données sont utilisées pour :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Fournir des recommandations personnalisées</li>
                <li>Améliorer nos services</li>
                <li>Communiquer avec vous concernant votre orientation</li>
                <li>Produire des statistiques anonymisées pour l'Université</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">5.3. Protection et sécurité</h3>
              <p>
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données
                contre tout accès non autorisé, perte ou destruction.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">5.4. Vos droits</h3>
              <p>
                Conformément aux lois applicables, vous disposez des droits suivants :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Droit d'accès à vos données personnelles</li>
                <li>Droit de rectification des données inexactes</li>
                <li>Droit de suppression de votre compte et de vos données</li>
                <li>Droit d'opposition au traitement de vos données</li>
                <li>Droit à la portabilité de vos données</li>
              </ul>
            </div>
          </section>

          {/* Test RIASEC */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Test RIASEC et Recommandations</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">6.1. Nature du test</h3>
              <p>
                Le test RIASEC est un outil d'aide à l'orientation basé sur la théorie de John Holland.
                Il évalue vos intérêts professionnels selon six dimensions : Réaliste, Investigateur, Artistique,
                Social, Entreprenant et Conventionnel.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">6.2. Recommandations</h3>
              <p>
                Les recommandations fournies par OrientCam sont basées sur un algorithme qui analyse :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Vos résultats au test RIASEC</li>
                <li>Votre parcours académique</li>
                <li>Vos valeurs professionnelles</li>
                <li>Les caractéristiques des programmes disponibles</li>
              </ul>

              <h3 className="font-semibold text-gray-900 mt-4">6.3. Caractère indicatif</h3>
              <p className="font-semibold text-primary-600">
                Important : Les résultats du test RIASEC et les recommandations ont un caractère purement indicatif
                et ne constituent pas une décision d'orientation définitive.
              </p>
              <p>
                Nous vous encourageons à :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Consulter un conseiller d'orientation professionnel</li>
                <li>Effectuer des recherches complémentaires sur les programmes</li>
                <li>Prendre en compte d'autres facteurs personnels dans votre décision</li>
                <li>Refaire le test périodiquement pour suivre l'évolution de vos intérêts</li>
              </ul>
            </div>
          </section>

          {/* Propriété intellectuelle */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Propriété Intellectuelle</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                L'ensemble du contenu d'OrientCam (textes, graphiques, logos, images, logiciels) est la propriété de
                l'Université de Bertoua et de TECH MAINT SERVICES (TMS), protégé par les lois sur la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, distribution ou utilisation commerciale du contenu sans autorisation préalable est interdite.
              </p>
            </div>
          </section>

          {/* Limitation de responsabilité */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation de Responsabilité</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">8.1. Disponibilité du service</h3>
              <p>
                Nous nous efforçons d'assurer la disponibilité continue d'OrientCam, mais nous ne garantissons pas
                un accès ininterrompu. La plateforme peut être temporairement indisponible pour maintenance ou
                pour des raisons techniques.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">8.2. Exactitude des informations</h3>
              <p>
                Nous mettons tout en œuvre pour maintenir l'exactitude des informations sur les programmes et
                les débouchés professionnels. Toutefois, ces informations peuvent évoluer et nous ne pouvons
                garantir leur exactitude absolue à tout moment.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">8.3. Décisions d'orientation</h3>
              <p>
                OrientCam ne peut être tenu responsable des décisions d'orientation prises par les utilisateurs
                sur la base des recommandations fournies. La décision finale vous appartient.
              </p>
            </div>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications des Conditions</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Nous nous réservons le droit de modifier les présentes conditions d'utilisation à tout moment.
                Les modifications entreront en vigueur dès leur publication sur la plateforme.
              </p>
              <p>
                Nous vous informerons des modifications importantes par email ou par notification sur la plateforme.
                Votre utilisation continue d'OrientCam après les modifications constitue votre acceptation des nouvelles conditions.
              </p>
            </div>
          </section>

          {/* Résiliation */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Résiliation</h2>
            <div className="space-y-3 text-gray-700">
              <h3 className="font-semibold text-gray-900 mt-4">10.1. Par l'utilisateur</h3>
              <p>
                Vous pouvez fermer votre compte à tout moment depuis les paramètres de votre profil.
                La suppression de votre compte entraîne la suppression définitive de vos données personnelles.
              </p>

              <h3 className="font-semibold text-gray-900 mt-4">10.2. Par OrientCam</h3>
              <p>
                Nous nous réservons le droit de suspendre ou de résilier votre compte en cas de :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violation des présentes conditions d'utilisation</li>
                <li>Utilisation frauduleuse ou abusive de la plateforme</li>
                <li>Inactivité prolongée (plus de 24 mois)</li>
              </ul>
            </div>
          </section>

          {/* Droit applicable */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Droit Applicable et Juridiction</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Les présentes conditions d'utilisation sont régies par le droit camerounais.
              </p>
              <p>
                En cas de litige relatif à l'utilisation d'OrientCam, les parties s'efforceront de trouver
                une solution amiable. À défaut, les tribunaux compétents de Bertoua seront seuls compétents.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact</h2>
            <div className="space-y-3 text-gray-700">
              <p>
                Pour toute question concernant ces conditions d'utilisation, vous pouvez nous contacter :
              </p>
              <div className="bg-primary-50 rounded-lg p-6 mt-4">
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900">Université de Bertoua</p>
                  <p>BP 652 Bertoua, Région de l'Est, Cameroun</p>
                  <p>Email : <a href="mailto:contact@univ-bertoua.cm" className="text-primary-600 hover:text-primary-700">contact@univ-bertoua.cm</a></p>
                  <p>Téléphone : <a href="tel:+237222241050" className="text-primary-600 hover:text-primary-700">+237 222 24 10 50</a></p>
                </div>
                <div className="border-t border-primary-200 mt-4 pt-4">
                  <p className="font-semibold text-gray-900">Support Technique (TMS)</p>
                  <p>Email : <a href="mailto:support@orientcam.cm" className="text-primary-600 hover:text-primary-700">support@orientcam.cm</a></p>
                  <p>Téléphone : <a href="tel:+237695683462" className="text-primary-600 hover:text-primary-700">+237 695 683 462</a></p>
                </div>
              </div>
            </div>
          </section>

          {/* Acceptation */}
          <section className="bg-gradient-to-r from-primary-50 to-riasec-social/10 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Acceptation des Conditions</h3>
            <p className="text-gray-700">
              En créant un compte et en utilisant OrientCam, vous reconnaissez avoir lu, compris et accepté
              les présentes conditions d'utilisation dans leur intégralité.
            </p>
          </section>
          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Voir la politique de confidentialité
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous contacter
              </Link>
            </div>
          </div>
        </section>
      </main>

      <UBertouaFooter />
    </div>
  );
}
