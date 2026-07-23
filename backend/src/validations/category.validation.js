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

module.exports = {
    createCategorySchema,
    updateCategorySchema
};
