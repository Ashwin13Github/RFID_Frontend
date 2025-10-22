import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PeopleService, Person } from '../people-at';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-people-at-location',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './people-at.html',
  styleUrls: ['./people-at.css'],
})
export class PeopleAtLocationComponent implements OnInit, OnDestroy {
  people: Person[] = [];
  location: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  // Added locations array for dropdown
  locations: string[] = ['Entrance', 'Lobby', 'Cafeteria', 'Office', 'Meet'];

  private peopleUpdateSubscription!: Subscription;

  constructor(private peopleService: PeopleService) {}

  ngOnInit(): void {
    // Subscribe to real-time people updates
    this.peopleUpdateSubscription = this.peopleService.getPeopleUpdates().subscribe((updatedPeople: Person[]) => {
      // Update people list if the current location matches
      if (this.location && updatedPeople.some(p => p.location === this.location)) {
        this.people = updatedPeople.filter(p => p.location === this.location);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.peopleUpdateSubscription) {
      this.peopleUpdateSubscription.unsubscribe();
    }
  }

  onLocationSubmit(): void {
    if (!this.location.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.people = [];

    this.peopleService.getPeopleAtLocation(this.location).subscribe({
      next: (data) => {
        this.people = data;
        this.isLoading = false;
        if (this.people.length === 0) {
          this.errorMessage = `No people found at ${this.location}.`;
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No one is at this location';
        this.isLoading = false;
      },
    });
  }
}
