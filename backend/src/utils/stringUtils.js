/**
 * Hàm hỗ trợ tạo slug đơn giản từ chuỗi đầu vào
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

/**
 * Escape các ký tự đặc biệt trong chuỗi để sử dụng an toàn với Regular Expression.
 * Giúp chống lỗi SyntaxError (Crash 500) và Regex Injection khi người dùng tìm kiếm.
 * @param {string} text - Chuỗi tìm kiếm từ người dùng
 * @returns {string} - Chuỗi đã được escape ký tự đặc biệt
 */
const escapeRegex = (text) => {
    if (typeof text !== 'string') return '';
    return text.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

module.exports = {
    generateSlug,
    escapeRegex
};
