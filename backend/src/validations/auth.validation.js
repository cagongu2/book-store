const { z } = require('zod');

const loginAdminSchema = z.object({
    body: z.object({
        username: z.string({
            required_error: "Vui lòng nhập tên đăng nhập"
        }).min(1, "Vui lòng nhập tên đăng nhập"),
        password: z.string({
            required_error: "Vui lòng nhập mật khẩu"
        }).min(1, "Vui lòng nhập mật khẩu")
    })
});

const registerCustomerSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Vui lòng cung cấp email"
        }).email("Email không hợp lệ"),
        password: z.string({
            required_error: "Vui lòng cung cấp mật khẩu"
        }).min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        displayName: z.string().optional()
    })
});

const loginCustomerSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Vui lòng cung cấp email"
        }).email("Email không hợp lệ"),
        password: z.string({
            required_error: "Vui lòng cung cấp mật khẩu"
        }).min(1, "Vui lòng cung cấp mật khẩu")
    })
});

module.exports = {
    loginAdminSchema,
    registerCustomerSchema,
    loginCustomerSchema
};
