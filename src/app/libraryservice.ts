// 📌 library.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// 🌐 Your backend base URL
const API_URL = 'https://localhost:44372/api/Library';


// ==========================================================
// 📌 MODELS
// ==========================================================

// Issue Book
export interface IssueBookRequest {
  book_UID?: string;
  bookId?: number;
  copyId?: number;
  userId?: number;
  userUID?: string;
}

// Return Book
export interface ReturnBookRequest {
  book_UID?: string;
  bookId?: number;
  copyId?: number;
}

// Overdue Books
export interface OverdueBookDTO {
  overdueId: number;
  issueId: number;
  userId: number;
  userUID: string;
  copyId: number;
  book_UID: string;
  isbn: string;
  title: string;
  borrowDate: string;
  dueDate: string;
  overdueDays: number;
  status: string;
}

// Book Details
export interface BookDetailsDTO {
  bookId: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publisher: string;
}

// Book Availability
export interface BookAvailabilityDTO {
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
}

export interface BookWithAvailabilityDTO {
  details: BookDetailsDTO;
  availability: BookAvailabilityDTO;
}

// Search Result
export interface BookSearchResult {
  bookId: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publisher: string;
  totalCopies: number;
  availableCopies: number;
}


// ==========================================================
// 📌 SERVICE
// ==========================================================
@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(private http: HttpClient) { }

  // -------------------------------------------
  // ISSUE BOOK
  // -------------------------------------------
  issueBook(request: IssueBookRequest): Observable<any> {
    return this.http.post(`${API_URL}/issue`, request);
  }

  // -------------------------------------------
  // RETURN BOOK
  // -------------------------------------------
  returnBook(request: ReturnBookRequest): Observable<any> {
    return this.http.post(`${API_URL}/return`, request);
  }

  // -------------------------------------------
  // GET OVERDUE BOOKS
  // -------------------------------------------
  getOverdueBooks(): Observable<OverdueBookDTO[]> {
    return this.http.get<OverdueBookDTO[]>(`${API_URL}/overdue`);
  }

  // -------------------------------------------
  // GET BOOK DETAILS + AVAILABILITY
  // -------------------------------------------
  getBookDetails(bookId: number): Observable<BookWithAvailabilityDTO> {
    return this.http.get<BookWithAvailabilityDTO>(`${API_URL}/book/${bookId}`);
  }

  // -------------------------------------------
  // SEARCH BOOKS
  // -------------------------------------------
  searchBooks(
    title?: string,
    author?: string,
    category?: string,
    isbn?: string,
    publisher?: string
  ): Observable<BookSearchResult[]> {

    let params = new HttpParams();

    if (title) params = params.append('title', title);
    if (author) params = params.append('author', author);
    if (category) params = params.append('category', category);
    if (isbn) params = params.append('isbn', isbn);
    if (publisher) params = params.append('publisher', publisher);

    return this.http.get<BookSearchResult[]>(`${API_URL}/search`, { params });
  }
}
