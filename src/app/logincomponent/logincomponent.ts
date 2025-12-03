// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { AuthService } from '../auth-service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './logincomponent.html',
//   styleUrls: ['./logincomponent.css']
// })
// export class LoginComponent {
//   email: string = '';
//   password: string = '';
//   errorMessage: string = '';

//   constructor(private authService: AuthService, private router: Router) {}

//   onSubmit() {
//     this.errorMessage = '';
//     this.authService.login(this.email, this.password).subscribe({
//       next: (res) => {
//         // Navigate based on designation
//         this.router.navigate(['/Home']);
//       },
//       error: (err) => {
//         this.errorMessage = err.error?.message || 'Login failed. Please try again.';
//       }
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './logincomponent.html',
  styleUrls: ['./logincomponent.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter valid email & password.';
      return;
    }

    const { email, password, remember } = this.loginForm.value;

    this.authService.login(email, password, remember).subscribe({
      next: user => {
        if (user) {
          this.router.navigate(['/Home']);
        }
      },
      error: err => {
        this.errorMessage = 'Invalid credentials';
      }
    });
  }
}
