/**
 * Hàm hỗ trợ tạo slug đơn giản không dùng thư viện ngoài
 * Chuyển đổi chuỗi có dấu tiếng Việt thành chuỗi không dấu, chữ thường, phân cách bởi dấu gạch ngang
 * @param {string} text - Chuỗi đầu vào
 * @returns {string} - Slug URL-friendly
 */
const generateSlug = (text) => {
    if (!text) return '';
    return text.toString().normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')       // Thay khoảng trắng và underscore bằng dấu gạch ngang
        .replace(/[^\w-]+/g, '')       // Loại bỏ các ký tự đặc biệt
        .replace(/--+/g, '-');         // Gộp nhiều dấu gạch ngang liên tiếp
};

module.exports = {
    generateSlug
};
