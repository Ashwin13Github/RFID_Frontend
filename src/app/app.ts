import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { SignalRupdateService } from './signal-rupdate';
import { AuthService } from './auth-service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AngularToastifyModule, ToastService } from 'angular-toastify';
import { SettingsService, UserDetails } from './settings/settings'; // Corrected path and imported UserDetails

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule, AngularToastifyModule],
  providers: [ToastService, SettingsService],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  showNavbar = true; // New property to control navbar visibility
  showSidebar = false; // New property to control sidebar visibility
  showReportsSubMenu = false; // New property to control Reports sub-menu visibility
  showLogsSubMenu = false; // New property to control Logs sub-menu visibility
  showUserDetailsSubMenu = false; // New property to control User Details sub-menu visibility
  applyMainContentMargin = true; // New property to control main content margin
  showProfileDropdown = false; // New property for profile dropdown visibility
  userDetails: UserDetails | undefined; // To store user details

  constructor(
    private signalRService: SignalRupdateService,
    private authService: AuthService,
    private router: Router,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    // Start SignalR connection
    this.signalRService.startConnection();

    // Initial check
    this.isLoggedIn = !!this.authService.getToken();
    this.showNavbar = this.router.url !== '/login'; // Initialize showNavbar based on current URL
    this.applyMainContentMargin = this.router.url !== '/login' && this.isLoggedIn; // Initialize applyMainContentMargin

    // Subscribe to login/logout changes
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      // Update showNavbar again in case user logs out/in while on a non-login page
      this.showNavbar = this.router.url !== '/login' && this.isLoggedIn;
      this.applyMainContentMargin = this.router.url !== '/login' && this.isLoggedIn; // Update applyMainContentMargin
    });

    // Subscribe to router events to control navbar visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.showNavbar = event.urlAfterRedirects !== '/login' && this.isLoggedIn;
      this.applyMainContentMargin = event.urlAfterRedirects !== '/login' && this.isLoggedIn; // Update applyMainContentMargin
    });
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  toggleProfileDropdown(): void {
    this.showProfileDropdown = !this.showProfileDropdown;
    if (this.showProfileDropdown && !this.userDetails) {
      this.settingsService.getUserDetails().subscribe(
        (data: UserDetails) => {
          this.userDetails = data;
        },
        (error: any) => { // Explicitly typed error as any
          console.error('Error fetching user details', error);
          // Handle error, e.g., show a toast notification
        }
      );
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.showProfileDropdown = false; // Close dropdown on logout
  }

  toggleReportsSubMenu(): void {
    this.showReportsSubMenu = !this.showReportsSubMenu;
  }

  toggleLogsSubMenu(): void {
    this.showLogsSubMenu = !this.showLogsSubMenu;
  }

  toggleUserDetailsSubMenu(): void {
    this.showUserDetailsSubMenu = !this.showUserDetailsSubMenu;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
