import { Observable } from '@nativescript/core';
import { ExpenseService } from '../../services/expense.service';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';
import { takePicture } from '@nativescript/camera';

export class AddExpenseViewModel extends Observable {
  private expenseService = ExpenseService.getInstance();
  private authService = AuthService.getInstance();

  amount: string = '';
  description: string = '';
  categories: string[] = ['Food', 'Transport', 'Bills', 'Shopping', 'Other'];
  selectedCategoryIndex: number = 0;
  expenseType: number = 0; // 0 = Personal, 1 = Shared
  receiptPath: string = '';

  async onAddReceipt() {
    try {
      const image = await takePicture({
        width: 1024,
        height: 1024,
        keepAspectRatio: true,
        saveToGallery: false
      });
      
      if (image) {
        this.receiptPath = image.android || image.ios;
        // TODO: Upload to Firebase Storage
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  async onSaveExpense() {
    const user = this.authService.currentUser$.value;
    if (!user) return;

    try {
      await this.expenseService.addExpense({
        amount: parseFloat(this.amount),
        description: this.description,
        category: this.categories[this.selectedCategoryIndex],
        date: new Date(),
        type: this.expenseType === 0 ? 'personal' : 'shared',
        userId: user.id,
        receiptUrl: this.receiptPath,
        currency: user.preferences.currency
      });

      Frame.topmost().goBack();
    } catch (error) {
      console.error('Save expense error:', error);
    }
  }
}