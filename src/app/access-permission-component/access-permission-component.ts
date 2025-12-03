import { Component, OnInit } from '@angular/core';
import { AccessPermission, AccessPermissionService } from '../access-permission-service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-access-permission',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './access-permission-component.html',
  styleUrls: ['./access-permission-component.css']
})
export class AccessPermissionComponent implements OnInit {
  permissions: AccessPermission[] = [];
  filteredPermissions: AccessPermission[] = [];
  paginatedPermissions: AccessPermission[] = [];
  form: FormGroup;
  editMode = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPermissionModal: boolean = false;

  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  pageSizes = [5, 10, 20, 50, 100];
  totalPages = 1;
  totalPagesArray: number[] = [];

  // Sorting
  showSortDropdown = false;
  sortColumns = [
    { label: 'PermissionId', value: 'permissionId' },
    { label: 'Designation', value: 'designationName' },
    { label: 'Location', value: 'locationName' },
    { label: 'Active', value: 'isActive' }
  ];
  sortColumn = 'permissionId';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(private service: AccessPermissionService, private fb: FormBuilder) {
    this.form = this.fb.group({
      permissionId: [0],
      designationId: [null, Validators.required],
      accessPointId: [null, Validators.required],
      isActive: [true, Validators.required]
    });
  }

  ngOnInit() {
    this.loadPermissions();
  }

  // ======== MODAL CONTROLS ========
  openPermissionModal(permission?: AccessPermission) {
    this.showPermissionModal = true;
    if (permission) {
      this.editMode = true;
      this.form.patchValue(permission);
    } else {
      this.editMode = false;
      this.form.reset({ isActive: true, permissionId: 0 });
    }
  }

  closePermissionModal() {
    this.showPermissionModal = false;
    this.cancel();
  }

  loadPermissions() {
    this.isLoading = true;
    this.errorMessage = '';
    this.service.getAll().subscribe({
      next: data => {
        this.permissions = data;
        this.filteredPermissions = data;
        this.isLoading = false;
        this.applySorting();
        this.updatePagination();
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Failed to load permissions.';
        this.isLoading = false;
      }
    });
  }

  edit(permission: AccessPermission) {
    this.openPermissionModal(permission);
  }

  save() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    const permission: AccessPermission = this.form.value;

    if (this.editMode) {
      this.service.update(permission).subscribe({
        next: () => {
          this.loadPermissions();
          this.closePermissionModal();
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Failed to update permission.';
          this.isLoading = false;
        }
      });
    } else {
      this.service.create(permission).subscribe({
        next: () => {
          this.loadPermissions();
          this.closePermissionModal();
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Failed to create permission.';
          this.isLoading = false;
        }
      });
    }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this permission?')) {
      this.isLoading = true;
      this.errorMessage = '';
      this.service.delete(id).subscribe({
        next: () => {
          this.loadPermissions();
          this.isLoading = false;
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Failed to delete permission.';
          this.isLoading = false;
        }
      });
    }
  }

  cancel() {
    this.editMode = false;
    this.form.reset({ isActive: true, permissionId: 0 });
    this.closePermissionModal(); // Ensure the modal is closed when cancelling
  }

  // ======= SORTING =======
  toggleSortDropdown() { this.showSortDropdown = !this.showSortDropdown; }
  closeSortDropdown() { this.showSortDropdown = false; }

  setSortColumn(col: any) {
    this.sortColumn = col.value;
  }

  setSortDirection(dir: 'asc' | 'desc') {
    this.sortDirection = dir;
  }

  applySorting() {
    if (!this.sortColumn) return;

    this.filteredPermissions.sort((a: any, b: any) => {
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

  // ======= PAGINATION =======
  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPermissions.length / this.itemsPerPage);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.paginatedPermissions = this.filteredPermissions.slice(
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
