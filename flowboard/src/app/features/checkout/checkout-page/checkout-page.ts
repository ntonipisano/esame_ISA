import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatAnchor } from '@angular/material/button';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, startWith, take } from 'rxjs/operators';
import { CartService } from '../../../core/services/cart';
import { OrderService } from '../../../core/services/order';
import { CartItem } from '../../../core/models/cartitems';
import { OrderItem } from '../../../core/models/orderitems';
import { CreateOrder } from '../../../core/models/create-order';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-checkout-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelect,
    MatOption,
    MatAnchor,
    CurrencyPipe,
    AsyncPipe,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './checkout-page.html',
  styleUrls: ['./checkout-page.scss'],
})
export class CheckoutPage {

  private fb = inject(FormBuilder);
  private cart = inject(CartService);
  private orderService = inject(OrderService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly form = this.fb.group({
    customer: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    address: this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      zip: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
    }),
    shippingMethod: ['standard', Validators.required],
    privacy: [false, Validators.requiredTrue],
  });

  getControl(path: string) {
    return this.form.get(path);
  }

  hasError(path: string, errorCode: string): boolean {
    const control = this.getControl(path);
    return !!control && control.hasError(errorCode) && control.touched;
  }

  readonly items$ = this.cart.cart$.pipe(
    map(cart => cart?.cart_items ?? [])
  );

  readonly backendTotal$ = this.cart.getCheckoutTotal().pipe(
  map(res => res.total)
  );


  readonly shipping$ = this.form
    .get('shippingMethod')!
    .valueChanges.pipe(
      startWith(this.form.get('shippingMethod')!.value)
    );

  readonly shippingCost$ = this.shipping$.pipe(
    map(method => (method === 'express' ? 15 : 5))
  );

  readonly totalWithShipping$ = combineLatest([
    this.backendTotal$,
    this.shippingCost$
  ]).pipe(
    map(([total, shipping]) => total + shipping)
  );

  showSummary = false;
  loading = false;
  orderSuccess = false;
  orderError = false;

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.showSummary = true;
      this.focusFirstInvalid();
      return;
    }

    this.loading = true;
    this.orderSuccess = false;
    this.orderError = false;

    const value = this.form.getRawValue();

    this.items$.pipe(take(1)).subscribe((items: CartItem[]) => {

      const orderItems: OrderItem[] = items.map(item => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      const order: CreateOrder = {
        name: value.customer.firstName!,
        surname: value.customer.lastName!,
        email: value.customer.email!,
        address: value.address.street!,
        city: value.address.city!,
        cap: value.address.zip!,
      };

      this.orderService.createOrder(order).subscribe({
        next: () => {
          this.loading = false;
          this.orderSuccess = true;

          this.snackBar.open(
          'Ordine effettuato con successo 🎉',
          'OK',
          { duration: 3000 }
          );

          this.form.reset();
          this.router.navigate(['/order-confirmation']);
        },
       error: err => {
    this.loading = false;
    this.orderError = true;

    let message = 'Errore durante il checkout'; // fallback generico
    if (err.error) {
      if (err.error.error) {
        message = err.error.error;
      } else if (err.error.errors) {
        message = err.error.errors.join(', ');
      }
    }

    this.snackBar.open(message, 'Riprova', { duration: 5000 });
  }
      });
    });
  }

  private focusFirstInvalid(): void {
    const firstInvalid = document.querySelector(
      'form .ng-invalid[formControlName]'
    ) as HTMLElement | null;

    firstInvalid?.focus();
  }
}