import { Observable } from '@nativescript/core';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class MainViewModel extends Observable {
  private expenseService = ExpenseService.getInstance();
  private authService = AuthService.getInstance();

  selectedTab: number = 0;
  monthlyTotal: number = 0;
  budgetRemaining: number = 0;
  savingsTotal: number = 0;
  recentExpenses: any[] = [];
  expenses: any[] = [];
  budgets: any[] = [];
  totalBudget: number = 0;
  user: any = null;
  darkMode: boolean = false;
  notifications: boolean = true;
  currencies: string[] = ['USD', 'EUR', 'GBP'];
  selectedCurrencyIndex: number = 0;

  constructor() {
    super();
    this.loadData();
  }

  async loadData() {
    const user = this.authService.currentUser$.value;
    if (user) {
      this.user = user;
      this.expenses = await this.expenseService.getExpenses(user.id);
      this.recentExpenses = this.expenses.slice(0, 5);
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
    this.budgetRemaining = 1000 - this.monthlyTotal; // Placeholder
    this.savingsTotal = 500; // Placeholder
    
    this.notifyPropertyChange('monthlyTotal', this.monthlyTotal);
    this.notifyPropertyChange('budgetRemaining', this.budgetRemaining);
    this.notifyPropertyChange('savingsTotal', this.savingsTotal);
  }

  onAddExpense() {
    Frame.topmost().navigate('pages/expenses/add-expense-page');
  }

  onAddBudget() {
    Frame.topmost().navigate('pages/budgets/add-budget-page');
  }

  onLinkPartner() {
    // TODO: Implement partner linking
  }

  onExportData() {
    // TODO: Implement data export
  }

  async onSignOut() {
    await this.authService.signOut();
    Frame.topmost().navigate({
      moduleName: 'pages/auth/login-page',
      clearHistory: true
    });
  }
}