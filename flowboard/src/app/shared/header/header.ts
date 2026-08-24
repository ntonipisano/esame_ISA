import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {

  private router = inject(Router);

  constructor(public auth: AuthService) {}

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  toggleLogin(): void {
    if (this.auth.isAuthenticated()) {
      this.auth.logout();
      // reindirizza alla home dopo logout
      this.router.navigate(['/products']);
    } else {
      // porta alla login page
      this.router.navigate(['/login']);
    }
  }
}