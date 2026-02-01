'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import {
  studentAPI,
  ProfessionalValuesAssessment,
  PROFESSIONAL_VALUES,
} from '@/lib/api/student';
import Link from 'next/link';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

// ============================================================================
// Professional Values Page Component
// ============================================================================

export default function ValuesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading, fetchUser } = useAuthStore();
  const [values, setValues] = useState<Record<string, number>>({});
  const [touchedValues, setTouchedValues] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Values
  // ========================================

  useEffect(() => {
    const loadValues = async () => {
      if (!user) return;

      try {
        const data = await studentAPI.getValues();

        if (data) {
          // Data exists, use it
          const valuesObj: Record<string, number> = {
            autonomy: data.autonomy,
            creativity: data.creativity,
            helping_others: data.helping_others,
            job_security: data.job_security,
            salary: data.salary,
            work_life_balance: data.work_life_balance,
            prestige: data.prestige,
            variety: data.variety,
          };
          setValues(valuesObj);
          // Mark all loaded values as touched since they were saved before
          setTouchedValues(new Set(Object.keys(valuesObj)));
        } else {
          // No data yet, initialize with defaults
          const defaultValues: Record<string, number> = {};
          PROFESSIONAL_VALUES.forEach((pv) => {
            defaultValues[pv.name] = 3;
          });
          setValues(defaultValues);
          // Nothing is touched yet
          setTouchedValues(new Set());
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load values:', err);

        // Initialize with defaults on error
        const defaultValues: Record<string, number> = {};
        PROFESSIONAL_VALUES.forEach((pv) => {
          defaultValues[pv.name] = 3;
        });
        setValues(defaultValues);
        setTouchedValues(new Set());
        setIsLoading(false);
      }
    };

    if (user) {
      loadValues();
    }
  }, [user]);

  // ========================================
  // Handlers
  // ========================================

  const handleValueChange = (valueName: string, importance: number) => {
    setValues({
      ...values,
      [valueName]: importance,
    });
    // Mark this value as touched
    setTouchedValues(prev => new Set(prev).add(valueName));
  };

  const handleReset = () => {
    // Reset all values to default (3)
    const defaultValues: Record<string, number> = {};
    PROFESSIONAL_VALUES.forEach((pv) => {
      defaultValues[pv.name] = 3;
    });
    setValues(defaultValues);

    // Clear all touched values
    setTouchedValues(new Set());

    // Clear any messages
    setError(null);
    setSuccess(null);

    // Close the confirmation dialog
    setShowResetConfirm(false);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = async () => {
    // Check if all values have been touched
    if (touchedValues.size < PROFESSIONAL_VALUES.length) {
      setError('Veuillez évaluer toutes les valeurs professionnelles avant d\'enregistrer.');
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const assessment: ProfessionalValuesAssessment = {
        autonomy: values.autonomy || 3,
        creativity: values.creativity || 3,
        helping_others: values.helping_others || 3,
        job_security: values.job_security || 3,
        salary: values.salary || 3,
        work_life_balance: values.work_life_balance || 3,
        prestige: values.prestige || 3,
        variety: values.variety || 3,
      };

      const savedData = await studentAPI.saveValues(assessment);

      // Update state with saved data
      const valuesObj: Record<string, number> = {
        autonomy: savedData.autonomy,
        creativity: savedData.creativity,
        helping_others: savedData.helping_others,
        job_security: savedData.job_security,
        salary: savedData.salary,
        work_life_balance: savedData.work_life_balance,
        prestige: savedData.prestige,
        variety: savedData.variety,
      };
      setValues(valuesObj);

      // Refresh user data to update completion percentage
      await fetchUser();

      setSuccess('Valeurs professionnelles enregistrées avec succès !');
      setIsSaving(false);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Values save error:', err);
      setError(
        err.response?.data?.detail ||
          'Erreur lors de l\'enregistrement des valeurs'
      );
      setIsSaving(false);
    }
  };

  // ========================================
  // Calculate Statistics
  // ========================================

  const getTopValues = () => {
    return Object.entries(values)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([name]) => {
        const value = PROFESSIONAL_VALUES.find((v) => v.name === name);
        return value?.label || name;
      });
  };

  const getCompletionPercentage = () => {
    // Count only the values that have been touched/modified by the user
    return Math.round((touchedValues.size / PROFESSIONAL_VALUES.length) * 100);
  };

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const topValues = getTopValues();
  const completionPercentage = getCompletionPercentage();

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au profil
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Valeurs Professionnelles
          </h2>
          <p className="text-gray-600">
            Évaluez l'importance de chaque valeur pour votre carrière future (1 = Pas important, 5 = Très important)
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-lg animate-pulse">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-semibold text-lg">✅ {success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3 shadow-lg">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-semibold text-lg mb-1">❌ {error}</p>
              <p className="text-sm text-red-600">
                {PROFESSIONAL_VALUES.length - touchedValues.size} valeur(s) restante(s) à évaluer.
                Les sections non complétées sont surlignées en rouge ci-dessous.
              </p>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="card bg-primary-50 border-primary-200">
            <p className="text-sm text-gray-600 mb-1">Progression</p>
            <div className="flex items-center gap-3">
              <p className="text-3xl font-bold text-primary-600">
                {completionPercentage}%
              </p>
              <div className="flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-purple-50 border-purple-200">
            <p className="text-sm text-gray-600 mb-2">Vos valeurs principales</p>
            <div className="space-y-1">
              {topValues.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-purple-600 font-semibold">{index + 1}.</span>
                  <span className="text-sm text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values Assessment */}
        <div className="card">
          <div className="space-y-6">
            {PROFESSIONAL_VALUES.map((value) => (
              <div
                key={value.name}
                className={`border-b pb-6 last:border-0 last:pb-0 transition-colors ${
                  error && !touchedValues.has(value.name)
                    ? 'border-red-200 bg-red-50 -mx-6 px-6 rounded-lg'
                    : 'border-gray-100'
                }`}
              >
                <div className="mb-3">
                  <h3 className={`font-semibold mb-1 ${
                    error && !touchedValues.has(value.name) ? 'text-red-700' : 'text-gray-900'
                  }`}>
                    {value.label}
                    {error && !touchedValues.has(value.name) && (
                      <span className="ml-2 text-red-600 text-sm">*</span>
                    )}
                  </h3>
                  <p className={`text-sm ${
                    error && !touchedValues.has(value.name) ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {value.description}
                  </p>
                </div>

                {/* Desktop: Radio buttons */}
                <div className="hidden sm:flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500 w-24">Pas important</span>
                  <div className="flex gap-6">
                    {[1, 2, 3, 4, 5].map((importance) => (
                      <label
                        key={importance}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                        onClick={() => {
                          // Mark as touched even if clicking the already selected value
                          handleValueChange(value.name, importance);
                        }}
                      >
                        <input
                          type="radio"
                          name={value.name}
                          value={importance}
                          checked={values[value.name] === importance}
                          onChange={() => handleValueChange(value.name, importance)}
                          style={{
                            accentColor: touchedValues.has(value.name) ? '#2563eb' : '#9ca3af'
                          }}
                          className={`w-5 h-5 focus:ring-2 cursor-pointer ${
                            touchedValues.has(value.name)
                              ? 'focus:ring-blue-500'
                              : 'focus:ring-gray-300'
                          }`}
                        />
                        <span className="text-xs text-gray-500 group-hover:text-primary-600">
                          {importance}
                        </span>
                      </label>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 w-24 text-right">Très important</span>
                </div>

                {/* Mobile: Range slider */}
                <div className="sm:hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Pas important</span>
                    <span className={`text-lg font-semibold ${
                      touchedValues.has(value.name) ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {values[value.name] || 3}
                    </span>
                    <span className="text-sm text-gray-500">Très important</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={values[value.name] || 3}
                    onChange={(e) =>
                      handleValueChange(value.name, parseInt(e.target.value))
                    }
                    style={{
                      accentColor: touchedValues.has(value.name) ? '#2563eb' : '#9ca3af'
                    }}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Current Value Badge */}
                <div className="mt-3 flex justify-center">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      touchedValues.has(value.name)
                        ? values[value.name] >= 4
                          ? 'bg-green-100 text-green-700'
                          : values[value.name] >= 3
                          ? 'bg-green-100 text-green-700'
                          : 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {values[value.name] === 5 && 'Très important'}
                    {values[value.name] === 4 && 'Important'}
                    {values[value.name] === 3 && 'Moyennement important'}
                    {values[value.name] === 2 && 'Peu important'}
                    {values[value.name] === 1 && 'Pas important'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between mt-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/profile" className="btn btn-outline">
              Retour
            </Link>
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={isSaving || touchedValues.size === 0}
              className="btn btn-outline text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Réinitialiser
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || touchedValues.size < PROFESSIONAL_VALUES.length}
            className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            title={touchedValues.size < PROFESSIONAL_VALUES.length ? 'Veuillez évaluer toutes les valeurs avant d\'enregistrer' : ''}
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              <>
                Enregistrer mes valeurs
                {touchedValues.size < PROFESSIONAL_VALUES.length && (
                  <span className="ml-2 text-xs">
                    ({touchedValues.size}/{PROFESSIONAL_VALUES.length})
                  </span>
                )}
              </>
            )}
          </button>
        </div>

        {/* Reset Confirmation Dialog (GitHub style) */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
              {/* Dialog Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Réinitialiser les valeurs professionnelles
                  </h3>
                  <p className="text-sm text-gray-600">
                    Cette action va réinitialiser toutes vos réponses à leur valeur par défaut.
                    Vous pourrez recommencer l'évaluation à zéro.
                  </p>
                </div>
              </div>

              {/* Warning Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Attention:</strong> Cette action ne peut pas être annulée.
                  Vos choix actuels seront perdus.
                </p>
              </div>

              {/* Dialog Actions */}
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button
                  onClick={handleReset}
                  className="btn bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  Oui, réinitialiser
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="card bg-blue-50 border-blue-200 mt-8">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-blue-600 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 mb-1">
                Pourquoi évaluer vos valeurs professionnelles ?
              </h4>
              <p className="text-sm text-blue-800">
                Vos valeurs professionnelles guident vos choix de carrière et votre satisfaction au travail.
                Elles nous permettent de vous recommander des programmes et métiers alignés avec ce qui compte
                vraiment pour vous dans votre vie professionnelle.
              </p>
            </div>
          </div>
        </div>
      </main>
      <UBertouaFooter />
    </div>
  );
}
