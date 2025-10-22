import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { RfidLog } from './rfidlogs';
import { Person } from './people-at';

@Injectable({ providedIn: 'root' })

export class SignalRupdateService {
  private hubConnection!: signalR.HubConnection;
  private newLogSubject = new Subject<RfidLog>();
  newLog$ = this.newLogSubject.asObservable();
  private newPeopleSubject = new Subject<Person[]>();
  newPeople$ = this.newPeopleSubject.asObservable();

  startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44372/rfidHub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log(' SignalR connected'))
      .catch((err) => console.error(' SignalR connection error:', err));

    this.hubConnection.on('ReceiveRfidUpdate', (log: any) => {
      const newLog: RfidLog = {
        uid: log.uid,
        name: log.name,
        location: log.location,
        action: log.action,
        timestamp: log.timestamp
      };
      console.log(' New log received:', newLog);
      this.newLogSubject.next(newLog);
    });

    this.hubConnection.on('ReceivePeopleUpdate', (people: any[]) => {
      const newPeople: Person[] = people.map(p => ({
        uid: p.uid,
        name: p.name,
        action: p.action,
        location: p.location,
        timestamp: p.timestamp
      }));
      console.log(' New people update received:', newPeople);
      this.newPeopleSubject.next(newPeople);
    });
  }

  stopConnection(): void {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => console.log('SignalR disconnected'));
    }
  }
}
