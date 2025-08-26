import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController
  ) {}

  async openImageOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose Image Source',
      cssClass: 'image-option-sheet',
      buttons: [
        {
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => {
            this.captureImage(CameraSource.Camera);
          }
        },
        {
          text: 'Gallery',
          icon: 'images-outline',
          handler: () => {
            this.captureImage(CameraSource.Photos);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async captureImage(source: CameraSource) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: source
      });

      const capturedImage = image.dataUrl!;
      this.navCtrl.navigateForward('/capture', {
        state: { image: capturedImage }
      });

    } catch (error) {
      console.error('Camera/Gallery error:', error);
    }
  }
}
