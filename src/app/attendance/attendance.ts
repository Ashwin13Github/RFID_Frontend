import { Component } from '@angular/core';
import { AttendanceService, TotalInTime } from '../attendance';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.html',
  styleUrls: ['./attendance.css']
})
export class AttendanceComponent {

  uid: string = '';
  date: string = '';
  records: TotalInTime[] = [];
  filteredRecords: TotalInTime[] = [];
  paginatedRecords: TotalInTime[] = [];
  message: string = '';
  isLoading = false;

  // Sorting
  showSortDropdown = false;
  sortColumns = [
    { label: 'User ID', value: 'userId' },
    { label: 'UID', value: 'uid' },
    { label: 'Full Name', value: 'fullName' },
    { label: 'Designation', value: 'designation' },
    { label: 'Date', value: 'attendanceDate' },
    { label: 'First In', value: 'firstIn' },
    { label: 'Last Out', value: 'lastOut' },
    { label: 'Total Worked Time', value: 'totalWorkedTime' }
  ];
  sortColumn = 'attendanceDate';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  pageSizes = [5, 10, 20, 50];
  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(private attendanceService: AttendanceService) {}

  search() {
    this.isLoading = true;

    this.attendanceService.getTotalInTime(this.uid, this.date).subscribe({
      next: (data) => {
        this.records = data;
        this.filteredRecords = data;
        this.message = '';
        this.applySorting();
        this.updatePagination();
        this.isLoading = false;
      },
      error: (err) => {
        this.records = [];
        this.filteredRecords = [];
        this.message = err.error?.message || 'No records found.';
        this.updatePagination();
        this.isLoading = false;
      }
    });
  }

  getHoursClass(totalWorkedTime: string | null): string {
    if (!totalWorkedTime) return '';

    const match = totalWorkedTime.match(/([\d.]+)/);
    const hours = match ? parseFloat(match[1]) : 0;

    return hours >= 8 ? 'hours-green' : 'hours-red';
  }

  toggleSortDropdown() {
    this.showSortDropdown = !this.showSortDropdown;
  }
  closeSortDropdown() {
    this.showSortDropdown = false;
  }

  setSortColumn(col: any) {
    this.sortColumn = col.value;
  }

  setSortDirection(direction: 'asc' | 'desc') {
    this.sortDirection = direction;
  }

  applySorting() {
    this.filteredRecords.sort((a: any, b: any) => {
      let A = a[this.sortColumn];
      let B = b[this.sortColumn];

      // Handle nulls
      if (!A) A = '';
      if (!B) B = '';

      // Date comparisons
      if (['attendanceDate', 'firstIn', 'lastOut'].includes(this.sortColumn)) {
        A = A ? new Date(A).getTime() : 0;
        B = B ? new Date(B).getTime() : 0;
      }

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  // Pagination
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredRecords.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    this.paginatedRecords = this.filteredRecords.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
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
