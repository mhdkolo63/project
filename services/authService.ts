import { apiRequest } from './api';
import { User, EnglishLevel } from '@/types';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: data,
    });
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
    });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  async updateProfile(token: string, updates: Partial<User>): Promise<User> {
    return apiRequest<User>('/auth/profile', {
      method: 'PUT',
      body: updates,
      token,
    });
  },

  async setEnglishLevel(token: string, level: EnglishLevel): Promise<User> {
    return apiRequest<User>('/auth/level', {
      method: 'PUT',
      body: { englishLevel: level },
      token,
    });
  },

  guestUser(): User {
    return {
      id: 'guest',
      name: 'Guest',
      email: '',
      englishLevel: 'Beginner',
      xp: 0,
      streak: 0,
      lessonsCompleted: 0,
      dailyGoal: 3,
      createdAt: new Date().toISOString(),
      isGuest: true,
      longestStreak: 0,
    };
  },
};
