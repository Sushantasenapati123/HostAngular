import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  phoneNumberInput = '';
  loggingIn = false;
  errorMsg = '';

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  login(): void {
    if (!this.phoneNumberInput || this.phoneNumberInput.trim() === '') {
      this.errorMsg = 'Please enter a valid mobile number.';
      return;
    }

    this.loggingIn = true;
    this.errorMsg = '';

    this.userService.login(this.phoneNumberInput.trim()).subscribe({
      next: (user) => {
        this.loggingIn = false;
        // Save current user session in local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        // Redirect to protected dashboard route
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Access Denied. Mobile number is not registered in the database.';
        this.loggingIn = false;
      }
    });
  }

  dismissAlerts(): void {
    this.errorMsg = '';
  }
}
