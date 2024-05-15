import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getCategory} from "../../api/category";

const initialState = {
    data: null,
    isLoading: true,
};

export const fetchCategory = createAsyncThunk("category/fetch", async () => {
    const res = await getCategory();
    return res.category;
});

export const categorySlice = createSlice({
    name: "category",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.data = null;
                state.isLoading = true;
            })
            .addCase(fetchCategory.fulfilled, (state, action) => {
                state.data = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchCategory.rejected, (state) => {
                state.data = null;
                state.isLoading = false;
            });
    },
});

export default categorySlice.reducer;
