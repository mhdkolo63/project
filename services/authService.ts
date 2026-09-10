import { supabase } from './supabase';

export const authService = {
  async signUp({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to create account.');
    }

    return {
      user: {
        id: data.user.id,
        name: name,
        email: data.user.email || email,
        englishLevel: 'Beginner' as const,
        xp: 0,
        streak: 0,
        longestStreak: 0,
        lessonsCompleted: 0,
        dailyGoal: 3,
        createdAt: data.user.created_at,
        isGuest: false,
      },
    };
  },

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to log in.');
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    return {
      user: {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || 'User',
        email: data.user.email || email,
        englishLevel: profile?.english_level || 'Beginner',
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        longestStreak: profile?.longest_streak || 0,
        lessonsCompleted: profile?.lessons_completed || 0,
        dailyGoal: profile?.daily_goal || 3,
        createdAt: profile?.created_at || data.user.created_at,
        isGuest: false,
      },
    };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      name: profile?.name || user.user_metadata?.name || 'User',
      email: user.email || '',
      englishLevel: profile?.english_level || 'Beginner',
      xp: profile?.xp || 0,
      streak: profile?.streak || 0,
      longestStreak: profile?.longest_streak || 0,
      lessonsCompleted: profile?.lessons_completed || 0,
      dailyGoal: profile?.daily_goal || 3,
      createdAt: profile?.created_at || user.created_at,
      isGuest: false,
    };
  },
};      method: 'POST',
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
