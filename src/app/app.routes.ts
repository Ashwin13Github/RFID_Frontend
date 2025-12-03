import { Routes } from '@angular/router';
// import { DashboardComponent } from './dashboard/dashboard';
import { Home } from './home/home';
// import { RfidLogsComponent } from './rfidlogs/rfidlogs';
import { FilteringComponent } from './filtering/filtering';
import { PeopleAtLocationComponent } from './people-at/people-at';
import { AttendanceComponent } from './attendance/attendance';
import { UserWalletComponent } from './user-wallet/user-wallet';
import { LoginComponent } from './logincomponent/logincomponent';
import { AdminGuard, AuthGuard } from './auth-guard-guard';
import { CrudComponent } from './crud-component/crud-component';
import { AccessPermissionComponent } from './access-permission-component/access-permission-component';
import { CanteenComponent } from './canteen/canteen';
import { AttendanceDisplayComponent } from './attendancedisplay/attendancedisplay';
import { ClassWiseAttendanceComponent } from './classwiseattendance/classwiseattendance';
import { ClassManagerComponent } from './classmanagercomponent/classmanagercomponent';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { LibraryComponent } from './library/library';
import { AssetTheftComponent } from './assettheftalert/assettheftalert';
import { SettingsComponent } from './settings/settings';
import { UserManagementComponent } from './user-management/user-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'Home', component: Home, canActivate: [AuthGuard] },
  { path: 'Filter', component: FilteringComponent, canActivate: [AdminGuard] },
  // { path: 'RfidLogs', component: RfidLogsComponent },
  { path: 'People-At', component: PeopleAtLocationComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'User Details', component: UserManagementComponent, canActivate: [AdminGuard] },
  { path: 'Designation Details', component: CrudComponent, canActivate: [AdminGuard] },
  { path: 'Attendance', component: AttendanceComponent, canActivate: [AdminGuard] },
  { path: 'Access Control', component: AccessPermissionComponent, canActivate: [AdminGuard] },
  { path: 'UserWallet', component: UserWalletComponent, canActivate: [AdminGuard] },
  { path: 'Canteen', component: CanteenComponent, canActivate: [AdminGuard] },
  { path: 'Reports', component: AttendanceDisplayComponent, canActivate: [AdminGuard] },
  { path: 'ClassWise Attendance', component: ClassWiseAttendanceComponent, canActivate: [AdminGuard] },
  { path: 'Class Manager', component: ClassManagerComponent, canActivate: [AdminGuard] },
  {path:'Library',component:LibraryComponent,canActivate:[AdminGuard]},
  {path:'Asset Management',component:AssetTheftComponent,canActivate:[AdminGuard]},
  { path: 'transaction-list', component: TransactionListComponent },
  { path: 'settings', component: SettingsComponent, canActivate: [AdminGuard] }
];
