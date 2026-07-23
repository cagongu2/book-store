export interface Book {
    id: string;
    title: string;
    description?: string;
    category: string;
    trending: boolean;
    coverImage: string;
    oldPrice: number;
    newPrice: number;
    createdAt?: string;
    updatedAt?: string;
}
