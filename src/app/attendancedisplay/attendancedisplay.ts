import { Component, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChartOptions } from 'chart.js';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute
import { Subscription } from 'rxjs'; // Import Subscription

@Component({
  selector: 'app-attendance-display',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgChartsModule, HttpClientModule],
  templateUrl: './attendancedisplay.html',
  styleUrls: ['./attendancedisplay.css']
})
export class AttendanceDisplayComponent implements OnInit {

  // Properties for Overall Attendance (from original AttendanceDisplayComponent)
  dateControl = new FormControl('');
  overallPresentCount = 0;
  overallAbsentCount = 0;
  overallIsLoading: boolean = false;
  overallErrorMessage: string = '';

  overallPieChartData: any = {
    labels: ['Present', 'Absent'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28a745', '#dc3545'] }]
  };

  designationAttendance: { [key: string]: { total: number; present: number; absent: number } } = {};

  overallBarChartData: any = {
    labels: ['Present', 'Absent'],
    datasets: [{ label: 'Attendance Count', data: [0, 0], backgroundColor: ['#28a745', '#dc3545'] }]
  };

  // Properties for Class-wise Attendance (from ClassWiseAttendanceComponent)
  classControl = new FormControl('');
  classWiseDateControl = new FormControl(''); // New FormControl for class-wise date
  classWisePresentList: any[] = [];
  classWiseAbsentList: any[] = [];
  classWisePresentCount = 0;
  classWiseAbsentCount = 0;
  classWiseTotalStudents = 0;
  classWiseIsLoading: boolean = false;
  classWiseErrorMessage: string = '';

  classWisePieChartData: any = {
    labels: ['Present', 'Absent'],
    datasets: [{ data: [0, 0], backgroundColor: ['#28a745', '#dc3545'] }]
  };

  classWiseBarChartData: any = {
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

  selectedDesignation: string | null = null;
  filteredPresentUsers: any[] = [];
  filteredAbsentUsers: any[] = [];
  allPresentUsers: any[] = []; // Store all present users from API
  allAbsentUsers: any[] = [];  // Store all absent users from API
  showPopup: boolean = false; // Controls the visibility of the popup

  currentReportType: 'overall' | 'classwise' = 'overall'; // Default to overall
  private routeSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    const today = new Date();
    this.dateControl.setValue(today.toISOString().split('T')[0]);
    this.classWiseDateControl.setValue(today.toISOString().split('T')[0]);

    this.routeSubscription = this.route.queryParams.subscribe(params => {
      const type = params['type'];
      if (type === 'overall' || type === 'classwise') {
        this.currentReportType = type;
      }
      this.fetchData();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.overallErrorMessage = '';
    this.classWiseErrorMessage = '';

    const selectedDate = this.dateControl.value; // Date for overall attendance
    const className = this.classControl.value?.trim();
    const classWiseSelectedDate = this.classWiseDateControl.value; // Date for class-wise attendance

    if (this.currentReportType === 'overall') {
      // Fetch Overall Attendance Data
      if (!selectedDate) {
        this.overallErrorMessage = "Please select a date for overall attendance.";
        return;
      }
      this.overallIsLoading = true;
      const formattedDate = selectedDate.replace(/-/g, '/');
      const overallAttendanceUrl = `https://localhost:44372/api/PresentAbsentList?date=${formattedDate}`;

      this.http.get<any>(overallAttendanceUrl).subscribe({
        next: (overallRes) => {
          this.overallPresentCount = overallRes.summary?.presentCount || 0;
          this.overallAbsentCount = overallRes.summary?.absentCount || 0;
          this.allPresentUsers = overallRes.presentUsers || [];
          this.allAbsentUsers = overallRes.absentUsers || [];

          this.designationAttendance = {};
          overallRes.presentUsers?.forEach((user: any) => {
            const designation = user.designationName;
            if (!this.designationAttendance[designation]) {
              this.designationAttendance[designation] = { total: 0, present: 0, absent: 0 };
            }
            this.designationAttendance[designation].total++;
            this.designationAttendance[designation].present++;
          });
          overallRes.absentUsers?.forEach((user: any) => {
            const designation = user.designationName;
            if (!this.designationAttendance[designation]) {
              this.designationAttendance[designation] = { total: 0, present: 0, absent: 0 };
            }
            this.designationAttendance[designation].total++;
            this.designationAttendance[designation].absent++;
          });

          if (this.selectedDesignation) {
            this.onDesignationClick(this.selectedDesignation);
          } else {
            this.filteredPresentUsers = [];
            this.filteredAbsentUsers = [];
          }

          this.overallPieChartData = {
            labels: ['Present', 'Absent'],
            datasets: [{
              data: [this.overallPresentCount, this.overallAbsentCount],
              backgroundColor: ['#28a745', '#dc3545'],
              borderColor: ['#ffffff'],
              borderWidth: 2
            }]
          };

          this.overallBarChartData = {
            labels: ['Present', 'Absent'],
            datasets: [{
              label: 'Attendance Count',
              data: [this.overallPresentCount, this.overallAbsentCount],
              backgroundColor: ['#28a745', '#dc3545']
            }]
          };
          this.overallIsLoading = false;
        },
        error: (err) => {
          console.error("Error fetching overall attendance data:", err);
          this.overallErrorMessage = "Failed to fetch overall attendance data.";
          this.overallIsLoading = false;
        }
      });
    } else if (this.currentReportType === 'classwise') {
      // Fetch Class-wise Attendance Data
      if (!className || !classWiseSelectedDate) {
        this.classWiseErrorMessage = "Please enter class name and select a date for class-wise attendance.";
        return;
      }
      this.classWiseIsLoading = true;
      const formattedClassWiseDate = classWiseSelectedDate.replace(/-/g, '/');
      const classWiseAttendanceUrl = `https://localhost:44372/api/ClassWiseAttendance/class-presence?tableName=${className}&date=${formattedClassWiseDate}`;

      this.http.get<any>(classWiseAttendanceUrl).subscribe({
        next: (classWiseRes) => {
          this.classWisePresentCount = classWiseRes.summary?.presentCount || 0;
          this.classWiseAbsentCount = classWiseRes.summary?.absentCount || 0;
          this.classWiseTotalStudents = classWiseRes.summary?.totalStudents || (this.classWisePresentCount + this.classWiseAbsentCount);
          this.classWisePresentList = classWiseRes.presentList || [];
          this.classWiseAbsentList = classWiseRes.absentList || [];

          this.classWisePieChartData = {
            labels: ['Present', 'Absent'],
            datasets: [{
              data: [this.classWisePresentCount, this.classWiseAbsentCount],
              backgroundColor: ['#28a745', '#dc3545'],
              borderColor: ['#ffffff'],
              borderWidth: 2
            }]
          };

          this.classWiseBarChartData = {
            labels: ['Present', 'Absent'],
            datasets: [{
              label: 'Attendance Count',
              data: [this.classWisePresentCount, this.classWiseAbsentCount],
              backgroundColor: ['#28a745', '#dc3545']
            }]
          };
          this.classWiseIsLoading = false;
        },
        error: (err) => {
          console.error("Error fetching class-wise attendance data:", err);
          this.classWiseErrorMessage = "Failed to fetch class-wise attendance data.";
          this.classWiseIsLoading = false;
        }
      });
    }
  }

  onDesignationClick(designation: string) {
    this.selectedDesignation = designation;
    this.filteredPresentUsers = this.allPresentUsers.filter(
      (user: any) => user.designationName === designation
    );
    this.filteredAbsentUsers = this.allAbsentUsers.filter(
      (user: any) => user.designationName === designation
    );
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.selectedDesignation = null;
  }
}
