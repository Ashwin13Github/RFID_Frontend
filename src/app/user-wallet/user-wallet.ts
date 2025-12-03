import { UserWalletService } from './user-wallet.service';
import { User } from './user-wallet.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as signalR from '@microsoft/signalr';

@Component({
  selector: 'app-user-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-wallet.html',
  styleUrls: ['./user-wallet.css']
})
export class UserWalletComponent implements OnInit {
  uid: string = '';
  amount: number = 0;
  receiverUID: string = '';
  selectedAction: string = 'recharge';
  message: string = '';
  isLoading: boolean = false;

  user: User | null = null;
  private connection!: signalR.HubConnection;

  constructor(private userWalletService: UserWalletService) {}

  ngOnInit() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:44372/rfidHub')
      .withAutomaticReconnect()
      .build();

    this.connection.start()
      .then(() => console.log('Connected to RfidHub'))
      .catch(err => console.error('SignalR error:', err));

    this.connection.on('ReceiveUID', (uid: string) => {
      console.log("Received UID from SignalR:", uid);
      this.uid = uid;
      this.fetchUser();
    });
  }

  fetchUser(callback?: () => void) {
    if (!this.uid || this.uid.trim() === "") {
      this.user = null;
      alert("Tap card on the RFID reader.");
      return;
    }

    this.isLoading = true;
    this.message = "";

    this.userWalletService.getUserByUID(this.uid).subscribe({
      next: (data: User) => {
        console.log("Fetched User:", data);
        this.user = data;
        this.isLoading = false;
        if (callback) {
          callback();
        }
      },
      error: (err: any) => {
        console.error('Error fetching user:', err);
        this.user = null;
        alert('User not found. Invalid UID.');
        this.isLoading = false;
      },
    });
  }

  executeAction() {
    console.log("Sending Payload:", {
      uid: this.uid,
      amount: this.amount,
      receiverUID: this.receiverUID,
      action: this.selectedAction
    });

    if (!this.uid || this.uid.trim() === "") {
      alert("UID not received. Please scan the card.");
      return;
    }

    if (!this.user) {
      alert("User not found.");
      return;
    }

    if (this.amount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    this.isLoading = true;
    this.message = "";

    if (this.selectedAction === 'recharge') {
      console.log('Attempting to recharge with UserId:', this.user.userId, 'Amount:', this.amount);
      const rechargedAmount = this.amount; // Store the amount before clearing it
      this.userWalletService.rechargeWallet(this.user.userId, rechargedAmount).subscribe({
        next: (res: { message: string, newBalance: number }) => {
          this.amount = 0;
          if (this.user) {
            this.user.walletBalance = res.newBalance; // Update the user's balance directly
            alert(`Wallet recharged successfully! Amount: ₹${rechargedAmount.toFixed(2)}. Current Balance: ₹${this.user.walletBalance.toFixed(2)}`);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Recharge Error:", err);
          alert("Recharge failed.");
          this.isLoading = false;
        }
      });
    }

    else if (this.selectedAction === 'transaction') {

      if (!this.receiverUID || this.receiverUID.trim() === "") {
        alert("Receiver UID is required.");
        this.isLoading = false;
        return;
      }

      console.log('Attempting to make payment from Payer UID:', this.uid, 'to Receiver UID:', this.receiverUID, 'Amount:', this.amount);
      const transactionAmount = this.amount;
      this.userWalletService.makePayment(this.uid, this.receiverUID, transactionAmount).subscribe({
        next: (res: { message: string, newBalance: number }) => {
          this.amount = 0;
          this.receiverUID = "";
          if (this.user) {
            this.user.walletBalance = res.newBalance; // Update the user's balance directly
            alert(`Payment of ₹${transactionAmount.toFixed(2)} successful! Current Balance: ₹${this.user.walletBalance.toFixed(2)}`);
          }
          this.isLoading = false;
        },
        error: (err) => {
          console.error("Payment Error:", err);
          alert("Payment failed. Check balance or UID.");
          this.isLoading = false;
        }
    });
    }
  }
}
