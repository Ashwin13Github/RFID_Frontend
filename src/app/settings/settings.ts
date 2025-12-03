import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Import CommonModule


// ===============================
// INTERFACES (Included in same file)
// ===============================
export interface ChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface OtpRequest {
  email: string;
}

export interface OtpVerify {
  email: string;
  otp: string;
  newPassword: string;
}

export interface UserDetails {
  id: string; // Maps to userId from API
  fullName: string;
  email: string;
  designationName: string;
  dateOfBirth: string; // Assuming string format for date
}


// ===============================
// SERVICE (Included in same file)
// ===============================
@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private baseUrl = "http://localhost:44372/api/Auth";

  constructor(private http: HttpClient) {}

  changePassword(model: ChangePassword) {
    return this.http.post(`${this.baseUrl}/ChangePassword`, model);
  }

  requestOtp(model: OtpRequest) {
    return this.http.post(`${this.baseUrl}/RequestOtp`, model);
  }

  verifyOtp(model: OtpVerify) {
    return this.http.post(`${this.baseUrl}/VerifyOtp`, model);
  }

  getUserDetails() {
    return this.http.get<UserDetails>(`https://localhost:44372/api/Auth/me`);
  }
}


// ===============================
// COMPONENT (Included in same file)
// ===============================
@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrls: ['./settings.css'],
  standalone: true,
  imports: [FormsModule, CommonModule] // Add CommonModule here
})
export class SettingsComponent {

  changePwd: ChangePassword = { currentPassword: '', newPassword: '' };
  otpRequest: OtpRequest = { email: '' };
  otpVerify: OtpVerify = { email: '', otp: '', newPassword: '' };
  userDetails: UserDetails | null = null; // New property to store user details

  constructor(private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.fetchUserDetails();
  }

  fetchUserDetails() {
    this.settingsService.getUserDetails().subscribe({
      next: (data: any) => {
        this.userDetails = {
          id: data.userId.toString(), // Map userId to id
          fullName: data.fullName,
          email: data.email,
          designationName: data.designationName,
          dateOfBirth: data.dateOfBirth
        };
        console.log('User Details:', this.userDetails);
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        // Handle error, e.g., show a toast message
      }
    });
  }

  changePassword() {
    this.settingsService.changePassword(this.changePwd).subscribe({
      next: () => alert("Password changed successfully"),
      error: err => alert(err.error || "Error changing password")
    });
  }

  requestOtp() {
    this.settingsService.requestOtp(this.otpRequest).subscribe({
      next: () => alert("OTP sent to your email"),
      error: err => alert(err.error || "Error sending OTP")
    });
  }

  verifyOtp() {
    this.settingsService.verifyOtp(this.otpVerify).subscribe({
      next: () => alert("Password reset successfully"),
      error: err => alert(err.error || "Error verifying OTP")
    });
  }
}
