import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filtering, RfidLog } from '../filtering';
import { SignalRupdateService } from '../signal-rupdate';

@Component({
  selector: 'app-filtering',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [filtering, SignalRupdateService],
  templateUrl: './filtering.html',
  styleUrls: ['./filtering.css']
})
export class FilteringComponent implements OnInit {
  filteredLogs: RfidLog[] = [];
  locations: string[] = ['Entrance', 'Meet', 'AVRoom', 'Cafeteria', 'Lobby'];

  filterLocation = '';
  filterAction = '';
  filterUidOrName = ''; 
  filterFromDate = '';
  filterToDate = '';

  isLoading = false;
  errorMessage = '';

  constructor(
    @Inject(filtering) private filtering: filtering,
    private signalRService: SignalRupdateService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    this.signalRService.startConnection();

    this.signalRService.newLog$.subscribe((newLog: RfidLog) => {
      const matchesFilter =
        (!this.filterLocation || newLog.location === this.filterLocation) &&
        (!this.filterAction || newLog.action === this.filterAction) &&
        (!this.filterUidOrName ||
          newLog.uid.includes(this.filterUidOrName) ||
          newLog.name.toLowerCase().includes(this.filterUidOrName.toLowerCase()));

      if (matchesFilter) {
        this.filteredLogs.push(newLog);
      }

      if (!this.locations.includes(newLog.location)) {
        this.locations.push(newLog.location);
      }
    });
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.filtering.getFilteredLogs().subscribe({
      next: (data: RfidLog[]) => {
        this.filteredLogs = data;
        this.locations = Array.from(new Set(data.map(l => l.location)));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = 'Failed to load logs';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.filtering
      .getFilteredLogs(
        this.filterLocation,
        this.filterAction,
        this.filterUidOrName, 
        this.filterFromDate,
        this.filterToDate
      )
      .subscribe({
        next: (data: RfidLog[]) => {
          this.filteredLogs = data;
          this.isLoading = false;
        },
        error: (err: any) => {
          console.error(err);
          this.errorMessage = 'No logs match the filter criteria';
          this.isLoading = false;
        }
      });
  }
}
