import { combineReducers } from "@reduxjs/toolkit";
import { blackjackApi } from "../services/blackjack";
import historySlice from "./historySlice";
import handSlice from "./handSlice";

const rootReducer = combineReducers({
  game: blackjackApi.reducer,
  history: historySlice.reducer,
  hand: handSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
