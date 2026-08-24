import { Component, inject } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { Product } from '../../../core/models/product';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, filter, map, startWith } from 'rxjs';
import { ProductService } from '../../../core/services/product';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CartService } from '../../../core/services/cart';
import { catchError, of } from 'rxjs';

type Sort = 'priceAsc' | 'priceDesc' | 'dateAsc' | 'dateDesc';
const cmp = (s:Sort)=>(a:Product,b:Product)=>
s==='priceAsc'? a.price-b.price :
s==='priceDesc'? b.price-a.price :
s==='dateAsc'? a.createdAt.localeCompare(b.createdAt) :
b.createdAt.localeCompare(a.createdAt); //default dateDesc


@Component({
  selector: 'app-product-page',
  imports: [ProductCard, FormsModule, MatFormFieldModule, MatInput, MatLabel, AsyncPipe, MatSelectModule, MatOptionModule, MatPaginator, MatSnackBarModule],
  templateUrl: './product-page.html',
  styleUrls: ['./product-page.scss'],
})
export class ProductPage {
  private service = inject(ProductService);
  private CartService = inject(CartService);
  private snackBar = inject(MatSnackBar);

  protected readonly products$ = this.service.list().pipe(
  map(products =>
    products.map(p => ({
      ...p,
      createdAt: (p as any).created_at
    }))
  ),
  catchError(err => {
    // Errore generico
    let message = 'Errore nel caricamento dei prodotti';

    if (err.status === 404) {
      message = 'Nessun prodotto trovato';
    } else if (err.status === 500) {
      message = 'Servizio temporaneamente non disponibile';
    }

    this.snackBar.open(message, 'Chiudi', {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
    return of([]);
  })
);



  private filters$ = new BehaviorSubject({
    title: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    sort: 'dateDesc' as Sort
  })

  title$ = this.filters$.pipe(
    map(f => f.title),
    debounceTime(250),
    distinctUntilChanged(),
    startWith(this.filters$.value.title)
  );

  filteredProducts$ = combineLatest([
    this.products$,
    this.filters$,
    this.title$
  ]).pipe(
    map(([products, filters, title]) => products.filter(product => {
      const matchesTitle = !title || 
      product.title.toLowerCase().includes(filters.title.toLowerCase());
      const matchesMin = filters.minPrice === null ||
      product.price >= filters.minPrice;
      const matchesMax = filters.maxPrice === null ||
      product.price <= filters.maxPrice;

      return matchesTitle && matchesMin && matchesMax;
    }).toSorted(cmp(filters.sort))) //viene prima filtrato e poi ordinato
  );

  page$= new BehaviorSubject(1);
  pageSize=6;
  paged$ = combineLatest([this.filteredProducts$, this.page$]).pipe(
    map(([items,page]) =>
    {
      const start = (page-1)*this.pageSize;
      return items.slice(start, start+this.pageSize);
    })
  );

  onPage(e: PageEvent) {this.page$.next(e.pageIndex+1); }
  
  updateTitle(title: string) {
    console.log('Filtri applicati:');
    this.filters$.next({
      ...this.filters$.value,
      title: title
    });

  }

  updateSort(sort: Sort) {
    console.log('Ordinamento applicato:', sort);
    this.filters$.next({
      ...this.filters$.value,
      sort: sort
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


  updateMinPrice(value: string) {
  const min = value ? parseFloat(value) : null;
  this.filters$.next({
    ...this.filters$.value,
    minPrice: min
  });
}

updateMaxPrice(value: string) {
  const max = value ? parseFloat(value) : null;
  this.filters$.next({
    ...this.filters$.value,
    maxPrice: max
  });
}

}

