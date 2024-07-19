import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { HistoryItem } from "../types";

const slice = createSlice({
  name: "history",
  initialState: [] as HistoryItem[],
  reducers: {
    addHistory: (state: HistoryItem[], action: PayloadAction<HistoryItem>) => state.concat(action.payload),
  },
});

export default slice;
