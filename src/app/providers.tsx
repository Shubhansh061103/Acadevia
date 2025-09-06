import { api } from '@/lib/api';
import { ApiResponse, AuthResponse, OTPRequest, OTPVerifyRequest } from '@/types/api';

class AuthAPI {
  /**
   * Send OTP to the provided phone number
   */
  async sendOTP(phoneNumber: string, userType: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/send-otp', {
        phoneNumber,
        userType,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and login user
   */
  async verifyOTP(phoneNumber: string, otp: string, userType: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/verify-otp', {
        phoneNumber,
        otp,
        userType,
      });

      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', userType);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Invalid OTP');
    }
  }

  /**
   * Register new user
   */
  async register(data: {
    name: string;
    phoneNumber: string;
    email?: string;
    grade?: string;
    userType: string;
  }): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/register', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  /**
   * Get current user details
   */
  async getCurrentUser(): Promise<any> {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh');

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to refresh token');
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');

      // Redirect to login
      window.location.href = '/auth/login';
    }
  }

  /**
   * Resend OTP
   */
  async resendOTP(phoneNumber: string, userType: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/resend-otp', {
        phoneNumber,
        userType,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to resend OTP');
    }
  }

  /**
   * Check if phone number exists
   */
  async checkPhoneExists(phoneNumber: string): Promise<{ exists: boolean; userType?: string }> {
    try {
      const response = await api.get(`/auth/check-phone/${phoneNumber}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check phone number');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    name?: string;
    email?: string;
    avatar?: string;
  }): Promise<any> {
    try {
      const response = await api.put('/auth/profile', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  }

  /**
   * Change phone number - Send OTP to new number
   */
  async changePhoneNumberRequest(newPhoneNumber: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/change-phone-request', {
        newPhoneNumber,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to initiate phone change');
    }
  }

  /**
   * Confirm phone number change with OTP
   */
  async changePhoneNumberConfirm(newPhoneNumber: string, otp: string): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/change-phone-confirm', {
        newPhoneNumber,
        otp,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to change phone number');
    }
  }

  /**
   * Delete account
   */
  async deleteAccount(password?: string): Promise<ApiResponse> {
    try {
      const response = await api.delete<ApiResponse>('/auth/account', {
        data: { password },
      });

      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('userType');

      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete account');
    }
  }
}

export const authApi = new AuthAPI();