import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-auth';
import { Observable, BehaviorSubject } from '@nativescript/core';
import { User } from '../models/expense.model';

export class AuthService extends Observable {
  private static instance: AuthService;
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (userCredential.user) {
        // Fetch user data from Firestore and update currentUserSubject
        // Implementation here
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        // Create user profile in Firestore
        // Implementation here
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await firebase.auth().signOut();
      this.currentUserSubject.next(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  }

  get currentUser$() {
    return this.currentUserSubject.asObservable();
  }
}