import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Product } from '../../../core/models/product';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../../core/services/wishlist';
import { MatIconModule } from "@angular/material/icon";
import { Observable, firstValueFrom, map } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  imports: [CurrencyPipe, DatePipe, MatButtonModule, MatCardModule, RouterModule, MatIconModule, AsyncPipe, MatSnackBarModule],
  standalone: true,
  templateUrl: `./product-card.html`,
  styleUrls: [`./product-card.scss`],
})

export class ProductCard {
    @Input({ required: true }) product!: Product;
    @Output () add = new EventEmitter<Product>();
    private WishlistService = inject(WishlistService);
    private snackBar = inject(MatSnackBar);

    // Observable booleano che indica se il prodotto è in wishlist
    inWishlist$!: Observable<boolean>;

    ngOnInit() {
      // Reactive wishlist 
      this.inWishlist$ = this.WishlistService.wishlist$.pipe(
        map(items => items.some(item => item.product.id === this.product.id))
      );
    }

  async toggleWishlist() {
     const isIn = await firstValueFrom(this.inWishlist$);
    if (isIn) {
      this.WishlistService.remove(this.product.id).subscribe({
        next: () => {
          this.snackBar.open(
            `"${this.product.title}" rimosso dalla wishlist`,
            'OK',
            {
              duration: 2500,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            }
          );
        },
        error: err => {
        let message = 'Errore durante la rimozione';

        if (err.status === 401) {
          message = 'Devi essere autenticato';
        } else if (err.status === 422) {
          message = err.error?.error || 'Prodotto non presente in wishlist';
        }
        this.snackBar.open(message, 'Chiudi', { duration: 3000 });
      }
    });
    } else {
      this.WishlistService.add(this.product.id).subscribe({
        next: () => {
          this.snackBar.open(
            `"${this.product.title}" aggiunto alla wishlist`,
            'OK',
            {
              duration: 2500,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
            }
          );
        },
        error: err => {
        let message = 'Errore durante l’aggiunta';

        if (err.status === 422) {
          message = err.error?.error || 'Prodotto già in wishlist';
        } else if (err.status === 401) {
          message = 'Devi essere autenticato';
        }

        this.snackBar.open(message, 'Chiudi', { duration: 3000 });
      }
      });
    }
  }

isInWishlist(productId: number): boolean {
  return this.WishlistService.isInWishlist(productId);
}

} 