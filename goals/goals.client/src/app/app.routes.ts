import { Routes } from '@angular/router';
import { Register } from './pages/register/register';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard'
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard }
];
