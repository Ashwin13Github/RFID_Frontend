import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

export interface RfidLog {
  uid: string;
  location: string;
  action: string;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class RfidSignalrService {

  private hubConnection!: signalR.HubConnection;

  // Observable to hold logs
  private logsSubject = new BehaviorSubject<RfidLog[]>([]);
  logs$ = this.logsSubject.asObservable();

  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44372/rfidHub', { transport: signalR.HttpTransportType.WebSockets })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log(' Connected to SignalR Hub'))
      .catch(err => console.error(' SignalR Connection Error:', err));

    this.hubConnection.on('ReceiveRfidUpdate', (data: RfidLog) => {
      console.log(' New RFID Update:', data);

      
      const currentLogs = this.logsSubject.value;

     
      this.logsSubject.next([...currentLogs, data]);

      localStorage.setItem('rfidLogs', JSON.stringify([...currentLogs, data]));
    });


    const storedLogs = localStorage.getItem('rfidLogs');
    if (storedLogs) {
      this.logsSubject.next(JSON.parse(storedLogs));
    }
  }
}
