import { Book } from "./book.types";

export interface CartItem {
    bookId?: string; // used for local sync
    book?: Book; // populated in backend
    quantity: number;
}

export interface Cart {
    id: string;
    customerId: string;
    items: CartItem[];
    updatedAt?: string;
}
