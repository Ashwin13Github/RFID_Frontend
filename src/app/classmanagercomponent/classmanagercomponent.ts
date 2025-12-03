import { Component, Injectable } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ClassWiseAttendanceService {

  private createClassUrl = "https://localhost:44372/api/ClassWiseAttendance/create-class";
  private insertStudentUrl = "https://localhost:44372/api/ClassWiseAttendance/insert-student";

  constructor(private http: HttpClient) {}

  createClass(tableName: string) {
    const body = { tableName };
    return this.http.post(this.createClassUrl, body);
  }

  insertStudent(tableName: string, userId: number, rollNo: number) {
    const body = { tableName, userId, rollNo };
    return this.http.post(this.insertStudentUrl, body);
  }
}

@Component({
  selector: 'app-class-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './classmanagercomponent.html',
  styleUrls: ['./classmanagercomponent.css']
})
export class ClassManagerComponent {

  // Create Class Form
  className = new FormControl('');

  // Insert Student Form
  insertClassName = new FormControl('');
  userId = new FormControl('');
  rollNo = new FormControl('');

  message = "";
  errorMessage = '';
  isLoading = false;

  constructor(private service: ClassWiseAttendanceService) {}

  // -------------------------
  // CREATE CLASS
  // -------------------------
  createClass() {
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const tableName = this.className.value?.trim();

    if (!tableName) {
      this.errorMessage = "Class name is required";
      this.isLoading = false;
      return;
    }

    this.service.createClass(tableName).subscribe({
      next: (res: any) => {
        this.message = res;
        this.isLoading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = "Error creating class";
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }

  // -------------------------
  // INSERT STUDENT
  // -------------------------
  insertStudent() {
    this.isLoading = true;
    this.message = '';
    this.errorMessage = '';

    const tableName = this.insertClassName.value?.trim();
    const userId = Number(this.userId.value);
    const rollNo = Number(this.rollNo.value);

    if (!tableName || isNaN(userId) || isNaN(rollNo)) {
      this.errorMessage = "All insert student fields are required and must be valid numbers";
      this.isLoading = false;
      return;
    }

    const body = { tableName, userId, rollNo };
    this.service.insertStudent(tableName, userId, rollNo).subscribe({
      next: (res: any) => {
        this.message = res;
        this.isLoading = false;
        setTimeout(() => this.message = '', 3000);
      },
      error: (err: any) => {
        console.error(err);
        this.errorMessage = "Error inserting student";
        this.isLoading = false;
        setTimeout(() => this.errorMessage = '', 3000);
      }
    });
  }
}
