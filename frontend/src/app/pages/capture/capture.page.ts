import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';
import { NavController } from '@ionic/angular';

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
  isScrolled: boolean = false;
  resultExpanded: boolean = false;
  isChiliPlant: boolean | null = null;
  isInfected: boolean = false;
  pestType: string = '';
  severity: string = '';
  severityValue: number = 0;
  severityColor: string = 'warning';
  recommendation: string = '';
  currentDate: Date = new Date();
  userNote: string = '';

  constructor(
    private router: Router,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController,
    private dataService: DataService,
    private navCtrl: NavController
  ) {
    // Get the image from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.capturedImage = navigation.extras.state['image'];
    }
  }

  ngOnInit() {
    if (!this.capturedImage) {
      // If no image was captured, go back
      this.navCtrl.back();
      return;
    }

    // Reset analysis state to ensure clean start
    this.resetAnalysisState();
  }

  resetAnalysisState() {
    this.isAnalyzing = false;
    this.analysisComplete = false;
    this.resultExpanded = false;
    this.isChiliPlant = null;
    this.isInfected = false;
    this.pestType = '';
    this.severity = '';
    this.severityValue = 0;
    this.severityColor = 'warning';
    this.recommendation = '';
    this.userNote = '';
  }

  initializeDemoData() {
    // Random demo results (would come from your analysis service)
    this.isChiliPlant = Math.random() > 0.2; // 80% chance it's a chili plant
    if (this.isChiliPlant) {
      this.isInfected = Math.random() > 0.5; // 50% chance it's infected
      if (this.isInfected) {
        const pests = [
          'Aphids',
          'Whiteflies',
          'Spider Mites',
          'Thrips',
          'Mealybugs',
        ];
        this.pestType = pests[Math.floor(Math.random() * pests.length)];

        const severities = ['Low', 'Medium', 'High', 'Critical'];
        this.severity = severities[Math.floor(Math.random() * severities.length)];

        // Set severity value for progress bar
        switch (this.severity) {
          case 'Low':
            this.severityValue = 0.3;
            this.severityColor = 'success';
            break;
          case 'Medium':
            this.severityValue = 0.5;
            this.severityColor = 'warning';
            break;
          case 'High':
            this.severityValue = 0.7;
            this.severityColor = 'danger';
            break;
          case 'Critical':
            this.severityValue = 0.9;
            this.severityColor = 'danger';
            break;
        }

        this.recommendation = this.getRecommendation(
          this.pestType,
          this.severity
        );
      }
    }
  }

  getRecommendation(pest: string, severity: string): string {
    const recommendations: any = {
      Aphids: {
        Low: 'Spray with neem oil solution weekly for 2 weeks.',
        Medium: 'Apply insecticidal soap every 5 days for 3 applications.',
        High: 'Use systemic insecticide and remove heavily infested leaves.',
        Critical: 'Immediate treatment with chemical insecticide recommended.',
      },
      Whiteflies: {
        Low: 'Use yellow sticky traps and spray with water.',
        Medium: 'Apply horticultural oil every 7 days for 3 weeks.',
        High: 'Use insecticidal soap combined with neem oil treatments.',
        Critical:
          'Consider chemical control and remove heavily infested plants.',
      },
      'Spider Mites': {
        Low: 'Spray plants with water to dislodge mites.',
        Medium: 'Apply miticide or neem oil every 5-7 days.',
        High: 'Use miticide in rotation to prevent resistance.',
        Critical: 'Remove severely infested plants to prevent spread.',
      },
      Thrips: {
        Low: 'Blue sticky traps and neem oil applications.',
        Medium: 'Spinosad applications every 5 days for 3 treatments.',
        High: 'Systemic insecticides may be necessary.',
        Critical: 'Remove infected plants and treat surrounding area.',
      },
      Mealybugs: {
        Low: 'Dab insects with alcohol-soaked cotton swabs.',
        Medium: 'Apply insecticidal soap or neem oil weekly.',
        High: 'Systemic insecticides combined with manual removal.',
        Critical: 'Consider discarding heavily infested plants.',
      },
    };

    return (
      recommendations[pest]?.[severity] ||
      'Consult with a local agricultural expert for treatment options.'
    );
  }

  onScroll(ev: any) {
    const scrollElement = ev.detail.scrollTop;
    this.isScrolled =
      scrollElement > this.imagePreview.nativeElement.offsetHeight;
  }

  async analyzeImage() {
    this.isAnalyzing = true;
    this.analysisComplete = false;

    // Simulate analysis delay
    setTimeout(() => {
      this.isAnalyzing = false;
      this.analysisComplete = true;
      this.resultExpanded = true;
      this.initializeDemoData(); // Initialize data after analysis completes
    }, 2500);
  }

  retakePhoto() {
    // Reset state for a new capture
    this.resetAnalysisState();
  }

  canSaveScan(): boolean {
    // Can save if analysis is complete and we have a captured image
    return this.analysisComplete && !!this.capturedImage;
  }

  async saveScan() {
    if (!this.canSaveScan()) return;

    // Create scan data object - let DataService generate the ID
    const scanData = {
      plantName: this.isChiliPlant ? 'Chili Plant' : 'Other Plant',
      plantImage: this.capturedImage,
      status: this.isChiliPlant
        ? this.isInfected
          ? 'infected'
          : 'healthy'
        : 'unknown',
      date: new Date(),
      location: 'My Garden',
      pestsDetected: this.isInfected
        ? [{ name: this.pestType, severity: this.severity }]
        : [],
      notes: this.userNote.trim()
        ? [
            {
              text: this.userNote.trim(),
              date: new Date(),
            },
          ]
        : [],
      analysisDetails: {
        isChiliPlant: this.isChiliPlant,
        isInfected: this.isInfected,
        pestType: this.pestType,
        severity: this.severity,
        recommendation: this.recommendation,
        confidence: this.isChiliPlant !== null ? 'High' : 'Low',
      },
    };

    // Save to data service
    this.dataService.addScanToHistory(scanData);

    // Show success toast
    const toast = await this.toastCtrl.create({
      message: 'Scan saved to history!',
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle-outline',
      buttons: [
        {
          text: 'View',
          handler: () => {
            this.router.navigate(['/tabs/history']);
          },
        },
      ],
    });
    await toast.present();

    // Clear the note after saving
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
          handler: () => {
            this.presentToast('Image sharing would be implemented here');
          },
        },
        {
          text: 'Share as Report',
          icon: 'document-text-outline',
          handler: () => {
            this.presentToast('Report sharing would be implemented here');
          },
        },
        {
          text: 'Copy Details',
          icon: 'copy-outline',
          handler: () => {
            this.presentToast('Details copied to clipboard');
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
        },
      ],
    });

    await actionSheet.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  viewSimilarCases() {
    this.router.navigate(['/tabs/history'], {
      queryParams: { pest: this.pestType },
    });
  }
}