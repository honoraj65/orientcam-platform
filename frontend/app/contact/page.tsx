import type { Metadata } from 'next';
import ModernHeader from '@/components/layout/ModernHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export const metadata: Metadata = {
  title: 'Contact - OrientUniv',
  description: 'Contactez l\'équipe OrientUniv et l\'Université de Bertoua',
};

export default function ContactPage() {
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Nous sommes là pour vous aider
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Contactez-<span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">nous</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                Besoin d'aide ou d'informations ? Notre équipe est à votre disposition pour répondre à toutes vos questions.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Université de Bertoua */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="flex-shrink-0 hover:scale-105 transition-transform">
                <img
                  src="/images/logo-ubertoua-alt.png"
                  alt="Université de Bertoua"
                  className="w-14 h-14 object-contain drop-shadow-md"
                />
              </a>
              <h2 className="text-2xl font-bold text-gray-900">Université de Bertoua</h2>
            </div>

            <div className="space-y-4">
              {/* Adresse */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Adresse</p>
                  <p className="text-gray-600">BP 652 Bertoua, Région de l'Est, Cameroun</p>
                </div>
              </div>

              {/* Téléphone Université */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Téléphone</p>
                  <a href="tel:+237222241050" className="text-primary-600 hover:text-primary-700">
                    +237 222 24 10 50
                  </a>
                </div>
              </div>

              {/* Email Université */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Email</p>
                  <a href="mailto:contact@univ-bertoua.cm" className="text-primary-600 hover:text-primary-700">
                    contact@univ-bertoua.cm
                  </a>
                </div>
              </div>

              {/* Site Web */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Site Web</p>
                  <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    www.univ-bertoua.cm
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux Sociaux Université */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="font-semibold text-gray-900 mb-4">Suivez-nous sur les réseaux sociaux</p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/univbertoua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center text-white transition-colors"
                  aria-label="Facebook"
                  title="Facebook - Université de Bertoua"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>

                {/* Twitter/X */}
                <a
                  href="https://twitter.com/univbertoua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-900 hover:bg-gray-800 rounded-lg flex items-center justify-center text-white transition-colors"
                  aria-label="Twitter/X"
                  title="Twitter/X - Université de Bertoua"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/school/universite-de-bertoua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-700 hover:bg-blue-800 rounded-lg flex items-center justify-center text-white transition-colors"
                  aria-label="LinkedIn"
                  title="LinkedIn - Université de Bertoua"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="https://www.youtube.com/@univ-bertoua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-colors"
                  aria-label="YouTube"
                  title="YouTube - Université de Bertoua"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Support Technique OrientUniv */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-riasec-enterprising/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-riasec-enterprising" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Support Technique</h2>
            </div>

            <div className="space-y-4">
              {/* Support Email */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-riasec-enterprising mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Email de support</p>
                  <a href="mailto:support@orientcam.cm" className="text-primary-600 hover:text-primary-700">
                    support@orientcam.cm
                  </a>
                </div>
              </div>

              {/* Contact Développeur */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-riasec-enterprising mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Contact Développeur</p>
                  <a href="tel:+237695683462" className="text-primary-600 hover:text-primary-700 block">
                    +237 695 683 462
                  </a>
                  <a href="https://wa.me/237695683462" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700 text-sm flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* Horaires */}
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-riasec-enterprising mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold text-gray-900">Horaires de support</p>
                  <p className="text-gray-600">Lundi - Vendredi: 8h00 - 17h00</p>
                  <p className="text-gray-600">Samedi: 9h00 - 13h00</p>
                </div>
              </div>
            </div>

            {/* Info TMS */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-primary-50 to-riasec-enterprising/10 rounded-lg p-4">
                <p className="font-semibold text-gray-900 mb-2">Développé par</p>
                <p className="text-primary-600 font-bold">TECH MAINT SERVICES (TMS)</p>
                <p className="text-sm text-gray-600 mt-1">Solutions technologiques innovantes</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Questions Fréquentes</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comment créer un compte ?</h3>
              <p className="text-gray-600">
                Cliquez sur "S'inscrire" en haut de la page et remplissez le formulaire avec vos informations.
                Vous recevrez un email de confirmation pour activer votre compte.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Le test RIASEC est-il gratuit ?</h3>
              <p className="text-gray-600">
                Oui, le test RIASEC est entièrement gratuit pour tous les étudiants. Il vous suffit de créer un compte
                pour y accéder et recevoir vos recommandations personnalisées.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Combien de temps dure le test ?</h3>
              <p className="text-gray-600">
                Le test RIASEC dure environ 10-15 minutes. Il comprend 30 questions sur vos intérêts professionnels
                et académiques.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Puis-je refaire le test ?</h3>
              <p className="text-gray-600">
                Oui, vous pouvez refaire le test à tout moment pour mettre à jour votre profil.
                Nous vous recommandons de le refaire tous les 6 mois pour suivre l'évolution de vos intérêts.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Comment sont calculées les recommandations ?</h3>
              <p className="text-gray-600">
                Nos recommandations sont basées sur un algorithme qui analyse votre profil RIASEC, vos notes académiques,
                vos valeurs professionnelles et les caractéristiques des programmes disponibles pour vous proposer
                les meilleures correspondances.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-12 border border-primary-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Vous n'avez pas trouvé de réponse ?</h3>
          <p className="text-gray-600 mb-6 text-lg">Notre équipe de support est prête à vous aider</p>
          <a
            href="mailto:support@orientcam.cm"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contactez le support
          </a>
        </div>
        </section>
      </main>

      <UBertouaFooter />
    </div>
  );
}
