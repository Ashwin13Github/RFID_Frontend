import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Canteen menu model
export interface CanteenMenu {
  itemId: number;
  itemName: string;
  price: number;
  isActive: boolean;
  quantity?: number; // optional for frontend
}

// Purchase request according to new API
export interface PurchaseRequest {
  payerUID: string;
  receiverUID: string;
  itemIDs: string; // comma-separated IDs
}

// API response model
export interface PurchaseResponse {
  message: string;
  totalAmount: number;
  newBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class CanteenMenuService {
  private menuApiUrl = 'https://localhost:44372/api/Canteen/menu';
  private purchaseApiUrl = 'https://localhost:44372/api/Canteen/purchase';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<CanteenMenu[]> {
    return this.http.get<CanteenMenu[]>(this.menuApiUrl);
  }

  purchaseItems(request: PurchaseRequest): Observable<PurchaseResponse> {
    return this.http.post<PurchaseResponse>(this.purchaseApiUrl, request);
  }
}
