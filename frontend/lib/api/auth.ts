import apiClient from './client';

export interface RegisterData {
  email: string;
  password: string;
  confirm_password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    role: string;
    created_at: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: string;
  created_at: string;
  student_profile?: {
    first_name: string;
    last_name: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    completion_percentage: number;
  };
}

export const authAPI = {
  // Register new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/register', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/api/v1/auth/login', data);
    return response.data;
  },

  // Get current user
  me: async (): Promise<UserProfile> => {
    const response = await apiClient.get('/api/v1/auth/me');
    return response.data;
  },

  // Logout user
  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        await apiClient.post('/api/v1/auth/logout', {
          refresh_token: refreshToken,
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    // Clear tokens regardless of API call success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
};
