'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/store/authStore';
import {
  studentAPI,
  AcademicGrade,
  ACADEMIC_YEARS,
  TERMS,
  CURRICULUM_TYPES,
  SUBJECTS_BY_CURRICULUM,
  CurriculumType,
} from '@/lib/api/student';
import { ubertouaAPI } from '@/lib/api/ubertoua';
import Link from 'next/link';
import UBertouaHeader from '@/components/UBertouaHeader';
import UBertouaFooter from '@/components/UBertouaFooter';
import ProfileStepper from '@/components/ProfileStepper';

// ============================================================================
// Constants for University Students
// ============================================================================

const UNIVERSITY_SEMESTERS = [
  'Semestre 1',
  'Semestre 2',
  'Semestre 3',
  'Semestre 4',
  'Semestre 5',
  'Semestre 6',
];

const UNIVERSITY_LEVELS = [
  'Licence 1',
  'Licence 2',
  'Licence 3',
  'Master 1',
  'Master 2',
];

// Unités d'Enseignement (UE) types at University of Bertoua
const UE_TYPES = [
  'UE Fondamentales',
  'UE Complémentaires',
  'UE Transversales',
  'UE Optionnelles',
  'UE Professionnalisantes',
];

// Sample UE by department (can be extended)
const UNIVERSITY_SUBJECTS = [
  // Sciences et Technologies
  'Mathématiques Générales',
  'Analyse Mathématique',
  'Algèbre Linéaire',
  'Probabilités et Statistiques',
  'Physique Générale',
  'Mécanique',
  'Électromagnétisme',
  'Thermodynamique',
  'Chimie Générale',
  'Chimie Organique',
  'Biologie Cellulaire',
  'Biochimie',
  'Informatique Générale',
  'Algorithmique et Programmation',
  'Base de Données',
  'Réseaux et Télécommunications',
  'Génie Logiciel',
  // Lettres et Sciences Humaines
  'Méthodologie du Travail Universitaire',
  'Technique d\'Expression Française',
  'Anglais',
  'Introduction au Droit',
  'Économie Générale',
  'Sociologie Générale',
  'Psychologie Générale',
  'Histoire des Institutions',
  'Géographie Humaine',
  'Philosophie',
  // Gestion et Commerce
  'Comptabilité Générale',
  'Management des Organisations',
  'Marketing',
  'Droit des Affaires',
  'Économie d\'Entreprise',
  'Gestion des Ressources Humaines',
  'Finance d\'Entreprise',
  'Fiscalité',
  // Autre
  'Stage',
  'Projet Tuteuré',
  'Mémoire',
  'Autre UE',
];

// ============================================================================
// Validation Schema
// ============================================================================

const gradeSchema = z.object({
  subject: z.string().min(1, 'Matière requise'),
  grade: z.coerce
    .number()
    .min(0, 'Note minimale: 0')
    .max(20, 'Note maximale: 20'),
  coefficient: z.coerce
    .number()
    .min(1, 'Coefficient minimum: 1')
    .max(10, 'Coefficient maximum: 10'),
  academic_year: z.string().min(1, 'Année académique requise'),
  term: z.string().optional().default('Baccalaureat'),
});

type GradeFormData = z.infer<typeof gradeSchema>;

// ============================================================================
// Grades Page Component
// ============================================================================

export default function GradesPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [grades, setGrades] = useState<AcademicGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingGrade, setEditingGrade] = useState<AcademicGrade | null>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<CurriculumType>('francophone_general');
  const [userType, setUserType] = useState<'new_bachelor' | 'university_student'>('new_bachelor');
  const [universityUE, setUniversityUE] = useState<string[]>([]);
  const [loadingUE, setLoadingUE] = useState(false);
  const [universityInfo, setUniversityInfo] = useState<{
    establishment?: string;
    department?: string;
    level?: string;
  }>({});
  const [isProfileComplete, setIsProfileComplete] = useState(true);

  // Get subjects for the selected curriculum
  const availableSubjects = SUBJECTS_BY_CURRICULUM[selectedCurriculum];

  // All semesters are always available - student can fill any semester freely
  const availableSemesters = UNIVERSITY_SEMESTERS;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      academic_year: ACADEMIC_YEARS[0],
      term: userType === 'university_student' ? 'Semestre 1' : 'Baccalaureat',
      coefficient: 1,
    },
  });

  // ========================================
  // Auth Check
  // ========================================

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // ========================================
  // Load Grades and Profile
  // ========================================

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        // Load profile to get user_type and university info
        const profile = await studentAPI.getProfile();
        setUserType(profile.user_type || 'new_bachelor');

        // Store university info and check profile completion
        if (profile.user_type === 'university_student') {
          setUniversityInfo({
            establishment: profile.university_establishment,
            department: profile.university_department,
            level: profile.university_level,
          });

          // Check if profile is complete
          const profileComplete = !!(
            profile.university_establishment &&
            profile.university_department &&
            profile.university_level &&
            profile.university_establishment.trim() !== '' &&
            profile.university_department.trim() !== '' &&
            profile.university_level.trim() !== ''
          );

          setIsProfileComplete(profileComplete);

          // Load UE list if all university info is available and valid
          if (
            profileComplete &&
            profile.university_establishment &&
            profile.university_department &&
            profile.university_level
          ) {
            setLoadingUE(true);
            try {
              const ueList = await ubertouaAPI.getUE(
                profile.university_establishment,
                profile.university_department,
                profile.university_level
              );
              setUniversityUE(ueList);
            } catch (ueErr) {
              // Fallback to generic list if specific UE not found (silently)
              setUniversityUE(UNIVERSITY_SUBJECTS);
            } finally {
              setLoadingUE(false);
            }
          } else {
            // Use generic list if profile is incomplete
            setUniversityUE(UNIVERSITY_SUBJECTS);
          }
        }

        // Load grades
        const data = await studentAPI.getGrades();

        // Filter grades based on user type
        const filteredGrades = data.filter((grade) => {
          const isUniversitySemester = UNIVERSITY_SEMESTERS.includes(grade.term);

          if (profile.user_type === 'university_student') {
            // University students: only show university semesters (Semestre 1-6)
            return isUniversitySemester;
          } else {
            // New bachelors: only show bac terms (1er Trimestre, etc.)
            return !isUniversitySemester;
          }
        });

        setGrades(filteredGrades);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Failed to load data:', err);
        const detail = err.response?.data?.detail || err.message || 'Erreur inconnue';
        setError(`Impossible de charger les données: ${detail}`);
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // ========================================
  // Form Handlers
  // ========================================

  const handleOpenForm = () => {
    setShowForm(true);
    // Set the first available semester for university students
    if (userType === 'university_student' && availableSemesters.length > 0) {
      setTimeout(() => {
        setValue('term', availableSemesters[0]);
      }, 0);
    }
  };

  const onSubmit = async (data: GradeFormData) => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (editingGrade) {
        // Update existing grade
        const updated = await studentAPI.updateGrade(editingGrade.id, data);
        setGrades(grades.map((g) => (g.id === updated.id ? updated : g)));
        setSuccess('Note mise à jour avec succès !');
      } else {
        // Create new grade
        const newGrade = await studentAPI.createGrade(data);
        setGrades([...grades, newGrade]);
        setSuccess('Note ajoutée avec succès !');
      }

      setShowForm(false);
      setEditingGrade(null);
      reset({
        subject: '',
        grade: 0,
        coefficient: 1,
        academic_year: ACADEMIC_YEARS[0],
        term: userType === 'university_student' ? 'Semestre 1' : 'Baccalaureat',
      });
      setIsSaving(false);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Grade save error:', err);
      setError(
        err.response?.data?.detail || 'Erreur lors de l\'enregistrement de la note'
      );
      setIsSaving(false);
    }
  };

  const handleEdit = (grade: AcademicGrade) => {
    setEditingGrade(grade);
    reset({
      subject: grade.subject,
      grade: grade.grade,
      coefficient: grade.coefficient,
      academic_year: grade.academic_year,
      term: grade.term,
    });
    setShowForm(true);
  };

  const handleDelete = async (gradeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
      return;
    }

    setIsDeleting(gradeId);
    setError(null);

    try {
      await studentAPI.deleteGrade(gradeId);
      setGrades(grades.filter((g) => g.id !== gradeId));
      setSuccess('Note supprimée avec succès !');
      setIsDeleting(null);

      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error('Grade delete error:', err);
      setError(
        err.response?.data?.detail || 'Erreur lors de la suppression de la note'
      );
      setIsDeleting(null);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingGrade(null);
    reset({
      subject: '',
      grade: 0,
      coefficient: 1,
      academic_year: ACADEMIC_YEARS[0],
      term: userType === 'university_student' ? 'Semestre 1' : 'Baccalaureat',
    });
  };

  // ========================================
  // Calculate Statistics
  // ========================================

  const calculateAverage = () => {
    if (grades.length === 0) return 0;

    const totalWeighted = grades.reduce(
      (sum, g) => sum + g.grade * g.coefficient,
      0
    );
    const totalCoefficients = grades.reduce((sum, g) => sum + g.coefficient, 0);

    return totalCoefficients > 0 ? totalWeighted / totalCoefficients : 0;
  };

  // Calculate averages per semester (for university students)
  const semesterAverages = useMemo(() => {
    if (userType !== 'university_student' || grades.length === 0) return [];

    const bySemester: Record<string, { total: number; coeff: number; count: number }> = {};
    grades.forEach((g) => {
      if (!bySemester[g.term]) bySemester[g.term] = { total: 0, coeff: 0, count: 0 };
      bySemester[g.term].total += g.grade * g.coefficient;
      bySemester[g.term].coeff += g.coefficient;
      bySemester[g.term].count += 1;
    });

    return UNIVERSITY_SEMESTERS
      .filter((s) => bySemester[s])
      .map((s) => ({
        semester: s,
        average: bySemester[s].coeff > 0 ? bySemester[s].total / bySemester[s].coeff : 0,
        count: bySemester[s].count,
        validated: bySemester[s].coeff > 0 && (bySemester[s].total / bySemester[s].coeff) >= 10,
      }));
  }, [grades, userType]);

  // Identify strengths and weaknesses (for university students)
  const strengthsWeaknesses = useMemo(() => {
    if (userType !== 'university_student' || grades.length < 3) return null;

    const sorted = [...grades].sort((a, b) => b.grade - a.grade);
    const strengths = sorted.slice(0, 3).filter((g) => g.grade >= 12);
    const weaknesses = sorted.slice(-3).reverse().filter((g) => g.grade < 10);

    return { strengths, weaknesses };
  }, [grades, userType]);

  // ========================================
  // Loading State
  // ========================================

  if (authLoading || isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des notes...</p>
        </div>
      </div>
    );
  }

  const average = calculateAverage();

  // ========================================
  // Render
  // ========================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/20 flex flex-col">
      <UBertouaHeader showAuth={true} />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Progress Stepper */}
        <ProfileStepper />

        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                {userType === 'university_student' ? (
                  <>Notes <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-primary-600 bg-clip-text text-transparent">Universitaires</span></>
                ) : (
                  <>Notes <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">du Baccalauréat</span></>
                )}
              </h2>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                userType === 'university_student'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-primary-100 text-primary-700'
              }`}>
                {userType === 'university_student' ? '🎓 Étudiant universitaire' : '📚 Nouveau bachelier'}
              </span>
            </div>
          </div>
          <p className="text-lg text-gray-600 ml-15">
            {userType === 'university_student'
              ? 'Ajoutez vos notes universitaires (UE) pour une réorientation personnalisée'
              : 'Ajoutez au moins 5 notes pour des recommandations précises'}
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Profile Incomplete Warning for University Students */}
        {userType === 'university_student' && !isProfileComplete && (
          <div className="mb-8 bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-yellow-900 mb-2">
                  ⚠️ Profil incomplet
                </h3>
                <p className="text-yellow-800 mb-4">
                  Pour ajouter vos notes universitaires (UE), vous devez d'abord compléter les informations suivantes dans votre profil :
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-800 mb-6">
                  {!universityInfo.establishment && (
                    <li className="font-medium">Établissement universitaire</li>
                  )}
                  {!universityInfo.department && (
                    <li className="font-medium">Département/Filière</li>
                  )}
                  {!universityInfo.level && (
                    <li className="font-medium">Niveau d'études (Licence 1, 2, 3...)</li>
                  )}
                </ul>
                <button
                  onClick={() => router.push('/profile')}
                  className="inline-flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  Compléter mon profil
                </button>
              </div>
            </div>
          </div>
        )}

        {/* University student with no grades: suggest filling bac grades or adding university grades */}
        {userType === 'university_student' && isProfileComplete && grades.length === 0 && !showForm && (
          <div className="mb-8 bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-blue-900 mb-2">Aucune note universitaire enregistree</h3>
            <p className="text-blue-800 mb-4">
              Vous pouvez ajouter vos notes de semestre pour une reorientation basee sur vos resultats universitaires,
              ou remplir vos notes du baccalaureat si vous n'avez pas encore de resultats universitaires.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleOpenForm}
                className="inline-flex items-center justify-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Ajouter notes universitaires
              </button>
              <button
                onClick={() => router.push('/profile')}
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 border-2 border-blue-300 px-5 py-3 rounded-xl font-semibold hover:bg-blue-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Changer de filiere / Remplir notes du bac
              </button>
            </div>
          </div>
        )}

        {/* Statistics - Only show if profile is complete for university students */}
        {(userType !== 'university_student' || isProfileComplete) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-6 border border-primary-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-primary-700">Nombre de notes</p>
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-primary-600">{grades.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-green-700">Moyenne générale</p>
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600">
              {average.toFixed(2)}/20
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-purple-700">Progression</p>
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-purple-600">
              {grades.length >= 5 ? '✓' : `${grades.length}/5`}
            </p>
          </div>
        </div>
        )}

        {/* University Student: Semester Breakdown + Strengths/Weaknesses */}
        {userType === 'university_student' && isProfileComplete && semesterAverages.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Semester Averages */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Moyenne par semestre
              </h3>
              <div className="space-y-2">
                {[1, 2, 3].map((year) => {
                  const yearSemesters = semesterAverages.filter((s) => {
                    const num = parseInt(s.semester.replace('Semestre ', ''));
                    return num === year * 2 - 1 || num === year * 2;
                  });
                  if (yearSemesters.length === 0) return null;
                  return (
                    <div key={year}>
                      <p className="text-xs font-bold text-purple-600 uppercase tracking-wide mb-1 mt-2">
                        Annee {year}
                      </p>
                      <div className="space-y-2">
                        {yearSemesters.map((s) => (
                          <div key={s.semester} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-600 w-24 flex-shrink-0">{s.semester}</span>
                            <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  s.average >= 14 ? 'bg-emerald-500' :
                                  s.average >= 10 ? 'bg-blue-500' :
                                  s.average >= 8 ? 'bg-amber-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min((s.average / 20) * 100, 100)}%` }}
                              />
                            </div>
                            <span className={`text-sm font-bold w-16 text-right ${
                              s.average >= 14 ? 'text-emerald-600' :
                              s.average >= 10 ? 'text-blue-600' :
                              s.average >= 8 ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {s.average.toFixed(1)}/20
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              s.validated ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {s.validated ? 'Valide' : 'Non valide'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            {strengthsWeaknesses && (strengthsWeaknesses.strengths.length > 0 || strengthsWeaknesses.weaknesses.length > 0) && (
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Forces et faiblesses
                </h3>

                {strengthsWeaknesses.strengths.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-emerald-700 mb-2">Points forts</p>
                    <div className="space-y-2">
                      {strengthsWeaknesses.strengths.map((g) => (
                        <div key={g.id} className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700 flex-1">{g.subject}</span>
                          <span className="text-sm font-bold text-emerald-600">{g.grade}/20</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {strengthsWeaknesses.weaknesses.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold text-red-700 mb-2">A ameliorer</p>
                    <div className="space-y-2">
                      {strengthsWeaknesses.weaknesses.map((g) => (
                        <div key={g.id} className="flex items-center gap-2 bg-red-50 rounded-lg px-3 py-2">
                          <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          <span className="text-sm text-gray-700 flex-1">{g.subject}</span>
                          <span className="text-sm font-bold text-red-600">{g.grade}/20</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Add Grade Button */}
        {(userType !== 'university_student' || isProfileComplete) && !showForm && (
          <button
            onClick={handleOpenForm}
            className={`inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all shadow-lg mb-8 ${
              userType === 'university_student'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {userType === 'university_student' ? 'Ajouter une UE' : 'Ajouter une note'}
          </button>
        )}

        {/* Grade Form - Only show if profile is complete for university students */}
        {(userType !== 'university_student' || isProfileComplete) && showForm ? (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                userType === 'university_student'
                  ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                  : 'bg-gradient-to-br from-primary-500 to-primary-600'
              }`}>
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGrade
                  ? (userType === 'university_student' ? 'Modifier l\'UE' : 'Modifier la note')
                  : (userType === 'university_student' ? 'Ajouter une UE' : 'Ajouter une note')}
              </h3>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
            >
              {/* Curriculum/Context Selector - Different for each user type */}
              {userType === 'university_student' ? (
                // University Student: Semester selector
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    🎓 Contexte universitaire
                  </label>
                  <p className="text-sm text-gray-600 mb-2">
                    Entrez vos notes d'Unités d'Enseignement (UE) de l'Université de Bertoua
                  </p>
                  <p className="text-xs text-amber-600 mb-4 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Vous devez remplir les semestres dans l'ordre (Semestre 1 → 2 → 3...)</span>
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {UNIVERSITY_SEMESTERS.map((semester) => {
                      const isAvailable = availableSemesters.includes(semester);
                      return (
                        <button
                          key={semester}
                          type="button"
                          onClick={() => isAvailable && setValue('term', semester)}
                          disabled={!isAvailable}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            !isAvailable
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                              : watch('term') === semester
                              ? 'border-purple-500 bg-purple-50 shadow-md'
                              : 'border-purple-200 bg-white hover:border-purple-400 hover:bg-purple-50 cursor-pointer'
                          }`}
                          title={!isAvailable ? 'Complétez les semestres précédents d\'abord' : ''}
                        >
                          <div className={`font-semibold text-sm ${!isAvailable ? 'text-gray-400' : 'text-gray-900'}`}>
                            {semester}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // New Bachelor: Curriculum selector
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-6 border border-primary-100">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    📚 Votre cursus scolaire
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {CURRICULUM_TYPES.map((curriculum) => (
                      <button
                        key={curriculum.id}
                        type="button"
                        onClick={() => setSelectedCurriculum(curriculum.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedCurriculum === curriculum.id
                            ? 'border-primary-500 bg-primary-50 shadow-md'
                            : 'border-gray-200 bg-white hover:border-primary-300 hover:bg-primary-25'
                        }`}
                      >
                        <div className="font-semibold text-gray-900 text-sm">{curriculum.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{curriculum.description}</div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    Sélectionnez votre cursus pour voir les matières correspondantes
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Subject / UE */}
                <div className="sm:col-span-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    {userType === 'university_student' ? 'Unité d\'Enseignement (UE)' : 'Matière'} <span className="text-red-500">*</span>
                  </label>

                  {/* Show warning if university info is incomplete */}
                  {userType === 'university_student' && (!universityInfo.establishment || !universityInfo.department || !universityInfo.level) && (
                    <div className="mb-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-medium">Informations universitaires incomplètes</p>
                        <p className="mt-1">
                          Veuillez compléter votre établissement, filière et niveau dans votre{' '}
                          <Link href="/profile" className="underline font-semibold hover:text-amber-900">profil</Link>
                          {' '}pour voir les UE spécifiques à votre programme.
                        </p>
                      </div>
                    </div>
                  )}

                  <select
                    {...register('subject')}
                    id="subject"
                    className="input"
                    disabled={isSaving || (userType === 'university_student' && loadingUE)}
                  >
                    <option value="">{userType === 'university_student' ? '-- Sélectionnez une UE --' : '-- Sélectionnez une matière --'}</option>
                    {userType === 'university_student' ? (
                      (universityUE.length > 0 ? universityUE : UNIVERSITY_SUBJECTS).map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))
                    ) : (
                      availableSubjects.map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {userType === 'university_student' ? (
                      loadingUE ? (
                        'Chargement des UE...'
                      ) : universityUE.length > 0 ? (
                        <>
                          {universityUE.length} UE disponibles pour {universityInfo.establishment} - {universityInfo.department} - {universityInfo.level}
                        </>
                      ) : universityInfo.establishment && universityInfo.department && universityInfo.level ? (
                        `${UNIVERSITY_SUBJECTS.length} UE génériques (programme spécifique non trouvé)`
                      ) : (
                        `${UNIVERSITY_SUBJECTS.length} UE génériques disponibles`
                      )
                    ) : (
                      `${availableSubjects.length} matières disponibles pour ce cursus`
                    )}
                  </p>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                  )}
                </div>

                {/* Grade */}
                <div>
                  <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
                    Note /20 <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('grade')}
                    type="number"
                    id="grade"
                    step="0.01"
                    min="0"
                    max="20"
                    className="input"
                    placeholder="Ex: 15.5"
                    disabled={isSaving}
                  />
                  {errors.grade && (
                    <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                  )}
                </div>

                {/* Coefficient */}
                <div>
                  <label htmlFor="coefficient" className="block text-sm font-medium text-gray-700 mb-2">
                    Coefficient <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register('coefficient')}
                    type="number"
                    id="coefficient"
                    min="1"
                    max="10"
                    className="input"
                    placeholder="Ex: 2"
                    disabled={isSaving}
                  />
                  {errors.coefficient && (
                    <p className="mt-1 text-sm text-red-600">{errors.coefficient.message}</p>
                  )}
                </div>

                {/* Academic Year */}
                <div>
                  <label htmlFor="academic_year" className="block text-sm font-medium text-gray-700 mb-2">
                    Année académique <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register('academic_year')}
                    id="academic_year"
                    className="input"
                    disabled={isSaving}
                  >
                    {ACADEMIC_YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.academic_year && (
                    <p className="mt-1 text-sm text-red-600">{errors.academic_year.message}</p>
                  )}
                </div>

                {/* Term / Semester - only for university students */}
                {userType === 'university_student' && (
                  <div>
                    <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-2">
                      Semestre <span className="text-red-500">*</span>
                    </label>
                    <select {...register('term')} id="term" className="input" disabled={isSaving}>
                      {availableSemesters.map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </select>
                    {errors.term && (
                      <p className="mt-1 text-sm text-red-600">{errors.term.message}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex gap-3">
                <button type="button" onClick={handleCancel} className="btn btn-outline" disabled={isSaving}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  {isSaving ? 'Enregistrement...' : editingGrade ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {/* Grades List - Only show if profile is complete for university students */}
        {(userType !== 'university_student' || isProfileComplete) && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              userType === 'university_student'
                ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                : 'bg-gradient-to-br from-primary-500 to-primary-600'
            }`}>
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              {userType === 'university_student' ? 'Mes UE' : 'Mes notes'} ({grades.length})
            </h3>
          </div>

          {grades.length === 0 ? (
            <div className="text-center py-16">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                userType === 'university_student' ? 'bg-purple-100' : 'bg-gray-100'
              }`}>
                <svg
                  className={`w-10 h-10 ${userType === 'university_student' ? 'text-purple-400' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                {userType === 'university_student' ? 'Aucune UE enregistrée' : 'Aucune note enregistrée'}
              </h4>
              <p className="text-gray-600 mb-6">
                {userType === 'university_student'
                  ? 'Commencez par ajouter vos premières Unités d\'Enseignement'
                  : 'Commencez par ajouter vos premières notes académiques'}
              </p>
              <button
                onClick={handleOpenForm}
                className={`inline-flex items-center gap-2 text-white px-6 py-3 rounded-xl font-semibold transform hover:scale-105 transition-all shadow-lg ${
                  userType === 'university_student'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {userType === 'university_student' ? 'Ajouter votre première UE' : 'Ajouter votre première note'}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                      {userType === 'university_student' ? 'UE' : 'Matière'}
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">
                      Note
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 hidden sm:table-cell">
                      Coef
                    </th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700 hidden md:table-cell">
                      Période
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{grade.subject}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                            grade.grade >= 15
                              ? 'bg-green-100 text-green-700'
                              : grade.grade >= 10
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {grade.grade.toFixed(1)}/20
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600 hidden sm:table-cell">
                        {grade.coefficient}
                      </td>
                      <td className="py-3 px-4 text-center text-sm text-gray-600 hidden md:table-cell">
                        {userType === 'university_student' ? `${grade.term}, ` : ''}{grade.academic_year}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(grade)}
                            className="text-primary-600 hover:text-primary-700 p-1"
                            title="Modifier"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(grade.id)}
                            disabled={isDeleting === grade.id}
                            className="text-red-600 hover:text-red-700 p-1 disabled:opacity-50"
                            title="Supprimer"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        )}

        {/* Navigation: Next Step */}
        {(userType !== 'university_student' || isProfileComplete) && (
          <div className="mt-8 space-y-4">
            {/* University: Add next semester button */}
            {userType === 'university_student' && (
              <div className="flex justify-center">
                <button
                  onClick={handleOpenForm}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transform hover:scale-[1.02] transition-all shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Passer au semestre suivant
                </button>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/profile')}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour au profil
              </button>
              <button
                onClick={() => router.push('/profile/values')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transform hover:scale-[1.02] transition-all shadow-lg"
              >
                Valeurs professionnelles
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      <UBertouaFooter />
    </div>
  );
}
