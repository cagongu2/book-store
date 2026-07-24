const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const UserMapper = require("./user.mapper");
const { ErrorCodes } = require('../constants/enums');

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'default_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET_KEY || 'default_refresh_secret';

const buildAdminProfile = (admin) => {
    const userObj = UserMapper.toResponse(admin);
    return {
        id: userObj.id,
        fullName: userObj.username,
        userName: userObj.username,
        email: `${userObj.username}@bookstore.com`,
        phone: null,
        avatar: null,
        roles: [userObj.role || 'ADMINISTRATORS'],
        isActivated: userObj.isActive
    };
};

const loginAdmin = asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    
    const admin = await User.findOne({ username });
    
    if (!admin) {
        throw ApiError.unauthorized("Sai tên đăng nhập hoặc mật khẩu!", ErrorCodes.INVALID_CREDENTIALS);
    }

    if (admin.isActive === false) {
        throw ApiError.forbidden("Tài khoản đã bị vô hiệu hóa!", ErrorCodes.ACCOUNT_DISABLED);
    }

    if (admin.lockedUntil && admin.lockedUntil > Date.now()) {
        throw new ApiError(429, ErrorCodes.ACCOUNT_LOCKED, "Tài khoản tạm khóa, thử lại sau 15 phút");
    }

    const isPasswordMatch = await bcrypt.compare(password, admin.password);

    if (!isPasswordMatch) {
        admin.loginAttempts += 1;
        if (admin.loginAttempts >= 5) {
            admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        await admin.save();
        throw ApiError.unauthorized("Sai tên đăng nhập hoặc mật khẩu!", ErrorCodes.INVALID_CREDENTIALS);
    }
    
    admin.loginAttempts = 0;
    admin.lockedUntil = undefined;
    admin.lastLoginAt = new Date();

    const accessToken = jwt.sign(
        { id: admin._id, username: admin.username, role: admin.role }, 
        JWT_SECRET,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: admin._id, type: "refresh" },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    admin.refreshTokens = (admin.refreshTokens || []).filter(t => t.expiresAt > new Date());
    admin.refreshTokens.push({ token: refreshToken, expiresAt });
    await admin.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const adminProfile = buildAdminProfile(admin);

    res.status(200).json(
        ApiResponse.success({
            accessToken,
            refreshToken,
            expiresIn: 900,
            adminProfile
        }, "Đăng nhập thành công")
    );
});

const refreshTokenAdmin = asyncHandler(async (req, res) => {
    const tokenFromCookie = req.cookies?.refreshToken;
    const tokenFromBody = req.body?.refreshToken;
    const refreshToken = tokenFromCookie || tokenFromBody;

    if (!refreshToken) {
        throw ApiError.unauthorized("Refresh token không hợp lệ hoặc thiếu", ErrorCodes.INVALID_CREDENTIALS);
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
        throw ApiError.unauthorized("Refresh token không hợp lệ hoặc đã hết hạn", ErrorCodes.INVALID_CREDENTIALS);
    }

    const admin = await User.findById(decoded.id);
    if (!admin || !admin.isActive) {
        throw ApiError.forbidden("Tài khoản đã bị vô hiệu hóa hoặc không tồn tại", ErrorCodes.ACCOUNT_DISABLED);
    }

    const tokenIndex = (admin.refreshTokens || []).findIndex(t => t.token === refreshToken);
    if (tokenIndex === -1) {
        admin.refreshTokens = [];
        await admin.save();
        res.clearCookie("refreshToken", { path: "/" });
        throw ApiError.unauthorized("Refresh token đã bị hủy hoặc đã được sử dụng", ErrorCodes.INVALID_CREDENTIALS);
    }

    admin.refreshTokens.splice(tokenIndex, 1);

    const newAccessToken = jwt.sign(
        { id: admin._id, username: admin.username, role: admin.role },
        JWT_SECRET,
        { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
        { id: admin._id, type: "refresh" },
        REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    admin.refreshTokens.push({ token: newRefreshToken, expiresAt });
    await admin.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const adminProfile = buildAdminProfile(admin);

    res.status(200).json(
        ApiResponse.success({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: 900,
            adminProfile
        }, "Làm mới token thành công")
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            const admin = await User.findById(decoded.id);
            if (admin) {
                admin.refreshTokens = (admin.refreshTokens || []).filter(t => t.token !== refreshToken);
                await admin.save();
            }
        } catch (e) {
            // Ignore verification error during logout
        }
    }

    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json(ApiResponse.success(null, "Đăng xuất thành công"));
});

const getMe = asyncHandler(async (req, res) => {
    const adminProfile = buildAdminProfile(req.user);
    res.status(200).json(
        ApiResponse.success({
            adminProfile
        }, "Lấy thông tin tài khoản thành công")
    );
});

module.exports = {
    loginAdmin,
    refreshTokenAdmin,
    logoutAdmin,
    getMe
};
