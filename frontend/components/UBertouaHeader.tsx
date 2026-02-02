'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

interface UBertouaHeaderProps {
  showAuth?: boolean;
}

export default function UBertouaHeader({ showAuth = true }: UBertouaHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo et nom de l'université */}
          <div className="flex items-center gap-3 group">
            {/* Logo UBertoua - clickable to university website */}
            <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 hover:scale-105 transition-transform duration-200">
              <Image
                src="/images/logo-ubertoua-alt.png"
                alt="Université de Bertoua"
                width={56}
                height={56}
                className="w-full h-full object-contain drop-shadow-md"
                priority
              />
            </a>

            {/* Divider */}
            <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

            {/* Branding - clickable to homepage */}
            <Link href="/" className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">OrientUniv</span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-ubertoua-blue/10 text-ubertoua-blue text-xs font-semibold rounded-full border border-ubertoua-blue/20">
                  UBertoua
                </span>
              </div>
              <span className="hidden md:block text-xs text-gray-600 font-medium">
                Université de Bertoua
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavLink href="/dashboard" active={pathname === '/dashboard'} prefetch={true}>
              Tableau de bord
            </NavLink>
            <NavLink href="/programs" active={pathname === '/programs'} prefetch={true}>
              Programmes
            </NavLink>
            <NavLink href="/test-riasec" active={pathname.startsWith('/test-riasec')} prefetch={true}>
              Test RIASEC
            </NavLink>
            <NavLink href="/recommendations" active={pathname === '/recommendations'} prefetch={true}>
              Recommandations
            </NavLink>
          </nav>

          {/* Actions */}
          {showAuth && (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                prefetch={true}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-ubertoua-blue hover:bg-gray-50 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profil
              </Link>
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="lg:hidden border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <MobileNavLink href="/dashboard" active={pathname === '/dashboard'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs">Accueil</span>
            </MobileNavLink>
            <MobileNavLink href="/programs" active={pathname === '/programs'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs">Programmes</span>
            </MobileNavLink>
            <MobileNavLink href="/test-riasec" active={pathname.startsWith('/test-riasec')}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <span className="text-xs">Test</span>
            </MobileNavLink>
            <MobileNavLink href="/profile" active={pathname === '/profile'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs">Profil</span>
            </MobileNavLink>
            <button
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="text-xs">Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function NavLink({ href, active, prefetch = true, children }: { href: string; active: boolean; prefetch?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={prefetch}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
        active
          ? 'bg-ubertoua-blue/10 text-ubertoua-blue'
          : 'text-gray-700 hover:text-ubertoua-blue hover:bg-gray-50'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      prefetch={true}
      className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'text-ubertoua-blue bg-ubertoua-blue/10'
          : 'text-gray-600 hover:text-ubertoua-blue'
      }`}
    >
      {children}
    </Link>
  );
}
