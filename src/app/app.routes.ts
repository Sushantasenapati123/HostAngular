import { Routes } from '@angular/router';
import { LandPageComponent } from './land-page/land-page.component';
import { LandPageV2Component } from './land-page-v2/land-page-v2.component';
import { LoginComponent } from './login/login.component';
import { ProductComponent } from './product/product.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandPageComponent },
  { path: 'v2', component: LandPageV2Component },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: ProductComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
