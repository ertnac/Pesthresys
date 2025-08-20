import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PestHomePage } from './pest-home.page';

const routes: Routes = [
  {
    path: '',
    component: PestHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule { }