'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store/authStore';
import {
  studentAPI,
  UpdateProfileData,
  CAMEROON_CITIES,
  EDUCATION_LEVELS,
  BAC_SERIES,
  FINANCIAL_SITUATIONS,
  USER_TYPES,
} from '@/lib/api/student';
import { ubertouaAPI, UNIVERSITY_LEVELS, Establishment, Department } from '@/lib/api/ubertoua';
import Link from 'next/link';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';

// ============================================================================
// Validation Schema
// ============================================================================

const profileSchema = z.object({
  user_type: z.enum(['new_bachelor', 'university_student']).default('new_bachelor'),
  university_establishment: z.string().optional().nullable().or(z.literal('')),
  university_department: z.string().optional().nullable().or(z.literal('')),
  university_level: z.string().optional().nullable().or(z.literal('')),
  first_name: z.string().min(2, 'Minimum 2 caractères'),
  last_name: z.string().min(2, 'Minimum 2 caractères'),
  phone: z
    .string()
    .regex(
      /^(\+237)?6[0-9]{8}$/,
      'Numéro invalide (ex: 6XXXXXXXX ou +2376XXXXXXXX)'
    )
    .optional()
    .or(z.literal('')),
  date_of_birth: z.string().optional().or(z.literal('')),
  gender: z.enum(['M', 'F', 'Autre']).optional().nullable().or(z.literal('')),
  city: z.string().optional().nullable().or(z.literal('')),
  region: z.string().optional().nullable().or(z.literal('')),
  current_education_level: z.string().optional().nullable().or(z.literal('')),
  bac_series: z.string().optional().nullable().or(z.literal('')),
  bac_year: z.coerce
    .number()
    .min(2000, 'Année invalide')
    .max(new Date().getFullYear(), 'Année invalide')
    .optional()
    .or(z.literal(NaN)),
  bac_grade: z.coerce
    .number()
    .min(0, 'Note invalide')
    .max(20, 'Note invalide')
    .optional()
    .or(z.literal(NaN)),
  financial_situation: z.string().optional().nullable().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ============================================================================
// Profile Page Component
// ============================================================================

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, fetchUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState<number>(10);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  // University data states
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingEstablishments, setLoadingEstablishments] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      user_type: 'new_bachelor',
    },
  });

  // Watch user_type for UI updates
  const selectedUserType = watch('user_type');
  const selectedEstablishment = watch('university_establishment');

  // ========================================
  // Load Establishments
  // ========================================

  useEffect(() => {
    const loadEstablishments = async () => {
      try {
        setLoadingEstablishments(true);
        const data = await ubertouaAPI.getEstablishments();
        setEstablishments(data);
      } catch (error) {
        console.error('Error loading establishments:', error);
      } finally {
        setLoadingEstablishments(false);
      }
    };

    loadEstablishments();
  }, []);

  // ========================================
  // Load Departments when Establishment changes
  // ========================================

  useEffect(() => {
    const loadDepartments = async () => {
      if (!selectedEstablishment) {
        setDepartments([]);
        return;
      }

      try {
        setLoadingDepartments(true);
        const data = await ubertouaAPI.getDepartments(selectedEstablishment);
        setDepartments(data);
      } catch (error) {
        console.error('Error loading departments:', error);
        setDepartments([]);
      } finally {
        setLoadingDepartments(false);
      }
    };

    loadDepartments();
  }, [selectedEstablishment]);

  // ========================================
  // Auth & Data Loading
  // ========================================

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.push('/login');
        return;
      }

      if (!user) {
        try {
          await fetchUser();
        } catch (err) {
          console.error('Failed to fetch user:', err);
          router.push('/login');
        }
      }
    };

    if (!authLoading) {
      checkAuth();
    }
  }, [authLoading, user, fetchUser, router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const profile = await studentAPI.getProfile();

        // Populate form with existing data
        reset({
          user_type: profile.user_type || 'new_bachelor',
          university_establishment: profile.university_establishment || '',
          university_department: profile.university_department || '',
          university_level: profile.university_level || '',
          first_name: profile.first_name,
          last_name: profile.last_name,
          phone: profile.phone || '',
          date_of_birth: profile.date_of_birth || '',
          gender: profile.gender,
          city: profile.city,
          region: profile.region,
          current_education_level: profile.current_education_level,
          bac_series: profile.bac_series,
          bac_year: profile.bac_year || NaN,
          bac_grade: profile.bac_grade || NaN,
          financial_situation: profile.financial_situation || '',
        });

        // Update completion percentage from API
        setCompletionPercentage(profile.completion_percentage || 10);

        // Load saved avatar from localStorage
        const savedAvatar = localStorage.getItem(`avatar_${user.id}`);
        if (savedAvatar) {
          setAvatarPreview(savedAvatar);
        }

        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load profile:', err);
        setError('Impossible de charger le profil');
        setIsLoading(false);
      }
    };

    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // ========================================
  // Form Submission
  // ========================================

  const onSubmit = async (data: ProfileFormData) => {
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Raw form data:', data);
    console.log('user_type value:', data.user_type);
    console.log('user_type type:', typeof data.user_type);

    // Clear previous missing fields
    setMissingFields([]);
    setError(null);
    setSuccess(null);

    // Validate required fields for university students
    if (data.user_type === 'university_student') {
      const missing: string[] = [];

      if (!data.university_establishment || data.university_establishment.trim() === '') {
        missing.push('university_establishment');
      }
      if (!data.university_department || data.university_department.trim() === '') {
        missing.push('university_department');
      }
      if (!data.university_level || data.university_level.trim() === '') {
        missing.push('university_level');
      }

      if (missing.length > 0) {
        setMissingFields(missing);
        setError('Veuillez remplir tous les champs obligatoires marqués en rouge (Établissement, Département, Niveau).');
        // Scroll to the error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Validate required fields for new bachelors
    if (data.user_type === 'new_bachelor') {
      const missing: string[] = [];

      if (!data.bac_series || data.bac_series.trim() === '') {
        missing.push('bac_series');
      }
      if (!data.current_education_level || data.current_education_level.trim() === '') {
        missing.push('current_education_level');
      }

      if (missing.length > 0) {
        setMissingFields(missing);
        setError('Veuillez remplir tous les champs obligatoires marqués en rouge (Série du bac, Niveau d\'études).');
        // Scroll to the error
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setIsSaving(true);

    try {
      // Clean up data - send undefined for empty fields to allow clearing them
      const updateData: UpdateProfileData = {
        user_type: data.user_type,
        university_establishment: data.university_establishment || undefined,
        university_department: data.university_department || undefined,
        university_level: data.university_level || undefined,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone || undefined,
        date_of_birth: data.date_of_birth || undefined,
        gender: data.gender || undefined,
        city: data.city || undefined,
        region: data.region || undefined,
        current_education_level: data.current_education_level || undefined,
        bac_series: data.bac_series || undefined,
        bac_year: data.bac_year && !isNaN(data.bac_year) ? data.bac_year : undefined,
        bac_grade: data.bac_grade && !isNaN(data.bac_grade) ? data.bac_grade : undefined,
        financial_situation: data.financial_situation || undefined,
      };

      console.log('Update data being sent:', updateData);
      const response = await studentAPI.updateProfile(updateData);
      console.log('API response:', response);
      // Refresh user data
      await fetchUser();

      // Reload profile to update form with saved data
      const updatedProfile = await studentAPI.getProfile();
      console.log('Profile after update:', updatedProfile);
      console.log('user_type from API:', updatedProfile.user_type);
      reset({
        user_type: updatedProfile.user_type || 'new_bachelor',
        university_establishment: updatedProfile.university_establishment || '',
        university_department: updatedProfile.university_department || '',
        university_level: updatedProfile.university_level || '',
        first_name: updatedProfile.first_name,
        last_name: updatedProfile.last_name,
        phone: updatedProfile.phone || '',
        date_of_birth: updatedProfile.date_of_birth || '',
        gender: updatedProfile.gender,
        city: updatedProfile.city,
        region: updatedProfile.region,
        current_education_level: updatedProfile.current_education_level,
        bac_series: updatedProfile.bac_series,
        bac_year: updatedProfile.bac_year || NaN,
        bac_grade: updatedProfile.bac_grade || NaN,
        financial_situation: updatedProfile.financial_situation || '',
      });

      // Update completion percentage
      setCompletionPercentage(updatedProfile.completion_percentage || 10);

      setSuccess('Profil mis à jour avec succès !');
      setIsSaving(false);

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(
        err.response?.data?.detail || 'Erreur lors de la mise à jour du profil'
      );
      setIsSaving(false);

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ========================================
  // Avatar Upload
  // ========================================

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('L\'image ne doit pas dépasser 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const avatarData = reader.result as string;
      setAvatarPreview(avatarData);

      // Save to localStorage
      if (user?.id) {
        localStorage.setItem(`avatar_${user.id}`, avatarData);
      }

      setSuccess('Photo de profil mise à jour avec succès !');

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  const profile = user.student_profile;

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content - GitHub Style Two Column Layout */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:gap-6">
          {/* Left Sidebar - Profile Overview */}
          <aside className="lg:w-64 mb-8 lg:mb-0 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 sticky top-24">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative group">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {/* Avatar circle - clickable */}
                  <div
                    onClick={handleAvatarClick}
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                  >
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span>{profile?.first_name?.[0]}{profile?.last_name?.[0]}</span>
                    )}
                  </div>

                  {/* Camera icon overlay on hover */}
                  <div
                    onClick={handleAvatarClick}
                    className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all cursor-pointer"
                  >
                    <svg
                      className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>

                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {profile?.first_name} {profile?.last_name}
                </h2>
                <p className="text-sm text-gray-600">{user.email}</p>
                <span className="mt-2 px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  Étudiant
                </span>
                <button
                  onClick={handleAvatarClick}
                  className="mt-2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  📸 Changer la photo
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{completionPercentage}%</div>
                  <div className="text-xs text-gray-600 mt-1">Complété</div>
                </div>
                <div className="text-center border-l border-r border-gray-200">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="text-xs text-gray-600 mt-1">Tests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">0</div>
                  <div className="text-xs text-gray-600 mt-1">Filières</div>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Complétion du profil</span>
                  <span className="text-sm font-bold text-primary-600">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                {completionPercentage < 100 && (
                  <p className="mt-3 text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    ⚡ Complétez votre profil pour débloquer toutes les fonctionnalités
                  </p>
                )}
              </div>

              {/* Quick Links */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <Link href="/profile/grades" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Notes académiques</span>
                </Link>
                <Link href="/profile/values" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Valeurs professionnelles</span>
                </Link>
                <Link href="/test-riasec" className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Test RIASEC</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Right Content - Profile Form */}
          <div className="flex-1">
            {/* Breadcrumb */}
            <div className="mb-6">
              <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au tableau de bord
              </Link>
            </div>

            {/* Page Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                🎯 Paramètres du profil
              </h2>
              <p className="text-gray-600">
                Gérez vos informations personnelles et académiques
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
          <div className="mb-6 bg-red-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-lg flex items-start gap-3 shadow-lg animate-pulse">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold text-lg">❌ {error}</span>
          </div>
        )}

        {/* Profile Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)(e);
          }}
          className="space-y-8"
        >
          {/* User Type Selection */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Type de profil
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Sélectionnez votre situation actuelle pour une orientation personnalisée
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-amber-700">
                <strong>Important:</strong> N'oubliez pas de cliquer sur "Enregistrer les modifications" en bas de la page pour sauvegarder votre choix.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {USER_TYPES.map((userTypeOption) => {
                const isSelected = selectedUserType === userTypeOption.id;
                return (
                  <div
                    key={userTypeOption.id}
                    onClick={() => {
                      if (!isSaving) {
                        setValue('user_type', userTypeOption.id as 'new_bachelor' | 'university_student', { shouldDirty: true });
                        console.log('User type set to:', userTypeOption.id);
                      }
                    }}
                    className={`relative flex cursor-pointer rounded-xl border-2 p-4 shadow-sm focus:outline-none transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                        : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-50/50'
                    }`}
                  >
                    <input
                      type="hidden"
                      {...register('user_type')}
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-semibold text-gray-900">
                          {userTypeOption.id === 'new_bachelor' ? '📚 ' : '🎓 '}
                          {userTypeOption.label}
                        </span>
                        <span className="mt-1 flex items-center text-sm text-gray-500">
                          {userTypeOption.description}
                        </span>
                      </span>
                    </span>
                    {isSelected && (
                      <svg
                        className="h-6 w-6 text-primary-600 flex-shrink-0"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* University Information - Only for university students */}
          {selectedUserType === 'university_student' && (
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                Informations Universitaires
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Sélectionnez votre établissement, département et niveau actuel
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Establishment */}
                <div>
                  <label htmlFor="university_establishment" className="block text-sm font-medium text-gray-700 mb-2">
                    Établissement <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('university_establishment')}
                    id="university_establishment"
                    disabled={isSaving || loadingEstablishments}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      missingFields.includes('university_establishment')
                        ? 'border-red-500 border-2 bg-red-50 animate-pulse focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                    }`}
                    onChange={(e) => {
                      setValue('university_establishment', e.target.value);
                      // Reset department and level when establishment changes
                      setValue('university_department', '');
                      setValue('university_level', '');
                      // Remove from missing fields if value is set
                      if (e.target.value) {
                        setMissingFields(prev => prev.filter(f => f !== 'university_establishment'));
                      }
                    }}
                  >
                    <option value="">Sélectionnez un établissement</option>
                    {establishments.map((est) => (
                      <option key={est.id} value={est.id}>
                        {est.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label htmlFor="university_department" className="block text-sm font-medium text-gray-700 mb-2">
                    Département/Filière <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('university_department')}
                    id="university_department"
                    disabled={isSaving || loadingDepartments || !selectedEstablishment}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      missingFields.includes('university_department')
                        ? 'border-red-500 border-2 bg-red-50 animate-pulse focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                    }`}
                    onChange={(e) => {
                      setValue('university_department', e.target.value);
                      // Reset level when department changes
                      setValue('university_level', '');
                      // Remove from missing fields if value is set
                      if (e.target.value) {
                        setMissingFields(prev => prev.filter(f => f !== 'university_department'));
                      }
                    }}
                  >
                    <option value="">Sélectionnez un département</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                  {!selectedEstablishment && (
                    <p className="mt-1 text-xs text-gray-500">
                      Sélectionnez d'abord un établissement
                    </p>
                  )}
                </div>

                {/* Level */}
                <div>
                  <label htmlFor="university_level" className="block text-sm font-medium text-gray-700 mb-2">
                    Niveau <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('university_level')}
                    id="university_level"
                    disabled={isSaving}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
                      missingFields.includes('university_level')
                        ? 'border-red-500 border-2 bg-red-50 animate-pulse focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-primary-500 focus:border-transparent'
                    }`}
                    onChange={(e) => {
                      setValue('university_level', e.target.value);
                      // Remove from missing fields if value is set
                      if (e.target.value) {
                        setMissingFields(prev => prev.filter(f => f !== 'university_level'));
                      }
                    }}
                  >
                    <option value="">Sélectionnez un niveau</option>
                    {UNIVERSITY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Informations personnelles
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('first_name')}
                  type="text"
                  id="first_name"
                  className="input"
                  disabled={isSaving}
                />
                {errors.first_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.first_name.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('last_name')}
                  type="text"
                  id="last_name"
                  className="input"
                  disabled={isSaving}
                />
                {errors.last_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.last_name.message}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Genre
                </label>
                <select {...register('gender')} id="gender" className="input" disabled={isSaving}>
                  <option value="">Sélectionner...</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div>
                <label htmlFor="date_of_birth" className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  {...register('date_of_birth')}
                  type="date"
                  id="date_of_birth"
                  className="input"
                  disabled={isSaving}
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  id="phone"
                  className="input"
                  placeholder="6XXXXXXXX"
                  disabled={isSaving}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  Ville de résidence
                </label>
                <select {...register('city')} id="city" className="input" disabled={isSaving}>
                  <option value="">Sélectionner...</option>
                  {CAMEROON_CITIES.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Parcours académique
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Current Level */}
              <div>
                <label htmlFor="current_education_level" className="block text-sm font-medium text-gray-700 mb-2">
                  {selectedUserType === 'new_bachelor' ? 'Niveau avant le Bac' : 'Niveau d\'études actuel'} {selectedUserType === 'new_bachelor' && <span className="text-red-500">*</span>}
                </label>
                <select
                  {...register('current_education_level')}
                  id="current_education_level"
                  className={`input ${
                    missingFields.includes('current_education_level')
                      ? 'border-red-500 border-2 bg-red-50 animate-pulse focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  disabled={isSaving}
                  onChange={(e) => {
                    setValue('current_education_level', e.target.value);
                    if (e.target.value) {
                      setMissingFields(prev => prev.filter(f => f !== 'current_education_level'));
                    }
                  }}
                >
                  <option value="">Sélectionner...</option>
                  {selectedUserType === 'new_bachelor' ? (
                    // For new bachelors, only show Terminale
                    <option value="Terminale">Terminale</option>
                  ) : (
                    // For university students, show all levels
                    EDUCATION_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))
                  )}
                </select>
                {selectedUserType === 'new_bachelor' && (
                  <p className="mt-1 text-xs text-gray-500 italic">
                    Seul "Terminale" est disponible pour les nouveaux bacheliers
                  </p>
                )}
              </div>

              {/* BAC Grade */}
              <div>
                <label htmlFor="bac_grade" className="block text-sm font-medium text-gray-700 mb-2">
                  Note du Baccalauréat (/20)
                </label>
                <input
                  {...register('bac_grade')}
                  type="number"
                  id="bac_grade"
                  className="input"
                  placeholder="Ex: 15"
                  min="0"
                  max="20"
                  step="0.01"
                  disabled={isSaving}
                />
                {errors.bac_grade && (
                  <p className="mt-1 text-sm text-red-600">{errors.bac_grade.message}</p>
                )}
              </div>

              {/* BAC Series */}
              <div>
                <label htmlFor="bac_series" className="block text-sm font-medium text-gray-700 mb-2">
                  Série du Baccalauréat {selectedUserType === 'new_bachelor' && <span className="text-red-500">*</span>}
                </label>
                <select
                  {...register('bac_series')}
                  id="bac_series"
                  className={`input ${
                    missingFields.includes('bac_series')
                      ? 'border-red-500 border-2 bg-red-50 animate-pulse focus:ring-red-500 focus:border-red-500'
                      : ''
                  }`}
                  disabled={isSaving}
                  onChange={(e) => {
                    setValue('bac_series', e.target.value);
                    if (e.target.value) {
                      setMissingFields(prev => prev.filter(f => f !== 'bac_series'));
                    }
                  }}
                >
                  <option value="">Sélectionner...</option>
                  {BAC_SERIES.map((series) => (
                    <option key={series} value={series}>
                      {series}
                    </option>
                  ))}
                </select>
              </div>

              {/* BAC Year */}
              <div>
                <label htmlFor="bac_year" className="block text-sm font-medium text-gray-700 mb-2">
                  Année d'obtention du Bac
                </label>
                <input
                  {...register('bac_year')}
                  type="number"
                  id="bac_year"
                  className="input"
                  placeholder="Ex: 2020"
                  min="2000"
                  max={new Date().getFullYear()}
                  disabled={isSaving}
                />
                {errors.bac_year && (
                  <p className="mt-1 text-sm text-red-600">{errors.bac_year.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Situation */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center text-primary-600 font-bold text-base">
                <span>₣</span>
              </div>
              Situation financière
            </h3>

            <div>
              <label htmlFor="financial_situation" className="block text-sm font-medium text-gray-700 mb-2">
                Capacité financière (optionnel)
              </label>
              <select
                {...register('financial_situation')}
                id="financial_situation"
                className="input"
                disabled={isSaving}
              >
                <option value="">Sélectionnez votre capacité financière</option>
                {FINANCIAL_SITUATIONS.map((situation) => (
                  <option key={situation} value={situation}>
                    {situation}
                  </option>
                ))}
              </select>
              {errors.financial_situation && (
                <p className="mt-1 text-sm text-red-600">{errors.financial_situation.message}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Cette information aide à recommander des programmes adaptés à vos moyens financiers
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <Link href="/dashboard" className="btn btn-outline">
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="btn btn-primary"
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
                'Enregistrer les modifications'
              )}
            </button>
          </div>
        </form>

            {/* Additional Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {/* Academic Grades */}
              <Link href="/profile/grades" className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-riasec-investigative/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-riasec-investigative" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Notes académiques</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Ajoutez vos notes pour des recommandations précises
                    </p>
                    <span className="text-primary-600 text-xs font-medium">
                      Gérer mes notes →
                    </span>
                  </div>
                </div>
              </Link>

              {/* Professional Values */}
              <Link href="/profile/values" className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-riasec-social/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-riasec-social" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Valeurs professionnelles</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Définissez vos priorités et aspirations
                    </p>
                    <span className="text-primary-600 text-xs font-medium">
                      Évaluer mes valeurs →
                    </span>
                  </div>
                </div>
              </Link>

              {/* RIASEC Test */}
              <Link href="/test-riasec" className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 hover:shadow-xl hover:border-primary-200 transition-all transform hover:scale-105">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-riasec-realistic/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-riasec-realistic" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">Test RIASEC</h3>
                    <p className="text-xs text-gray-600 mb-2">
                      Découvrez vos profils professionnels
                    </p>
                    <span className="text-primary-600 text-xs font-medium">
                      Commencer le test →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <UBertouaFooter />
    </div>
  );
}
