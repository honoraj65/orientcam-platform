import apiClient from './client';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ProgramSubject {
  id: string;
  program_id: string;
  subject_name: string;
  is_required: boolean;
  created_at: string;
}

export interface MasterProgramBrief {
  id: string;
  code: string;
  name: string;
  duration_years?: number;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  level: string;
  domain: string;
  university: string;
  department: string;
  duration_years: number;
  description: string;

  // RIASEC
  riasec_primary: string;
  riasec_secondary?: string;

  // Requirements
  minimum_grade?: number;
  required_subjects: string[];

  // Financial
  tuition_fee_fcfa?: number;
  scholarship_available: boolean;

  // Career
  employment_rate?: number;
  average_salary_fcfa?: number;

  // Metadata
  capacity?: number;
  website_url?: string;
  created_at: string;
  updated_at: string;

  // Relations
  subjects?: ProgramSubject[];
  master_program_id?: string;
  master_program?: MasterProgramBrief;
}

export interface ProgramFilters {
  level?: string;
  domain?: string;
  university?: string;
  riasec_code?: string;
  min_employment_rate?: number;
  max_tuition_fee?: number;
  scholarship_only?: boolean;
  limit?: number;
  offset?: number;
}

export interface ProgramsResponse {
  programs: Program[];
  total: number;
  limit: number;
  offset: number;
}

export interface ProgramStatistics {
  total_programs: number;
  by_level: { [key: string]: number };
  by_domain: { [key: string]: number };
  by_university: { [key: string]: number };
  average_tuition: number;
  programs_with_scholarships: number;
}

export interface CompatibilityScore {
  total_score: number;
  ranking: string;
  components: {
    riasec_score: number;
    riasec_weight: number;
    grades_score: number;
    grades_weight: number;
    values_score: number;
    values_weight: number;
    employment_score: number;
    employment_weight: number;
    financial_score: number;
    financial_weight: number;
  };
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface ProgramCompatibility {
  program: Program;
  compatibility: CompatibilityScore;
}

// ============================================================================
// Programs API
// ============================================================================

export const programsAPI = {
  // ========================================
  // List Programs
  // ========================================

  list: async (filters?: ProgramFilters): Promise<ProgramsResponse> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/api/v1/programs?${params.toString()}`);
    return response.data;
  },

  // ========================================
  // Search Programs
  // ========================================

  search: async (query: string): Promise<Program[]> => {
    const response = await apiClient.get('/api/v1/programs/search', {
      params: { q: query },
    });
    return response.data;
  },

  // ========================================
  // Get Statistics
  // ========================================

  getStatistics: async (): Promise<ProgramStatistics> => {
    const response = await apiClient.get('/api/v1/programs/statistics');
    return response.data;
  },

  // ========================================
  // Get Program by ID
  // ========================================

  getById: async (programId: string): Promise<Program> => {
    const response = await apiClient.get(`/api/v1/programs/${programId}`);
    return response.data;
  },

  // ========================================
  // Get Program Compatibility
  // ========================================

  getCompatibility: async (programId: string): Promise<CompatibilityScore> => {
    const response = await apiClient.get(`/api/v1/programs/${programId}/compatibility`);
    return response.data;
  },
};

// ============================================================================
// Constants
// ============================================================================

export const EDUCATION_LEVELS = [
  'Licence 1',
  'Licence 2',
  'Licence 3',
  'Master 1',
  'Master 2',
  'Doctorat',
];

export const PROGRAM_DOMAINS = [
  'Sciences de l\'Éducation',  // DIPES, DIPEN, DIPCO - ENS (21 formations)
  'Sciences et Technologies',  // Informatique, Maths, Physique, Chimie, Statistiques, Énergies, Génie Minier (14 formations)
  'Géosciences et Environnement',  // Géographie, Urbanisme, Tourisme, Agriculture, Environnement, Forêts, Génie Urbain (12 formations)
  'Droit et Sciences Politiques',  // Droit Public, Privé, English Law, Science Politique, Carrière Judiciaire (10 formations)
  'Lettres et Langues',  // English, Français, Histoire, Langues Étrangères Appliquées (8 formations)
  'Économie et Gestion',  // Banque, Finance, Comptabilité, Gestion, Économie Minière (7 formations)
  'Sciences de la Vie et Santé',  // Biologie, Sciences Biomédicales (4 formations)
];

export const CAMEROON_UNIVERSITIES = [
  'Université de Bertoua',
  'Université de Yaoundé I',
  'Université de Yaoundé II',
  'Université de Douala',
  'Université de Dschang',
  'Université de Ngaoundéré',
  'Université de Buea',
  'Université de Bamenda',
  'Université de Maroua',
];

export const COMPATIBILITY_RANKINGS = {
  HIGHLY_RECOMMENDED: {
    min: 80,
    label: 'Fortement recommandé',
    color: '#10B981', // Green
    icon: '🌟',
  },
  RECOMMENDED: {
    min: 65,
    max: 79,
    label: 'Recommandé',
    color: '#3B82F6', // Blue
    icon: '👍',
  },
  CONSIDER: {
    min: 50,
    max: 64,
    label: 'À considérer',
    color: '#F59E0B', // Orange
    icon: '💡',
  },
  NOT_RECOMMENDED: {
    max: 49,
    label: 'Non recommandé',
    color: '#EF4444', // Red
    icon: '⚠️',
  },
};

// Helper function to get ranking info
export const getRankingInfo = (score: number) => {
  if (score >= COMPATIBILITY_RANKINGS.HIGHLY_RECOMMENDED.min) {
    return COMPATIBILITY_RANKINGS.HIGHLY_RECOMMENDED;
  } else if (score >= COMPATIBILITY_RANKINGS.RECOMMENDED.min) {
    return COMPATIBILITY_RANKINGS.RECOMMENDED;
  } else if (score >= COMPATIBILITY_RANKINGS.CONSIDER.min) {
    return COMPATIBILITY_RANKINGS.CONSIDER;
  } else {
    return COMPATIBILITY_RANKINGS.NOT_RECOMMENDED;
  }
};

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Helper function to get duration text
export const getDurationText = (years: number): string => {
  return years === 1 ? '1 an' : `${years} ans`;
};

// Helper function to determine program domain from name and department
export const getProgramDomain = (program: Program): string => {
  // If domain is already set, return it
  if (program.domain) return program.domain;

  const name = program.name.toLowerCase();
  const dept = (program.department || '').toLowerCase();

  // Sciences de l'Éducation (ENS - priority check)
  if (name.includes('dipes') || name.includes('dipen') ||
      name.includes('dipco') || dept.includes('normale')) {
    return 'Sciences de l\'Éducation';
  }

  // Économie et Gestion (avant Sciences et Technologies pour attraper "Ingénieur en Économie")
  if (name.includes('economie') || name.includes('gestion') ||
      name.includes('banque') || name.includes('finance') ||
      name.includes('comptabilite') || name.includes('assurances') ||
      name.includes('commerce') ||
      dept.includes('economie') || dept.includes('gestion')) {
    return 'Économie et Gestion';
  }

  // Sciences et Technologies (mais exclure Génie Urbain qui va dans Géosciences)
  if (name.includes('informatique') || name.includes('mathematiques') ||
      name.includes('physique') || name.includes('chimie') ||
      name.includes('statistiques') || name.includes('energies renouvelables') ||
      name.includes('mines') || name.includes('materiaux') ||
      (name.includes('genie') && !name.includes('urbain')) ||
      (name.includes('ingenieur') && !name.includes('urbain') && !name.includes('amenagement')) ||
      dept.includes('informatique') || dept.includes('mathematiques') ||
      dept.includes('physique') || dept.includes('chimie') ||
      dept.includes('mines')) {
    return 'Sciences et Technologies';
  }

  // Sciences de la Vie et Santé
  if (name.includes('biologie') || name.includes('biomedicales') ||
      name.includes('sante') || name.includes('vie') ||
      dept.includes('biologie') || dept.includes('sante')) {
    return 'Sciences de la Vie et Santé';
  }

  // Géosciences et Environnement (inclure Génie Urbain, Aménagement)
  if (name.includes('geosciences') || name.includes('environnement') ||
      name.includes('agriculture') || name.includes('forets') ||
      name.includes('bois') || name.includes('eau') ||
      name.includes('terre') || name.includes('geographie') ||
      name.includes('geomatique') || name.includes('urbanisme') ||
      name.includes('tourisme') || name.includes('hotellerie') ||
      name.includes('elevage') || name.includes('aquaculture') ||
      name.includes('genie urbain') || name.includes('amenagement urbain') ||
      dept.includes('geographie') || dept.includes('environnement') ||
      dept.includes('agriculture') || dept.includes('urbanisme') ||
      dept.includes('tourisme')) {
    return 'Géosciences et Environnement';
  }

  // Droit et Sciences Politiques
  if (name.includes('droit') || name.includes('juridique') ||
      name.includes('politique') || name.includes('law') ||
      name.includes('judiciare') || name.includes('affaires') ||
      dept.includes('droit') || dept.includes('juridique') ||
      dept.includes('politique')) {
    return 'Droit et Sciences Politiques';
  }

  // Lettres et Langues
  if (name.includes('lettres') || name.includes('langues') ||
      name.includes('anglais') || name.includes('francais') ||
      name.includes('allemand') || name.includes('espagnol') ||
      name.includes('chinois') || name.includes('arabe') ||
      name.includes('english') || name.includes('creative writing') ||
      name.includes('histoire') ||
      dept.includes('lettres') || dept.includes('langues') ||
      dept.includes('histoire')) {
    return 'Lettres et Langues';
  }

  // Default
  return 'Sciences et Technologies';
};
