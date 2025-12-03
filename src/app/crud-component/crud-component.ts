import { Component, OnInit, HostListener } from '@angular/core';
import { CrudService } from '../crud-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'angular-toastify';
import { UserManagementComponent } from '../user-management/user-management.component';

@Component({
  selector: 'app-crud',
  standalone: true,
  imports: [CommonModule, FormsModule, UserManagementComponent],
  templateUrl: './crud-component.html',
  styleUrls: ['./crud-component.css']
})
export class CrudComponent implements OnInit {
  activeTab: string = 'designation';

  // Common properties for pagination
  pageSizes = [5, 10, 20, 50, 100];

  // Side panel and dropdown states
  showSidePanel: boolean = false;
  activeSidePanelForm: 'designation' | null = null;
  isEditing: boolean = false;
  showActionDropdown: 'designation' | null = null;
  activeDropdownIndex: number | null = null;

  // Designation properties
  designations: any[] = [];
  filteredDesignations: any[] = [];
  paginatedDesignations: any[] = [];
  designationModel: any = { designationId: '', designationName: '' };
  isEditingDesignation: boolean = false;
  showDesignationModal: boolean = false;
  designationLoading: boolean = false;

  // Designation Sorting
  showDesignationSortDropdown = false;
  designationSortColumns = [
    { label: 'ID', value: 'designationId' },
    { label: 'Name', value: 'designationName' }
  ];
  designationSortColumn = 'designationName';
  designationSortDirection: 'asc' | 'desc' = 'asc';

  // Designation Pagination
  currentDesignationPage = 1;
  designationItemsPerPage = 10;
  totalDesignationPages = 1;
  totalDesignationPagesArray: number[] = [];

  constructor(private crudService: CrudService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadDesignations();
  }

  // ======== MODAL CONTROLS ========
  openDesignationModal(designation?: any) {
    this.showDesignationModal = true;
    if (designation) {
      this.isEditingDesignation = true; // Set editing flag
      this.designationModel = { ...designation };
    } else {
      this.isEditingDesignation = false; // Set editing flag
      this.designationModel = { designationId: '', designationName: '' }; // Reset for new entry
    }
    this.closeActionDropdown(); // Close any open action dropdown
  }

  closeDesignationModal() {
    this.showDesignationModal = false;
    this.designationModel = { designationId: '', designationName: '' }; // Reset model
    this.isEditingDesignation = false;
  }

  // ======== ACTION DROPDOWN CONTROLS ========
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (! (event.target as HTMLElement).closest('.action-dropdown-wrapper')) {
      this.closeActionDropdown();
    }
  }

  toggleActionDropdown(formType: 'designation', index: number, event: Event) {
    event.stopPropagation(); // Prevent document click from closing immediately
    if (this.showActionDropdown === formType && this.activeDropdownIndex === index) {
      this.closeActionDropdown();
    } else {
      this.closeActionDropdown(); // Close any other open dropdown
      this.showActionDropdown = formType;
      this.activeDropdownIndex = index;
    }
  }

  closeActionDropdown() {
    this.showActionDropdown = null;
    this.activeDropdownIndex = null;
  }

  // ========== DESIGNATIONS ==========
  loadDesignations() {
    this.designationLoading = true;
    this.crudService.getAllDesignations().subscribe({
      next: res => {
        this.designations = res;
        this.filteredDesignations = res;
        this.designationLoading = false;
        this.applyDesignationSorting();
        this.updateDesignationPagination();
      },
      error: err => {
        console.error(err);
        this.toastService.error('Failed to load designations.');
        this.designationLoading = false;
      }
    });
  }

  createDesignation() {
    this.designationLoading = true;
    if (this.designationModel.designationId && this.designations.some(designation => designation.designationId === this.designationModel.designationId)) {
      this.toastService.error('Designation with this ID already exists.');
      this.designationLoading = false;
      return;
    }

    this.crudService.createDesignation(this.designationModel).subscribe({
      next: () => {
        this.toastService.success('Designation created successfully!');
        this.closeDesignationModal(); // Use closeDesignationModal
        this.loadDesignations();
        this.designationLoading = false;
      },
      error: err => {
        console.error('Error creating designation:', err);
        this.toastService.error('Failed to create designation.');
        this.designationLoading = false;
      }
    });
  }

  updateDesignation() {
    this.designationLoading = true;
    this.crudService.updateDesignation(this.designationModel).subscribe({
      next: () => {
        this.toastService.success('Designation updated successfully!');
        this.closeDesignationModal(); // Use closeDesignationModal
        this.loadDesignations();
        this.designationLoading = false;
      },
      error: err => {
        console.error('Error updating designation:', err);
        this.toastService.error('Failed to update designation.');
        this.designationLoading = false;
      }
    });
  }

  deleteDesignation(id: number) {
    if (!confirm('Delete this designation?')) return;
    this.crudService.deleteDesignation(id).subscribe({
      next: () => {
        this.toastService.success('Designation deleted!');
        this.loadDesignations();
      },
      error: err => {
        console.error('Error deleting designation', err);
        this.toastService.error('Error deleting designation.');
      }
    });
  }

  // Designation Sorting
  toggleDesignationSortDropdown() { this.showDesignationSortDropdown = !this.showDesignationSortDropdown; }
  closeDesignationSortDropdown() { this.showDesignationSortDropdown = false; }

  setDesignationSortColumn(col: any) {
    this.designationSortColumn = col.value;
  }

  setDesignationSortDirection(dir: 'asc' | 'desc') {
    this.designationSortDirection = dir;
  }

  applyDesignationSorting() {
    if (!this.designationSortColumn) return;

    this.filteredDesignations.sort((a: any, b: any) => {
      let A = a[this.designationSortColumn];
      let B = b[this.designationSortColumn];

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.designationSortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.designationSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateDesignationPagination();
  }

  // Designation Pagination
  updateDesignationPagination() {
    this.totalDesignationPages = Math.ceil(this.filteredDesignations.length / this.designationItemsPerPage);
    this.totalDesignationPagesArray = Array.from({ length: this.totalDesignationPages }, (_, i) => i + 1);
    this.paginatedDesignations = this.filteredDesignations.slice(
      (this.currentDesignationPage - 1) * this.designationItemsPerPage,
      this.currentDesignationPage * this.designationItemsPerPage
    );
  }

  changeDesignationItemsPerPage() {
    this.currentDesignationPage = 1;
    this.updateDesignationPagination();
  }

  goToDesignationPage(page: number) {
    this.currentDesignationPage = page;
    this.updateDesignationPagination();
  }

  nextDesignationPage() {
    if (this.currentDesignationPage < this.totalDesignationPages) {
      this.currentDesignationPage++;
      this.updateDesignationPagination();
    }
  }

  prevDesignationPage() {
    if (this.currentDesignationPage > 1) {
      this.currentDesignationPage--;
      this.updateDesignationPagination();
    }
  }
}
