export interface Expense {
  id?: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  type: 'personal' | 'shared';
  userId: string;
  receiptUrl?: string;
  notes?: string;
  currency: string;
}

export interface Budget {
  id?: string;
  category: string;
  amount: number;
  period: 'weekly' | 'monthly';
  userId: string;
  shared: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  partnerId?: string;
  preferences: {
    darkMode: boolean;
    currency: string;
    notifications: boolean;
  };
}