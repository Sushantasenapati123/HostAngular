import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/TestModel`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/GetAll`);
  }

  addProduct(product: Product, file: File | null): Observable<Product> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    if (product.createdBy) {
      formData.append('createdBy', product.createdBy);
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Product>(this.apiUrl, formData);
  }

  updateProduct(id: number, product: Product, file: File | null): Observable<void> {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('description', product.description || '');
    formData.append('price', product.price.toString());
    formData.append('stock', product.stock.toString());
    if (product.createdBy) {
      formData.append('createdBy', product.createdBy);
    }
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<void>(`${this.apiUrl}/${id}`, formData);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
