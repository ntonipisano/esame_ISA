import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { OrderService } from '../../../core/services/order';
import { Order } from '../../../core/models/order';
import { OrderCard } from '../order-card/order-card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBarModule } from '@angular/material/snack-bar';

type Sort = 'dateAsc' | 'dateDesc';

const cmp = (s: Sort) => (a: Order, b: Order) =>
  s === 'dateAsc'
    ? a.createdAt.localeCompare(b.createdAt)
    : b.createdAt.localeCompare(a.createdAt);

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [
    OrderCard,
    FormsModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MatSelectModule,
    MatOptionModule,
    MatPaginator
  ],
  templateUrl: './order-page.html',
  styleUrls: ['./order-page.scss'],
})
export class OrderPage {
  private service = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  protected readonly orders$ = this.service.getOrders().pipe(
    map(orders =>
      orders.map(o => ({
        ...o,
        createdAt: (o as any).created_at
      }))
    ),
    catchError(err => {
      let message = 'Errore nel caricamento degli ordini';
      if (err.status === 401) { message = 'Non sei autenticato';
    } else if (err.status === 404) { message = 'Ordini non trovati'; }
    else if (err.status === 422 && err.error?.errors) { message = err.error.errors.join(', '); }

    this.snackBar.open(message, 'Chiudi', {duration: 5000});
    return of([]);
  })
  );

  /** FILTRI */
  private filters$ = new BehaviorSubject({
    status: '',
    fromDate: null as string | null,
    toDate: null as string | null,
    sort: 'dateDesc' as Sort
  });

  status$ = this.filters$.pipe(
    map(f => f.status),
    debounceTime(200),
    distinctUntilChanged(),
    startWith(this.filters$.value.status)
  );

  filteredOrders$ = combineLatest([
    this.orders$,
    this.filters$,
    this.status$
  ]).pipe(
    map(([orders, filters]) =>
      orders
        .filter(o => {
          const matchesStatus =
            !filters.status || o.status === filters.status;

          const orderDate = new Date(o.createdAt).getTime();

          const matchesFrom =
            !filters.fromDate ||
            orderDate >= new Date(filters.fromDate).getTime();

          const matchesTo =
            !filters.toDate ||
            orderDate <= new Date(filters.toDate).getTime();

          return matchesStatus && matchesFrom && matchesTo;
        })
        .toSorted(cmp(filters.sort))
    )
  );

  /** PAGINAZIONE */
  page$ = new BehaviorSubject(1);
  pageSize = 3;

  paged$ = combineLatest([
    this.filteredOrders$,
    this.page$
  ]).pipe(
    map(([items, page]) => {
      const start = (page - 1) * this.pageSize;
      return items.slice(start, start + this.pageSize);
    })
  );

  onPage(e: PageEvent) {
    this.page$.next(e.pageIndex + 1);
  }

  /** UPDATE FILTRI */
  updateStatus(status: string) {
    this.filters$.next({
      ...this.filters$.value,
      status
    });
  }

  updateFromDate(value: string) {
    this.filters$.next({
      ...this.filters$.value,
      fromDate: value || null
    });
  }

  updateToDate(value: string) {
    this.filters$.next({
      ...this.filters$.value,
      toDate: value || null
    });
  }

  updateSort(sort: Sort) {
    this.filters$.next({
      ...this.filters$.value,
      sort
    });
  }
}
