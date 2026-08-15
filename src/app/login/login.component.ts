import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

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

  @Output() loginSuccess = new EventEmitter<User>();

  constructor(private userService: UserService) {}

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
        this.loginSuccess.emit(user);
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
