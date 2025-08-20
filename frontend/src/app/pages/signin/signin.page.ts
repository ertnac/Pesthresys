
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage implements OnInit {
  viewPassword: boolean = false;
  constructor(
    public util: UtilService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
  }

  onHome() {
    this.util.navigateRoot('/tabs');
  }

  onSignIn() {
    this.util.navigateRoot('/signup');
  }

  changeType() {
    this.viewPassword = !this.viewPassword;
  }

}
