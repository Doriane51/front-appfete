import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/accueil/accueil.component').then(m => m.AccueilComponent)
  },
  {
    path: 'salles',
    loadComponent: () => import('./pages/salles/salle.component').then(m => m.SallesComponent)
  },
  {
    path: 'salles/:id',
    loadComponent: () => import('./pages/salle-detail/salle-detail.component').then(m => m.SalleDetailComponent)
  },
  {
    path: 'connexion',
    loadComponent: () => import('./pages/connexion/connexion.component').then(m => m.ConnexionComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./pages/inscription/inscription.component').then(m => m.InscriptionComponent)
  },
  {
    path: 'mes-reservations',
    loadComponent: () => import('./pages/mes-reservations/mes-reservations.component').then(m => m.MesReservationsComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/gestion-salles',
    loadComponent: () => import('./pages/admin/gestion-salles/gestion-salles.component').then(m => m.GestionSallesComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/gestion-reservations',
    loadComponent: () => import('./pages/admin/gestion-reservations/gestion-reservations.component').then(m => m.GestionReservationsComponent),
    canActivate: [AdminGuard]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
