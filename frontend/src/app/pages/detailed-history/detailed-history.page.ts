import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-detailed-history',
  templateUrl: './detailed-history.page.html',
  styleUrls: ['./detailed-history.page.scss'],
})
export class DetailedHistoryPage implements OnInit {
  scan: any;
  newNote: string = '';
  isLoading: boolean = true;
  error: any = null;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private dataService: DataService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.loadScanData();
  }

  async loadScanData() {
    this.isLoading = true;
    this.error = null;
    
    try {
      const scanId = this.route.snapshot.paramMap.get('id');
      if (!scanId) {
        throw new Error('No scan ID provided');
      }
      
      this.scan = this.dataService.getAllScans().find(scan => scan.id === scanId);
      
      if (!this.scan) {
        this.navCtrl.navigateBack('/tabs/history');
        return;
      }
    } catch (err) {
      this.error = err;
      console.error('Error loading scan:', err);
    } finally {
      this.isLoading = false;
    }
  }

  async retryLoading() {
    await this.loadScanData();
  }

  async addNote() {
    if (!this.newNote.trim()) {
      const toast = await this.toastCtrl.create({
        message: 'Please enter a note',
        duration: 2000,
        position: 'top',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      const added = this.dataService.addNoteToScan(this.scan.id, this.newNote);
      if (added) {
        this.newNote = '';
        
        const toast = await this.toastCtrl.create({
          message: 'Note added successfully',
          duration: 2000,
          position: 'top',
          color: 'success'
        });
        await toast.present();
        
        // Refresh the scan data
        this.scan = this.dataService.getAllScans().find(s => s.id === this.scan.id);
      } else {
        throw new Error('Failed to add note');
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to add note',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  async deleteNote(note: any) {
    try {
      // Find the note index and remove it
      const noteIndex = this.scan.notes.findIndex((n: any) => n.date === note.date && n.text === note.text);
      if (noteIndex > -1) {
        // Update the scan in the data service
        const updated = await this.dataService.deleteNoteFromScan(this.scan.id, noteIndex);
        if (updated) {
          // Refresh the scan data
          this.scan = this.dataService.getAllScans().find(s => s.id === this.scan.id);
          
          const toast = await this.toastCtrl.create({
            message: 'Note deleted',
            duration: 2000,
            position: 'top',
            color: 'success'
          });
          await toast.present();
        }
      }
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: 'Failed to delete note',
        duration: 2000,
        position: 'top',
        color: 'danger'
      });
      await toast.present();
    }
  }

  rescanPlant() {
    console.log('Rescan plant:', this.scan.plantName);
    // Implement rescan logic
  }

  deleteScan() {
    this.dataService.deleteScan(this.scan.id);
    this.navCtrl.navigateBack('/tabs/history');
  }
}