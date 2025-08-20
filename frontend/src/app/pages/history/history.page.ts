import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  history: any[] = [];
  filteredHistory: any[] = [];
  isSearching = false;
  searchQuery = '';
  filterStatus = 'all';

  constructor(
    private router: Router, 
    private dataService: DataService
  ) {}

  ngOnInit() {
    // Initialize the data service to load from storage
    this.dataService.initialize();
    
    // Subscribe to history changes
    this.dataService.history$.subscribe(history => {
      this.history = history;
      this.filteredHistory = [...history];
    });
  }

  toggleSearch() {
    this.isSearching = !this.isSearching;
    if (!this.isSearching) {
      this.clearSearch();
    }
  }

  filterHistory() {
    if (!this.searchQuery && this.filterStatus === 'all') {
      this.filteredHistory = [...this.history];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredHistory = this.history.filter(scan => {
      // Text search - now includes scan ID
      const matchesText = 
        scan.plantName.toLowerCase().includes(query) ||
        (scan.location && scan.location.toLowerCase().includes(query)) ||
        scan.status.toLowerCase().includes(query) ||
        scan.id.toLowerCase().includes(query) || // Search by scan ID
        (scan.pestsDetected && scan.pestsDetected.some((pest: string) => 
          pest.toLowerCase().includes(query)));
      
      // Status filter
      const matchesStatus = this.filterStatus === 'all' || scan.status === this.filterStatus;
      
      return matchesText && matchesStatus;
    });
  }

  setStatusFilter(status: string) {
    this.filterStatus = status;
    this.filterHistory();
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterStatus = 'all';
    this.filteredHistory = [...this.history];
  }

  openScanDetails(scanId: string) {
    this.router.navigate(['/detailed-history', scanId]);
  }
}