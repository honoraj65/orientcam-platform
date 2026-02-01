import apiClient from './client';

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Establishment {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Program {
  level: string;
  name: string;
  ue: string[];
}

export interface UEResponse {
  ue: string[];
}

// ============================================================================
// UBertoua Data API
// ============================================================================

export const ubertouaAPI = {
  // Get all establishments
  getEstablishments: async (): Promise<Establishment[]> => {
    const response = await apiClient.get('/api/v1/ubertoua/establishments');
    return response.data;
  },

  // Get departments for an establishment
  getDepartments: async (establishmentId: string): Promise<Department[]> => {
    const response = await apiClient.get(
      `/api/v1/ubertoua/establishments/${establishmentId}/departments`
    );
    return response.data;
  },

  // Get programs for a department and level
  getPrograms: async (
    establishmentId: string,
    departmentId: string,
    level: string
  ): Promise<Program[]> => {
    const response = await apiClient.get(
      `/api/v1/ubertoua/establishments/${establishmentId}/departments/${departmentId}/programs`,
      { params: { level } }
    );
    return response.data;
  },

  // Get UE for a department and level
  getUE: async (
    establishmentId: string,
    departmentId: string,
    level: string
  ): Promise<string[]> => {
    const response = await apiClient.get<UEResponse>(
      `/api/v1/ubertoua/establishments/${establishmentId}/departments/${departmentId}/ue`,
      { params: { level } }
    );
    return response.data.ue;
  },
};

// University levels for dropdown
export const UNIVERSITY_LEVELS = [
  'Licence 1',
  'Licence 2',
  'Licence 3',
  'Master 1',
  'Master 2',
];
