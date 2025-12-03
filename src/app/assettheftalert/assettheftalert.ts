import { Component, OnInit } from '@angular/core';
import { AssetTheftService, AssetTheftAlert } from '../assettheftservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asset-theft',
  templateUrl: './assettheftalert.html',
  standalone:true,
  imports:[CommonModule,FormsModule],
  styleUrls: ['./assettheftalert.css']
})
export class AssetTheftComponent implements OnInit {

  alerts: AssetTheftAlert[] = [];

  selectedAlertId: number | null = null;
  newStatus: string = '';
  comments: string = '';

  message = '';
  errorMessage = '';
  showModal: boolean = false;
  toasterMessage: string = '';
  toasterClass: string = '';

  constructor(private service: AssetTheftService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.service.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.message = ''; // Clear previous messages
        this.errorMessage = ''; // Clear previous error messages
      },
      error: () => {
        this.errorMessage = 'Failed to load alerts';
        this.showToaster('Failed to load alerts', 'error');
      }
    });
  }

  selectAlert(alert: AssetTheftAlert) {
    this.selectedAlertId = alert.alertId;
    this.newStatus = alert.status;
    this.comments = '';
    this.showModal = true;
  }

  closeModal() {
    this.selectedAlertId = null;
    this.showModal = false;
  }

  updateStatus() {
    if (!this.selectedAlertId) return;

    this.service.updateStatus({
      alertId: this.selectedAlertId,
      newStatus: this.newStatus,
      comments: this.comments
    })
    .subscribe({
      next: (res) => {
        this.showToaster(res.message, 'success');
        this.loadAlerts();
        this.closeModal();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error updating status';
        this.showToaster(msg, 'error');
        this.errorMessage = msg; // Keep old error message for now, might remove later
      }
    });
  }

  showToaster(message: string, type: 'success' | 'error') {
    this.toasterMessage = message;
    this.toasterClass = `show ${type}`;

    setTimeout(() => {
      this.toasterMessage = '';
      this.toasterClass = '';
    }, 3000); // Toaster disappears after 3 seconds
  }
}
