import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Product Management Portal';

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Check if loading via subdomain in production
    const hostname = window.location.hostname;
    if (hostname.startsWith('login.')) {
      // Redirect to login page if on subdomain root path
      if (window.location.pathname === '/') {
        this.router.navigate(['/login']);
      }
    }
  }

  // Getter to hide the switcher bar if on the login subdomain
  get isSubdomain(): boolean {
    const hostname = window.location.hostname;
    return hostname.startsWith('login.');
  }
}
