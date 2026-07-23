class CategoryMapper {
    static toResponse(category) {
        if (!category) return null;
        return {
            id: category._id,
            name: category.name,
            slug: category.slug,
            parentId: category.parentId,
            level: category.level,
            priority: category.priority,
            isActive: category.isActive,
            isFeatured: category.isFeatured,
            productCount: category.productCount,
            description: category.description,
            isDeleted: category.isDeleted,
            children: category.children
                ? category.children.map(CategoryMapper.toResponse)
                : undefined,
            createdAt: category.createdAt,
            updatedAt: category.updatedAt,
        };
    }

    static toResponseList(categories) {
        if (!categories || !Array.isArray(categories)) return [];
        return categories.map(CategoryMapper.toResponse);
    }
}

module.exports = CategoryMapper;
