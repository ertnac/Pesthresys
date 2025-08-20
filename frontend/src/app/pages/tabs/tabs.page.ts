import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private navCtrl: NavController) {}

  async captureImage() {
    try {
      const image = await Camera.getPhoto({
        quality: 120,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      const capturedImage = image.dataUrl!;

      // 👉 Navigate to /capture with the image
      this.navCtrl.navigateForward('/capture', {
        state: { image: capturedImage }
      });

    } catch (error) {
      console.error('Camera error:', error);
    }
  }
}
