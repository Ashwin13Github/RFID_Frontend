import { Component, signal, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard";
import { Home } from './home/home';
import { RfidLogsComponent } from './rfidlogs/rfidlogs';
import { FilteringComponent } from './filtering/filtering';
import { PeopleAtLocationComponent } from './people-at/people-at';
import { SignalRupdateService } from './signal-rupdate';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardComponent,RouterModule,Home,RfidLogsComponent,FilteringComponent,PeopleAtLocationComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('RFID-app');

  constructor(private signalRService: SignalRupdateService) {}

  ngOnInit(): void {
    
    this.signalRService.startConnection();
  }
}
