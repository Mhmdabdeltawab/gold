import { firebase } from '@nativescript/firebase-core';
import '@nativescript/firebase-firestore';
import { Expense, Budget } from '../models/expense.model';

export class ExpenseService {
  private static instance: ExpenseService;
  private db = firebase.firestore();

  static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }
    return ExpenseService.instance;
  }

  async addExpense(expense: Expense): Promise<string> {
    try {
      const docRef = await this.db.collection('expenses').add(expense);
      return docRef.id;
    } catch (error) {
      console.error('Add expense error:', error);
      throw error;
    }
  }

  async getExpenses(userId: string, type?: 'personal' | 'shared'): Promise<Expense[]> {
    try {
      let query = this.db.collection('expenses').where('userId', '==', userId);
      if (type) {
        query = query.where('type', '==', type);
      }
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
    } catch (error) {
      console.error('Get expenses error:', error);
      throw error;
    }
  }

  async setBudget(budget: Budget): Promise<string> {
    try {
      const docRef = await this.db.collection('budgets').add(budget);
      return docRef.id;
    } catch (error) {
      console.error('Set budget error:', error);
      throw error;
    }
  }

  async getBudgets(userId: string): Promise<Budget[]> {
    try {
      const snapshot = await this.db.collection('budgets')
        .where('userId', '==', userId)
        .get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
    } catch (error) {
      console.error('Get budgets error:', error);
      throw error;
    }
  }
}