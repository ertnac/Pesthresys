import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { NavController } from '@ionic/angular';

import * as tf from '@tensorflow/tfjs';
import * as tflite from '@tensorflow/tfjs-tflite';

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

  private model: tflite.TFLiteModel | null = null;

  private classes = [
    'sitaw-healthy',
    'sitaw-low',
    'sitaw-moderate',
    'sitaw-high',
    'leaf-aphid-low',
    'leaf-aphid-moderate',
    'leaf-aphid-high',
    'sitaw-aphid-low',
    'sitaw-aphid-moderate',
    'sitaw-aphid-high',
    'leaf-healthy',
    'leaf-low',
    'leaf-moderate',
    'leaf-high',
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
      this.model = await tflite.loadTFLiteModel(
        'assets/models/pest_detector.tflite'
      );
      console.log('TFLite model loaded successfully');
    } catch (err) {
      console.error('Error loading TFLite model:', err);
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

      // Use the NamedTensorMap format
      const output: any = this.model.predict({ "input": inputTensor });

      const predictions = output.dataSync() as Float32Array;
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
    const parts = predictedClass.split('-');
    const plant = parts[0];
    const status = parts[1];
    const severity = parts[2] || '';

    this.plantType = plant.charAt(0).toUpperCase() + plant.slice(1);
    this.isInfected = status !== 'healthy';
    this.severity = severity
      ? severity.charAt(0).toUpperCase() + severity.slice(1)
      : 'Healthy';

    switch (severity) {
      case 'low':
        this.severityValue = 0.3;
        this.severityColor = 'success';
        break;
      case 'moderate':
        this.severityValue = 0.6;
        this.severityColor = 'warning';
        break;
      case 'high':
        this.severityValue = 0.9;
        this.severityColor = 'danger';
        break;
      default:
        this.severityValue = 0;
        this.severityColor = 'success';
        break;
    }

    if (this.isInfected) {
      this.pestType = status === 'aphid' ? 'Aphid' : 'Other';
      this.recommendation = this.getRecommendation(
        this.pestType,
        this.severity
      );
    } else {
      this.pestType = '';
      this.recommendation = '';
    }
  }

  getRecommendation(pest: string, severity: string): string {
    const recommendations: any = {
      Aphid: {
        Low: 'Spray with neem oil solution weekly for 2 weeks.',
        Moderate: 'Apply insecticidal soap every 5 days for 3 applications.',
        High: 'Use systemic insecticide and remove heavily infested leaves.',
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