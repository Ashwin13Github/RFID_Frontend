import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PeopleService, Person } from '../people-at';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people-at-location',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './people-at.html',
  styleUrls: ['./people-at.css'],
})
export class PeopleAtLocationComponent implements OnInit, OnDestroy {
  people: Person[] = [];
  location: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  paginatedPeople: Person[] = [];
  filteredPeople: Person[] = [];

  // Added locations array for dropdown
 

 locations: string[] = [
  "Admin Office",
  "Staff Room",
  "Classroom Block",
  "Computer Lab",
  "Library",
  "Canteen",
  "Principal Office",
  "Entrance"
];


  private peopleUpdateSubscription!: Subscription;

  // Sorting dropdown
  showSortDropdown = false;
  sortColumns = [
    { label: 'UID', value: 'uid' },
    { label: 'Name', value: 'fullName' },
    { label: 'Location', value: 'location' },
    { label: 'Action', value: 'action' },
    { label: 'Timestamp', value: 'timestamp' }
  ];
  sortColumn = 'uid';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  pageSizes = [5, 10, 20, 50, 100];
  totalPages = 1;
  totalPagesArray: number[] = [];

  constructor(private peopleService: PeopleService) {}

  ngOnInit(): void {
    // Subscribe to real-time people updates
    this.peopleUpdateSubscription = this.peopleService.getPeopleUpdates().subscribe((updatedPeople: Person[]) => {
      // Update people list if the current location matches
      if (this.location && updatedPeople.some(p => p.location === this.location)) {
        this.people = updatedPeople.filter(p => p.location === this.location);
        this.applySorting();
        this.updatePagination();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.peopleUpdateSubscription) {
      this.peopleUpdateSubscription.unsubscribe();
    }
  }

  onLocationSubmit(): void {
    if (!this.location.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.people = [];

    this.peopleService.getPeopleAtLocation(this.location).subscribe({
      next: (data) => {
        this.people = data;
        this.filteredPeople = data;
        this.isLoading = false;
        if (this.people.length === 0) {
          this.errorMessage = `No people found at ${this.location}.`;
        }
        this.applySorting();
        this.updatePagination();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No one is at this location';
        this.isLoading = false;
      },
    });
  }

  closeSortDropdown() { this.showSortDropdown = false; }

  toggleSortDropdown() { this.showSortDropdown = !this.showSortDropdown; }

  setSortColumn(col: any) {
    this.sortColumn = col.value;
  }

  setSortDirection(dir: 'asc' | 'desc') {
    this.sortDirection = dir;
  }

  applySorting() {
    if (!this.sortColumn) return;

    this.filteredPeople.sort((a: any, b: any) => {
      let A = a[this.sortColumn];
      let B = b[this.sortColumn];

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.sortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPeople.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedPeople = this.filteredPeople.slice(
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
