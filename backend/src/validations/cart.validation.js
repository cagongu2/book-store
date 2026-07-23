const { z } = require('zod');

const mergeCartSchema = z.object({
    body: z.object({
        localCartItems: z.array(
            z.object({
                bookId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sách không hợp lệ"),
                quantity: z.number().int().min(1, "Số lượng phải lớn hơn 0")
            })
        ).optional().default([])
    })
});

module.exports = {
    mergeCartSchema
};
