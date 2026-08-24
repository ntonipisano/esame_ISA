import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../core/models/product';
import { CartService } from '../../core/services/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { catchError, map, of } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.scss'
})
export class WishlistPage {

  private wishlistService = inject(WishlistService);
  private CartService = inject(CartService);
  private snackBar = inject(MatSnackBar);
  
    protected readonly wishlist$ = this.wishlistService.wishlist$.pipe(
    map(items =>
      items.map(item => ({
        ...item,
        product: {
          ...item.product,
          createdAt: (item.product as any).created_at // snake_case → camelCase
        }
      }))
    ),
    catchError(err => {
      let message = 'Errore nel caricamento della wishlist';
      if (err.status === 401) message = 'Non sei autenticato';
      else if (err.status === 404) message = 'Wishlist non trovata';
      else if (err.status === 422 && err.error?.errors) message = err.error.errors.join(', ');

      this.snackBar.open(message, 'Chiudi', { duration: 5000 });
      return of([]);
    })
  );

    ngOnInit(): void {
    this.wishlistService.loadWishlist().subscribe();
  }

remove(productId: number) {
  this.wishlistService.remove(productId).subscribe({
    next: () => {
      this.snackBar.open(
        'Prodotto rimosso dalla wishlist',
        'OK',
        { duration: 2500 }
      );
    },
    error: err => {
      let message = 'Errore durante la rimozione';

      if (err.status === 404) {
        message = err.error?.error || 'Prodotto non trovato in wishlist';
      } 
      this.snackBar.open(message, 'Chiudi', { duration: 3000 });
    }
  });
}


 onAddToCart(product: Product) {
  this.CartService.addItem(product.id, 1).subscribe({
    next: () => {
      this.snackBar.open(
        `"${product.title}" aggiunto al carrello`,
        'OK',
        {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
        }
      );
    },
    error: (err) => {
      let msg = 'Errore durante l’aggiunta al carrello';

      if (err.status === 401) {
        msg = 'Devi effettuare il login per aggiungere al carrello';
      } else if (err.status === 404) {
        msg = 'Prodotto non trovato';
      } else if (err.status === 422) {
        msg = err.error?.error || 'Quantità non valida';
      } else if (err.status === 500) {
        msg = 'Errore interno del server, riprova più tardi';
      }

      this.snackBar.open(msg, 'Chiudi', { duration: 3000 });
    }
  });
}

}

