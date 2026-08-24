//DTO per la creazione di un ordine

export interface CreateOrder {
  name: string;
  surname: string;
  email: string;
  address: string;
  city: string;
  cap: string;
  //items: OrderItem[];
  //total: number;
}
