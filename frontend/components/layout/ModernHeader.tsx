import Link from "next/link";
import Image from "next/image";

export default function ModernHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group">
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
            <Link href="/about" className="hidden md:inline-flex text-gray-700 hover:text-primary-600 font-medium transition-colors">
              À propos
            </Link>
            <Link href="/contact" className="hidden md:inline-flex text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Contact
            </Link>
            <Link href="/login" className="text-gray-700 hover:text-primary-600 font-medium transition-colors">
              Connexion
            </Link>
            <Link href="/register" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-lg font-medium hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all shadow-md hover:shadow-lg">
              Commencer
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
