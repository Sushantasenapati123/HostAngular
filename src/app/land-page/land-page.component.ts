import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-land-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.css']
})
export class LandPageComponent {
  contactName: string = '';
  contactEmail: string = '';
  contactPhone: string = '';
  contactMessage: string = '';
  formSubmitted: boolean = false;
  showSuccessModal: boolean = false;

  constructor(private router: Router) {}

  onLoginClick(): void {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.router.navigate(['/login']);
    } else {
      window.location.href = 'https://login.uucarchitects.in';
    }
  }

  onSubmitContact() {
    this.formSubmitted = true;
    setTimeout(() => {
      this.contactName = '';
      this.contactEmail = '';
      this.contactPhone = '';
      this.contactMessage = '';
      this.formSubmitted = false;
      this.showSuccessModal = true;
    }, 1000);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
