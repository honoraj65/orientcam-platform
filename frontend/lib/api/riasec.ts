import apiClient from './client';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface RiasecDimension {
  id: string;
  code: string;
  name: string;
  description: string;
  color: string;
  created_at: string;
}

export interface RiasecQuestion {
  id: string;
  dimension_id: string;
  text: string;
  question_number: number;
  reverse_scored: boolean;
  dimension?: RiasecDimension;
}

export interface RiasecQuestionsResponse {
  dimensions: RiasecDimension[];
  questions: RiasecQuestion[];
}

export interface RiasecTestAnswers {
  [questionId: string]: number; // 1-5 scale
}

export interface RiasecAnswer {
  question_number: number;
  answer: number;
}

export interface SubmitTestData {
  answers: RiasecAnswer[];
  duration_seconds?: number;
}

export interface RiasecScore {
  dimension_code: string;
  dimension_name: string;
  score: number;
  percentage: number;
}

export interface RiasecTestResult {
  id: string;
  student_profile_id: string;
  holland_code: string;
  scores: RiasecScore[];
  completed_at: string;
  created_at: string;
}

export interface CareerRecommendation {
  name: string;
  description: string;
  required_education: string;
  average_salary_range: string;
  job_market_outlook: string;
}

export interface CareersByCode {
  dimension: RiasecDimension;
  careers: CareerRecommendation[];
}

export interface RiasecDraftData {
  answers: RiasecTestAnswers;
  current_question_index: number;
}

export interface RiasecDraftResponse {
  answers: RiasecTestAnswers;
  current_question_index: number;
  updated_at: string;
}

// ============================================================================
// RIASEC API
// ============================================================================

export const riasecAPI = {
  // ========================================
  // Get Test Questions (Public)
  // ========================================

  getQuestions: async (): Promise<RiasecQuestionsResponse> => {
    const response = await apiClient.get('/api/v1/riasec/questions');
    return response.data;
  },

  // ========================================
  // Submit Test
  // ========================================

  submitTest: async (data: SubmitTestData): Promise<RiasecTestResult> => {
    const response = await apiClient.post('/api/v1/riasec/submit', data);
    return response.data;
  },

  // ========================================
  // Get Latest Result
  // ========================================

  getLatestResult: async (): Promise<RiasecTestResult> => {
    const response = await apiClient.get('/api/v1/riasec/results/latest');
    return response.data;
  },

  // ========================================
  // Get Test History
  // ========================================

  getHistory: async (): Promise<RiasecTestResult[]> => {
    const response = await apiClient.get('/api/v1/riasec/results/history');
    return response.data;
  },

  // ========================================
  // Get Careers by Holland Code
  // ========================================

  getCareersByCode: async (code: string): Promise<CareersByCode> => {
    const response = await apiClient.get(`/api/v1/riasec/careers/${code}`);
    return response.data;
  },

  // ========================================
  // Save Test Draft (Progress)
  // ========================================

  saveDraft: async (data: RiasecDraftData): Promise<{ message: string; answers_count: number }> => {
    const response = await apiClient.post('/api/v1/riasec/draft/save', data);
    return response.data;
  },

  // ========================================
  // Get Saved Draft (Progress)
  // ========================================

  getDraft: async (): Promise<RiasecDraftResponse> => {
    const response = await apiClient.get('/api/v1/riasec/draft');
    return response.data;
  },

  // ========================================
  // Delete Draft (Clear Progress)
  // ========================================

  deleteDraft: async (): Promise<{ message: string }> => {
    const response = await apiClient.delete('/api/v1/riasec/draft');
    return response.data;
  },

  // ========================================
  // Download PDF Report
  // ========================================

  downloadPDF: async (): Promise<Blob> => {
    const response = await apiClient.get('/api/v1/riasec/results/latest/download-pdf', {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================================================
// RIASEC Constants
// ============================================================================

export const RIASEC_DIMENSIONS = {
  R: {
    code: 'R',
    name: 'Réaliste',
    fullName: 'Réaliste (Realistic)',
    color: '#2563EB', // Bleu
    description: 'Personnes pratiques qui aiment travailler avec leurs mains, utiliser des outils et des machines',
    traits: ['Pratique', 'Technique', 'Concret', 'Manuel'],
    careers: [
      'Ingénieur mécanique',
      'Technicien',
      'Agriculteur',
      'Électricien',
      'Architecte',
    ],
  },
  I: {
    code: 'I',
    name: 'Investigateur',
    fullName: 'Investigateur (Investigative)',
    color: '#7C3AED', // Violet
    description: 'Personnes analytiques qui aiment observer, apprendre, analyser et résoudre des problèmes',
    traits: ['Analytique', 'Intellectuel', 'Curieux', 'Scientifique'],
    careers: [
      'Chercheur',
      'Médecin',
      'Biologiste',
      'Mathématicien',
      'Chimiste',
    ],
  },
  A: {
    code: 'A',
    name: 'Artistique',
    fullName: 'Artistique (Artistic)',
    color: '#EC4899', // Rose
    description: 'Personnes créatives qui aiment exprimer leurs idées de manière originale et innovante',
    traits: ['Créatif', 'Expressif', 'Original', 'Imaginatif'],
    careers: [
      'Artiste',
      'Designer',
      'Musicien',
      'Écrivain',
      'Architecte',
    ],
  },
  S: {
    code: 'S',
    name: 'Social',
    fullName: 'Social (Social)',
    color: '#10B981', // Vert
    description: 'Personnes empathiques qui aiment aider, enseigner et travailler avec les autres',
    traits: ['Empathique', 'Coopératif', 'Serviable', 'Communicatif'],
    careers: [
      'Enseignant',
      'Infirmier',
      'Conseiller',
      'Travailleur social',
      'Psychologue',
    ],
  },
  E: {
    code: 'E',
    name: 'Entrepreneur',
    fullName: 'Entrepreneur (Enterprising)',
    color: '#F59E0B', // Orange
    description: 'Personnes ambitieuses qui aiment persuader, diriger et gérer des projets',
    traits: ['Ambitieux', 'Persuasif', 'Leader', 'Énergique'],
    careers: [
      'Chef d\'entreprise',
      'Manager',
      'Avocat',
      'Vendeur',
      'Politicien',
    ],
  },
  C: {
    code: 'C',
    name: 'Conventionnel',
    fullName: 'Conventionnel (Conventional)',
    color: '#6B7280', // Gris
    description: 'Personnes organisées qui aiment travailler avec des données, suivre des procédures établies',
    traits: ['Organisé', 'Méthodique', 'Précis', 'Fiable'],
    careers: [
      'Comptable',
      'Secrétaire',
      'Bibliothécaire',
      'Banquier',
      'Analyste de données',
    ],
  },
};

export const ANSWER_SCALE = [
  { value: 1, label: 'Pas du tout', emoji: '😐' },
  { value: 2, label: 'Un peu', emoji: '🙂' },
  { value: 3, label: 'Moyennement', emoji: '😊' },
  { value: 4, label: 'Beaucoup', emoji: '😄' },
  { value: 5, label: 'Énormément', emoji: '🤩' },
];

// Helper function to get dimension info by code
export const getDimensionInfo = (code: string) => {
  return RIASEC_DIMENSIONS[code as keyof typeof RIASEC_DIMENSIONS] || null;
};

// Helper function to parse Holland Code
export const parseHollandCode = (code: string) => {
  return code.split('').map((char) => getDimensionInfo(char)).filter(Boolean);
};

// Helper function to get color by dimension code
export const getDimensionColor = (code: string): string => {
  const dimension = getDimensionInfo(code);
  return dimension?.color || '#6B7280';
};
