import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileActionsPageRoutingModule } from './profile-actions-routing.module';

import { ProfileActionsPage } from './profile-actions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfileActionsPageRoutingModule
  ],
  declarations: [ProfileActionsPage]
})
export class ProfileActionsPageModule {}
