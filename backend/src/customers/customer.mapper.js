class CustomerMapper {
    static toResponse(customer) {
        if (!customer) return null;
        
        return {
            id: customer._id,
            email: customer.email,
            displayName: customer.displayName,
            photoURL: customer.photoURL,
            phone: customer.phone,
            addresses: customer.addresses,
            isActive: customer.isActive,
            totalOrders: customer.totalOrders,
            totalSpent: customer.totalSpent,
            lastOrderAt: customer.lastOrderAt,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt
        };
    }

    static toResponseList(customers) {
        if (!customers || !Array.isArray(customers)) return [];
        return customers.map(CustomerMapper.toResponse);
    }
}

module.exports = CustomerMapper;
