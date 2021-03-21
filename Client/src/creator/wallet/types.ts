export interface Product {
  unitPrice: number;
  name: string;
  quantity: number;
  dataSourceFileName: string;
}

export interface ProductList {
  currency: string;
  products: Product[];
  deliveryCost: number;
  subTotal: number;
  totalToPay: number;
  description: string;
}
