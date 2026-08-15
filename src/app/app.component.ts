import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from './services/product.service';
import { UserService } from './services/user.service';
import { Product } from './models/product.model';
import { User } from './models/user.model';
import { LandPageComponent } from './land-page/land-page.component';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, LandPageComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  activeView: 'landpage' | 'portal' = 'landpage';
  title = 'Product Management Portal';
  products: Product[] = [];
  
  // Auth state
  currentUser: User | null = null;
  
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
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Check if user is already logged in (session persistence)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      try {
        this.currentUser = JSON.parse(storedUser);
        this.loadProducts();
      } catch (e) {
        localStorage.removeItem('currentUser');
      }
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

  onLoginSuccess(user: User): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.loadProducts();
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.products = [];
    this.successMsg = '';
    this.errorMsg = '';
    this.onCancelEdit();
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
      const updatedProduct: Product = {
        ...this.newProduct,
        id: this.editingProduct.id,
        createdBy: this.editingProduct.createdBy // Keep the original creator
      };

      this.productService.updateProduct(this.editingProduct.id, updatedProduct).subscribe({
        next: () => {
          this.successMsg = `Product "${updatedProduct.name}" updated successfully!`;
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

      this.productService.addProduct(this.newProduct).subscribe({
        next: (createdProduct) => {
          this.successMsg = `Product "${createdProduct.name}" created successfully by ${createdProduct.createdBy}!`;
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
