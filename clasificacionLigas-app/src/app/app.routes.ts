import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabla-clasificacion',
    loadComponent: () => import('./paginas/tabla-clasificacion/tabla-clasificacion.page').then(m => m.TablaClasificacionPage)
  },
  {
    path: '',
    redirectTo: 'tabla-clasificacion',
    pathMatch: 'full',
  },
];
