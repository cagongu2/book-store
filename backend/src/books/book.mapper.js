class BookMapper {
    static toResponse(book) {
        if (!book) return null;

        const oldPrice = book.oldPrice ?? book.newPrice;
        const newPrice = book.newPrice;
        const isDiscounted = Boolean(oldPrice && oldPrice > newPrice);
        const discountPercent = isDiscounted
            ? Math.round(((oldPrice - newPrice) / oldPrice) * 100)
            : 0;

        const formatCategories = (categories) => {
            if (!Array.isArray(categories)) return [];
            return categories.filter(Boolean).map(cat => {
                if (typeof cat === 'object' && cat._id) {
                    return {
                        id: cat._id,
                        name: cat.name,
                        parentId: cat.parentId || null,
                        slug: cat.slug
                    };
                }
                return { id: cat };
            });
        };
        
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
            categories: formatCategories(book.categories),
            coverImage: book.coverImage,
            images: book.images,
            oldPrice: oldPrice,
            newPrice: newPrice,
            isDiscounted,
            discountPercent,
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
