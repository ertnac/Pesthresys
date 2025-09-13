import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { NavController } from '@ionic/angular';

import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-capture',
  templateUrl: './capture.page.html',
  styleUrls: ['./capture.page.scss'],
})
export class CapturePage implements OnInit {
  @ViewChild('imagePreview', { static: false }) imagePreview!: ElementRef;

  capturedImage: string | null = null;
  isAnalyzing: boolean = false;
  analysisComplete: boolean = false;
  resultExpanded: boolean = false;

  // Prediction results
  plantType: string = '';
  isInfected: boolean = false;
  pestType: string = '';
  severity: string = '';
  severityValue: number = 0;
  severityColor: string = 'warning';
  recommendation: string = '';
  currentDate: Date = new Date();
  userNote: string = '';
  private model: tf.LayersModel | null = null;
  // private model: tflite.TFLiteModel | null = null;
  // private model: tflite.TFLiteModel | null = null;
  private classes = [
    'leaf-healthy',
    'leaf-high',
    'leaf-low',
    'leaf-moderate',
    'sitaw-healthy',
    'sitaw-high',
    'sitaw-low',
    'sitaw-moderate'
  ];

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private dataService: DataService,
    private navCtrl: NavController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.capturedImage = navigation.extras.state['image'];
    }
  }

  async ngOnInit() {
    if (!this.capturedImage) {
      this.navCtrl.back();
      return;
    }

    this.resetAnalysisState();
    await this.loadModel();
  }

  resetAnalysisState() {
    this.isAnalyzing = false;
    this.analysisComplete = false;
    this.resultExpanded = false;
    this.plantType = '';
    this.isInfected = false;
    this.pestType = '';
    this.severity = '';
    this.severityValue = 0;
    this.severityColor = 'warning';
    this.recommendation = '';
    this.userNote = '';
  }

  /** Load TFLite Model */
  async loadModel() {
    try {
      await tf.ready();
      this.model = await tf.loadLayersModel('assets/models/new/model.json');
      console.log('Model loaded');
    } catch (err) {
      console.error('Error loading model:', err);
      await this.presentToast('Failed to load model.');
    }
  }

  /** Analyze captured image */
  async analyzeImage() {
  if (!this.model || !this.capturedImage) return;

  this.isAnalyzing = true;
  this.analysisComplete = false;

  try {
    const img = new Image();
    img.src = this.capturedImage!;
    await new Promise((resolve) => (img.onload = resolve));

    const inputTensor = tf.browser
      .fromPixels(img)
      .resizeBilinear([224, 224])
      .expandDims(0)
      .toFloat()
      .div(255);

    const output = this.model.predict(inputTensor) as tf.Tensor;
    const predictions = await output.data();

    const maxIndex = predictions.indexOf(Math.max(...predictions));
    const predictedClass = this.classes[maxIndex];

    this.parsePredictedClass(predictedClass);

    inputTensor.dispose();
    output.dispose();
  } catch (err) {
    console.error('Error during analysis:', err);
    await this.presentToast('Failed to analyze image. Try again.');
  }

  this.isAnalyzing = false;
  this.analysisComplete = true;
  this.resultExpanded = true;
}
  /** Map predicted class to UI variables */
  parsePredictedClass(predictedClass: string) {
    console.log('Predicted Class:', predictedClass);
    
    const parts = predictedClass.split('-');
    const plant = parts[0];
    const status = parts[1];
    const severity ='';  

    this.plantType = plant.charAt(0).toUpperCase() + plant.slice(1);
    this.isInfected = status !== 'healthy';
    this.severity = status
      ? status.charAt(0).toUpperCase() + status.slice(1)
      : 'Healthy';
    if (this.severity=='') {
      this.severityValue = 0;
      this.severityColor = 'success';
    }
    else if(this.severity == 'Low') {
          this.severityValue = 0.3;
          this.severityColor = 'success';
    }
    else if( this.severity == 'Moderate') {
          this.severityValue = 0.6;
          this.severityColor = 'warning';
    }
    else if( this.severity == 'High') {
          this.severityValue = 0.9;
          this.severityColor = 'danger';
    }

    if (this.isInfected) {
      this.pestType = 'Aphid';
      console.log (this.severityValue);
      console.log (this.severityColor);
      this.recommendation = this.getRecommendation(
        this.pestType,
        status
      );
      
    } else {
      this.pestType = '';
      this.recommendation = '';
    }
  }

  getRecommendation(pest: string, severity: string): string {
    console.log('Getting recommendation for', pest, severity);
    const recommendations: any = {
      Aphid: {
        low: 'Spray with neem oil solution weekly for 2 weeks.',
        moderate: 'Apply insecticidal soap every 5 days for 3 applications.',
        high: 'Use systemic insecticide and remove heavily infested leaves.',
      },
      Other: {
        Low: 'Monitor the plant and remove minor infestations manually.',
        Moderate: 'Apply appropriate biological control measures.',
        High: 'Use chemical treatment and isolate affected plants.',
      },
    };

    return (
      recommendations[pest]?.[severity] ||
      'Consult a local agricultural expert.'
    );
  }

  retakePhoto() {
    this.resetAnalysisState();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  canSaveScan(): boolean {
    return this.analysisComplete && !!this.capturedImage;
  }

  async saveScan() {
    if (!this.canSaveScan()) return;

    const scanData = {
      plantName: this.plantType,
      plantImage: this.capturedImage,
      status: this.isInfected ? 'infected' : 'healthy',
      date: new Date(),
      location: 'My Garden',
      pestsDetected: this.isInfected
        ? [{ name: this.pestType, severity: this.severity }]
        : [],
      notes: this.userNote.trim()
        ? [{ text: this.userNote.trim(), date: new Date() }]
        : [],
      analysisDetails: {
        plantType: this.plantType,
        isInfected: this.isInfected,
        pestType: this.pestType,
        severity: this.severity,
        recommendation: this.recommendation,
      },
    };

    this.dataService.addScanToHistory(scanData);

    const toast = await this.toastCtrl.create({
      message: 'Scan saved to history!',
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          text: 'View',
          handler: () => this.router.navigate(['/tabs/history']),
        },
      ],
    });
    await toast.present();

    this.userNote = '';
  }

  async shareResults() {
    if (!this.analysisComplete) return;

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Share Results',
      buttons: [
        {
          text: 'Share as Image',
          icon: 'image-outline',
          handler: () => this.presentToast('Image sharing placeholder'),
        },
        {
          text: 'Share as Report',
          icon: 'document-text-outline',
          handler: () => this.presentToast('Report sharing placeholder'),
        },
        {
          text: 'Copy Details',
          icon: 'copy-outline',
          handler: () => this.presentToast('Details copied to clipboard'),
        },
        { text: 'Cancel', icon: 'close', role: 'cancel' },
      ],
    });

    await actionSheet.present();
  }

  viewSimilarCases() {
    this.router.navigate(['/tabs/history'], {
      queryParams: { pest: this.pestType },
    });
  }
}