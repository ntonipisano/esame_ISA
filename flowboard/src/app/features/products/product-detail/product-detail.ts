import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, map } from 'rxjs';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../../core/services/cart';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
selector: 'app-product-detail'
,

standalone: true,
templateUrl: './product-detail.html'
,

imports: [RouterModule, AsyncPipe, MatCardModule, MatButtonModule, CurrencyPipe, MatSnackBarModule],
})
export class ProductDetail {
private CartService = inject(CartService);
private route = inject(ActivatedRoute);
private svc = inject(ProductService);
private snackBar = inject(MatSnackBar);

readonly product$ = this.route.paramMap.pipe(
map(params => params.get('id') as string),
switchMap(id => this.svc.getProductById(id)),
);

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