import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { Person } from './people-at';

export interface RfidLog {
  uid: string;
  fullName: string;
  location: string;
  action: string;
  timestamp: string;
  designation: string;
  classOrDept: string;
}

@Injectable({
  providedIn: 'root'
})
export class SignalRupdateService {
  private hubConnection!: signalR.HubConnection;

  private newLogSubject = new Subject<RfidLog>();
  newLog$ = this.newLogSubject.asObservable();

  private newPeopleSubject = new Subject<Person[]>();
  newPeople$ = this.newPeopleSubject.asObservable();

  private existingLogs: RfidLog[] = [];

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44372/rfidHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log('✅ SignalR connected'))
      .catch(err => console.error('❌ SignalR connection error:', err));

    // RECEIVE LOG UPDATE
    this.hubConnection.on('ReceiveRfidUpdate', (log: any) => {
      console.log('📡 Raw SignalR log:', log);

      const newLog: RfidLog = {
        uid: log.uid,
        fullName: log.fullname || log.fullName || log.FullName || "",
        location: log.location,
        action: log.action,
        timestamp: log.timestamp,
        designation: log.designation || "",
        classOrDept: log.classordept || log.classOrDept || ""
      };

      console.log('🟢 Parsed Log:', newLog);

      // Add or update
      const idx = this.existingLogs.findIndex(
        x => x.uid === newLog.uid && x.timestamp === newLog.timestamp
      );

      if (idx >= 0) {
        this.existingLogs[idx] = { ...this.existingLogs[idx], ...newLog };
      } else {
        this.existingLogs.unshift(newLog);
      }

      this.newLogSubject.next(newLog);
    });

    // RECEIVE PEOPLE UPDATE
    this.hubConnection.on('ReceivePeopleUpdate', (people: any[]) => {
      const newPeople = people.map(p => ({
        uid: p.uid,
        fullName: p.fullname || p.fullName || "",
        action: p.action,
        location: p.location,
        timestamp: p.timestamp,
        designation: p.designation || "",
        classOrDept: p.classordept || p.classOrDept || ""
      }));

      console.log('👥 People update:', newPeople);
      this.newPeopleSubject.next(newPeople);
    });
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('⛔ SignalR disconnected'));
    }
  }

  setInitialLogs(logs: RfidLog[]): void {
    logs.forEach(newLog => {
      const idx = this.existingLogs.findIndex(
        x => x.uid === newLog.uid && x.timestamp === newLog.timestamp
      );

      if (idx >= 0) {
        this.existingLogs[idx] = { ...this.existingLogs[idx], ...newLog };
      } else {
        this.existingLogs.unshift(newLog);
      }
    });
  }
}
