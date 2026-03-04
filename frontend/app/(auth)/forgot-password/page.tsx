'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authAPI } from '@/lib/api/auth';
import UBertouaFooter from '@/components/UBertouaFooter';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email invalide'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await authAPI.forgotPassword(data.email.trim());
      setSuccess(response.message);
    } catch (err: any) {
      if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
        setError('Impossible de se connecter au serveur. Veuillez réessayer.');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        setError(err.response?.data?.detail || 'Une erreur est survenue. Veuillez réessayer.');
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
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-ubertoua-blue to-primary-700 bg-clip-text text-transparent">
                    OrientUniv
                  </h1>
                </div>
                <span className="text-xs text-gray-600 font-medium">
                  Université de Bertoua
                </span>
              </Link>
            </div>
            <p className="text-lg text-gray-600 mt-2">Mot de passe oublié</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
            {success ? (
              /* Succès */
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Email envoyé</h2>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  {success}
                </p>
                <p className="text-xs text-gray-500 mb-6">
                  Vérifiez votre boîte de réception et vos spams. Le lien expire dans 15 minutes.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              /* Formulaire */
              <>
                <p className="text-sm text-gray-600 mb-6 text-center">
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); handleSubmit(onSubmit)(e); }} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      id="email"
                      className="input"
                      placeholder="exemple@email.com"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </span>
                    ) : (
                      'Envoyer le lien de réinitialisation'
                    )}
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Vous vous souvenez de votre mot de passe ?{' '}
                <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
      <UBertouaFooter />
    </div>
  );
}
