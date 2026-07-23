export interface Order {
    id: string;
    name: string;
    email: string;
    address: {
        city: string;
        country: string;
        state?: string;
        zipcode?: string;
    };
    phone: number;
    productIds: string[];
    totalPrice: number;
    createdAt?: string;
    updatedAt?: string;
}
