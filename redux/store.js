// import { configureStore, combineReducers } from "@reduxjs/toolkit";
// import { gameReducer } from "./slices/gameSlice";
// import authslice from "./slices/authslice";

// const appReducers = combineReducers({
//   game: gameReducer,
//   authslice: authslice,
// });

// export const store = configureStore({
//   reducer: appReducers,
// });

import {
  configureStore,
  combineReducers,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
// import { combineReducers } from "redux";
import { gameReducer } from "./slices/gameSlice";
import authslice from "./slices/authslice";
import Leaderboardslice from "./slices/Leaderboardslice";

const reducers = combineReducers({
  game: gameReducer,
  authslice: authslice,
  Leaderboardslice: Leaderboardslice,
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware option needs to be provided for avoiding the error. ref: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },

      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
