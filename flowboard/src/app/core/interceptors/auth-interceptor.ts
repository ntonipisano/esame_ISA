import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Prendi il token dal servizio Auth
    const token = this.auth.getToken(); // metodo che legge il token da localStorage

    // Se c'è il token, clono la richiesta aggiungendo l'header Authorization
    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(authReq).pipe (

        // Gestione dell'errore 401 Unauthorized di HTTP (token scaduto o non valido)
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.auth.logout();
            this.router.navigate(['/login']);
          }
          return throwError(() => error);
        })
      );
    }

    // Altrimenti passa la richiesta così com’è
    return next.handle(req);
  }
}
