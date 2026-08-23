import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-land-page-v2',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './land-page-v2.component.html',
  styleUrls: ['./land-page-v2.component.css']
})
export class LandPageV2Component {
  bookingService: string = '';
  bookingExpert: string = '';
  bookingDate: string = '';
  bookingTime: string = '';
  bookingName: string = '';
  bookingPhone: string = '';
  bookingMessage: string = '';
  formSubmitted: boolean = false;
  showSuccessModal: boolean = false;

  clients = [
    { name: 'HDFC Bank', logo: '/assets/images/clients/client_logo_hdfc.png' },
    { name: 'World Skill Center', logo: '/assets/images/clients/client_logo_wsc.png' },
    { name: 'Tata Steel', logo: '/assets/images/clients/client_logo_tatasteel.png' },
    { name: 'Bhubaneswar Municipal Corporation', logo: '/assets/images/clients/client_logo_bmc.png' },
    { name: 'IDCO Odisha', logo: '/assets/images/clients/client_logo_idco.png' },
    { name: 'Odisha Coal and Power Limited', logo: '/assets/images/clients/client_logo_ocpl.png' },
    { name: 'Odisha Power Generation Corporation', logo: '/assets/images/clients/client_logo_opgc.png' },
    { name: 'Vedanta', logo: '/assets/images/clients/client_logo_vedanta.png' }
  ];

  constructor(private router: Router) {}

  onLoginClick(): void {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      this.router.navigate(['/login']);
    } else {
      window.location.href = 'https://login.uucarchitects.in';
    }
  }

  onSubmitBooking() {
    this.formSubmitted = true;
    setTimeout(() => {
      this.bookingService = '';
      this.bookingExpert = '';
      this.bookingDate = '';
      this.bookingTime = '';
      this.bookingName = '';
      this.bookingPhone = '';
      this.bookingMessage = '';
      this.formSubmitted = false;
      this.showSuccessModal = true;
    }, 1000);
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
  }
}
