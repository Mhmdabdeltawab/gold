import { Observable } from '@nativescript/core';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Expense } from '../../models/expense.model';
import { Frame } from '@nativescript/core';

export class ExpensesViewModel extends Observable {
  private expenseService = ExpenseService.getInstance();
  private authService = AuthService.getInstance();
  
  expenses: Expense[] = [];
  monthlyTotal: number = 0;
  budgetRemaining: number = 0;

  constructor() {
    super();
    this.loadExpenses();
  }

  async loadExpenses() {
    const user = await this.authService.currentUser$.value;
    if (user) {
      this.expenses = await this.expenseService.getExpenses(user.id);
      this.calculateTotals();
      this.notifyPropertyChange('expenses', this.expenses);
    }
  }

  private calculateTotals() {
    const now = new Date();
    const thisMonth = this.expenses.filter(e => 
      e.date.getMonth() === now.getMonth() && 
      e.date.getFullYear() === now.getFullYear()
    );
    
    this.monthlyTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
    this.notifyPropertyChange('monthlyTotal', this.monthlyTotal);
    
    // TODO: Calculate budget remaining based on set budgets
    this.budgetRemaining = 1000 - this.monthlyTotal; // Placeholder
    this.notifyPropertyChange('budgetRemaining', this.budgetRemaining);
  }

  onAddExpense() {
    Frame.topmost().navigate('pages/expenses/add-expense-page');
  }
}