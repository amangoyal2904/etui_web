import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import login from "Slices/login";

const reducer = combineReducers({
  login
});

export const store = configureStore({
  reducer
});
const makeStore = () => store;

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<typeof store.getState>;
