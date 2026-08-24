import { Component, Output } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Order } from '../../../core/models/order';
import { MatCardModule} from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-order-card',
  imports: [MatCardModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './order-card.html',
  styleUrl: './order-card.scss',
})
export class OrderCard {
  @Input({required: true}) order!: Order;
  @Output() add = new EventEmitter<Order>();

}
