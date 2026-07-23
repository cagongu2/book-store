export const API_ERROR_MESSAGES: Record<string, string> = {
  AUTH_TOKEN_INVALID:
    "Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu gửi lại email.",
  PASSWORD_SAME_AS_CURRENT: "Mật khẩu mới phải khác mật khẩu hiện tại.",
  VALIDATION_ERROR: "Dữ liệu không hợp lệ.",
  BANNER_CATEGORY_SLUG_DUPLICATE: "Danh mục đã được sử dụng cho một banner khác.",
  PAYMENT_NOT_PAID: "Đơn hàng chỉ được chuyển sang Hoàn thành khi đã thanh toán.",
  REASON_REQUIRED: "Vui lòng nhập lý do.",
  ORDER_TERMINATED: "Không thể cập nhật trạng thái đơn hàng đã hoàn thành, đã hủy hoặc đã đổi/trả.",
};
