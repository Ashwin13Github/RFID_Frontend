// import { Component, OnInit } from '@angular/core';
// import { CommonModule, AsyncPipe } from '@angular/common';
// //import { RfidSignalrService, RfidLog } from './dashboard';

// import { Inject } from '@angular/core';
// import { RfidSignalrService } from '../dashboard';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [CommonModule, AsyncPipe],
//   templateUrl: './dashboard.html',
//   styleUrls: ['./dashboard.css'],
//   providers: [RfidSignalrService]
// })
// export class DashboardComponent implements OnInit {

//   logs$: typeof this.rfidService.logs$;

//   constructor(@Inject(RfidSignalrService) private rfidService: RfidSignalrService) {
//     this.logs$ = this.rfidService.logs$;
//   }
//   onClearLogs() {
//     localStorage.removeItem('rfidLogs');
//     this.rfidService['logsSubject'].next([]);
//   }

//   onclick(){
    

    
//   }
//   ngOnInit(): void {
//     // service automatically connects
//   }
// }
