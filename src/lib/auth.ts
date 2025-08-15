import { supabase, Player } from './supabase';

export interface LoginCredentials {
  identifier: string; // Can be username or email
  password: string;
}

export interface AuthUser {
  player_id: string;
  player_name: string;
  email: string;
  is_admin: boolean;
  avatar: string;
}

export class AuthService {
  /**
   * Login with username or email
   */
  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { identifier, password } = credentials;
      
      // Check if identifier is email or username
      const isEmail = identifier.includes('@');
      
      let query = supabase
        .from('players')
        .select('*')
        .eq('password', password);
      
      if (isEmail) {
        query = query.eq('email', identifier);
      } else {
        query = query.eq('player_name', identifier);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        return { user: null, error: 'Invalid credentials' };
      }
      
      if (!data) {
        return { user: null, error: 'User not found' };
      }
      
      const user: AuthUser = {
        player_id: data.player_id,
        player_name: data.player_name,
        email: data.email,
        is_admin: data.is_admin,
        avatar: data.avatar
      };
      
      // Store user in localStorage for session management
      if (typeof window !== 'undefined') {
        localStorage.setItem('wsob_user', JSON.stringify(user));
      }
      
      return { user, error: null };
    } catch (error) {
      console.error('Login error:', error);
      return { user: null, error: 'Login failed. Please try again.' };
    }
  }
  
  /**
   * Logout user
   */
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wsob_user');
    }
  }
  
  /**
   * Get current user from localStorage
   */
  static getCurrentUser(): AuthUser | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('wsob_user');
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }
    return null;
  }
  
  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }
  
  /**
   * Check if current user is admin
   */
  static isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.is_admin || false;
  }
}