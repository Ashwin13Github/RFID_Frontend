import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Transaction } from './user-wallet.model';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserWalletService {

  private apiUrl = `${environment.baseUrl}/api/UserWallet`;

  constructor(private http: HttpClient) {}

  getUserByUID(uid: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/get-user/${uid}`);
  }

  rechargeWallet(userId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/recharge`, { userId, amount });
  }

  makePayment(payerUID: string, receiverUID: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/pay`, { payerUID, receiverUID, amount });
  }

  addTransaction(transaction: Transaction): Observable<any> {
    return this.http.post(`${this.apiUrl}/addTransaction`, transaction);
  }
}
