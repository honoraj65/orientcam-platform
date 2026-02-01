'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/store/authStore';
import {
  programsAPI,
  Program,
  ProgramFilters,
  EDUCATION_LEVELS,
  PROGRAM_DOMAINS,
  CAMEROON_UNIVERSITIES,
  formatCurrency,
  getDurationText,
} from '@/lib/api/programs';
import { getDimensionColor } from '@/lib/api/riasec';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

export default function ProgramsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProgramFilters>({
    limit: 18,  // Display 18 programs per page with pagination
    offset: 0,
  });
  const [showFilters, setShowFilters] = useState(false);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Programs
  // ========================================

  useEffect(() => {
    const loadPrograms = async () => {
      if (!user) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await programsAPI.list(filters);
        setPrograms(data.programs || []);
        setTotal(data.total || 0);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load programs:', err);
        setError('Impossible de charger les programmes');
        setPrograms([]);
        setTotal(0);
        setIsLoading(false);
      }
    };

    if (user) {
      loadPrograms();
    }
  }, [user, filters]);

  // ========================================
  // Handlers
  // ========================================

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      // Reset to list if search is empty
      setFilters({ ...filters, offset: 0 });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await programsAPI.search(searchQuery);
      setPrograms(results || []);
      setTotal((results || []).length);
      setIsLoading(false);
    } catch (err: any) {
      console.error('Search failed:', err);
      setError('Erreur lors de la recherche');
      setPrograms([]);
      setTotal(0);
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ProgramFilters, value: any) => {
    setFilters({
      ...filters,
      [key]: value === '' ? undefined : value,
      offset: 0, // Reset pagination
    });
  };

  const handleClearFilters = () => {
    setFilters({ limit: 18, offset: 0 });
    setSearchQuery('');
  };

  const handlePageChange = (page: number) => {
    const limit = filters.limit || 18;
    setFilters({
      ...filters,
      offset: (page - 1) * limit,
    });
    // Scroll to top of programs section
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination info
  const limit = filters.limit || 18;
  const currentPage = Math.floor((filters.offset || 0) / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // ========================================
  // Loading State
  // ========================================

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const hasFilters =
    filters.level ||
    filters.domain ||
    filters.university ||
    filters.riasec_code ||
    filters.scholarship_only;

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content */}
      <main className="container-mobile py-8 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au tableau de bord
          </Link>
        </div>

        {/* Modern Page Header with Icon */}
        <div className="mb-8 text-center">
          <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center mb-4">
            <img
              src="/images/logo-ubertoua-alt.png"
              alt="Université de Bertoua"
              className="w-20 h-20 object-contain"
            />
          </a>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Programmes de l'Université de Bertoua
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Découvrez les 76 formations proposées par les 8 établissements de l'UBertoua
          </p>

          {/* Quick Stats */}
          <div className="flex items-center justify-center gap-6 mt-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600"><span className="font-semibold text-gray-900">{total}</span> programmes</span>
            </div>
            {hasFilters && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Filtres actifs</span>
              </div>
            )}
          </div>
        </div>

        {/* Modern Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="p-6 bg-white border border-gray-300 rounded-lg">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un programme (ex: Informatique, Médecine...)"
                  className="input pl-12 text-base focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <button type="submit" className="btn btn-primary px-8">
                Rechercher
              </button>
            </div>
          </div>
        </form>

        {/* Filters Toggle (Mobile) */}
        <div className="mb-6 md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-outline w-full"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                clipRule="evenodd"
              />
            </svg>
            Filtres {hasFilters && `(${Object.keys(filters).length - 2})`}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Modern Filters Sidebar */}
          <div className={`md:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="p-6 sticky top-24 border border-gray-300 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Filtres</h3>
                </div>
                {hasFilters && (
                  <button
                    onClick={handleClearFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                  >
                    Réinitialiser
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {/* Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau
                  </label>
                  <select
                    value={filters.level || ''}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Tous les niveaux</option>
                    {EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Domain */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domaine
                  </label>
                  <select
                    value={filters.domain || ''}
                    onChange={(e) => handleFilterChange('domain', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Tous les domaines</option>
                    {PROGRAM_DOMAINS.map((domain) => (
                      <option key={domain} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                </div>

                {/* University - Hidden since only UBertoua for now */}
                {/*
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Université
                  </label>
                  <select
                    value={filters.university || ''}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    className="input text-sm"
                  >
                    <option value="">Toutes les universités</option>
                    {CAMEROON_UNIVERSITIES.map((university) => (
                      <option key={university} value={university}>
                        {university}
                      </option>
                    ))}
                  </select>
                </div>
                */}

                {/* Scholarship */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.scholarship_only || false}
                      onChange={(e) =>
                        handleFilterChange('scholarship_only', e.target.checked || undefined)
                      }
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">
                      Bourses disponibles
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Programs List */}
          <div className="md:col-span-3">
            {/* Results Count */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {isLoading ? (
                  'Chargement...'
                ) : (
                  <>
                    {total} programme{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
                  </>
                )}
              </p>
            </div>

            {/* Modern Error Message */}
            {error && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100/50 border-l-4 border-red-500 rounded-lg shadow-md">
                <div className="flex items-start gap-3 p-5">
                  <div className="flex-shrink-0">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-red-800 font-bold mb-1">Erreur</h4>
                    <p className="text-red-700">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="flex-shrink-0 text-red-600 hover:text-red-800"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Programs Grid */}
            {isLoading && (!programs || programs.length === 0) ? (
              <div className="text-center py-20">
                <div className="relative inline-flex">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-600 mt-4 font-medium">Chargement des programmes...</p>
              </div>
            ) : !programs || programs.length === 0 ? (
              <div className="text-center py-16">
                <div className="card max-w-md mx-auto p-10 shadow-lg">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aucun programme trouvé</h3>
                  <p className="text-gray-600 mb-6">
                    {hasFilters
                      ? "Essayez de modifier vos critères de recherche"
                      : "Il n'y a pas de programmes disponibles pour le moment"}
                  </p>
                  {hasFilters && (
                    <button onClick={handleClearFilters} className="btn btn-primary mx-auto">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programs && programs.map((program, index) => {
                  // Check if this is the start of a new department/faculty
                  const isNewDepartment = index === 0 || programs[index - 1].department !== program.department;

                  return (
                    <React.Fragment key={program.id}>
                      {/* Department/Faculty Separator */}
                      {isNewDepartment && (
                        <div className="col-span-2 flex items-center gap-4 mb-6 mt-8 py-6 px-6 bg-gradient-to-r from-primary-50 to-white border-l-4 border-primary-500 rounded-lg">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                              </svg>
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900">
                              {program.department}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {program.university || 'Université de Bertoua'} • {programs.filter(p => p.department === program.department).length} formation{programs.filter(p => p.department === program.department).length > 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Program Card */}
                      <Link
                        href={`/programs/${program.id}`}
                        className="group border border-gray-300 overflow-hidden bg-white rounded-lg hover:border-primary-500 transition-colors"
                      >
                        {/* Top Bar */}
                        <div className={`h-1 ${
                          program.level === 'Licence' ? 'bg-blue-500' :
                          program.level === 'Master' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}></div>

                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className={`px-3 py-1.5 rounded text-xs font-bold text-white ${
                                program.level === 'Licence' ? 'bg-blue-600' :
                                program.level === 'Master' ? 'bg-purple-600' :
                                'bg-orange-600'
                              }`}>
                                {program.level}
                              </span>
                              <span
                                className="px-3 py-1.5 rounded text-xs font-bold text-white"
                                style={{
                                  backgroundColor: getDimensionColor(program.riasec_primary),
                                }}
                              >
                                {program.riasec_primary}
                              </span>
                              <span className="px-2 py-1 border border-gray-300 rounded text-xs font-mono text-gray-600">{program.code}</span>
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-primary-600 transition-colors">
                              {program.name}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              {program.university || 'Université de Bertoua'}
                            </p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 mb-5 line-clamp-2 leading-relaxed">
                          {program.description}
                        </p>

                        {/* Info Grid with Modern Icons */}
                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div className="flex items-center gap-2.5 text-gray-700 border border-gray-300 rounded p-2.5">
                            <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm font-medium">{getDurationText(program.duration_years)}</span>
                          </div>

                          {program.employment_rate && (
                            <div className="flex items-center gap-2.5 text-gray-700 border border-gray-300 rounded p-2.5">
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                              </svg>
                              <span className="text-sm font-semibold">{program.employment_rate}%</span>
                            </div>
                          )}

                          {program.tuition_fee_fcfa && (
                            <div className="flex items-center gap-2.5 text-gray-700 border border-gray-300 rounded p-2.5 col-span-2">
                              <svg className="w-5 h-5 text-amber-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-bold">{formatCurrency(program.tuition_fee_fcfa)}</span>
                            </div>
                          )}

                          {program.scholarship_available && (
                            <div className="flex items-center gap-2.5 text-green-700 border border-green-600 rounded p-2.5 col-span-2">
                              <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm font-bold">Bourses disponibles</span>
                            </div>
                          )}
                        </div>

                        {/* University Footer */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span className="font-semibold">{program.university}</span>
                        </div>
                      </div>
                    </Link>
                    </React.Fragment>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="col-span-2 mt-10">
                    <div className="flex items-center justify-center gap-2">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1);

                        // Show ellipsis
                        const showEllipsisBefore = page === currentPage - 2 && currentPage > 3;
                        const showEllipsisAfter = page === currentPage + 2 && currentPage < totalPages - 2;

                        if (showEllipsisBefore || showEllipsisAfter) {
                          return (
                            <span key={page} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }

                        if (!showPage) return null;

                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              page === currentPage
                                ? 'bg-primary-600 text-white shadow-md'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                    {/* Page Info */}
                    <p className="text-sm text-gray-600 text-center mt-4">
                      Page {currentPage} sur {totalPages} • {total} programme{total > 1 ? 's' : ''} au total
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <UBertouaFooter />
    </div>
  );
}
