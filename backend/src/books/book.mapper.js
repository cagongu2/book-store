class BookMapper {
    static toResponse(book) {
        if (!book) return null;
        
        return {
            id: book._id,
            title: book.title,
            slug: book.slug,
            sku: book.sku,
            description: book.description,
            author: book.author,
            publisher: book.publisher,
            isbn: book.isbn,
            pageCount: book.pageCount,
            language: book.language,
            publishedYear: book.publishedYear,
            categories: book.categories,
            coverImage: book.coverImage,
            images: book.images,
            oldPrice: book.oldPrice,
            newPrice: book.newPrice,
            stockQuantity: book.stockQuantity,
            stockThreshold: book.stockThreshold,
            trending: book.trending,
            status: book.status,
            isDeleted: book.isDeleted,
            deletedAt: book.deletedAt,
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
