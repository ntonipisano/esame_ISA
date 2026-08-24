import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { AuthService } from './core/services/auth-service';
import { CartService } from './core/services/cart';
import { WishlistService } from './core/services/wishlist';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  currentYear = new Date().getFullYear();
  protected readonly title = signal('flowboard');
  constructor(private authService: AuthService, private cartService: CartService, private wishlistService: WishlistService) {
    if (this.authService.isAuthenticated()) {
    this.cartService.loadCart().subscribe();
    this.wishlistService.loadWishlist().subscribe();
  }
}
}
