import { useQuery } from "@tanstack/react-query";
import { getBooks, getBookById } from "../services/books.service";

export const useGetBooks = () => {
    return useQuery({
        queryKey: ["books"],
        queryFn: getBooks,
    });
};

export const useGetBookById = (id: string) => {
    return useQuery({
        queryKey: ["books", id],
        queryFn: () => getBookById(id),
        enabled: !!id,
    });
};
