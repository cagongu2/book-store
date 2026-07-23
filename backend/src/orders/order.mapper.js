class OrderMapper {
    static toResponse(order) {
        if (!order) return null;
        
        return {
            id: order._id,
            name: order.name,
            email: order.email,
            address: order.address,
            phone: order.phone,
            productIds: order.productIds,
            totalPrice: order.totalPrice,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt
        };
    }

    static toResponseList(orders) {
        if (!orders || !Array.isArray(orders)) return [];
        return orders.map(OrderMapper.toResponse);
    }
}

module.exports = OrderMapper;
