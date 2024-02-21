import { createSlice } from "@reduxjs/toolkit";

export const FavPlacesSlice = createSlice({
  name: "HostelBooking",
  initialState: {
    favorite: [],
  },
  reducers: {
    addFavorite: (state, action) => {
      state.favorite.push({ ...action.payload });
    },
    removeFavorite: (state, action) => {
      state.favorite = state.favorite.filter(
        (favorite) => favorite.id !== action.payload.id
      );
    },
  },
});

export const { addFavorite, removeFavorite } = FavPlacesSlice.actions;

export default FavPlacesSlice.reducer;
