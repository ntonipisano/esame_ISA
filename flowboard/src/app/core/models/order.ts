import { OrderItem } from "./orderitems";

export interface Order {
    id: number;
    userId: number;
    total: number;
    status: 'pending' | 'shipped' | 'delivered' | 'canceled';
    name: unknown;
    surname: unknown;
    email: string;
    address: unknown;
    cap: string;
    city: string;
    items: OrderItem[];
    createdAt: string;
}