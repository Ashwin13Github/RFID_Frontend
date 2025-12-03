import { Component, OnInit, HostListener } from '@angular/core';
import { CrudService } from '../crud-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  activeTab: string = 'user'; // Initialize activeTab
  activeSubTab: string = 'user'; // Initialize activeSubTab

  // Common properties for pagination
  pageSizes = [5, 10, 20, 50, 100];

  // Side panel and dropdown states
  showSidePanel: boolean = false;
  activeSidePanelForm: 'user' | 'useruid' | 'designation-details' | null = null;
  isEditing: boolean = false;
  showActionDropdown: 'user' | 'useruid' | 'designation-details' | null = null;
  activeDropdownIndex: number | null = null;

  // User properties
  users: any[] = [];
  filteredUsers: any[] = [];
  paginatedUsers: any[] = [];
  userModel: any = {
    userId: '',
    fullName: '',
    address: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    designationId: ''
  };
  isEditingUser: boolean = false;
  showUserModal: boolean = false;
  userLoading: boolean = false;

  // User Sorting
  showUserSortDropdown = false;
  userSortColumns = [
    { label: 'ID', value: 'userId' },
    { label: 'Full Name', value: 'fullName' },
    { label: 'Phone', value: 'phoneNumber' },
    { label: 'Gender', value: 'gender' },
    { label: 'Designation ID', value: 'designationId' }
  ];
  userSortColumn = 'fullName';
  userSortDirection: 'asc' | 'desc' = 'asc';

  // User Pagination
  currentUserPage = 1;
  userItemsPerPage = 10;
  totalUserPages = 1;
  totalUserPagesArray: number[] = [];

  // Add User and UID properties
  showAddUserAndUIDModal: boolean = false;
  newUserAndUIDModel: any = {
    fullName: '',
    address: '',
    phoneNumber: '',
    gender: '',
    dateOfBirth: '',
    designationId: '',
    uid: '',
    userId: '' // Add userId property
  };
  newUserAndUIDLoading: boolean = false;

  // User UID properties
  userUIDs: any[] = [];
  filteredUserUIDs: any[] = [];
  paginatedUserUIDs: any[] = [];
  userUIDModel: any = { uid: '', userId: '', assignedDate: '' };
  isEditingUserUID: boolean = false;
  showUserUIDModal: boolean = false;
  userUIDLoading: boolean = false;

  // User UID Sorting
  showUserUIDSortDropdown = false;
  userUIDSortColumns = [
    { label: 'UID', value: 'uid' },
    { label: 'User ID', value: 'userId' },
    { label: 'Assigned Date', value: 'assignedDate' }
  ];
  userUIDSortColumn = 'assignedDate';
  userUIDSortDirection: 'asc' | 'desc' = 'desc'; // Default to descending for most recent first

  // User UID Pagination
  currentUserUIDPage = 1;
  userUIDItemsPerPage = 10;
  totalUserUIDPages = 1;
  totalUserUIDPagesArray: number[] = [];

  // Designation Details properties
  designationDetails: any[] = [];
  filteredDesignationDetails: any[] = [];
  paginatedDesignationDetails: any[] = [];
  designationDetailModel: any = { designationId: '', designationName: '' };
  isEditingDesignationDetail: boolean = false;
  showDesignationDetailModal: boolean = false;
  designationDetailLoading: boolean = false;

  // Designation Details Sorting
  showDesignationDetailSortDropdown = false;
  designationDetailSortColumns = [
    { label: 'Designation ID', value: 'designationId' },
    { label: 'Designation Name', value: 'designationName' }
  ];
  designationDetailSortColumn = 'designationName';
  designationDetailSortDirection: 'asc' | 'desc' = 'asc';

  // Designation Details Pagination
  currentDesignationDetailPage = 1;
  designationDetailItemsPerPage = 10;
  totalDesignationDetailPages = 1;
  totalDesignationDetailPagesArray: number[] = [];


  constructor(private crudService: CrudService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadUserUIDs();
    this.loadDesignationDetails();
  }

  // ======== MODAL CONTROLS ========
  openUserModal(user?: any) {
    this.closeActionDropdown(); // Close any open action dropdown
    this.showUserModal = true;
    if (user) {
      this.isEditingUser = true; // Set editing flag
      this.userModel = { ...user };
    } else {
      this.isEditingUser = false; // Set editing flag
      this.userModel = {
        userId: '',
        fullName: '',
        address: '',
        phoneNumber: '',
        gender: '',
        dateOfBirth: '',
        designationId: ''
      }; // Reset for new entry
    }
  }

  closeUserModal() {
    this.showUserModal = false;
    this.userModel = {
      userId: '',
      fullName: '',
      address: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      designationId: ''
    };
    this.isEditingUser = false;
  }

  openUserUIDModal(userUID?: any) {
    this.closeActionDropdown(); // Close any open action dropdown
    this.showUserUIDModal = true;
    if (userUID) {
      this.isEditingUserUID = true; // Set editing flag
      this.userUIDModel = { ...userUID };
    } else {
      this.isEditingUserUID = false; // Set editing flag
      this.userUIDModel = { uid: '', userId: '', assignedDate: '' }; // Reset for new entry
    }
  }

  closeUserUIDModal() {
    this.showUserUIDModal = false;
    this.userUIDModel = { uid: '', userId: '', assignedDate: '' };
    this.isEditingUserUID = false;
  }

  openAddUserAndUIDModal() {
    this.showAddUserAndUIDModal = true;
    this.newUserAndUIDModel = {
      fullName: '',
      address: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      designationId: '',
      uid: '',
      userId: ''
    };
    this.closeActionDropdown(); // Close any open action dropdown
  }

  closeAddUserAndUIDModal() {
    this.showAddUserAndUIDModal = false;
    this.newUserAndUIDModel = {
      fullName: '',
      address: '',
      phoneNumber: '',
      gender: '',
      dateOfBirth: '',
      designationId: '',
      uid: '',
      userId: ''
    };
    this.closeActionDropdown();
  }

  createNewUserAndUID() {
    this.newUserAndUIDLoading = true;
    const newUser = {
      fullName: this.newUserAndUIDModel.fullName,
      address: this.newUserAndUIDModel.address,
      phoneNumber: this.newUserAndUIDModel.phoneNumber,
      gender: this.newUserAndUIDModel.gender,
      dateOfBirth: this.newUserAndUIDModel.dateOfBirth,
      designationId: this.newUserAndUIDModel.designationId,
      userId: this.newUserAndUIDModel.userId // Include userId here
    };

    const newUserUID = {
      uid: this.newUserAndUIDModel.uid,
      userId: this.newUserAndUIDModel.userId, // Use userId from model directly
      assignedDate: new Date().toISOString().split('T')[0]
    };

    // Basic validation
    if (!newUser.fullName || !newUser.phoneNumber || !newUserUID.uid || !newUser.userId) {
      this.toastService.error('User ID, Full Name, Phone Number, and UID are required.');
      this.newUserAndUIDLoading = false;
      return;
    }

    this.crudService.createUser(newUser).subscribe({
      next: (userResponse: any) => {
        this.toastService.success('User created successfully!');
        // newUserUID.userId = userResponse.userId; // No longer needed as userId is already in model

        this.crudService.createUserUID(newUserUID).subscribe({
          next: () => {
            this.toastService.success('User UID created successfully!');
            this.closeAddUserAndUIDModal();
            this.loadUsers();
            this.loadUserUIDs();
            this.newUserAndUIDLoading = false;
          },
          error: (err: any) => {
            console.error('Error creating user UID:', err);
            this.toastService.error('Failed to create user UID.');
            this.newUserAndUIDLoading = false;
            // Optionally, delete the created user if UID creation fails
            this.crudService.deleteUser(userResponse.userId).subscribe();
          }
        });
      },
      error: (err: any) => {
        console.error('Error creating user:', err);
        this.toastService.error('Failed to create user.');
        this.newUserAndUIDLoading = false;
      }
    });
  }

  // ======== ACTION DROPDOWN CONTROLS ========
  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (! (event.target as HTMLElement).closest('.action-dropdown-wrapper')) {
      this.closeActionDropdown();
    }
  }

  toggleActionDropdown(formType: 'user' | 'useruid' | 'designation-details', index: number, event: Event) {
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

  // ========== USERS ==========
  loadUsers() {
    this.userLoading = true;
    this.crudService.getAllUsers().subscribe({
      next: (res: any[]) => {
        this.users = res;
        this.filteredUsers = res;
        this.userLoading = false;
        this.applyUserSorting();
        this.updateUserPagination();
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error('Failed to load users.');
        this.userLoading = false;
      }
    });
  }

  createUser() {
    this.userLoading = true;
    if (this.userModel.userId && this.users.some(user => user.userId === this.userModel.userId)) {
      this.toastService.error('User with this ID already exists.');
      this.userLoading = false;
      return;
    }

    this.crudService.createUser(this.userModel).subscribe({
      next: () => {
        this.toastService.success('User created successfully!');
        this.closeUserModal(); // Use closeUserModal
        this.loadUsers();
        this.userLoading = false;
      },
      error: (err: any) => {
        console.error('Error creating user:', err);
        this.toastService.error('Failed to create user.');
        this.userLoading = false;
      }
    });
  }

  updateUser() {
    this.userLoading = true;
    this.crudService.updateUser(this.userModel).subscribe({
      next: () => {
        this.toastService.success('User updated successfully!');
        this.closeUserModal(); // Use closeUserModal
        this.loadUsers();
        this.userLoading = false;
      },
      error: (err: any) => {
        console.error('Error updating user', err);
        this.toastService.error('Failed to update user.');
        this.userLoading = false;
      }
    });
  }

  deleteUser(id: number) {
    if (!confirm('Delete this user?')) return;
    this.crudService.deleteUser(id).subscribe({
      next: () => {
        this.toastService.success('User deleted!');
        this.loadUsers();
      },
      error: (err: any) => {
        console.error('Error deleting user', err);
        this.toastService.error('Error deleting user.');
      }
    });
  }

  // User Sorting
  toggleUserSortDropdown() { this.showUserSortDropdown = !this.showUserSortDropdown; }
  closeUserSortDropdown() { this.showUserSortDropdown = false; }

  setUserSortColumn(col: any) {
    this.userSortColumn = col.value;
  }

  setUserSortDirection(dir: 'asc' | 'desc') {
    this.userSortDirection = dir;
  }

  applyUserSorting() {
    if (!this.userSortColumn) return;

    this.filteredUsers.sort((a: any, b: any) => {
      let A = a[this.userSortColumn];
      let B = b[this.userSortColumn];

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.userSortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.userSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateUserPagination();
  }

  // User Pagination
  updateUserPagination() {
    this.totalUserPages = Math.ceil(this.filteredUsers.length / this.userItemsPerPage);
    this.totalUserPagesArray = Array.from({ length: this.totalUserPages }, (_, i) => i + 1);
    this.paginatedUsers = this.filteredUsers.slice(
      (this.currentUserPage - 1) * this.userItemsPerPage,
      this.currentUserPage * this.userItemsPerPage
    );
  }

  changeUserItemsPerPage() {
    this.currentUserPage = 1;
    this.updateUserPagination();
  }

  goToUserPage(page: number) {
    this.currentUserPage = page;
    this.updateUserPagination();
  }

  nextUserPage() {
    if (this.currentUserPage < this.totalUserPages) {
      this.currentUserPage++;
      this.updateUserPagination();
    }
  }

  prevUserPage() {
    if (this.currentUserPage > 1) {
      this.currentUserPage--;
      this.updateUserPagination();
    }
  }

  // ========== USER UIDs ==========
  loadUserUIDs() {
    this.userUIDLoading = true;
    this.crudService.getAllUserUIDs().subscribe({
      next: (res: any[]) => {
        this.userUIDs = res;
        this.filteredUserUIDs = res;
        this.userUIDLoading = false;
        this.applyUserUIDSorting();
        this.updateUserUIDPagination();
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error('Failed to load user UIDs.');
        this.userUIDLoading = false;
      }
    });
  }

  createUserUID() {
    this.userUIDLoading = true;
    if (this.userUIDModel.uid && this.userUIDs.some(userUID => userUID.uid === this.userUIDModel.uid)) {
      this.toastService.error('User UID with this ID already exists.');
      this.userUIDLoading = false;
      return;
    }

    this.crudService.createUserUID(this.userUIDModel).subscribe({
      next: () => {
        this.toastService.success('User UID created successfully!');
        this.closeUserUIDModal(); // Use closeUserUIDModal
        this.loadUserUIDs();
        this.userUIDLoading = false;
      },
      error: (err: any) => {
        console.error('Error creating user UID:', err);
        this.toastService.error('Failed to create user UID.');
        this.userUIDLoading = false;
      }
    });
  }

  updateUserUID() {
    this.userUIDLoading = true;
    this.crudService.updateUserUID(this.userUIDModel).subscribe({
      next: () => {
        this.toastService.success('User UID updated successfully!');
        this.closeUserUIDModal(); // Use closeUserUIDModal
        this.loadUserUIDs();
        this.userUIDLoading = false;
      },
      error: (err: any) => {
        console.error('Error updating user UID', err);
        this.toastService.error('Failed to update user UID.');
        this.userUIDLoading = false;
      }
    });
  }

  deleteUserUID(uid: string) {
    if (!confirm('Delete this UID?')) return;
    this.crudService.deleteUserUID(uid).subscribe({
      next: () => {
        this.toastService.success('UID deleted!');
        this.loadUserUIDs();
      },
      error: (err: any) => {
        console.error('Error deleting UID', err);
        this.toastService.error('Error deleting UID.');
      }
    });
  }

  // User UID Sorting
  toggleUserUIDSortDropdown() { this.showUserUIDSortDropdown = !this.showUserUIDSortDropdown; }
  closeUserUIDSortDropdown() { this.showUserUIDSortDropdown = false; }

  setUserUIDSortColumn(col: any) {
    this.userUIDSortColumn = col.value;
  }

  setUserUIDSortDirection(dir: 'asc' | 'desc') {
    this.userUIDSortDirection = dir;
  }

  applyUserUIDSorting() {
    if (!this.userUIDSortColumn) return;

    this.filteredUserUIDs.sort((a: any, b: any) => {
      let A = a[this.userUIDSortColumn];
      let B = b[this.userUIDSortColumn];

      if (this.userUIDSortColumn === 'assignedDate') {
        A = new Date(A).getTime();
        B = new Date(B).getTime();
      }

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.userUIDSortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.userUIDSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateUserUIDPagination();
  }

  // User UID Pagination
  updateUserUIDPagination() {
    this.totalUserUIDPages = Math.ceil(this.filteredUserUIDs.length / this.userUIDItemsPerPage);
    this.totalUserUIDPagesArray = Array.from({ length: this.totalUserUIDPages }, (_, i) => i + 1);
    this.paginatedUserUIDs = this.filteredUserUIDs.slice(
      (this.currentUserUIDPage - 1) * this.userUIDItemsPerPage,
      this.currentUserUIDPage * this.userUIDItemsPerPage
    );
  }

  changeUserUIDItemsPerPage() {
    this.currentUserUIDPage = 1;
    this.updateUserUIDPagination();
  }

  goToUserUIDPage(page: number) {
    this.currentUserUIDPage = page;
    this.updateUserUIDPagination();
  }

  nextUserUIDPage() {
    if (this.currentUserUIDPage < this.totalUserUIDPages) {
      this.currentUserUIDPage++;
      this.updateUserUIDPagination();
    }
  }

  prevUserUIDPage() {
    if (this.currentUserUIDPage > 1) {
      this.currentUserUIDPage--;
      this.updateUserUIDPagination();
    }
  }

  // ========== Designation Details ==========
  loadDesignationDetails() {
    this.designationDetailLoading = true;
    this.crudService.getAllDesignations().subscribe({
      next: (res: any[]) => {
        this.designationDetails = res;
        this.filteredDesignationDetails = res;
        this.designationDetailLoading = false;
        this.applyDesignationDetailSorting();
        this.updateDesignationDetailPagination();
      },
      error: (err: any) => {
        console.error(err);
        this.toastService.error('Failed to load designation details.');
        this.designationDetailLoading = false;
      }
    });
  }

  createDesignation() {
    this.designationDetailLoading = true;
    if (this.designationDetailModel.designationId && this.designationDetails.some(detail => detail.designationId === this.designationDetailModel.designationId)) {
      this.toastService.error('Designation with this ID already exists.');
      this.designationDetailLoading = false;
      return;
    }

    this.crudService.createDesignation(this.designationDetailModel).subscribe({
      next: () => {
        this.toastService.success('Designation detail created successfully!');
        this.closeDesignationDetailModal();
        this.loadDesignationDetails();
        this.designationDetailLoading = false;
      },
      error: err => {
        console.error('Error creating designation detail:', err);
        this.toastService.error('Failed to create designation detail.');
        this.designationDetailLoading = false;
      }
    });
  }

  updateDesignation() {
    this.designationDetailLoading = true;
    this.crudService.updateDesignation(this.designationDetailModel).subscribe({
      next: () => {
        this.toastService.success('Designation detail updated successfully!');
        this.closeDesignationDetailModal();
        this.loadDesignationDetails();
        this.designationDetailLoading = false;
      },
      error: (err: any) => {
        console.error('Error updating designation detail', err);
        this.toastService.error('Failed to update designation detail.');
        this.designationDetailLoading = false;
      }
    });
  }

  deleteDesignation(designationId: number) {
    if (!confirm('Delete this designation detail?')) return;
    this.crudService.deleteDesignation(+designationId).subscribe({
      next: () => {
        this.toastService.success('Designation detail deleted!');
        this.loadDesignationDetails();
      },
      error: (err: any) => {
        console.error('Error deleting designation detail', err);
        this.toastService.error('Error deleting designation detail.');
      }
    });
  }

  // Designation Details Sorting
  toggleDesignationDetailSortDropdown() { this.showDesignationDetailSortDropdown = !this.showDesignationDetailSortDropdown; }
  closeDesignationDetailSortDropdown() { this.showDesignationDetailSortDropdown = false; }

  setDesignationDetailSortColumn(col: any) {
    this.designationDetailSortColumn = col.value;
  }

  setDesignationDetailSortDirection(dir: 'asc' | 'desc') {
    this.designationDetailSortDirection = dir;
  }

  applyDesignationDetailSorting() {
    if (!this.designationDetailSortColumn) return;

    this.filteredDesignationDetails.sort((a: any, b: any) => {
      let A = a[this.designationDetailSortColumn];
      let B = b[this.designationDetailSortColumn];

      if (typeof A === 'string') A = A.toLowerCase();
      if (typeof B === 'string') B = B.toLowerCase();

      if (A < B) return this.designationDetailSortDirection === 'asc' ? -1 : 1;
      if (A > B) return this.designationDetailSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updateDesignationDetailPagination();
  }

  // Designation Details Pagination
  updateDesignationDetailPagination() {
    this.totalDesignationDetailPages = Math.ceil(this.filteredDesignationDetails.length / this.designationDetailItemsPerPage);
    this.totalDesignationDetailPagesArray = Array.from({ length: this.totalDesignationDetailPages }, (_, i) => i + 1);
    this.paginatedDesignationDetails = this.filteredDesignationDetails.slice(
      (this.currentDesignationDetailPage - 1) * this.designationDetailItemsPerPage,
      this.currentDesignationDetailPage * this.designationDetailItemsPerPage
    );
  }

  changeDesignationDetailItemsPerPage() {
    this.currentDesignationDetailPage = 1;
    this.updateDesignationDetailPagination();
  }

  goToDesignationDetailPage(page: number) {
    this.currentDesignationDetailPage = page;
    this.updateDesignationDetailPagination();
  }

  nextDesignationDetailPage() {
    if (this.currentDesignationDetailPage < this.totalDesignationDetailPages) {
      this.currentDesignationDetailPage++;
      this.updateDesignationDetailPagination();
    }
  }

  prevDesignationDetailPage() {
    if (this.currentDesignationDetailPage > 1) {
      this.currentDesignationDetailPage--;
      this.updateDesignationDetailPagination();
    }
  }

  openDesignationDetailModal(detail?: any) {
    this.closeActionDropdown(); // Close any open action dropdown
    this.isEditingDesignationDetail = !!detail;
    if (detail) {
      this.designationDetailModel = { ...detail };
    } else {
      this.designationDetailModel = { designationId: '', designationName: '' };
    }
    this.showDesignationDetailModal = true;
  }

  closeDesignationDetailModal() {
    this.showDesignationDetailModal = false;
    this.designationDetailModel = { designationId: '', designationName: '' };
    this.isEditingDesignationDetail = false;
  }
}
