import type { Metadata } from 'next';
import Link from 'next/link';
import ModernHeader from '@/components/layout/ModernHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export const metadata: Metadata = {
  title: 'Politique de confidentialité - OrientCam',
  description: 'Politique de confidentialité et protection des données personnelles sur OrientCam',
};

export default function PrivacyPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Protection de vos données
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Politique de <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">confidentialité</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-4xl">
          <div className="prose prose-lg max-w-none">

            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OrientCam, développé par TECH MAINT SERVICES (TMS) en partenariat avec l'Université de Bertoua,
                s'engage à protéger la confidentialité et la sécurité des données personnelles de ses utilisateurs.
                Cette politique de confidentialité décrit comment nous collectons, utilisons, stockons et protégeons
                vos informations personnelles.
              </p>
              <p className="text-gray-700 leading-relaxed">
                En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique.
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser OrientCam.
              </p>
            </section>

            {/* Données collectées */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Données d'inscription</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Lors de votre inscription sur OrientCam, nous collectons les informations suivantes :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Nom complet</li>
                <li>Adresse e-mail</li>
                <li>Numéro de téléphone</li>
                <li>Date de naissance</li>
                <li>Niveau d'études actuel</li>
                <li>Établissement d'enseignement</li>
                <li>Mot de passe (crypté)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Données académiques</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour personnaliser nos recommandations, nous collectons :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Notes et résultats scolaires</li>
                <li>Matières étudiées</li>
                <li>Diplômes obtenus</li>
                <li>Préférences de filières</li>
                <li>Objectifs professionnels</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.3 Résultats du test RIASEC</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Lorsque vous passez le test d'orientation RIASEC, nous enregistrons :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Vos réponses aux questions du test</li>
                <li>Vos scores dans les six dimensions (Réaliste, Investigateur, Artistique, Social, Entreprenant, Conventionnel)</li>
                <li>Le profil RIASEC généré</li>
                <li>La date de passage du test</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">2.4 Données de navigation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous collectons automatiquement certaines informations techniques :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Adresse IP</li>
                <li>Type de navigateur et version</li>
                <li>Système d'exploitation</li>
                <li>Pages visitées et durée de visite</li>
                <li>Date et heure de connexion</li>
                <li>Source de référence (comment vous avez trouvé notre site)</li>
              </ul>
            </section>

            {/* Utilisation des données */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Utilisation des données</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous utilisons vos données personnelles pour les finalités suivantes :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Fourniture du service :</strong> Créer et gérer votre compte utilisateur</li>
                <li><strong>Orientation personnalisée :</strong> Analyser votre profil et générer des recommandations de filières adaptées</li>
                <li><strong>Test RIASEC :</strong> Calculer vos scores et établir votre profil d'orientation</li>
                <li><strong>Communication :</strong> Vous envoyer des notifications importantes concernant votre compte ou nos services</li>
                <li><strong>Amélioration du service :</strong> Analyser l'utilisation de la plateforme pour améliorer nos fonctionnalités</li>
                <li><strong>Recherche académique :</strong> Produire des statistiques anonymisées pour l'Université de Bertoua (avec votre consentement)</li>
                <li><strong>Sécurité :</strong> Détecter et prévenir les fraudes et abus</li>
                <li><strong>Conformité légale :</strong> Respecter nos obligations légales et réglementaires</li>
              </ul>
            </section>

            {/* Partage des données */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Partage des données</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous ne vendons jamais vos données personnelles. Nous pouvons partager vos informations uniquement dans les cas suivants :
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 Université de Bertoua</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                En tant que partenaire institutionnel, l'Université de Bertoua peut avoir accès à des données
                anonymisées et agrégées pour des fins de recherche académique et d'amélioration de l'orientation
                des étudiants camerounais.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.2 Prestataires de services</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous travaillons avec des prestataires tiers pour l'hébergement, la maintenance et l'analyse.
                Ces prestataires sont contractuellement tenus de protéger vos données et ne peuvent les utiliser
                qu'aux fins spécifiées.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">4.3 Obligations légales</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous pouvons divulguer vos informations si la loi l'exige, en réponse à une procédure judiciaire,
                ou pour protéger nos droits, votre sécurité ou celle d'autrui.
              </p>
            </section>

            {/* Stockage et sécurité */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Stockage et sécurité des données</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Localisation des données</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Vos données sont stockées sur des serveurs sécurisés. Nous nous efforçons de conserver vos données
                au Cameroun ou dans la région, dans le respect de la législation camerounaise.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Mesures de sécurité</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Cryptage des données sensibles (notamment les mots de passe avec bcrypt)</li>
                <li>Protocoles HTTPS pour toutes les communications</li>
                <li>Pare-feu et systèmes de détection d'intrusion</li>
                <li>Accès limité aux données personnelles (principe du moindre privilège)</li>
                <li>Sauvegardes régulières et plan de récupération</li>
                <li>Audits de sécurité périodiques</li>
                <li>Formation du personnel sur la protection des données</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Durée de conservation</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Fournir nos services (tant que votre compte est actif)</li>
                <li>Respecter nos obligations légales et réglementaires</li>
                <li>Résoudre des litiges et faire appliquer nos accords</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Après la suppression de votre compte, vos données sont effacées dans un délai de 30 jours,
                sauf obligation légale de conservation plus longue.
              </p>
            </section>

            {/* Vos droits */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos droits</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conformément aux principes de protection des données, vous disposez des droits suivants :
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.1 Droit d'accès</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.2 Droit de rectification</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez corriger ou mettre à jour vos informations personnelles à tout moment via votre tableau de bord.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.3 Droit à l'effacement</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez demander la suppression de votre compte et de toutes vos données personnelles,
                    sauf si nous avons une obligation légale de les conserver.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.4 Droit à la limitation du traitement</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.5 Droit à la portabilité</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez demander à recevoir vos données dans un format structuré et lisible par machine.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">6.6 Droit d'opposition</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Vous pouvez vous opposer au traitement de vos données à des fins de marketing ou de recherche.
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mt-4">
                Pour exercer ces droits, contactez-nous à l'adresse :
                <a href="mailto:privacy@orientcam.cm" className="text-primary-600 hover:text-primary-700 font-medium ml-1">
                  privacy@orientcam.cm
                </a>
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies et technologies similaires</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OrientCam utilise des cookies et technologies similaires pour améliorer votre expérience utilisateur.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Types de cookies utilisés</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li><strong>Cookies essentiels :</strong> Nécessaires au fonctionnement de la plateforme (authentification, sécurité)</li>
                <li><strong>Cookies de performance :</strong> Permettent d'analyser l'utilisation du site pour l'améliorer</li>
                <li><strong>Cookies de préférence :</strong> Mémorisent vos choix (langue, paramètres d'affichage)</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Gestion des cookies</h3>
              <p className="text-gray-700 leading-relaxed">
                Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
                Notez que la désactivation de certains cookies peut affecter le fonctionnement de la plateforme.
              </p>
            </section>

            {/* Mineurs */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Protection des mineurs</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                OrientCam est principalement destiné aux étudiants et lycéens, dont certains peuvent être mineurs.
                Nous prenons des mesures spéciales pour protéger les données des utilisateurs de moins de 18 ans :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Pour les utilisateurs de moins de 16 ans, nous demandons le consentement parental avant la collecte de données</li>
                <li>Nous limitons la collecte de données aux informations strictement nécessaires à l'orientation</li>
                <li>Nous ne partageons jamais les données des mineurs à des fins commerciales</li>
                <li>Les parents peuvent exercer tous les droits mentionnés ci-dessus au nom de leur enfant</li>
              </ul>
            </section>

            {/* Modifications */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Modifications de la politique</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nous pouvons modifier cette politique de confidentialité pour refléter les changements dans nos pratiques
                ou pour des raisons légales. En cas de modification importante, nous vous en informerons par :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Une notification sur la plateforme</li>
                <li>Un e-mail à l'adresse associée à votre compte</li>
                <li>Une mise à jour de la date "Dernière mise à jour" en haut de cette page</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Nous vous encourageons à consulter régulièrement cette politique pour rester informé de la manière
                dont nous protégeons vos données.
              </p>
            </section>

            {/* Transferts internationaux */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Transferts internationaux de données</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dans certains cas, vos données peuvent être transférées vers des pays situés en dehors du Cameroun,
                notamment pour l'hébergement cloud ou les services d'analyse. Dans ces cas, nous veillons à ce que :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Le pays destinataire offre un niveau de protection adéquat des données personnelles</li>
                <li>Des garanties contractuelles appropriées soient en place (clauses contractuelles types)</li>
                <li>Vos données bénéficient du même niveau de protection qu'au Cameroun</li>
              </ul>
            </section>

            {/* Responsable du traitement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Responsable du traitement des données</h2>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed mb-2">
                  <strong>TECH MAINT SERVICES (TMS)</strong>
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  En partenariat avec l'Université de Bertoua
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  BP 652 Bertoua, Région de l'Est, Cameroun
                </p>
                <p className="text-gray-700 leading-relaxed mb-2">
                  E-mail : <a href="mailto:privacy@orientcam.cm" className="text-primary-600 hover:text-primary-700">privacy@orientcam.cm</a>
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Téléphone : <a href="tel:+237695683462" className="text-primary-600 hover:text-primary-700">+237 695 683 462</a>
                </p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Nous contacter</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles,
                vous pouvez nous contacter :
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Par e-mail : <a href="mailto:privacy@orientcam.cm" className="text-primary-600 hover:text-primary-700">privacy@orientcam.cm</a></li>
                <li>Par téléphone : <a href="tel:+237695683462" className="text-primary-600 hover:text-primary-700">+237 695 683 462</a></li>
                <li>Via notre <Link href="/contact" className="text-primary-600 hover:text-primary-700">page de contact</Link></li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                Nous nous engageons à répondre à toutes vos demandes dans un délai de 30 jours maximum.
              </p>
            </section>

            {/* Réclamations */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Droit de réclamation</h2>
              <p className="text-gray-700 leading-relaxed">
                Si vous estimez que vos droits en matière de protection des données ne sont pas respectés,
                vous avez le droit de déposer une réclamation auprès de l'autorité de protection des données
                compétente au Cameroun ou de saisir les tribunaux camerounais.
              </p>
            </section>

          </div>

          {/* Footer Links */}
          <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <Link
                href="/conditions"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Voir les conditions d'utilisation
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
