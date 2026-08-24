import { CartItem } from './cartitems';

export interface Cart {
    id: number;
    cart_items: CartItem[];
}
