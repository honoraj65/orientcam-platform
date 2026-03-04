'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '@/lib/api/auth';
import UBertouaFooter from '@/components/UBertouaFooter';

const resetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(8, 'Minimum 8 caractères')
      .regex(/[A-Z]/, 'Au moins une majuscule')
      .regex(/[a-z]/, 'Au moins une minuscule')
      .regex(/[0-9]/, 'Au moins un chiffre')
      .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Au moins un caractère spécial (!@#$%...)'),
    confirm_password: z.string().min(1, 'Confirmez le mot de passe'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirm_password'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    if (!token || !email) {
      setError('Lien de réinitialisation invalide. Veuillez refaire une demande.');
    }
  }, [token, email]);

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token || !email) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await authAPI.resetPassword(email, token, data.new_password);
      setSuccess(true);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Veuillez réessayer.');
      } else if (err.response?.status === 422) {
        const detail = err.response?.data?.detail;
        if (Array.isArray(detail)) {
          setError(detail.map((d: any) => d.msg || d.message || JSON.stringify(d)).join('. '));
        } else {
          setError(typeof detail === 'string' ? detail : 'Données invalides.');
        }
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.detail || 'Lien expiré ou invalide. Veuillez refaire une demande.');
      } else {
        setError(err.response?.data?.detail || 'Une erreur est survenue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-3 group mb-4">
              <a href="https://www.univ-bertoua.cm" target="_blank" rel="noopener noreferrer" className="relative w-16 h-16 flex-shrink-0 hover:scale-105 transition-transform duration-200">
                <Image
                  src="/images/logo-ubertoua-alt.png"
                  alt="Université de Bertoua"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain drop-shadow-md"
                  priority
                />
              </a>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
              <Link href="/" className="flex flex-col items-start">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">
                  OrientUniv
                </h1>
                <span className="text-xs text-gray-600 font-medium">
                  Université de Bertoua
                </span>
              </Link>
            </div>
            <p className="text-lg text-gray-600 mt-2">Nouveau mot de passe</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            {success ? (
              /* Succès */
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Mot de passe modifié</h2>
                <p className="text-gray-600 mb-6 text-sm">
                  Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg"
                >
                  Se connecter
                </Link>
              </div>
            ) : (
              /* Formulaire */
              <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit(onSubmit)(e); }} className="space-y-5">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                    {error.includes('expiré') && (
                      <div className="mt-2">
                        <Link href="/forgot-password" className="font-semibold text-red-800 hover:underline">
                          Refaire une demande
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {email && (
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
                    Réinitialisation pour : <strong>{email}</strong>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      {...register('new_password')}
                      type={showPassword ? 'text' : 'password'}
                      id="new_password"
                      className="input pr-12"
                      placeholder="••••••••"
                      disabled={isSubmitting || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.new_password.message}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      {...register('confirm_password')}
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm_password"
                      className="input pr-12"
                      placeholder="••••••••"
                      disabled={isSubmitting || !token}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors focus:outline-none"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirm_password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !token}
                  className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Réinitialisation...
                    </span>
                  ) : (
                    'Réinitialiser le mot de passe'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
      <UBertouaFooter />
    </div>
  );
}
