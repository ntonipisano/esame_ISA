import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WishlistItem } from '../models/wishlist-item';
import { map } from 'rxjs/operators';
import { catchError, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WishlistService {

  private readonly apiUrl = 'http://localhost:3000'; // backend Rails

  private wishlistSubject = new BehaviorSubject<WishlistItem[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  private http = inject(HttpClient);

  /* Carica la wishlist dell’utente autenticato */
  loadWishlist(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(`${this.apiUrl}/wishlist`).pipe(
      tap(items => this.wishlistSubject.next(items)),
      catchError(err => {
        return throwError (() => err);
  })
    );
  }

  /* Aggiunge un prodotto alla wishlist */
  add(productId: number): Observable<WishlistItem> {
    return this.http.post<WishlistItem>(`${this.apiUrl}/wishlist`, {
      product_id: productId
    }).pipe(
      tap(item => {
        const current = this.wishlistSubject.value;
        this.wishlistSubject.next([...current, item]);
      }),
      catchError(err => {
        return throwError (() => err);
  })
    );
  }

  /* Rimuove un prodotto dalla wishlist */
  remove(productId: number): Observable<WishlistItem[]> {
  return this.http
    .delete<WishlistItem[]>(`${this.apiUrl}/wishlist/${productId}`)
    .pipe(
      tap(items => {
        this.wishlistSubject.next(items);
      }),
      catchError(err => {
        return throwError (() => err);
  })
    );
}

  /*Verifica se un prodotto è in wishlist*/
  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.value
      .some(item => item.product.id === productId);
  }

 isInWishlist$(productId: number): Observable<boolean> {
    return this.wishlist$.pipe(
      map(items =>
        items.some(item => item.product.id === productId)
      )
    );
  }

  clearLocal(): void {
    this.wishlistSubject.next([]);
  }
}
