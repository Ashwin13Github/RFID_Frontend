// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { parse } from 'date-fns';
// import { Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RfidLog, RfidLogsService } from '../rfidlogs';
// import { SignalRupdateService } from '../signal-rupdate';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-rfid-logs',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   providers: [RfidLogsService],
//   templateUrl: './rfidlogs.html',
//   styleUrls: ['./rfidlogs.css']
// })
// export class RfidLogsComponent implements OnInit, OnDestroy {
//   logs: RfidLog[] = [];
//   filteredLogs: RfidLog[] = [];
//   locations: string[] = [];

//   isLoading = true;
//   errorMessage = '';

//   // Filters
//   filterLocation = '';
//   filterAction = '';
//   filterAfterDate = '';
//   filterUid = '';
//   private newLogSubscription!: Subscription;

//   constructor(@Inject(RfidLogsService) private rfidLogsService: RfidLogsService, private signalRService: SignalRupdateService) {}
  

//   ngOnInit(): void {
//     this.rfidLogsService.getFilteredLogs().subscribe({
//       next: (data: RfidLog[]) => {
//         this.logs = data;
//         this.filteredLogs = [...this.logs];
//         this.locations = Array.from(new Set(this.logs.map(l => l.location)));
//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         console.error(err);
//         this.errorMessage = 'Failed to load logs';
//         this.isLoading = false;
//       }
//     });

//     // Subscribe to real-time log updates
//     this.newLogSubscription = this.signalRService.newLog$.subscribe((newLog: RfidLog) => {
//       this.logs.unshift(newLog); // Add new log to the beginning
//       this.filteredLogs = [...this.logs]; // Update filtered logs
//       this.applyFilters(); // Re-apply filters if any
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.newLogSubscription) {
//       this.newLogSubscription.unsubscribe();
//     }
//   }

//   applyFilters(): void {
//     let afterDateObj: Date | null = null;

//     if (this.filterAfterDate) {
//       try {
//         afterDateObj = parse(this.filterAfterDate, 'MM/dd/yy, h:mm a', new Date());
//       } catch {
//         afterDateObj = null;
//       }
//     }

//     this.filteredLogs = this.logs.filter(log => {
//       const matchesLocation = this.filterLocation ? log.location === this.filterLocation : true;
//       const matchesAction = this.filterAction ? log.action === this.filterAction : true;
//       const matchesUid = this.filterUid ? log.uid.includes(this.filterUid) : true;

//       // Only show logs after the entered datetime
//       let matchesAfterDate = true;
//       if (afterDateObj) {
//         const logTime = new Date(log.timestamp);
//         matchesAfterDate = logTime.getTime() > afterDateObj.getTime();
//       }

//       return matchesLocation && matchesAction && matchesUid && matchesAfterDate;
//     });
//   }
// }
