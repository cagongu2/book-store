const { z } = require('zod');

// Regex for MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createBookSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Tên sách là bắt buộc" }).min(1, "Tên sách không được để trống").max(200, "Tên sách tối đa 200 ký tự"),
        description: z.string({ required_error: "Mô tả là bắt buộc" }).min(1, "Mô tả không được để trống"),
        author: z.string().optional(),
        publisher: z.string().optional(),
        isbn: z.string().optional(),
        pageCount: z.number().int().positive().optional(),
        language: z.string().optional(),
        publishedYear: z.number().int().optional(),
        categories: z.array(z.string().regex(objectIdRegex, "ID danh mục không hợp lệ")).min(1, "Phải chọn ít nhất 1 danh mục"),
        coverImage: z.string({ required_error: "Ảnh bìa là bắt buộc" }).min(1, "Ảnh bìa không được để trống"),
        images: z.array(z.string()).max(8, "Tối đa 8 ảnh phụ").optional(),
        oldPrice: z.number({ required_error: "Giá cũ là bắt buộc" }).min(0, "Giá không hợp lệ"),
        newPrice: z.number({ required_error: "Giá mới là bắt buộc" }).min(0, "Giá không hợp lệ"),
        stockQuantity: z.number({ required_error: "Số lượng tồn kho là bắt buộc" }).int().min(0, "Số lượng không hợp lệ"),
        stockThreshold: z.number().int().min(0).optional(),
        trending: z.boolean().default(false).optional(),
        status: z.enum(['draft', 'active', 'inactive']).default('draft').optional(),
        isDeleted: z.boolean().optional()
    })
});

const updateBookSchema = z.object({
    params: z.object({
        id: z.string().regex(objectIdRegex, "ID sách không hợp lệ")
    }),
    body: z.object({
        title: z.string().min(1, "Tên sách không được để trống").max(200, "Tên sách tối đa 200 ký tự").optional(),
        description: z.string().min(1, "Mô tả không được để trống").optional(),
        author: z.string().optional(),
        publisher: z.string().optional(),
        isbn: z.string().optional(),
        pageCount: z.number().int().positive().optional(),
        language: z.string().optional(),
        publishedYear: z.number().int().optional(),
        categories: z.array(z.string().regex(objectIdRegex, "ID danh mục không hợp lệ")).min(1, "Phải chọn ít nhất 1 danh mục").optional(),
        coverImage: z.string().min(1, "Ảnh bìa không được để trống").optional(),
        images: z.array(z.string()).max(8, "Tối đa 8 ảnh phụ").optional(),
        oldPrice: z.number().min(0, "Giá không hợp lệ").optional(),
        newPrice: z.number().min(0, "Giá không hợp lệ").optional(),
        stockQuantity: z.number().int().min(0, "Số lượng không hợp lệ").optional(),
        stockThreshold: z.number().int().min(0).optional(),
        trending: z.boolean().optional(),
        status: z.enum(['draft', 'active', 'inactive']).optional(),
        isDeleted: z.boolean().optional()
    })
});

const getBooksSchema = z.object({
    query: z.object({
        page: z.string().regex(/^\d+$/, "Page phải là số nguyên dương").optional(),
        limit: z.string().regex(/^\d+$/, "Limit phải là số nguyên dương").optional()
    }).optional()
});

module.exports = {
    createBookSchema,
    updateBookSchema,
    getBooksSchema
};
