import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart } from '../models/cart';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CartService {

  private readonly apiUrl = 'http://localhost:3000';
  private http = inject(HttpClient);
  private readonly emptyCart: Cart = {
  id: 0,
  cart_items: []
  };

  private cartSubject = new BehaviorSubject<Cart>(this.emptyCart);
  cart$ = this.cartSubject.asObservable();

  // Carica il carrello dal server
  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/cart`).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError (() => err))
    );
  }


  // Aggiunge un articolo al carrello
  addItem(productId: number, quantity = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/cart/items`, {
      product_id: productId,
      quantity
    }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError (() => err))
    );
  }

  // Aggiorna la quantità di un articolo nel carrello
  updateItem(itemId: number, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/cart/items/${itemId}`, {
      quantity
    }).pipe(
      tap(cart => this.cartSubject.next(cart)),
      catchError(err => throwError (() => err))
    );
  }

  // Rimuove un articolo dal carrello
  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/cart/items/${itemId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart)),
        catchError(err => throwError (() => err))
      );
  }

  // Calcola il totale del carrello moltiplicando prezzo per quantità di ogni articolo
  getTotal(): number {
    const cart = this.cartSubject.value;
    if (!cart) return 0;

    return cart.cart_items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
  }

  // Legge il riepilogo del carrello dal server
  getCheckoutTotal(): Observable<{ total: number }> {
  return this.http.get<{ total: number }>(`${this.apiUrl}/cart/summary`
  );  
}

  // Svuota il carrello locale
  clearLocal(): void {
    this.cartSubject.next(this.emptyCart);
  }
}
