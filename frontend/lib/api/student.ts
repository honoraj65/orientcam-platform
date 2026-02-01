import apiClient from './client';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface StudentProfile {
  id: string;
  user_id: string;
  user_type?: 'new_bachelor' | 'university_student';
  university_establishment?: string;
  university_department?: string;
  university_level?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'Autre';
  city?: string;
  region?: string;
  current_education_level?: string;
  bac_series?: string;
  bac_year?: number;
  bac_grade?: number;
  max_annual_budget?: number; // Deprecated
  financial_situation?: string;
  financial_aid_eligible?: number;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  user_type?: 'new_bachelor' | 'university_student';
  university_establishment?: string;
  university_department?: string;
  university_level?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'Autre';
  city?: string;
  region?: string;
  current_education_level?: string;
  bac_series?: string;
  bac_year?: number;
  bac_grade?: number;
  max_annual_budget?: number; // Deprecated
  financial_situation?: string;
  financial_aid_eligible?: number;
}

export interface AcademicGrade {
  id: string;
  student_profile_id: string;
  subject: string;
  grade: number;
  coefficient: number;
  academic_year: string;
  term: string;
  created_at: string;
  updated_at: string;
}

export interface CreateGradeData {
  subject: string;
  grade: number;
  coefficient: number;
  academic_year: string;
  term: string;
}

export interface UpdateGradeData {
  subject?: string;
  grade?: number;
  coefficient?: number;
  academic_year?: string;
  term?: string;
}

export interface ProfessionalValue {
  id: string;
  student_profile_id: string;
  value_name: string;
  importance: number;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalValuesAssessment {
  autonomy: number;
  creativity: number;
  helping_others: number;
  job_security: number;
  salary: number;
  work_life_balance: number;
  prestige: number;
  variety: number;
}

// ============================================================================
// Student Profile API
// ============================================================================

export const studentAPI = {
  // ========================================
  // Profile
  // ========================================

  // Get current user's profile
  getProfile: async (): Promise<StudentProfile> => {
    const response = await apiClient.get('/api/v1/student/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data: UpdateProfileData): Promise<StudentProfile> => {
    const response = await apiClient.put('/api/v1/student/profile', data);
    return response.data;
  },

  // ========================================
  // Academic Grades
  // ========================================

  // Get all grades
  getGrades: async (): Promise<AcademicGrade[]> => {
    const response = await apiClient.get('/api/v1/student/grades');
    return response.data;
  },

  // Create grade
  createGrade: async (data: CreateGradeData): Promise<AcademicGrade> => {
    const response = await apiClient.post('/api/v1/student/grades', data);
    return response.data;
  },

  // Update grade
  updateGrade: async (
    gradeId: string,
    data: UpdateGradeData
  ): Promise<AcademicGrade> => {
    const response = await apiClient.put(
      `/api/v1/student/grades/${gradeId}`,
      data
    );
    return response.data;
  },

  // Delete grade
  deleteGrade: async (gradeId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/student/grades/${gradeId}`);
  },

  // ========================================
  // Professional Values
  // ========================================

  // Get professional values
  getValues: async (): Promise<ProfessionalValuesAssessment | null> => {
    try {
      const response = await apiClient.get('/api/v1/student/values');
      return response.data;
    } catch (error: any) {
      // If 404, return null (values not created yet)
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Create/update professional values assessment
  saveValues: async (
    data: ProfessionalValuesAssessment
  ): Promise<ProfessionalValuesAssessment> => {
    try {
      // Try to check if values exist first by making a GET request
      try {
        await apiClient.get('/api/v1/student/values');
        // If no error, values exist - use PUT to update
        const response = await apiClient.put('/api/v1/student/values', data);
        return response.data;
      } catch (getError: any) {
        // If 404, values don't exist - use POST to create
        if (getError.response?.status === 404) {
          const response = await apiClient.post('/api/v1/student/values', data);
          return response.data;
        }
        // If other error, throw it
        throw getError;
      }
    } catch (error: any) {
      // If we get a 400 error saying values already exist, use PUT instead
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('already exist')) {
        const response = await apiClient.put('/api/v1/student/values', data);
        return response.data;
      }
      throw error;
    }
  },

  // Update single value
  updateValue: async (
    valueId: string,
    importance: number
  ): Promise<ProfessionalValue> => {
    const response = await apiClient.put(`/api/v1/student/values/${valueId}`, {
      importance,
    });
    return response.data;
  },

  // Delete value
  deleteValue: async (valueId: string): Promise<void> => {
    await apiClient.delete(`/api/v1/student/values/${valueId}`);
  },
};

// ============================================================================
// Constants
// ============================================================================

export const CAMEROON_CITIES = [
  'Yaoundé',
  'Douala',
  'Garoua',
  'Bamenda',
  'Bafoussam',
  'Maroua',
  'Ngaoundéré',
  'Bertoua',
  'Buea',
  'Kumba',
  'Kribi',
  'Limbe',
  'Ebolowa',
];

export const EDUCATION_LEVELS = [
  'Terminale',
  'Licence 1',
  'Licence 2',
  'Licence 3',
  'Master 1',
  'Master 2',
  'Doctorat',
];

export const BAC_SERIES = [
  'A (Littéraire)',
  'C (Math-Physique)',
  'D (Math-Sciences)',
  'E (Math-Technique)',
  'F (Technique)',
  'G (Commercial)',
  'TI (Technique Industriel)',
];

export const ACADEMIC_YEARS = [
  '2024-2025',
  '2023-2024',
  '2022-2023',
  '2021-2022',
  '2020-2021',
];

export const TERMS = ['1er Trimestre', '2ème Trimestre', '3ème Trimestre'];

export const FINANCIAL_SITUATIONS = [
  'Très faible',
  'Faible',
  'Moyen',
  'Bon',
  'Très bon',
];

export const PROFESSIONAL_VALUES = [
  { name: 'autonomy', label: 'Autonomie', description: 'Travailler de manière indépendante' },
  { name: 'creativity', label: 'Créativité', description: 'Innover et créer de nouvelles choses' },
  { name: 'helping_others', label: 'Aider les autres', description: 'Contribuer au bien-être d\'autrui' },
  { name: 'job_security', label: 'Sécurité de l\'emploi', description: 'Stabilité et sécurité de l\'emploi' },
  { name: 'salary', label: 'Salaire', description: 'Rémunération et avantages financiers' },
  { name: 'work_life_balance', label: 'Équilibre vie-travail', description: 'Temps pour la famille et les loisirs' },
  { name: 'prestige', label: 'Prestige', description: 'Reconnaissance et statut social' },
  { name: 'variety', label: 'Variété', description: 'Diversité des tâches et activités' },
];

// ============================================================================
// Curriculum Types (Cursus Camerounais)
// ============================================================================

export type CurriculumType =
  | 'francophone_general'
  | 'francophone_technique'
  | 'anglophone_arts'
  | 'anglophone_science'
  | 'anglophone_commercial';

export const CURRICULUM_TYPES = [
  {
    id: 'francophone_general' as CurriculumType,
    label: 'Francophone - Enseignement Général',
    description: 'Séries A, C, D, etc.',
    series: ['A1', 'A2', 'A3', 'A4', 'A5', 'C', 'D', 'E']
  },
  {
    id: 'francophone_technique' as CurriculumType,
    label: 'Francophone - Enseignement Technique',
    description: 'Séries F, G, etc.',
    series: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'G1', 'G2', 'G3']
  },
  {
    id: 'anglophone_arts' as CurriculumType,
    label: 'Anglophone - Arts',
    description: 'GCE A-Level Arts',
    series: ['Arts']
  },
  {
    id: 'anglophone_science' as CurriculumType,
    label: 'Anglophone - Science',
    description: 'GCE A-Level Science',
    series: ['Science']
  },
  {
    id: 'anglophone_commercial' as CurriculumType,
    label: 'Anglophone - Commercial',
    description: 'GCE A-Level Commercial',
    series: ['Commercial']
  },
];

// ============================================================================
// Subjects by Curriculum (Matières par Cursus)
// ============================================================================

export const SUBJECTS_BY_CURRICULUM: Record<CurriculumType, string[]> = {
  // Francophone - Enseignement Général (Séries A, C, D, E)
  francophone_general: [
    // Matières communes
    'Mathématiques',
    'Physique',
    'Chimie',
    'Sciences de la Vie et de la Terre (SVT)',
    'Français',
    'Anglais',
    'Philosophie',
    'Histoire',
    'Géographie',
    'Histoire-Géographie',
    'Éducation Civique et Morale (ECM)',
    'EPS (Éducation Physique et Sportive)',
    'Informatique',
    // Séries littéraires (A1, A2, A3, A4, A5)
    'Littérature Française',
    'Littérature Africaine',
    'Latin',
    'Grec',
    'Espagnol',
    'Allemand',
    'Italien',
    'Arabe',
    'Langues Nationales',
    // Séries scientifiques (C, D, E)
    'Sciences Physiques',
    'Biologie',
    'Géologie',
    'Sciences Économiques et Sociales (SES)',
    'Économie',
    // Autres matières
    'Logique',
    'Sociologie',
    'Psychologie',
    'Droit',
    'Musique',
    'Arts Plastiques',
    'Dessin',
    'Travaux Manuels',
  ],

  // Francophone - Enseignement Technique (Séries F, G, etc.)
  francophone_technique: [
    // Matières générales
    'Mathématiques',
    'Physique',
    'Chimie',
    'Français',
    'Anglais',
    'Informatique',
    'Histoire-Géographie',
    'Éducation Civique et Morale (ECM)',
    'EPS (Éducation Physique et Sportive)',
    'Philosophie',
    // Technique Industriel - Mécanique (F1)
    'Construction Mécanique',
    'Mécanique Appliquée',
    'Technologie de Construction',
    'Dessin Industriel',
    'Résistance des Matériaux',
    'Fabrication Mécanique',
    'Métrologie',
    // Technique Industriel - Électronique (F2)
    'Électronique',
    'Électronique Analogique',
    'Électronique Numérique',
    'Télécommunications',
    'Traitement du Signal',
    // Technique Industriel - Électrotechnique (F3)
    'Électrotechnique',
    'Machines Électriques',
    'Automatisme',
    'Installations Électriques',
    'Schémas Électriques',
    // Génie Civil (F4)
    'Topographie',
    'Béton Armé',
    'Construction Bâtiment',
    'Dessin Bâtiment',
    'Résistance des Matériaux (RDM)',
    'Technologie du Bâtiment',
    'Métré',
    // Froid et Climatisation (F5)
    'Thermodynamique',
    'Froid et Climatisation',
    'Machines Thermiques',
    // Agriculture (F6)
    'Agriculture Générale',
    'Zootechnie',
    'Pédologie',
    'Phytotechnie',
    'Économie Rurale',
    'Biologie Animale',
    'Biologie Végétale',
    // Industries Alimentaires (F7)
    'Technologie Alimentaire',
    'Microbiologie',
    'Biochimie',
    // Informatique (F8)
    'Algorithmique',
    'Programmation',
    'Base de Données',
    'Réseaux Informatiques',
    'Systèmes d\'Exploitation',
    'Maintenance Informatique',
    // Comptabilité/Gestion (G1)
    'Comptabilité Générale',
    'Comptabilité Analytique',
    'Comptabilité des Sociétés',
    'Fiscalité',
    'Économie d\'Entreprise',
    'Économie Générale',
    'Droit Commercial',
    'Droit du Travail',
    'Techniques Quantitatives de Gestion (TQG)',
    'Mathématiques Financières',
    // Secrétariat (G2)
    'Secrétariat',
    'Sténographie',
    'Dactylographie',
    'Bureautique',
    'Communication Professionnelle',
    'Organisation Administrative',
    // Commerce (G3)
    'Techniques Commerciales',
    'Marketing',
    'Gestion Commerciale',
    'Commerce International',
    'Droit',
  ],

  // Anglophone - Arts (GCE A-Level)
  anglophone_arts: [
    'English Language',
    'French',
    'Literature in English',
    'History',
    'Geography',
    'Economics',
    'Religious Studies',
    'Philosophy',
    'Citizenship Education',
    'Logic',
    'Sociology',
    'Psychology',
    'Spanish',
    'German',
    'Italian',
    'Arabic',
    'Latin',
    'Greek',
    'African Literature',
    'Law',
    'Government',
    'Journalism',
    'Mass Communication',
    'Fine Arts',
    'Music',
    'Theatre Arts',
    'Physical Education',
    'General Paper',
  ],

  // Anglophone - Science (GCE A-Level)
  anglophone_science: [
    'Mathematics',
    'Further Mathematics',
    'Additional Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Information and Communication Technology (ICT)',
    'English Language',
    'French',
    'Geography',
    'Economics',
    'Geology',
    'Environmental Science',
    'Agricultural Science',
    'Human Biology',
    'Food Science',
    'Nutrition',
    'Technical Drawing',
    'Statistics',
    'Physical Education',
    'General Paper',
  ],

  // Anglophone - Commercial (GCE A-Level)
  anglophone_commercial: [
    'English Language',
    'French',
    'Mathematics',
    'Economics',
    'Accounting',
    'Commerce',
    'Business Studies',
    'Management of Business',
    'Principles of Accounts',
    'Computer Science',
    'Information and Communication Technology (ICT)',
    'Geography',
    'History',
    'Law',
    'Secretarial Duties',
    'Office Practice',
    'Shorthand',
    'Typewriting',
    'Marketing',
    'Financial Accounting',
    'Cost Accounting',
    'Statistics',
    'Physical Education',
    'General Paper',
  ],
};

// Legacy export for backward compatibility
export const COMMON_SUBJECTS = [
  ...SUBJECTS_BY_CURRICULUM.francophone_general,
  ...SUBJECTS_BY_CURRICULUM.anglophone_science.filter(s => !SUBJECTS_BY_CURRICULUM.francophone_general.includes(s)),
];

// ============================================================================
// RIASEC Classification for Subjects (for orientation algorithm)
// ============================================================================
// R = Réaliste (pratique, technique, manuel)
// I = Investigateur (scientifique, analytique, recherche)
// A = Artistique (créatif, expressif, littéraire)
// S = Social (aide, enseignement, relations humaines)
// E = Entreprenant (leadership, commerce, persuasion)
// C = Conventionnel (organisation, données, administration)

export type RIASECType = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export type SubjectGroup = 1 | 2 | 3; // 1er groupe (principal), 2e groupe, 3e groupe

export interface SubjectInfo {
  name: string;
  riasec: RIASECType[];  // Une matière peut correspondre à plusieurs types
  group: SubjectGroup;   // Groupe de la matière (importance pour le BAC/GCE)
  curriculum: CurriculumType[];
}

// Classification complète des matières
export const SUBJECTS_WITH_RIASEC: SubjectInfo[] = [
  // ============================================
  // MATIÈRES SCIENTIFIQUES (I - Investigateur)
  // ============================================
  // 1er groupe - Sciences exactes
  { name: 'Mathématiques', riasec: ['I', 'C'], group: 1, curriculum: ['francophone_general', 'francophone_technique', 'anglophone_science', 'anglophone_commercial'] },
  { name: 'Mathematics', riasec: ['I', 'C'], group: 1, curriculum: ['anglophone_science', 'anglophone_commercial', 'anglophone_arts'] },
  { name: 'Further Mathematics', riasec: ['I'], group: 1, curriculum: ['anglophone_science'] },
  { name: 'Additional Mathematics', riasec: ['I'], group: 1, curriculum: ['anglophone_science'] },
  { name: 'Physique', riasec: ['I', 'R'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Physics', riasec: ['I', 'R'], group: 1, curriculum: ['anglophone_science'] },
  { name: 'Chimie', riasec: ['I'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Chemistry', riasec: ['I'], group: 1, curriculum: ['anglophone_science'] },
  { name: 'Sciences de la Vie et de la Terre (SVT)', riasec: ['I', 'R'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Biology', riasec: ['I', 'S'], group: 1, curriculum: ['anglophone_science'] },
  { name: 'Biologie', riasec: ['I', 'S'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Human Biology', riasec: ['I', 'S'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Sciences Physiques', riasec: ['I', 'R'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Géologie', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Geology', riasec: ['I', 'R'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Environmental Science', riasec: ['I', 'R'], group: 2, curriculum: ['anglophone_science'] },

  // 2e groupe - Informatique et Statistiques
  { name: 'Informatique', riasec: ['I', 'R', 'C'], group: 2, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Computer Science', riasec: ['I', 'R', 'C'], group: 2, curriculum: ['anglophone_science', 'anglophone_commercial'] },
  { name: 'Information and Communication Technology (ICT)', riasec: ['I', 'R', 'C'], group: 2, curriculum: ['anglophone_science', 'anglophone_commercial'] },
  { name: 'Statistics', riasec: ['I', 'C'], group: 2, curriculum: ['anglophone_science', 'anglophone_commercial'] },
  { name: 'Algorithmique', riasec: ['I', 'C'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Programmation', riasec: ['I', 'R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Base de Données', riasec: ['I', 'C'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Réseaux Informatiques', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Systèmes d\'Exploitation', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Maintenance Informatique', riasec: ['R', 'I'], group: 2, curriculum: ['francophone_technique'] },

  // ============================================
  // MATIÈRES TECHNIQUES (R - Réaliste)
  // ============================================
  // 1er groupe - Technique industriel
  { name: 'Construction Mécanique', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Mécanique Appliquée', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Technologie de Construction', riasec: ['R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Dessin Industriel', riasec: ['R', 'A'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Technical Drawing', riasec: ['R', 'A'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Résistance des Matériaux', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Résistance des Matériaux (RDM)', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Fabrication Mécanique', riasec: ['R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Métrologie', riasec: ['R', 'I'], group: 2, curriculum: ['francophone_technique'] },

  // Électronique / Électrotechnique
  { name: 'Électronique', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Électronique Analogique', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Électronique Numérique', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Télécommunications', riasec: ['R', 'I'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Traitement du Signal', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Électrotechnique', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Machines Électriques', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Automatisme', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Installations Électriques', riasec: ['R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Schémas Électriques', riasec: ['R', 'C'], group: 2, curriculum: ['francophone_technique'] },

  // Génie Civil
  { name: 'Topographie', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Béton Armé', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Construction Bâtiment', riasec: ['R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Dessin Bâtiment', riasec: ['R', 'A'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Technologie du Bâtiment', riasec: ['R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Métré', riasec: ['R', 'C'], group: 2, curriculum: ['francophone_technique'] },

  // Thermique / Froid
  { name: 'Thermodynamique', riasec: ['I', 'R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Froid et Climatisation', riasec: ['R'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Machines Thermiques', riasec: ['R', 'I'], group: 2, curriculum: ['francophone_technique'] },

  // Agriculture
  { name: 'Agriculture Générale', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Agricultural Science', riasec: ['R', 'I'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Zootechnie', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Pédologie', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Phytotechnie', riasec: ['R', 'I'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Économie Rurale', riasec: ['E', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Biologie Animale', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Biologie Végétale', riasec: ['I', 'R'], group: 2, curriculum: ['francophone_technique'] },

  // Industries alimentaires
  { name: 'Technologie Alimentaire', riasec: ['R', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Food Science', riasec: ['I', 'R'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Nutrition', riasec: ['I', 'S'], group: 2, curriculum: ['anglophone_science'] },
  { name: 'Microbiologie', riasec: ['I'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Biochimie', riasec: ['I'], group: 2, curriculum: ['francophone_technique'] },

  // ============================================
  // MATIÈRES LITTÉRAIRES ET ARTISTIQUES (A - Artistique)
  // ============================================
  // 1er groupe - Langues et Littérature
  { name: 'Français', riasec: ['A', 'S'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'French', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },
  { name: 'Anglais', riasec: ['A', 'S'], group: 2, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'English Language', riasec: ['A', 'S'], group: 1, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },
  { name: 'Littérature Française', riasec: ['A'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Littérature Africaine', riasec: ['A', 'S'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Literature in English', riasec: ['A'], group: 1, curriculum: ['anglophone_arts'] },
  { name: 'African Literature', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_arts'] },

  // Langues étrangères
  { name: 'Espagnol', riasec: ['A', 'S'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Spanish', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Allemand', riasec: ['A', 'S'], group: 2, curriculum: ['francophone_general'] },
  { name: 'German', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Italien', riasec: ['A', 'S'], group: 3, curriculum: ['francophone_general'] },
  { name: 'Italian', riasec: ['A', 'S'], group: 3, curriculum: ['anglophone_arts'] },
  { name: 'Arabe', riasec: ['A', 'S'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Arabic', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Latin', riasec: ['A', 'I'], group: 2, curriculum: ['francophone_general', 'anglophone_arts'] },
  { name: 'Grec', riasec: ['A', 'I'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Greek', riasec: ['A', 'I'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Langues Nationales', riasec: ['A', 'S'], group: 3, curriculum: ['francophone_general'] },

  // Arts
  { name: 'Musique', riasec: ['A'], group: 3, curriculum: ['francophone_general'] },
  { name: 'Music', riasec: ['A'], group: 3, curriculum: ['anglophone_arts'] },
  { name: 'Arts Plastiques', riasec: ['A', 'R'], group: 3, curriculum: ['francophone_general'] },
  { name: 'Fine Arts', riasec: ['A'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Dessin', riasec: ['A', 'R'], group: 3, curriculum: ['francophone_general'] },
  { name: 'Theatre Arts', riasec: ['A', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Travaux Manuels', riasec: ['R', 'A'], group: 3, curriculum: ['francophone_general'] },

  // ============================================
  // MATIÈRES SOCIALES ET HUMAINES (S - Social)
  // ============================================
  // 1er groupe - Philosophie et Sciences humaines
  { name: 'Philosophie', riasec: ['A', 'I', 'S'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Philosophy', riasec: ['A', 'I', 'S'], group: 1, curriculum: ['anglophone_arts'] },
  { name: 'Logique', riasec: ['I', 'A'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Logic', riasec: ['I', 'A'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Psychologie', riasec: ['I', 'S'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Psychology', riasec: ['I', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Sociologie', riasec: ['I', 'S'], group: 2, curriculum: ['francophone_general'] },
  { name: 'Sociology', riasec: ['I', 'S'], group: 2, curriculum: ['anglophone_arts'] },

  // Histoire et Géographie
  { name: 'Histoire', riasec: ['A', 'I'], group: 1, curriculum: ['francophone_general'] },
  { name: 'History', riasec: ['A', 'I'], group: 1, curriculum: ['anglophone_arts', 'anglophone_commercial'] },
  { name: 'Géographie', riasec: ['I', 'S'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Geography', riasec: ['I', 'S'], group: 2, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },
  { name: 'Histoire-Géographie', riasec: ['A', 'I', 'S'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },

  // Éducation civique et religieuse
  { name: 'Éducation Civique et Morale (ECM)', riasec: ['S', 'C'], group: 3, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Citizenship Education', riasec: ['S', 'C'], group: 3, curriculum: ['anglophone_arts'] },
  { name: 'Religious Studies', riasec: ['S', 'A'], group: 2, curriculum: ['anglophone_arts'] },

  // Communication et Médias
  { name: 'Journalism', riasec: ['A', 'E', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Mass Communication', riasec: ['A', 'E', 'S'], group: 2, curriculum: ['anglophone_arts'] },
  { name: 'Communication Professionnelle', riasec: ['S', 'E'], group: 2, curriculum: ['francophone_technique'] },

  // Sport
  { name: 'EPS (Éducation Physique et Sportive)', riasec: ['R', 'S'], group: 3, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Physical Education', riasec: ['R', 'S'], group: 3, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },

  // ============================================
  // MATIÈRES ÉCONOMIQUES ET COMMERCIALES (E - Entreprenant)
  // ============================================
  // 1er groupe - Économie
  { name: 'Économie', riasec: ['E', 'I'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Economics', riasec: ['E', 'I'], group: 1, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },
  { name: 'Sciences Économiques et Sociales (SES)', riasec: ['E', 'S', 'I'], group: 1, curriculum: ['francophone_general'] },
  { name: 'Économie d\'Entreprise', riasec: ['E'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Économie Générale', riasec: ['E', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Business Studies', riasec: ['E'], group: 1, curriculum: ['anglophone_commercial'] },
  { name: 'Management of Business', riasec: ['E'], group: 1, curriculum: ['anglophone_commercial'] },

  // Commerce
  { name: 'Techniques Commerciales', riasec: ['E', 'S'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Commerce', riasec: ['E'], group: 1, curriculum: ['anglophone_commercial'] },
  { name: 'Commerce International', riasec: ['E'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Marketing', riasec: ['E', 'A'], group: 1, curriculum: ['francophone_technique', 'anglophone_commercial'] },
  { name: 'Gestion Commerciale', riasec: ['E', 'C'], group: 1, curriculum: ['francophone_technique'] },

  // Droit et Gestion
  { name: 'Droit', riasec: ['E', 'C', 'S'], group: 1, curriculum: ['francophone_general', 'francophone_technique'] },
  { name: 'Law', riasec: ['E', 'C', 'S'], group: 1, curriculum: ['anglophone_arts', 'anglophone_commercial'] },
  { name: 'Droit Commercial', riasec: ['E', 'C'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Droit du Travail', riasec: ['E', 'S', 'C'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Government', riasec: ['E', 'S'], group: 2, curriculum: ['anglophone_arts'] },

  // General Paper
  { name: 'General Paper', riasec: ['A', 'I', 'S'], group: 2, curriculum: ['anglophone_science', 'anglophone_arts', 'anglophone_commercial'] },

  // ============================================
  // MATIÈRES COMPTABLES ET ADMINISTRATIVES (C - Conventionnel)
  // ============================================
  // 1er groupe - Comptabilité
  { name: 'Comptabilité Générale', riasec: ['C', 'E'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Accounting', riasec: ['C', 'E'], group: 1, curriculum: ['anglophone_commercial'] },
  { name: 'Principles of Accounts', riasec: ['C'], group: 1, curriculum: ['anglophone_commercial'] },
  { name: 'Financial Accounting', riasec: ['C', 'E'], group: 1, curriculum: ['anglophone_commercial'] },
  { name: 'Comptabilité Analytique', riasec: ['C', 'I'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Cost Accounting', riasec: ['C', 'I'], group: 2, curriculum: ['anglophone_commercial'] },
  { name: 'Comptabilité des Sociétés', riasec: ['C', 'E'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Fiscalité', riasec: ['C', 'E'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Mathématiques Financières', riasec: ['C', 'I'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Techniques Quantitatives de Gestion (TQG)', riasec: ['C', 'I'], group: 1, curriculum: ['francophone_technique'] },

  // Secrétariat et Administration
  { name: 'Secrétariat', riasec: ['C', 'S'], group: 1, curriculum: ['francophone_technique'] },
  { name: 'Secretarial Duties', riasec: ['C', 'S'], group: 2, curriculum: ['anglophone_commercial'] },
  { name: 'Sténographie', riasec: ['C'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Shorthand', riasec: ['C'], group: 2, curriculum: ['anglophone_commercial'] },
  { name: 'Dactylographie', riasec: ['C', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Typewriting', riasec: ['C', 'R'], group: 2, curriculum: ['anglophone_commercial'] },
  { name: 'Bureautique', riasec: ['C', 'R'], group: 2, curriculum: ['francophone_technique'] },
  { name: 'Office Practice', riasec: ['C'], group: 2, curriculum: ['anglophone_commercial'] },
  { name: 'Organisation Administrative', riasec: ['C', 'E'], group: 2, curriculum: ['francophone_technique'] },
];

// Helper function to get subjects by curriculum with RIASEC info
export const getSubjectsForCurriculum = (curriculum: CurriculumType): SubjectInfo[] => {
  return SUBJECTS_WITH_RIASEC.filter(s => s.curriculum.includes(curriculum));
};

// Helper function to get subjects by RIASEC type
export const getSubjectsByRIASEC = (riasecType: RIASECType): SubjectInfo[] => {
  return SUBJECTS_WITH_RIASEC.filter(s => s.riasec.includes(riasecType));
};

// Helper function to get subjects by group
export const getSubjectsByGroup = (group: SubjectGroup, curriculum?: CurriculumType): SubjectInfo[] => {
  let subjects = SUBJECTS_WITH_RIASEC.filter(s => s.group === group);
  if (curriculum) {
    subjects = subjects.filter(s => s.curriculum.includes(curriculum));
  }
  return subjects;
};

// ============================================================================
// User Types for the Platform
// ============================================================================

export type UserType = 'new_bachelor' | 'university_student';

export interface UserTypeInfo {
  id: UserType;
  label: string;
  description: string;
  needsOrientation: boolean;
}

export const USER_TYPES: UserTypeInfo[] = [
  {
    id: 'new_bachelor',
    label: 'Nouveau bachelier',
    description: 'Vous venez d\'obtenir votre BAC/GCE et cherchez une orientation universitaire',
    needsOrientation: true,
  },
  {
    id: 'university_student',
    label: 'Étudiant universitaire',
    description: 'Vous êtes déjà inscrit à l\'Université de Bertoua et souhaitez une réorientation',
    needsOrientation: true,
  },
];
