import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { 
    path: 'main',
    loadChildren: () => import('./main/main.module').then(m => m.MainComponentModule) 
  },
  {
    path:'detail',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailComponentModule)
  },
  {
    path: 'send',
    loadChildren: () => import('./send/send.module').then(m => m.SendComponentModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit/edit.module').then(m => m.EditComponentModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
