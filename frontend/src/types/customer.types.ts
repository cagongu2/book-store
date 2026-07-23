export interface Customer {
    id: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    phone?: string;
    addresses?: any[];
    isActive: boolean;
    totalOrders?: number;
    totalSpent?: number;
    lastOrderAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
