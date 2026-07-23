const { z } = require('zod');

const createBookSchema = z.object({
    body: z.object({
        title: z.string({ required_error: "Tên sách là bắt buộc" }).min(1, "Tên sách không được để trống"),
        description: z.string().optional(),
        category: z.string({ required_error: "Thể loại là bắt buộc" }).min(1, "Thể loại không được để trống"),
        trending: z.boolean().default(false).optional(),
        coverImage: z.string({ required_error: "Ảnh bìa là bắt buộc" }).min(1, "Ảnh bìa không được để trống"),
        oldPrice: z.number({ required_error: "Giá cũ là bắt buộc" }).min(0, "Giá không hợp lệ"),
        newPrice: z.number({ required_error: "Giá mới là bắt buộc" }).min(0, "Giá không hợp lệ")
    })
});

const updateBookSchema = z.object({
    params: z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sách không hợp lệ")
    }),
    body: z.object({
        title: z.string().min(1, "Tên sách không được để trống").optional(),
        description: z.string().optional(),
        category: z.string().min(1, "Thể loại không được để trống").optional(),
        trending: z.boolean().optional(),
        coverImage: z.string().min(1, "Ảnh bìa không được để trống").optional(),
        oldPrice: z.number().min(0, "Giá không hợp lệ").optional(),
        newPrice: z.number().min(0, "Giá không hợp lệ").optional()
    })
});

module.exports = {
    createBookSchema,
    updateBookSchema
};
