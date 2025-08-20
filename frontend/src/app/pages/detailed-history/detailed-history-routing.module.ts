import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailedHistoryPage } from './detailed-history.page';

const routes: Routes = [
  {
    path: '',
    component: DetailedHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailedHistoryPageRoutingModule {}
