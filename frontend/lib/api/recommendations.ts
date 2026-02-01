import apiClient from './client';
import { Program, CompatibilityScore } from './programs';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Recommendation {
  id: string;
  student_profile_id: string;
  program_id: string;
  compatibility_score: number;
  ranking: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  created_at: string;
  updated_at: string;

  // Relations
  program?: Program;
}

export interface RecommendationWithDetails extends Recommendation {
  program: Program;
  compatibility: CompatibilityScore;
}

// ============================================================================
// Recommendations API
// ============================================================================

export const recommendationsAPI = {
  // Get all recommendations for current user
  getAll: async (): Promise<RecommendationWithDetails[]> => {
    const response = await apiClient.get('/api/v1/recommendations');
    return response.data;
  },

  // Generate new recommendations
  generate: async (): Promise<RecommendationWithDetails[]> => {
    const response = await apiClient.post('/api/v1/recommendations/generate');
    return response.data;
  },
};
