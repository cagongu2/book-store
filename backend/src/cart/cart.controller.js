const Cart = require('./cart.model');
const ApiResponse = require("../core/ApiResponse");
const ApiError = require("../core/ApiError");
const asyncHandler = require("../core/asyncHandler");
const CartMapper = require("./cart.mapper");

const mergeCart = asyncHandler(async (req, res) => {
    const { localCartItems } = req.body;
    const customerId = req.customer.id;

    let cart = await Cart.findOne({ customerId });

    if (!cart) {
        cart = new Cart({ customerId, items: [] });
    }

    if (localCartItems && localCartItems.length > 0) {
        localCartItems.forEach(localItem => {
            const existingItem = cart.items.find(item => item.bookId.toString() === localItem.bookId);
            
            if (existingItem) {
                // Ưu tiên quantity lớn hơn
                if (localItem.quantity > existingItem.quantity) {
                    existingItem.quantity = localItem.quantity;
                }
            } else {
                cart.items.push({ bookId: localItem.bookId, quantity: localItem.quantity });
            }
        });
        await cart.save();
    }

    // Populate bookId to return full details if needed, for now just map
    res.status(200).json(
        ApiResponse.success({ cart: CartMapper.toResponse(cart) }, "Gộp giỏ hàng thành công")
    );
});

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ customerId: req.customer.id }).populate('items.bookId');
    
    res.status(200).json(
        ApiResponse.success({ cart: cart ? CartMapper.toResponse(cart) : { items: [] } })
    );
});

module.exports = {
    mergeCart,
    getCart
};
