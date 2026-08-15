import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  currentUser!: User;

  products: Product[] = [];
  selectedFile: File | null = null;
  
  // Model for the product form
  newProduct: Product = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };

  // Editing state
  editingProduct: Product | null = null;

  // Search & Filtering state
  searchQuery = '';
  searchType: 'name' | 'createdBy' = 'name';

  // Pagination state
  currentPage = 1;
  pageSize = 6;

  // Card Size Zoom state
  cardSize: 'small' | 'medium' | 'large' = 'medium';

  // State flags
  loading = false;
  submitting = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUser = JSON.parse(storedUser);
      this.loadProducts();
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Getters for Client-Side Search and Pagination
  get filteredProducts(): Product[] {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      return this.products;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.products.filter(p => {
      if (this.searchType === 'name') {
        return p.name.toLowerCase().includes(query);
      } else {
        return (p.createdBy || '').toLowerCase().includes(query);
      }
    });
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProducts.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.pageSize) || 1;
  }

  get pages(): number[] {
    const pagesArray: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  // Search and Pagination events
  onSearchChange(): void {
    this.currentPage = 1; // Reset to page 1 on filter
  }

  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Zoom size event
  changeCardSize(size: 'small' | 'medium' | 'large'): void {
    this.cardSize = size;
  }

  logoutClick(): void {
    localStorage.removeItem('currentUser');
    const hostname = window.location.hostname;
    if (hostname.startsWith('login.')) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/']);
    }
  }

  loadProducts(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.errorMsg = '';
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        // Verify current page boundary on list reload
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load products from API. Please verify the backend service is running.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  getProductImageUrl(product: Product): string {
    if (product.documentPath) {
      const baseUrl = environment.apiUrl.replace(/\/api$/, '');
      return `${baseUrl}${product.documentPath}?t=${new Date().getTime()}`;
    }
    return '/assets/images/placeholder.jpg';
  }

  onSubmit(): void {
    if (!this.currentUser) {
      this.errorMsg = 'You must be logged in to manage products.';
      return;
    }

    // Simple frontend validation
    if (!this.newProduct.name || this.newProduct.name.trim() === '') {
      this.errorMsg = 'Product Name is required.';
      return;
    }
    if (this.newProduct.price <= 0) {
      this.errorMsg = 'Price must be greater than zero.';
      return;
    }
    if (this.newProduct.stock < 0) {
      this.errorMsg = 'Stock cannot be negative.';
      return;
    }

    this.submitting = true;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.editingProduct && this.editingProduct.id !== undefined) {
      // Perform Update
      const productId = this.editingProduct.id;
      const updatedProduct: Product = {
        ...this.newProduct,
        id: productId,
        createdBy: this.editingProduct.createdBy // Keep the original creator
      };

      this.productService.updateProduct(productId, updatedProduct, this.selectedFile).subscribe({
        next: () => {
          this.successMsg = `Product "${updatedProduct.name}" updated successfully!`;
          this.selectedFile = null;
          // Reset file input element manually
          const fileInput = document.getElementById('productImage') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
          
          this.onCancelEdit();
          this.loadProducts();
          this.submitting = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to update product. Verify the server is accessible.';
          this.submitting = false;
        }
      });
    } else {
      // Perform Create
      this.newProduct.createdBy = this.currentUser.name;

      this.productService.addProduct(this.newProduct, this.selectedFile).subscribe({
        next: (createdProduct) => {
          this.successMsg = `Product "${createdProduct.name}" created successfully by ${createdProduct.createdBy}!`;
          this.selectedFile = null;
          // Reset file input element manually
          const fileInput = document.getElementById('productImage') as HTMLInputElement;
          if (fileInput) fileInput.value = '';

          this.resetForm();
          this.loadProducts(); // Refresh list
          this.submitting = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to create product. Ensure the data is correct and the server is accessible.';
          this.submitting = false;
        }
      });
    }
  }

  onEdit(product: Product): void {
    this.editingProduct = product;
    // Load existing values into form inputs
    this.newProduct = {
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock
    };
    this.dismissAlerts();
  }

  onCancelEdit(): void {
    this.editingProduct = null;
    this.resetForm();
  }

  onDelete(id: number | undefined): void {
    if (id === undefined) return;

    if (confirm('Are you sure you want to delete this product?')) {
      this.loading = true;
      this.dismissAlerts();

      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.successMsg = 'Product deleted successfully!';
          this.loadProducts();
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Failed to delete product from the server.';
          this.loading = false;
        }
      });
    }
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      description: '',
      price: 0,
      stock: 0
    };
  }

  dismissAlerts(): void {
    this.errorMsg = '';
    this.successMsg = '';
  }
}
