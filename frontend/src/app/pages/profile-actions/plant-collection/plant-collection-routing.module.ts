import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlantCollectionPage } from './plant-collection.page';

const routes: Routes = [
  {
    path: '',
    component: PlantCollectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantCollectionPageRoutingModule {}
