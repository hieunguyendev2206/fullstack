import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getProduct} from "../../api/product";

const initialState = {
    data: null,
    isLoading: true,
};

export const fetchProduct = createAsyncThunk("product/fetch", async () => {
    const res = await getProduct();
    return res.products;
});

export const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProduct.pending, (state) => {
                state.data = null;
                state.isLoading = true;
            })
            .addCase(fetchProduct.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchProduct.rejected, (state) => {
                state.data = null;
                state.isLoading = false;
            });
    },
});

export default productSlice.reducer;
