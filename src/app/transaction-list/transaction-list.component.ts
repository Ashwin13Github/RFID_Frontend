import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transaction {
    id: string;
    date: string;
    time: string;
    amount: string;
    status: 'Completed' | 'Pending' | 'Failed';
    action: string;
}

@Component({
    selector: 'app-transaction-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {
    transactions: Transaction[] = [
        { id: '#123456', date: 'Nov 25, 2025', time: '10:00 AM', amount: '$100.00', status: 'Completed', action: 'View' },
        { id: '#123457', date: 'Nov 25, 2025', time: '10:30 AM', amount: '$50.00', status: 'Pending', action: 'View' },
        { id: '#123458', date: 'Nov 24, 2025', time: '09:15 AM', amount: '$200.00', status: 'Failed', action: 'Retry' },
        { id: '#123459', date: 'Nov 24, 2025', time: '02:45 PM', amount: '$75.00', status: 'Completed', action: 'View' },
        { id: '#123460', date: 'Nov 23, 2025', time: '11:20 AM', amount: '$150.00', status: 'Completed', action: 'View' },
        { id: '#123461', date: 'Nov 23, 2025', time: '04:10 PM', amount: '$30.00', status: 'Pending', action: 'View' },
        { id: '#123462', date: 'Nov 22, 2025', time: '08:00 AM', amount: '$120.00', status: 'Completed', action: 'View' },
        { id: '#123463', date: 'Nov 22, 2025', time: '01:30 PM', amount: '$90.00', status: 'Completed', action: 'View' },
        { id: '#123464', date: 'Nov 21, 2025', time: '10:00 AM', amount: '$25.00', status: 'Failed', action: 'Retry' },
        { id: '#123465', date: 'Nov 21, 2025', time: '03:50 PM', amount: '$180.00', status: 'Completed', action: 'View' }
    ];

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completed':
                return 'badge bg-success-subtle text-success';
            case 'Pending':
                return 'badge bg-warning-subtle text-warning';
            case 'Failed':
                return 'badge bg-danger-subtle text-danger';
            default:
                return 'badge bg-secondary-subtle text-secondary';
        }
    }
}
