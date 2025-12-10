/**
 * API Client Service
 * Handles all HTTP requests to the Flask backend
 * Manages authentication tokens and request/response interceptors
 */

import axios, { AxiosInstance, AxiosError } from 'axios';

// Use environment variable or fallback to hostname:5000
// Use environment variable or fallback to protocol-relative path
// Ideally VITE_API_URL should be set in .env.production
export const API_URL = import.meta.env.VITE_API_URL || `${window.location.protocol}//${window.location.hostname}:5202`;

interface LoginResponse {
  success: boolean;
  message?: string;
  user?: User;
  error?: string;
}

interface SignupResponse {
  success: boolean;
  message?: string;
  user?: User;
  error?: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  is_admin: boolean;
  verified: boolean;
  created_at: string;
}

interface ApiError {
  success: boolean;
  error: string;
}

class APIClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true, // Enable cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        return Promise.reject(error);
      }
    );
  }

  // ===========================
  // Authentication Endpoints
  // ===========================

  /**
   * Login user
   */
  public async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.client.post('/api/auth/login', {
        email,
        password,
      });

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Sign up a new user
   */
  public async signup(
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<SignupResponse> {
    try {
      const response = await this.client.post('/api/auth/signup', {
        username,
        email,
        password,
        confirmPassword: confirmPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Get current user info
   */
  public async getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await this.client.get('/api/auth/check');
      if (response.data.isAuthenticated) {
        return { success: true, user: response.data.user };
      }
      return { success: false };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Verify email with token
   */
  public async verifyEmail(token: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.client.get(`/api/auth/verify/${token}`);
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  public async logout(): Promise<void> {
    try {
      await this.client.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  /**
   * Request password reset
   */
  public async forgotPassword(email: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.client.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Reset password with token
   */
  public async resetPassword(
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const response = await this.client.post(`/api/auth/reset-password/${token}`, {
        password,
        confirm_password: confirmPassword,
      });
      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic GET request
   */
  public async get(url: string, config?: any): Promise<any> {
    try {
      return await this.client.get(url, config);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic POST request
   */
  public async post(url: string, data?: any, config?: any): Promise<any> {
    try {
      return await this.client.post(url, data, config);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic PUT request
   */
  public async put(url: string, data?: any, config?: any): Promise<any> {
    try {
      return await this.client.put(url, data, config);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Generic DELETE request
   */
  public async delete(url: string, config?: any): Promise<any> {
    try {
      return await this.client.delete(url, config);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): any {
    if (axios.isAxiosError(error)) {
      const response = error.response?.data as ApiError;
      // If the response is a blob (for files), we might not be able to parse it as JSON
      if (error.response?.config?.responseType === 'blob') {
        return {
          success: false,
          error: 'Download failed'
        };
      }

      return {
        success: false,
        error: response?.error || error.response?.statusText || 'An error occurred',
      };
    }

    return {
      success: false,
      error: 'Network error. Please try again.',
    };
  }
}

// Export singleton instance
export const apiClient = new APIClient();
export default apiClient;
