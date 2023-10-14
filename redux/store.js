import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { gameReducer } from "./slices/gameSlice";

const appReducers = combineReducers({
  game: gameReducer,
});

export const store = configureStore({
  reducer: appReducers,
});
