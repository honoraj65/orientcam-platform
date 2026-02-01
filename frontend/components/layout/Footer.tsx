import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container-mobile py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-primary-600 mb-4">OrientCam</h3>
            <p className="text-sm text-gray-600 mb-4">
              Plateforme d'orientation académique et professionnelle pour les étudiants camerounais.
            </p>
            <p className="text-xs text-gray-500">
              Université de Bertoua
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Programmes
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Connexion
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Ressources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/test-riasec" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Test RIASEC
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Recommandations
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Tableau de bord
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} OrientCam. Tous droits réservés.
          </p>

          <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
            <span>Fait avec ❤️ au Cameroun</span>
            <span className="text-xs text-gray-500">Powered by TECH MAINT SERVICES (TMS)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
