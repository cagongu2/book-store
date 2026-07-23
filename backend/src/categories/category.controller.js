const ApiResponse = require("../core/ApiResponse");
const asyncHandler = require("../core/asyncHandler");
const categoryService = require("./category.service");

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(
        ApiResponse.success(category, "Tạo danh mục thành công")
    );
});

const getCategories = asyncHandler(async (req, res) => {
    // Nếu có truyền ?adminView=true thì lấy cả danh mục bị ẩn (isActive: false)
    const adminView = req.query.adminView === 'true';
    const categories = await categoryService.getCategories(adminView);
    res.status(200).json(
        ApiResponse.success(categories, "Lấy danh sách danh mục thành công")
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(
        ApiResponse.success(category, "Lấy thông tin danh mục thành công")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(
        ApiResponse.success(category, "Cập nhật danh mục thành công")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(
        ApiResponse.success(null, "Xóa danh mục thành công")
    );
});

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
