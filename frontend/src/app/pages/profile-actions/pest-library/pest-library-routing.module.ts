import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PestLibraryPage } from './pest-library.page';

const routes: Routes = [
  {
    path: '',
    component: PestLibraryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PestLibraryPageRoutingModule {}
