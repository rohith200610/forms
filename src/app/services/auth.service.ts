import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  private readonly USERS_DB_KEY = 'users_database'; // Add this for persistent user storage
  
  // BehaviorSubject to track authentication state
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  
  // Public observables
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  // Default user database (initial data)
  private defaultUsers: User[] = [
    {
      id: '1',
      email: 'admin@expense.com',
      name: 'Admin User',
      role: 'admin',
      permissions: ['read', 'write', 'delete', 'manage_users', 'view_all_data']
    },
    {
      id: '2',
      email: 'user@expense.com',
      name: 'Regular User',
      role: 'user',
      permissions: ['read', 'write']
    },
    {
      id: '3',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'user',
      permissions: ['read', 'write']
    }
  ];

  // Mock user database (in real app, this would be backend API)
  private mockUsers: User[] = [];

  constructor(private router: Router) {
    // Initialize users from localStorage or use defaults
    this.loadUsersFromStorage();
    // Check if user is already authenticated on service initialization
    this.checkAuthStatus();
  }

  /**
   * Load users from localStorage or initialize with defaults
   */
  private loadUsersFromStorage(): void {
    try {
      const savedUsers = localStorage.getItem(this.USERS_DB_KEY);
      if (savedUsers) {
        this.mockUsers = JSON.parse(savedUsers);
        console.log('Users loaded from localStorage');
      } else {
        // First time or no saved data, use defaults
        this.mockUsers = [...this.defaultUsers];
        this.saveUsersToStorage();
        console.log('Initialized with default users');
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      this.mockUsers = [...this.defaultUsers];
    }
  }

  /**
   * Save users to localStorage
   */
  private saveUsersToStorage(): void {
    try {
      localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(this.mockUsers));
      console.log('Users saved to localStorage');
    } catch (error) {
      console.error('Error saving users to localStorage:', error);
    }
  }

  /**
   * Check authentication status on app start
   */
  private checkAuthStatus(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        // In real app, you'd validate token with backend
        if (this.isTokenValid(token)) {
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
        } else {
          this.logout();
        }
      } catch (error) {
        this.logout();
      }
    }
  }

  /**
   * Simulate token validation (in real app, check with backend)
   */
  private isTokenValid(token: string): boolean {
    try {
      // In real app, decode JWT and check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  /**
   * Generate mock JWT token (in real app, received from backend)
   */
  private generateToken(user: User): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = btoa('mock_signature');
    
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Login with email and password
   */
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return new Observable(observer => {
      // Simulate API delay
      setTimeout(() => {
        // Check if it's one of the predefined users
        let user = this.mockUsers.find(u => u.email === credentials.email);
        
        if (!user && this.validatePassword(credentials.password)) {
          // Create a new user dynamically for any valid email/password combination
          user = {
            id: Date.now().toString(), // Simple ID generation
            email: credentials.email,
            name: this.extractNameFromEmail(credentials.email),
            role: 'user', // Default role for new users
            permissions: ['read', 'write']
          };
          
          // Add to mock users array for this session
          this.mockUsers.push(user);
          this.saveUsersToStorage(); // Save to localStorage
        }
        
        if (user && this.validatePassword(credentials.password)) {
          const token = this.generateToken(user);
          
          // Store in localStorage
          localStorage.setItem(this.TOKEN_KEY, token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(user));
          
          // Update subjects
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next(user);
          
          observer.next({
            success: true,
            user,
            token,
            message: 'Login successful'
          });
        } else {
          observer.next({
            success: false,
            message: 'Invalid email or password. Password must be at least 4 characters long.'
          });
        }
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }

  /**
   * Extract name from email address
   */
  private extractNameFromEmail(email: string): string {
    const localPart = email.split('@')[0];
    // Convert email local part to a readable name
    return localPart
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  /**
   * Validate password (in real app, hash comparison on backend)
   */
  private validatePassword(password: string): boolean {
    // For demo, accept any password with length >= 4 and basic requirements
    if (password.length < 4) {
      return false;
    }
    
    // Additional validation can be added here
    // For now, just check minimum length
    return true;
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
    
    this.router.navigate(['/login']);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has specific permission
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.permissions.includes(permission) : false;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  /**
   * Check if user can access resource
   */
  canAccess(requiredRole?: string, requiredPermission?: string): boolean {
    if (!this.isAuthenticated()) {
      return false;
    }

    if (requiredRole && !this.hasRole(requiredRole)) {
      return false;
    }

    if (requiredPermission && !this.hasPermission(requiredPermission)) {
      return false;
    }

    return true;
  }

  /**
   * Register new user (basic implementation)
   */
  register(userData: { email: string; password: string; name: string }): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        // Check if user already exists
        if (this.mockUsers.find(u => u.email === userData.email)) {
          observer.next({
            success: false,
            message: 'User already exists'
          });
        } else {
          const newUser: User = {
            id: (this.mockUsers.length + 1).toString(),
            email: userData.email,
            name: userData.name,
            role: 'user',
            permissions: ['read', 'write']
          };
          
          this.mockUsers.push(newUser);
          
          observer.next({
            success: true,
            user: newUser,
            message: 'Registration successful'
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Change password
   */
  changePassword(oldPassword: string, newPassword: string): Observable<AuthResponse> {
    return new Observable(observer => {
      setTimeout(() => {
        if (this.validatePassword(oldPassword)) {
          observer.next({
            success: true,
            message: 'Password changed successfully'
          });
        } else {
          observer.next({
            success: false,
            message: 'Current password is incorrect'
          });
        }
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Get all users (Admin only)
   */
  getAllUsers(): User[] {
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.role === 'admin') {
      return [...this.mockUsers];
    }
    return [];
  }

  /**
   * Update user (Admin only)
   */
  updateUser(updatedUser: User): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }

    const index = this.mockUsers.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.mockUsers[index] = { ...updatedUser };
      this.saveUsersToStorage(); // Save changes to localStorage
      
      // If updating current user, update the stored session
      if (currentUser.id === updatedUser.id) {
        localStorage.setItem(this.USER_KEY, JSON.stringify(updatedUser));
        this.currentUserSubject.next(updatedUser);
      }
      
      return true;
    }
    return false;
  }

  /**
   * Delete user (Admin only)
   */
  deleteUser(userId: string): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }

    // Prevent admin from deleting themselves
    if (currentUser.id === userId) {
      return false;
    }

    const index = this.mockUsers.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.mockUsers.splice(index, 1);
      this.saveUsersToStorage(); // Save changes to localStorage
      return true;
    }
    return false;
  }

  /**
   * Create new user (Admin only)
   */
  createUser(userData: { email: string; name: string; role: 'admin' | 'user' }): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }

    // Check if user already exists
    if (this.mockUsers.find(u => u.email === userData.email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
      permissions: userData.role === 'admin' 
        ? ['read', 'write', 'delete', 'manage_users', 'view_all_data']
        : ['read', 'write']
    };

    this.mockUsers.push(newUser);
    this.saveUsersToStorage(); // Save to localStorage
    return true;
  }

  /**
   * Reset users database to defaults (Admin only)
   */
  resetUsersDatabase(): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return false;
    }

    this.mockUsers = [...this.defaultUsers];
    this.saveUsersToStorage();
    return true;
  }

  /**
   * Clear all user data (for testing purposes)
   */
  clearUsersDatabase(): void {
    localStorage.removeItem(this.USERS_DB_KEY);
    this.mockUsers = [...this.defaultUsers];
    console.log('Users database cleared and reset to defaults');
  }
}
