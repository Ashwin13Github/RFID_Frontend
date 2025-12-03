import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface BookDetails {
  bookId: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  publisher: string;
}

interface BookAvailability {
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
}

interface BookDetailsResponse {
  details: BookDetails;
  availability: BookAvailability;
}

interface OverdueBook {
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
  returnDate: string | null;
}

@Component({
  selector: 'app-library',
  standalone: true, 
  imports: [CommonModule,FormsModule],
  templateUrl: './library.html',
  styleUrls: ['./library.css']
})
export class LibraryComponent {

  constructor(private http: HttpClient) {}

  // Active Tab
  activeTab: string = "issue";

  // API Base URL
  api = "https://localhost:44372/api/Library";

  // -------------------------------
  // ISSUE BOOK
  // -------------------------------
  issue = {
    bookId: null,
    copyId: null,
    userId: null,
    userUID: ''
  };

  issueMsg: string = "";

  issueBook() {
    this.http.post<any>(`${this.api}/issue`, this.issue).subscribe({
      next: (res) => this.issueMsg = res.message,
      error: (err) => this.issueMsg = "Error issuing book"
    });
  }

  // -------------------------------
  // RETURN BOOK
  // -------------------------------
  returnReq = {
    book_UID: '',
    bookId: null,
    copyId: null,
    issueId: null
  };

  returnMsg: string = "";

  returnBook() {
    this.http.post<any>(`${this.api}/return`, this.returnReq).subscribe({
      next: (res) => this.returnMsg = res.message,
      error: (err) => this.returnMsg = "Error returning book"
    });
  }

  // -------------------------------
  // SEARCH BOOKS
  // -------------------------------
  search = {
    title: '',
    author: '',
    category: '',
    isbn: '',
    publisher: ''
  };

  searchResults: any[] = [];

  searchBooks() {
    let params = new HttpParams();

    if (this.search.title) params = params.set("title", this.search.title);
    if (this.search.author) params = params.set("author", this.search.author);
    if (this.search.category) params = params.set("category", this.search.category);
    if (this.search.isbn) params = params.set("isbn", this.search.isbn);
    if (this.search.publisher) params = params.set("publisher", this.search.publisher);

    this.http.get<any[]>(`${this.api}/search`, { params }).subscribe({
      next: (res) => this.searchResults = res,
      error: () => this.searchResults = []
    });
  }

  // -------------------------------
  // BOOK DETAILS BY BOOK ID
  // -------------------------------
  bookId: number | null = null;
  bookDetails: BookDetailsResponse | null = null;

  getBookDetails() {
    this.http.get<any>(`${this.api}/book/${this.bookId}`).subscribe({
      next: (res) => this.bookDetails = res,
      error: () => this.bookDetails = null
    });
  }

  // -------------------------------
  // OVERDUE BOOKS
  // -------------------------------
  overdueBooks: OverdueBook[] = [];

  loadOverdue() {
    this.http.get<any[]>(`${this.api}/overdue`).subscribe({
      next: (res) => this.overdueBooks = res,
      error: () => this.overdueBooks = []
    });
  }

  // Trigger load when opening overdue tab
  ngDoCheck() {
    if (this.activeTab === 'overdue' && this.overdueBooks.length === 0) {
      this.loadOverdue();
    }
  }
}
