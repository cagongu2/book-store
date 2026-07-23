const Book = require("./book.model");
const Category = require("../categories/category.model");
const { recountProductCount } = require("../categories/category.service");
const ApiError = require("../core/ApiError");
const { escapeRegex } = require("../utils/stringUtils");

const categoryPopulateOption = {
    path: 'categories',
    select: 'name parentId slug',
    match: { isDeleted: false }
};

const validateCategoryNoChildren = async (categoryIds) => {
    const ids = Array.isArray(categoryIds) ? categoryIds : [categoryIds];
    for (const id of ids) {
        const category = await Category.findOne({ _id: id, isDeleted: false });
        if (!category) {
            throw ApiError.badRequest(`Danh mục (ID: ${id}) không tồn tại hoặc đã bị xóa.`);
        }

        const hasChildren = await Category.exists({ parentId: id, isDeleted: false });
        if (hasChildren) {
            throw ApiError.badRequest("Danh mục này đang có danh mục con, không thể thêm sản phẩm vào.");
        }
    }
};

const recountBookCategories = async (book) => {
    const catIds = (book.categories || []).filter(Boolean);
    const uniqueIds = [...new Set(catIds.map(id => (id._id || id).toString()))];
    await Promise.all(uniqueIds.map(id => recountProductCount(id)));
};

const createBook = async (bookData) => {
    if (bookData.oldPrice === undefined || bookData.oldPrice === null) {
        bookData.oldPrice = bookData.newPrice;
    }

    await validateCategoryNoChildren(bookData.categories || []);

    try {
        const newBook = new Book({ ...bookData });
        await newBook.save();
        await recountBookCategories(newBook);
        await newBook.populate(categoryPopulateOption);
        return newBook;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Mã SKU hoặc Slug sách đã tồn tại trong hệ thống.");
        }
        throw error;
    }
};

const getBooks = async ({ page = 1, limit = 10, category, search, status, trending, sortBy } = {}) => {
    const numericPage = parseInt(page, 10) || 1;
    const numericLimit = parseInt(limit, 10) || 10;
    const skip = (numericPage - 1) * numericLimit;

    const query = { isDeleted: false };

    if (status) {
        query.status = status;
    }

    if (trending !== undefined) {
        query.trending = trending === 'true' || trending === true;
    }

    if (category) {
        const childIds = (await Category.find({ parentId: category, isDeleted: false }).select('_id').lean())
            .map(c => c._id);
        const allCatIds = [category, ...childIds];
        query.categories = { $in: allCatIds };
    }

    if (search && search.trim()) {
        const escapedText = escapeRegex(search);
        const searchRegex = { $regex: escapedText, $options: "i" };
        query.$or = [
            { title: searchRegex },
            { author: searchRegex },
            { sku: searchRegex }
        ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy) {
        switch (sortBy) {
            case 'price_asc':
                sortOptions = { newPrice: 1 };
                break;
            case 'price_desc':
                sortOptions = { newPrice: -1 };
                break;
            case 'createdAt_asc':
                sortOptions = { createdAt: 1 };
                break;
            case 'createdAt_desc':
                sortOptions = { createdAt: -1 };
                break;
            case 'title_asc':
                sortOptions = { title: 1 };
                break;
            case 'title_desc':
                sortOptions = { title: -1 };
                break;
            default:
                sortOptions = { createdAt: -1 };
        }
    }

    const [books, total] = await Promise.all([
        Book.find(query)
            .populate(categoryPopulateOption)
            .sort(sortOptions)
            .skip(skip)
            .limit(numericLimit),
        Book.countDocuments(query)
    ]);

    return {
        books,
        meta: {
            page: numericPage,
            limit: numericLimit,
            totalItems: total,
            totalPages: Math.ceil(total / numericLimit)
        }
    };
};

const getBookById = async (id) => {
    const book = await Book.findOne({ _id: id, isDeleted: false })
        .populate(categoryPopulateOption);
    if (!book) {
        throw ApiError.notFound("Không tìm thấy sách");
    }
    return book;
};

const updateBook = async (id, updateData) => {
    const oldBook = await Book.findOne({ _id: id, isDeleted: false }).lean();
    if (!oldBook) {
        throw ApiError.notFound("Không tìm thấy sách để cập nhật");
    }

    if (updateData.categories && updateData.categories.length > 0) {
        await validateCategoryNoChildren(updateData.categories);
    }

    try {
        const updatedBook = await Book.findOneAndUpdate({ _id: id, isDeleted: false }, updateData, { new: true })
            .populate(categoryPopulateOption);
        if (!updatedBook) {
            throw ApiError.notFound("Không tìm thấy sách để cập nhật");
        }

        // Recount tất cả category bị ảnh hưởng (cũ + mới)
        const oldCatIds = (oldBook?.categories || []).filter(Boolean);
        const newCatIds = (updatedBook.categories || []).filter(Boolean);
        const allAffected = [...new Set([...oldCatIds, ...newCatIds].map(catId => (catId._id || catId).toString()))];
        await Promise.all(allAffected.map(catId => recountProductCount(catId)));

        return updatedBook;
    } catch (error) {
        if (error.code === 11000) {
            throw ApiError.badRequest("Mã SKU hoặc Slug sách đã tồn tại trong hệ thống.");
        }
        throw error;
    }
};

const deleteBook = async (id) => {
    const book = await Book.findOne({ _id: id, isDeleted: false });
    if (!book) {
        throw ApiError.notFound("Không tìm thấy sách để xóa");
    }

    book.isDeleted = true;
    book.deletedAt = new Date();
    await book.save();

    await recountBookCategories(book);
    return book;
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};
