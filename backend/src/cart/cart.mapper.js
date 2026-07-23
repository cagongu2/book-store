class CartMapper {
    static toResponse(cart) {
        if (!cart) return null;
        
        return {
            id: cart._id,
            customerId: cart.customerId,
            items: cart.items.map(item => ({
                book: item.bookId, // Có thể đã được populate
                quantity: item.quantity
            })),
            updatedAt: cart.updatedAt
        };
    }
}

module.exports = CartMapper;
