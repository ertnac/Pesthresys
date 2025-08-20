import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private scanHistory: any[] = [];
  private historySubject = new BehaviorSubject<any[]>(this.scanHistory);
  private scanCounter = 1; 

  history$ = this.historySubject.asObservable();

  constructor() {
    // No longer loading from storage
    this.historySubject.next(this.scanHistory);
  }

  private generateScanId(): string {
    const year = new Date().getFullYear();
    const sequential = this.scanCounter.toString().padStart(5, '0');
    this.scanCounter++;
    return `${year}-${sequential}`;
  }

  addScanToHistory(scan: any) {
    try {
      scan.id = this.generateScanId();

      if (!scan.notes) {
        scan.notes = [];
      }

      if (!scan.date) {
        scan.date = new Date();
      }

      this.scanHistory.unshift(scan);
      this.historySubject.next(this.scanHistory);

      console.log('Scan saved with ID:', scan.id);
      return scan.id; 
    } catch (error) {
      console.error('Error saving scan:', error);
      throw error;
    }
  }

  // Removed all localStorage-related methods

  initialize(): void {
    // No initialization needed as data is temporary
  }

  addNoteToScan(scanId: string, note: string) {
    const scanIndex = this.scanHistory.findIndex((scan) => scan.id === scanId);
    if (scanIndex !== -1) {
      if (!this.scanHistory[scanIndex].notes) {
        this.scanHistory[scanIndex].notes = [];
      }

      this.scanHistory[scanIndex].notes.unshift({
        text: note,
        date: new Date(),
      });

      this.historySubject.next(this.scanHistory);
      return true;
    }
    return false;
  }

  deleteNoteFromScan(scanId: string, noteIndex: number): boolean {
    const scanIndex = this.scanHistory.findIndex((scan) => scan.id === scanId);
    if (scanIndex !== -1 && this.scanHistory[scanIndex].notes) {
      this.scanHistory[scanIndex].notes.splice(noteIndex, 1);
      this.historySubject.next(this.scanHistory);
      return true;
    }
    return false;
  }

  getScanNotes(scanId: string) {
    const scan = this.scanHistory.find((s) => s.id === scanId);
    return scan?.notes || [];
  }

  deleteScan(scanId: string) {
    this.scanHistory = this.scanHistory.filter((scan) => scan.id !== scanId);
    this.historySubject.next(this.scanHistory);
  }

  getRecentScans(limit: number = 5) {
    return this.scanHistory.slice(0, limit);
  }

  getAllScans() {
    return this.scanHistory;
  }

  getDashboardStats() {
    const stats = {
      plantsTracked: this.scanHistory.length,
      todaysScans: this.getTodaysScans().length,
      healthyCount: this.scanHistory.filter((scan) => scan.status === 'healthy')
        .length,
      watchlistCount: this.scanHistory.filter(
        (scan) => scan.status === 'watchlist'
      ).length,
      infectedCount: this.scanHistory.filter(
        (scan) => scan.status === 'infected'
      ).length,
    };
    return stats;
  }

  private getTodaysScans() {
    const today = new Date();
    return this.scanHistory.filter((scan) => {
      const scanDate = new Date(scan.date);
      return (
        scanDate.getDate() === today.getDate() &&
        scanDate.getMonth() === today.getMonth() &&
        scanDate.getFullYear() === today.getFullYear()
      );
    });
  }

  getHighRiskAlert() {
    const highRiskScans = this.scanHistory.filter((scan) =>
      scan.pestsDetected?.some((pest: any) => pest.severity === 'High')
    );

    if (highRiskScans.length > 0) {
      const mostRecent = highRiskScans[0];
      return {
        plant: mostRecent.plantName,
        pest: mostRecent.pestsDetected[0].name,
        severity: 'high',
      };
    }
    return null;
  }

  // Add a method to clear all data (optional)
  clearAllData() {
    this.scanHistory = [];
    this.scanCounter = 1;
    this.historySubject.next(this.scanHistory);
  }
}