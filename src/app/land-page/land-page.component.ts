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

  galleryImages = [
    { src: '/assets/images/gallery/IMG-20260823-WA0000.jpg', alt: 'Modern Exterior', title: 'Modern Exterior' },
    { src: '/assets/images/gallery/IMG-20260823-WA0001.jpg', alt: 'Elegant Living Room', title: 'Elegant Living Room' },
    { src: '/assets/images/gallery/IMG-20260823-WA0002.jpg', alt: 'Luxury Bedroom', title: 'Luxury Bedroom' },
    { src: '/assets/images/gallery/IMG-20260823-WA0003.jpg', alt: 'Contemporary Kitchen', title: 'Contemporary Kitchen' },
    { src: '/assets/images/gallery/IMG-20260823-WA0004.jpg', alt: 'Cozy Lounge Area', title: 'Cozy Lounge Area' },
    { src: '/assets/images/gallery/IMG-20260823-WA0005.jpg', alt: 'Stylish Dining Space', title: 'Stylish Dining Space' },
    { src: '/assets/images/gallery/IMG-20260823-WA0006.jpg', alt: 'Architectural Elevation', title: 'Architectural Elevation' },
    { src: '/assets/images/gallery/IMG-20260823-WA0007.jpg', alt: 'Premium Facade', title: 'Premium Facade' },
    { src: '/assets/images/gallery/IMG-20260823-WA0008.jpg', alt: 'Modern Living Space', title: 'Modern Living Space' },
    { src: '/assets/images/gallery/IMG-20260823-WA0009.jpg', alt: 'Sunset Balcony View', title: 'Sunset Balcony View' },
    { src: '/assets/images/gallery/IMG-20260823-WA0010.jpg', alt: 'Chic Interior Details', title: 'Chic Interior Details' },
    { src: '/assets/images/gallery/IMG-20260823-WA0011.jpg', alt: 'Luxury Villa Elevation', title: 'Luxury Villa Elevation' }
  ];

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
