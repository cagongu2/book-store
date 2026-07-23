const { z } = require('zod');

// Regex cho MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createCategorySchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Tên danh mục là bắt buộc" }).min(1, "Tên danh mục không được để trống").max(50, "Tên danh mục tối đa 50 ký tự"),
        parentId: z.string().regex(objectIdRegex, "ID danh mục cha không hợp lệ").nullable().optional(),
        priority: z.number().int().optional(),
        isActive: z.boolean().default(true).optional(),
        isFeatured: z.boolean().default(false).optional(),
        description: z.string().optional()
    })
});

const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, "ID danh mục không hợp lệ")
    }),
    body: z.object({
        name: z.string().min(1, "Tên danh mục không được để trống").max(50, "Tên danh mục tối đa 50 ký tự").optional(),
        parentId: z.string().regex(objectIdRegex, "ID danh mục cha không hợp lệ").nullable().optional(),
        priority: z.number().int().optional(),
        isActive: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        description: z.string().optional()
    })
});

const getCategoriesSchema = z.object({
    query: z.object({
        parentId: z.string().optional(),
        level: z.coerce.number().int().min(1).max(2).optional(),
        status: z.enum(['true', 'false']).optional(),
        searchText: z.string().optional(),
        readyForProduct: z.enum(['true', 'false']).optional(),
        readyForCategory: z.enum(['true', 'false']).optional(),
        isTree: z.enum(['true', 'false']).optional(),
        page: z.coerce.number().int().min(1).default(1).optional(),
        limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    })
});

const updatePrioritySchema = z.object({
    body: z.object({
        categoryId: z.string({ required_error: "ID danh mục là bắt buộc" }).regex(objectIdRegex, "ID danh mục không hợp lệ"),
        priority: z.number({ required_error: "Priority là bắt buộc" }).int("Priority phải là số nguyên").min(1, "Priority phải lớn hơn hoặc bằng 1"),
        parentId: z.string().regex(objectIdRegex, "ID danh mục cha không hợp lệ").nullable().optional()
    })
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
    getCategoriesSchema,
    updatePrioritySchema
};
