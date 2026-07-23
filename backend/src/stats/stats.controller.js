const Order = require('../orders/order.model');
const Book = require('../books/book.model');
const ApiResponse = require("../core/ApiResponse");
const asyncHandler = require("../core/asyncHandler");

const getAdminStats = asyncHandler(async (req, res) => {
    // 1. Total number of orders
    const totalOrders = await Order.countDocuments();

    // 2. Total sales (sum of all totalPrice from orders)
    const totalSalesAggr = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: "$totalPrice" },
            }
        }
    ]);
    const totalSales = totalSalesAggr[0]?.totalSales || 0;

    // 3. Trending books statistics
    const trendingBooksCount = await Book.aggregate([
        { $match: { trending: true } },
        { $count: "trendingBooksCount" }
    ]);
    const trendingBooks = trendingBooksCount.length > 0 ? trendingBooksCount[0].trendingBooksCount : 0;

    // 4. Total number of books
    const totalBooks = await Book.countDocuments();

    // 5. Monthly sales
    const monthlySales = await Order.aggregate([
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                totalSales: { $sum: "$totalPrice" },
                totalOrders: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }  
    ]);

    res.status(200).json(
        ApiResponse.success({
            totalOrders,
            totalSales,
            trendingBooks,
            totalBooks,
            monthlySales
        })
    );
});

module.exports = {
    getAdminStats
};
