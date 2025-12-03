import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { CanteenMenuService, CanteenMenu } from '../canteen-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CanteenMenuWithQty extends CanteenMenu {
  quantity: number;
}

@Component({
  selector: 'app-canteen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canteen.html',
  styleUrls: ['./canteen.css']
})
export class CanteenComponent implements OnInit {

  private hubConnection!: HubConnection;
  menuItems: CanteenMenuWithQty[] = [];
  selectedItems: CanteenMenuWithQty[] = [];
  totalAmount: number = 0;

  payerId: string = "";
  receiverId: string = "";

  constructor(private canteenService: CanteenMenuService) {}

  ngOnInit(): void {
    this.loadMenu();
    this.initRFIDHub();
  }

  loadMenu() {
    this.canteenService.getMenu().subscribe({
      next: (data) => this.menuItems = data.map(item => ({ ...item, quantity: 0 })),
      error: (err) => console.error("Menu load error:", err)
    });
  }

  initRFIDHub() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('https://localhost:44372/rfidhub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => console.log('Connected to RFID Hub'))
      .catch(err => console.error('RFID Hub connection error:', err));

    this.hubConnection.on('ReceiveUID', (uid: string) => {
      this.payerId = uid;
    });
  }

  addItem(item: CanteenMenuWithQty) {
    if (!this.selectedItems.includes(item)) {
      item.quantity = 1;
      this.selectedItems.push(item);
    } else {
      item.quantity += 1;
    }
    this.updateTotal();
  }

  increaseQty(item: CanteenMenuWithQty) {
    item.quantity += 1;
    this.updateTotal();
  }

  decreaseQty(item: CanteenMenuWithQty) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.selectedItems = this.selectedItems.filter(i => i !== item);
      item.quantity = 0;
    }
    this.updateTotal();
  }

  updateTotal() {
    this.totalAmount = this.selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
  }

  // **NEW: Single purchase request**
  makePurchase() {
    if (!this.payerId.trim() || !this.receiverId.trim()) {
      alert("Please enter both Payer UID and Receiver UID.");
      return;
    }
    if (this.selectedItems.length === 0) {
      alert("Cart is empty.");
      return;
    }

    // Collect item IDs as comma-separated string
    const itemIDs = this.selectedItems.map(item => item.itemId).join(',');

    this.canteenService.purchaseItems({
      payerUID: this.payerId,
      receiverUID: this.receiverId,
      itemIDs
    }).subscribe({
      next: (res) => {
        alert(`Purchase successful! Total: ₹${res.totalAmount}, New Balance: ₹${res.newBalance}`);
        this.selectedItems = [];
        this.totalAmount = 0;
        this.menuItems.forEach(item => item.quantity = 0);
      },
      error: (err) => console.error("Purchase error:", err)
    });
  }
}
