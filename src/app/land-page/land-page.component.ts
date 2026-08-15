import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-land-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './land-page.component.html',
  styleUrls: ['./land-page.component.css']
})
export class LandPageComponent {
  @Output() loginClick = new EventEmitter<void>();

  contactName: string = '';
  contactEmail: string = '';
  contactPhone: string = '';
  contactMessage: string = '';
  formSubmitted: boolean = false;

  showSuccessModal: boolean = false;

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
