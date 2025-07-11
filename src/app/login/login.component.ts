import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email && this.password) {
      console.log('Login attempt:', { email: this.email, password: this.password });
      // Here you would typically call an authentication service
      // For now, just log the values and navigate to dashboard
      this.router.navigate(['/dashboard']);
    }
  }
}
