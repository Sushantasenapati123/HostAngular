import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Configured default Base URL matching the runasp.net deployment.
  // Change to http://localhost:5228/api/User for local development.
  private apiUrl = 'https://demo123.runasp.net/api/User';

  constructor(private http: HttpClient) {}

  login(phoneNumber: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/login/${phoneNumber}`);
  }
}
