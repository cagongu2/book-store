const ApiResponse = require("../core/ApiResponse");
const asyncHandler = require("../core/asyncHandler");
const categoryService = require("./category.service");
const CategoryMapper = require("./category.mapper");

const createCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(
        ApiResponse.success(CategoryMapper.toResponse(category), "Tạo danh mục thành công")
    );
});

const getCategories = asyncHandler(async (req, res) => {
    const { parentId, level, status, searchText, isTree, page, limit, readyForProduct, readyForCategory } = req.query;
    const result = await categoryService.getCategories({
        parentId,
        level,
        isActive: status !== undefined ? status === 'true' : undefined,
        readyForProduct: readyForProduct !== undefined ? readyForProduct === 'true' : undefined,
        readyForCategory: readyForCategory !== undefined ? readyForCategory === 'true' : undefined,
        searchText,
        isTree: isTree !== 'false',
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 20,
    });

    // Trả về dữ liệu (hỗ trợ phân trang cho cả dạng phẳng lẫn dạng cây)
    res.status(200).json({
        success: true,
        message: "Lấy danh sách danh mục thành công",
        data: CategoryMapper.toResponseList(result.items),
        page: result.page,
        limit: result.limit,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / result.limit)
    });
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.status(200).json(
        ApiResponse.success(CategoryMapper.toResponse(category), "Lấy thông tin danh mục thành công")
    );
});

const updateCategory = asyncHandler(async (req, res) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.status(200).json(
        ApiResponse.success(CategoryMapper.toResponse(category), "Cập nhật danh mục thành công")
    );
});

const deleteCategory = asyncHandler(async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json(
        ApiResponse.success(null, "Xóa danh mục thành công")
    );
});

const updatePriority = asyncHandler(async (req, res) => {
    const updatedCategory = await categoryService.updatePriority(req.body);
    res.status(200).json(
        ApiResponse.success(CategoryMapper.toResponse(updatedCategory), "Cập nhật vị trí danh mục thành công")
    );
});

module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    updatePriority
};
