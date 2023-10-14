import { createSlice } from "@reduxjs/toolkit";

// Define the initial state using that type
const initialState = {
  settings: {
    allowSound: true,
    allowMusic: true,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    saveGameSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const { saveGameSettings } = gameSlice.actions;

export const selectSettingsState = (state) => state.game.settings;

// Reducer
export const gameReducer = gameSlice.reducer;
