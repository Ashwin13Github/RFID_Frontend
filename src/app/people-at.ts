import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SignalRupdateService } from './signal-rupdate';
import { environment } from '../environments/environments';

export interface Person {
  uid: string;
  fullName: string;
  action: string;
  location: string;
  timestamp: string;
  designation: string;
  classOrDept: string;
}

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private baseUrl=environment.baseUrl
  //private baseUrl = 'http://rfid-app.runasp.net/api/Values/users-at-location';

  constructor(private http: HttpClient, private signalRService: SignalRupdateService) {}

  getPeopleAtLocation(location: string): Observable<Person[]> {
    const url = `${this.baseUrl}/api/Values/users-at-location?location=${encodeURIComponent(location)}`;
    console.log(' Fetching people at location:', url);
    return this.http.get<Person[]>(url).pipe(
      map(people => people.map(person => ({
        ...person,
        fullName: person.fullName || 'N/A' // Ensure fullname is always a string
      })))
      
    );
  }

  getPeopleUpdates(): Observable<Person[]> {
    return this.signalRService.newPeople$.pipe(
      map(people => people.map(person => ({
        ...person,
        fullName: person.fullName || 'N/A' // Ensure fullname is always a string
      })))
    );
}
}