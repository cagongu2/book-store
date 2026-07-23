const { z } = require('zod');

const createOrderSchema = z.object({
    body: z.object({
        name: z.string({ required_error: "Tên người đặt là bắt buộc" }).min(1, "Tên không được để trống"),
        email: z.string({ required_error: "Email là bắt buộc" }).email("Email không hợp lệ"),
        address: z.object({
            city: z.string({ required_error: "Thành phố là bắt buộc" }).min(1, "Thành phố không được để trống"),
            country: z.string({ required_error: "Quốc gia là bắt buộc" }).min(1, "Quốc gia không được để trống"),
            state: z.string().optional(),
            zipcode: z.string().optional(),
        }),
        phone: z.number({ required_error: "Số điện thoại là bắt buộc" }).int("Số điện thoại không hợp lệ"),
        productIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "ID sách không hợp lệ")).min(1, "Giỏ hàng không được trống"),
        totalPrice: z.number({ required_error: "Tổng tiền là bắt buộc" }).min(0, "Tổng tiền không hợp lệ")
    })
});

module.exports = {
    createOrderSchema
};
