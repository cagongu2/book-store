class BookMapper {
    static toResponse(book) {
        if (!book) return null;
        
        return {
            id: book._id,
            title: book.title,
            description: book.description,
            category: book.category,
            trending: book.trending,
            coverImage: book.coverImage,
            oldPrice: book.oldPrice,
            newPrice: book.newPrice,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt
        };
    }

    static toResponseList(books) {
        if (!books || !Array.isArray(books)) return [];
        return books.map(BookMapper.toResponse);
    }
}

module.exports = BookMapper;
