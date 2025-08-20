import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';

import {
  leafOutline,
  bugOutline,
  statsChartOutline,
  listOutline,
  settingsOutline,
  warningOutline,
  cameraOutline,
  searchOutline,
  calendarOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  createOutline,
  refreshOutline,
  eyeOutline,
  libraryOutline,
  bulbOutline,
} from 'ionicons/icons';

import SwiperCore, { Autoplay, Pagination } from 'swiper';

// Install modules
SwiperCore.use([Autoplay, Pagination]);

import { addIcons } from 'ionicons';
import { ThisReceiver } from '@angular/compiler';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pest-home',
  templateUrl: './pest-home.page.html',
  styleUrls: ['./pest-home.page.scss'],
})

export class PestHomePage {
  recentScans: any[] = [];
  dashboardStats: any;
  highRiskAlert: any = null;

  constructor(private router: Router, private dataService: DataService) {
    // Subscribe to history changes
    this.dataService.history$.subscribe((history) => {
      this.recentScans = history.slice(0, 3); // Get 3 most recent scans
      this.dashboardStats = this.dataService.getDashboardStats();
      this.highRiskAlert = this.dataService.getHighRiskAlert();
    });

    addIcons({
      leafOutline,
      bugOutline,
      statsChartOutline,
      listOutline,
      settingsOutline,
      warningOutline,
      cameraOutline,
      searchOutline,
      calendarOutline,
      checkmarkCircleOutline,
      alertCircleOutline,
      createOutline,
      refreshOutline,
      eyeOutline,
      libraryOutline,
      bulbOutline,
    });
  }

  // Intro Carousel Slides
  introSlides = [
    {
      icon: 'search-outline',
      title: 'Identify Plants',
      description:
        'Instantly recognize thousands of plant species with our advanced AI',
      bgImage: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
    },
    {
      icon: 'warning-outline',
      title: 'Pest Alerts',
      description:
        'Receive instant alerts when pests are detected on your crops',
      bgImage:
        'https://images.unsplash.com/photo-1597733336794-12d05021d510?auto=format&fit=crop&w=800&q=80',
    },
    {
      icon: 'calendar-outline',
      title: 'Care Reminders',
      description: 'Personalized care schedule for each of your plants',
      bgImage: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd',
    },
    {
      icon: 'stats-chart-outline',
      title: 'Health Tracking',
      description: "Monitor your plant's health progress over time",
      bgImage: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
    },
  ];

  // Quick Actions
  quickActions = [
    { icon: 'library-outline', label: 'My Library' },
    { icon: 'bulb-outline', label: 'Tips' },
    { icon: 'create-outline', label: 'New Note' },
  ];

  onHistory() {
    this.router.navigate(['/tabs/history']);
  }

  startScan() {
    console.log('Opening camera to scan plant...');
  }

  viewStatistics() {
    console.log('Viewing statistics...');
  }

  viewPlants() {
    console.log('Viewing all plants...');
  }

  settings() {
    console.log('Opening settings...');
  }

  viewScanDetails(scanId: string) {
    this.router.navigate(['/detailed-history', scanId]);
  }

  rescanPlant(scanId: string) {
    // Implement rescan logic
    console.log('Rescanning plant with ID:', scanId);
    // You might want to navigate to the scan page with some parameters
  }
}
