// import { Component, OnInit, Inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { filtering, RfidLog } from '../filtering';

// @Component({
//   selector: 'app-rfid-logs',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   providers: [filtering],
//   templateUrl: './filter.html',
//   styleUrls: ['./filter.css']
// })
// export class filter implements OnInit {
//   filteredLogs: RfidLog[] = [];
//   locations: string[] = [];

//   // Filters
//   filterLocation = '';
//   filterAction = '';
//   filterUid = '';
//   filterAfterDate = '';
  

//   // Sorting
//   sortColumn: string = '';
//   sortDirection: 'asc' | 'desc' = 'asc';

//   isLoading = false;
//   errorMessage = '';

//   constructor(@Inject(filtering) private filtering: filtering) {}

//   ngOnInit(): void {
//     this.loadInitialData();
//   }

//   loadInitialData(): void {
//     this.isLoading = true;
//     this.filtering.getFilteredLogs().subscribe({
//       next: (data: any[]) => {
//         this.filteredLogs = data;

//         this.locations = Array.from(new Set(data.map(l => l.location)));
//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         console.error(err);
//         this.errorMessage = 'Failed to load logs';
//         this.isLoading = false;
//       }
//     });
//   }

//   applyFilters(): void {
//     this.isLoading = true;
//     this.errorMessage = '';

//     this.filtering.getFilteredLogs(
//       this.filterLocation,
//       this.filterAction,
//       this.filterUid,
//       this.filterAfterDate
//     ).subscribe({
//       next: (data: RfidLog[]) => {
//         this.filteredLogs = data;

//         // Re-apply sorting after filtering
//         if (this.sortColumn) {
//           this.sortBy(this.sortColumn);
//         }

//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         console.error(err);
//         this.errorMessage = 'Failed to load filtered logs';
//         this.isLoading = false;
//       }
//     });
//   }

//   // Sorting Function
//   sortBy(column: string): void {
//     if (this.sortColumn === column) {
//       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
//     } else {
//       this.sortColumn = column;
//       this.sortDirection = 'asc';
//     }

//     this.filteredLogs.sort((a: any, b: any) => {
//       const valueA = a[column];
//       const valueB = b[column];

//       if (column === 'timestamp') {
//         return this.sortDirection === 'asc'
//           ? new Date(valueA).getTime() - new Date(valueB).getTime()
//           : new Date(valueB).getTime() - new Date(valueA).getTime();
//       }

//       if (valueA < valueB) return this.sortDirection === 'asc' ? -1 : 1;
//       if (valueA > valueB) return this.sortDirection === 'asc' ? 1 : -1;
//       return 0;
//     });
//   }
// }
