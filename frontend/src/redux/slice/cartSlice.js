import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    data: null,
};

export const cartSlice = createSlice({
    name: "card",
    initialState: initialState,
    reducers: {
        getCartUser: (state, action) => {
            state.data = action.payload;
        },
        increase: (state, action) => {
            const checkIndex = state.data.findIndex(
                (item) => item._id === action.payload._id
            );
            if (checkIndex !== -1) {
                state.data[checkIndex].quantity = action.payload.quantity + 1;
            }
        },
        decrease: (state, action) => {
            const checkIndex = state.data.findIndex(
                (item) => item._id === action.payload._id
            );
            if (checkIndex !== -1) {
                state.data[checkIndex].quantity = action.payload.quantity - 1;
            }
        },
        clearCart: (state, action) => {
            state.data = [];
        },
    },
});

export const {increase, decrease, clearCart, getCartUser} =
    cartSlice.actions;
export default cartSlice.reducer;
