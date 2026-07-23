import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import { createBook, deleteBook, updateBook } from "../services/books.service";
import { handleError } from "../../../utils/errorHandler";
import { Book } from "../types/book.types";

export const useBooksMutation = () => {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: (data: Partial<Book>) => createBook(data),
        onSuccess: () => {
            notification.success({ message: "Thêm sách thành công", placement: "topRight" });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: handleError
    });

    const editMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<Book> }) => updateBook(id, data),
        onSuccess: () => {
            notification.success({ message: "Cập nhật sách thành công", placement: "topRight" });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: handleError
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) => deleteBook(id),
        onSuccess: () => {
            notification.success({ message: "Xóa sách thành công", placement: "topRight" });
            queryClient.invalidateQueries({ queryKey: ["books"] });
        },
        onError: handleError
    });

    return {
        addMutation,
        editMutation,
        removeMutation
    };
};
