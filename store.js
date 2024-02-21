import {configureStore} from "@reduxjs/toolkit";
import SavedReducer from "./SavedReducer";
import FavouriteReducer from "./FavouriteReducer";
import userReducer from "./userReducer";

export default configureStore({
    reducer:{
        booking: SavedReducer,
        favorite: FavouriteReducer,
        user: userReducer,
    }
})
