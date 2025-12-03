import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService, DashboardSummary } from '../dashboardservices';

@Component({
  selector: 'app-dashboardcomponent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboardcomponent.html',
  styleUrls: ['./dashboardcomponent.css']
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  loading = false;
  errorMsg = '';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    // Load today’s dashboard data initially
    this.loadDashboardData();

    // Start SignalR for live updates
    this.dashboardService.startSignalRConnection(this.selectedDate);

    // Listen for updates from SignalR
    this.dashboardService.dashboard$.subscribe((updatedSummary) => {
      if (updatedSummary) {
        console.log('📊 Dashboard auto-updated:', updatedSummary);
        this.summary = updatedSummary;
      }
    });
  }

  loadDashboardData(): void {
    if (!this.selectedDate) return;

    this.loading = true;
    this.errorMsg = '';
    this.summary = null;

    this.dashboardService.getDashboardSummary(this.selectedDate).subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.errorMsg = 'Unable to load dashboard data.';
        this.loading = false;
      }
    });
  }

  onDateChange(): void {
    this.loadDashboardData();
  }
}
