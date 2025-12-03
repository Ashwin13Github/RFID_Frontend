export interface User {
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  designationId: number;
  designationName: string;
  walletBalance: number;
}

export interface Transaction {
  transactionId: number;
  senderUID: string;
  receiverUID: string;
  amount: number;
  timestamp: Date;
  type: string;
}
