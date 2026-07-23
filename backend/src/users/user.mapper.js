class UserMapper {
    static toResponse(user) {
        if (!user) return null;
        
        return {
            id: user._id,
            username: user.username,
            role: user.role,
            isActive: user.isActive,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt
        };
    }

    static toResponseList(users) {
        if (!users || !Array.isArray(users)) return [];
        return users.map(UserMapper.toResponse);
    }
}

module.exports = UserMapper;
