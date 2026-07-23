import { callApi } from "../../../core/api/handleApi";
import { Book } from "../types/book.types";

export interface BookListResponse {
    books: Book[];
}

export const getBooks = () => {
    return callApi<BookListResponse>("/books", null, "get");
};

export const getBookById = (id: string) => {
    return callApi<Book>(`/books/${id}`, null, "get");
};

export const createBook = (data: Partial<Book>) => {
    return callApi<Book>("/books/create-book", data, "post");
};

export const updateBook = (id: string, data: Partial<Book>) => {
    return callApi<Book>(`/books/edit/${id}`, data, "put");
};

export const deleteBook = (id: string) => {
    return callApi<{ message: string }>(`/books/${id}`, null, "delete");
};
