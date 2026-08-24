import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { WishlistService } from './wishlist';
import { CartService } from './cart';

interface AuthResponse {
  token?: string;
  id: number;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:3000/auth';
  private readonly tokenKey = 'auth_token';

  private wishlistService = inject(WishlistService);
  private cartService = inject(CartService);
  private http = inject(HttpClient);

  // Autentica l'utente con email e password, salva il token se il login ha successo
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, 
      { email, password },
      { observe: 'response' }
    ).pipe(
      tap((response: HttpResponse<AuthResponse>) => {
        // Prova a leggere il token dal body della risposta
        let token = response.body?.token;
        
        // Se non c'è nel body, leggi dall'header Authorization
        if (!token) {
          const authHeader = response.headers.get('Authorization');
          if (authHeader) {
            // Header è "Bearer <token>"
            token = authHeader.replace('Bearer ', '');
          }
        }
        
        if (token) {
          this.setToken(token);
        }
        this.wishlistService.loadWishlist().subscribe();
        this.cartService.loadCart().subscribe();
      }),
      map(response => response.body as AuthResponse),
      catchError(err => {
        return throwError(() => err);
  })
    );
  }

  // Registra un nuovo utente con email e password
  register(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/register`, {
      user: {
        email,
        password,
      }
    }).pipe (
      catchError(err => {
        return throwError(() => err);
  })
    );
  }

  // Effettua il logout rimuovendo il token da localStorage
  logout() {
    localStorage.removeItem(this.tokenKey);
    this.wishlistService.clearLocal();
    this.cartService.clearLocal();
  }

  // Verifica se l'utente è autenticato controllando la presenza del token
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Restituisce il token di autenticazione da localStorage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Salva il token in localStorage
  private setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }
}
