import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
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
  paginatedLogs: RfidLog[] = [];

  locations: string[] = [];

  // Filters
  filterLocation = '';
  filterAction = '';
  filterUidOrName = '';
  filterFromDate = '';
  filterToDate = '';
  filterDesignation = '';
  filterClassOrDept = '';

  // Pop-ups
  showFilterPopup = false;

  // Sorting dropdown
  showSortDropdown = false;
  sortColumns = [
    { label: 'UID', value: 'uid' },
    { label: 'Name', value: 'fullName' },
    { label: 'Location', value: 'location' },
    { label: 'Action', value: 'action' },
    { label: 'Designation', value: 'designation' },
    { label: 'Class/Department', value: 'classOrDept' },
    { label: 'Timestamp', value: 'timestamp' }
  ];
  sortColumn = 'uid';
  sortDirection: 'asc' | 'desc' = 'asc';

  // UI State
  isLoading = false;
  errorMessage = '';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;

  pageSizes = [5, 10, 20, 50, 100];

  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(
    @Inject(filtering) private filteringService: filtering,
    private SignalRupdateService: SignalRupdateService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.SignalRupdateService.startConnection();

    this.SignalRupdateService.newLog$.subscribe((log: RfidLog) => {
      this.filteredLogs.unshift(log); // Change push to unshift

      if (!this.locations.includes(log.location)) {
        this.locations.push(log.location);
      }

      this.applySorting();
      this.updatePagination();
    });
  }

  // Load initial data
  loadData() {
    this.isLoading = true;
    this.filteringService.getFilteredLogs().subscribe({
      next: (data) => {
        this.filteredLogs = data;
        this.locations = Array.from(new Set(data.map(x => x.location)));
        this.isLoading = false;

        this.applySorting();
        this.updatePagination();
      },
      error: () => {
        this.errorMessage = "Failed to load logs";
        this.isLoading = false;
      }
    });
  }

  // ======= POPUPS =======
  openFilterPopup() { this.showFilterPopup = true; }
  closeFilterPopup() { this.showFilterPopup = false; }

  toggleSortDropdown() { this.showSortDropdown = !this.showSortDropdown; }
  closeSortDropdown() { this.showSortDropdown = false; }

  // ======= FILTER APPLY =======
  applyFilters() {
    this.isLoading = true;

    this.filteringService.getFilteredLogs(
      this.filterLocation,
      this.filterAction,
      this.filterUidOrName,
      this.filterFromDate,
      this.filterToDate,
      this.filterDesignation,
      this.filterClassOrDept
    ).subscribe({
      next: (data) => {
        this.filteredLogs = data;

        this.applySorting();
        this.currentPage = 1;
        this.updatePagination();

        this.isLoading = false;
        this.closeFilterPopup();
      },
      error: () => {
        this.errorMessage = 'No logs found';
        this.isLoading = false;
      }
    });
  }

  // ======= SORT APPLY =======
  setSortColumn(col: any) {
    this.sortColumn = col.value;
  }

  setSortDirection(dir: 'asc' | 'desc') {
    this.sortDirection = dir;
  }

  applySorting() {
    if (!this.sortColumn) return;

    this.filteredLogs.sort((a: any, b: any) => {
      let A = a[this.sortColumn];
      let B = b[this.sortColumn];

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    this.cdr.detectChanges();

    this.updatePagination();
  }

  // ======= PAGINATION =======
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedLogs = this.filteredLogs.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
    this.cdr.detectChanges();
  }

  changeItemsPerPage() {
    this.currentPage = 1;
    this.updatePagination();
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
