import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart';
import { MatCardModule } from "@angular/material/card";
import { MatListModule } from "@angular/material/list";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButton } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatFormFieldModule, MatInputModule, MatIconModule, RouterModule, MatButton],
  templateUrl: './cart.html'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);

  cart$ = this.cartService.cart$;
  total$ = this.cart$.pipe(
    map(cart => cart ? cart.cart_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0) : 0)
  );

  updateQuantity(itemId: number, qty: number) {
    const quantity = Number(qty);
    if (quantity < 1 || isNaN(quantity)) return;
    this.cartService.updateItem(itemId, qty).subscribe();
  }

  removeItem(itemId: number) {
    this.cartService.removeItem(itemId).subscribe();
  }

  ngOnInit() {
    this.cartService.loadCart().subscribe();
  }
}
