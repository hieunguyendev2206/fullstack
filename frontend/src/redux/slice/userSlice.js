import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: null,
};
export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        getUser: (state, action) => {
            state.user = action.payload;
        },
    },
});

export const {getUser} = userSlice.actions;
export default userSlice.reducer;
