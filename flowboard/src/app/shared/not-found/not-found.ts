import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule],
  template: `
    <h2>404 – Pagina non trovata</h2>
    <p>La pagina richiesta non esiste.</p>

    <a routerLink="/products">Torna al catalogo</a>
  `
})
export class NotFoundComponent {}
