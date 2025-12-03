import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../environments/environments';

export interface DashboardSummary {
  summaryDate: string;
  totalReadsToday: number;
  activeUsers: number;
  avgWorkHours: number;
  avgWorkHoursFormatted: string;
  employeesAbove8Hrs: number;
  lastUpdated: string;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = environment.baseUrl;
  private hubConnection!: signalR.HubConnection;
  private dashboardSubject = new BehaviorSubject<DashboardSummary | null>(null);
  dashboard$ = this.dashboardSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Get dashboard summary */
  getDashboardSummary(date: string): Observable<DashboardSummary | null> {
    const url = `${this.apiUrl}/api/DashboardSummary?date=${date}`;
    return this.http.get<DashboardSummary[]>(url).pipe(
      map(response => response && response.length > 0 ? response[0] : null)
    );
  }

  /** Start SignalR for live dashboard updates */
  startSignalRConnection(date: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/rfidHub`)
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('📡 Dashboard SignalR connected'))
      .catch(err => console.error('SignalR error:', err));

    // Refresh dashboard when new RFID log arrives
    this.hubConnection.on('ReceiveRfidUpdate', () => {
      console.log('🔁 New RFID log detected — refreshing dashboard...');
      this.getDashboardSummary(date).subscribe(summary => {
        if (summary) this.dashboardSubject.next(summary);
      });
    });
  }
}
