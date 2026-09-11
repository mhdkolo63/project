import { supabase } from './supabase';
import type { EnglishLevel, User } from '@/types';

interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}

const mapUser = (
  authUser: {
    id: string;
    email?: string | null;
    created_at: string;
    user_metadata?: Record<string, any>;
  },
  profile?: any
): User => {
  return {
    id: authUser.id,
    name:
      profile?.name ||
      authUser.user_metadata?.name ||
      'User',
    email: authUser.email || '',
    englishLevel:
      (profile?.english_level as EnglishLevel) || 'Beginner',
    xp: profile?.xp || 0,
    streak: profile?.streak || 0,
    longestStreak: profile?.longest_streak || 0,
    lessonsCompleted: profile?.lessons_completed || 0,
    dailyGoal: profile?.daily_goal || 3,
    createdAt: profile?.created_at || authUser.created_at,
    isGuest: false,
  };
};

export const authService = {
  async signUp({
    name,
    email,
    password,
  }: AuthCredentials): Promise<{ user: User }> {
    if (!name) {
      throw new Error('Name is required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: name.trim(),
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to create account.');
    }

    /*
     * The database trigger should normally create the profile
     * automatically. If email confirmation is disabled, we can
     * also read the profile immediately.
     */
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    return {
      user: mapUser(data.user, profile),
    };
  },

  async login({
    email,
    password,
  }: AuthCredentials): Promise<{ user: User }> {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Unable to log in.');
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        'Failed to load user profile:',
        profileError.message
      );
    }

    return {
      user: mapUser(data.user, profile),
    };
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error(
        'Failed to get current user:',
        error.message
      );
      return null;
    }

    if (!user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        'Failed to load profile:',
        profileError.message
      );
    }

    return mapUser(user, profile);
  },

  async updateProfile(
    updates: Partial<User>
  ): Promise<User> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in.');
    }

    const profileUpdates: Record<string, any> = {};

    if (updates.name !== undefined) {
      profileUpdates.name = updates.name;
    }

    if (updates.englishLevel !== undefined) {
      profileUpdates.english_level = updates.englishLevel;
    }

    if (updates.xp !== undefined) {
      profileUpdates.xp = updates.xp;
    }

    if (updates.streak !== undefined) {
      profileUpdates.streak = updates.streak;
    }

    if (updates.longestStreak !== undefined) {
      profileUpdates.longest_streak = updates.longestStreak;
    }

    if (updates.lessonsCompleted !== undefined) {
      profileUpdates.lessons_completed =
        updates.lessonsCompleted;
    }

    if (updates.dailyGoal !== undefined) {
      profileUpdates.daily_goal = updates.dailyGoal;
    }

    if (Object.keys(profileUpdates).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    }

    const updatedUser = await this.getCurrentUser();

    if (!updatedUser) {
      throw new Error('Unable to load updated profile.');
    }

    return updatedUser;
  },

  async setEnglishLevel(
    level: EnglishLevel
  ): Promise<User> {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error('You must be logged in.');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        english_level: level,
      })
      .eq('id', user.id);

    if (error) {
      throw new Error(error.message);
    }

    const updatedUser = await this.getCurrentUser();

    if (!updatedUser) {
      throw new Error('Unable to load updated profile.');
    }

    return updatedUser;
  },

  guestUser(): User {
    return {
      id: 'guest',
      name: 'Guest',
      email: '',
      englishLevel: 'Beginner',
      xp: 0,
      streak: 0,
      longestStreak: 0,
      lessonsCompleted: 0,
      dailyGoal: 3,
      createdAt: new Date().toISOString(),
      isGuest: true,
    };
  },
};
