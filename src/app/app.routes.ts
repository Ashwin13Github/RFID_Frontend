import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { Home } from './home/home';
import { RfidLogsComponent } from './rfidlogs/rfidlogs';
import { FilteringComponent } from './filtering/filtering';
import { PeopleAtLocationComponent } from './people-at/people-at';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'Home', component: Home },
  { path: 'Filter', component: FilteringComponent },
  { path: 'RfidLogs', component: RfidLogsComponent },
  { path: 'People-At', component: PeopleAtLocationComponent },
];
