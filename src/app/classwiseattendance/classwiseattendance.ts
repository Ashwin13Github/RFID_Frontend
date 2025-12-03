import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-classwise-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './classwiseattendance.html',
  styleUrls: ['./classwiseattendance.css']
})
export class ClassWiseAttendanceComponent {

  classControl = new FormControl('');
  dateControl = new FormControl('');

  presentList: any[] = [];
  absentList: any[] = [];

  presentCount = 0;
  absentCount = 0;
  totalStudents = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  pieChartData: any = {
    labels: ['Present', 'Absent'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28a745', '#dc3545'] }]
  };

  barChartData: any = {
    labels: ['Present', 'Absent'],
    datasets: [{
      label: 'Attendance Count',
      data: [0, 0],
      backgroundColor: ['#28a745', '#dc3545']
    }]
  };

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private http: HttpClient) {}

  fetchData() {
    const className = this.classControl.value?.trim();
    const selectedDate = this.dateControl.value;

    this.errorMessage = '';
    if (!className || !selectedDate) {
      this.errorMessage = "Please enter class name and date.";
      return;
    }

    this.isLoading = true;
    this.presentCount = 0;
    this.absentCount = 0;
    this.totalStudents = 0;
    this.presentList = [];
    this.absentList = [];

    const formattedDate = selectedDate.replace(/-/g, "/");
    const api = `https://localhost:44372/api/ClassWiseAttendance/class-presence?tableName=${className}&date=${formattedDate}`;

    this.http.get<any>(api).subscribe({
      next: (res) => {
        console.log("API response:", res);

        // Summary Counts
        this.presentCount = res.summary?.presentCount || 0;
        this.absentCount = res.summary?.absentCount || 0;
        this.totalStudents = res.summary?.totalStudents || (this.presentCount + this.absentCount);

        // Lists
        this.presentList = res.presentList || [];
        this.absentList = res.absentList || [];

        // PIE chart update
        this.pieChartData = {
          labels: ['Present', 'Absent'],
          datasets: [{
            data: [this.presentCount, this.absentCount],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#ffffff'],
            borderWidth: 2
          }]
        };

        // BAR chart update
        this.barChartData = {
          labels: ['Present', 'Absent'],
          datasets: [{
            label: 'Attendance Count',
            data: [this.presentCount, this.absentCount],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        };
        this.isLoading = false;
      },

      error: (err) => {
        console.error("Error fetching attendance:", err);
        this.errorMessage = "Failed to load attendance data. Please check the class name and date.";
        this.isLoading = false;
      }
    });
  }
}
