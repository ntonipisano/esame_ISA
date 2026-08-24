import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth-guard';
import { CheckoutPage } from './features/checkout/checkout-page/checkout-page';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductPage } from './features/products/product-page/product-page';
import { NotFoundComponent } from './shared/not-found/not-found';
import { LoginComponent } from './features/login/login';
import { RegisterComponent } from './features/register/register';
import { CartComponent } from './features/cart/cart';
import { OrderConfirmationPage } from './features/order/order-confirmation/order-confirmation';
import { OrderPage } from './features/order/order-page/order-page';
import { OrderDetailPage } from './features/order/order-detail/order-detail';
import { WishlistPage } from './features/wishlist/wishlist';

export const routes: Routes = [
    { path: '', redirectTo: 'products', pathMatch: 'full' },
    { path: 'products', component: ProductPage },
    { path: 'checkout', canActivate: [authGuard], component: CheckoutPage},
    { path: 'products/:id', component: ProductDetail },
    { path: 'login', component: LoginComponent },
    { path: 'logout', redirectTo: 'products' },
    { path: 'register', component: RegisterComponent },
    { path: 'cart', canActivate: [authGuard ], component: CartComponent },
    { path: 'order-confirmation', canActivate: [authGuard], component: OrderConfirmationPage },
    { path: 'orders', canActivate: [authGuard], component: OrderPage },
    { path: 'orders/:id', canActivate: [authGuard], component: OrderDetailPage },
    { path: 'wishlist', canActivate: [authGuard], component: WishlistPage },
    
    //Questa route deve stare per ultima!!!
    { path: '**', component: NotFoundComponent },
];
