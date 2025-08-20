import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileActionsPage } from './profile-actions.page';

const routes: Routes = [
  {
    path: '',
    component: ProfileActionsPage
  },
    {
    path: '',
    loadChildren: () => import('../tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('../profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'plant-collection',
    loadChildren: () => import('./plant-collection/plant-collection.module').then( m => m.PlantCollectionPageModule)
  },
  {
    path: 'pest-library',
    loadChildren: () => import('./pest-library/pest-library.module').then( m => m.PestLibraryPageModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
  },
  {
    path: 'help-support',
    loadChildren: () => import('./help-support/help-support.module').then( m => m.HelpSupportPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileActionsPageRoutingModule {}
