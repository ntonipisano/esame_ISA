import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { OrderService } from '../../../core/services/order';
import { switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-order-detail',
  imports: [AsyncPipe, MatCardModule, DatePipe, CurrencyPipe, RouterLink, MatButtonModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss',
})
export class OrderDetailPage {
  private service = inject(OrderService);
  private route = inject(ActivatedRoute);

  readonly order$ = this.route.paramMap.pipe(
    map(params => params.get('id') as string),
    switchMap(id => this.service.getOrder(id)),
     map(order => ({
    ...order,
    createdAt: (order as any).created_at,
    items: (order as any).order_items,
  }))
  );


}
