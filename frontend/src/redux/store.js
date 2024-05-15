import {configureStore} from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {combineReducers} from "redux";
import {FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE,} from "redux-persist";

import userReducer from "./slice/userSlice";
import categoryReducer from "./slice/categorySlice";
import productReducer from "./slice/productSlice";
import cardReducer from "./slice/cartSlice";

const rootReducers = combineReducers({
    user: userReducer,
    category: categoryReducer,
    products: productReducer,
    car: cardReducer,
});

const persistConfig = {
    key: "root",
    storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export let persistor = persistStore(store);

export default store;
