
import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    public util: UtilService 
  ) {   }

  ngOnInit() {
  }

  onSettings() {
    console.log('on settings');
    this.util.navigateToPage('settings');
  }

  onLogout() {
    this.util.navigateRoot('../welcome');
  }

  onMyCards() {
    this.util.navigateToPage('my-cards');
  }

  
}


