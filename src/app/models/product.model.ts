export interface Product {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdBy?: string;
  createdDate?: Date | string;
  updatedDate?: Date | string | null;
  documentPath?: string;
}
