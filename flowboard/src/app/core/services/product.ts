import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, throwError } from "rxjs";
import { Product } from "../models/product";

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly baseUrl = 'http://localhost:3000';
  private http = inject(HttpClient);

  // Recupera tutti i prodotti dal server
  list(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/products`).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

  // Recupera un prodotto specifico
  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`).pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }
}
