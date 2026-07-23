import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Swal from "sweetalert2";
import { Book } from '../../types/book.types';

export interface CartState {
    cartItems: Book[];
}

const initialState: CartState = {
    cartItems: []
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<Book>) => {
            const existingItem = state.cartItems.find(item => item.id === action.payload.id || (item as any)._id === (action.payload as any)._id);
            if (!existingItem) {
                state.cartItems.push(action.payload);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Product Added to the Cart",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire({
                    title: "Already Added to the Cart",
                    text: "You won't be able to revert this!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "OK!"
                });
            }
        },
        removeFromCart: (state, action: PayloadAction<Book>) => {
            state.cartItems = state.cartItems.filter(item => item.id !== action.payload.id && (item as any)._id !== (action.payload as any)._id)
        },
        clearCart: (state) => {
            state.cartItems = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart , clearCart} = cartSlice.actions;

export default cartSlice.reducer