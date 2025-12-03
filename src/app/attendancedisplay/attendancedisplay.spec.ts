import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgChartsModule } from 'ng2-charts';
import { ChartType } from 'chart.js';

@Component({
  selector: 'app-present-absent',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './attendancedisplay.html',
  styleUrls: ['./attendancedisplay.css']
})
export class PresentAbsentComponent {

  dateControl = new FormControl(new Date());

  pieChartLabels = ['Present', 'Absent'];
  pieChartData = [10, 5];
  pieChartType: ChartType = 'pie';

  barChartLabels = ['Present', 'Absent'];
  barChartData = [{ data: [10, 5], label: 'Attendance' }];
  barChartType: ChartType = 'bar';

}
