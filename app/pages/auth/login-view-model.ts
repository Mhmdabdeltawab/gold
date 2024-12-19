import { Observable } from '@nativescript/core';
import { AuthService } from '../../services/auth.service';
import { Frame } from '@nativescript/core';

export class LoginViewModel extends Observable {
  private authService = AuthService.getInstance();
  email: string = '';
  password: string = '';

  async onSignIn() {
    try {
      await this.authService.signIn(this.email, this.password);
      Frame.topmost().navigate({
        moduleName: 'pages/expenses/expenses-page',
        clearHistory: true
      });
    } catch (error) {
      console.error('Login error:', error);
      // Show error dialog
    }
  }

  onNavigateToSignUp() {
    Frame.topmost().navigate('pages/auth/signup-page');
  }
}