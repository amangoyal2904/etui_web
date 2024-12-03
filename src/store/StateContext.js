"use client";

import React, { createContext, useContext, useReducer } from "react";
import combineReducers from "./combinedReducers";
import loginReducer from "../Reducers/loginReducer.ts";
import marketReducer from "../Reducers/marketReducer";
import watchlistReducer from "../Reducers/watchlistReducer.ts";
import newsletterSubReducer from "../Reducers/newsletterSubReducer.ts";

const initialState = {
  login: {
    ssoReady: "",
    isLogin: null,
    isPrime: null,
    userInfo: {},
    ssoid: "",
    ticketId: "",
    email: "",
    error: null,
    permissions: [],
    isAdfree: "",
    isPink: false
  },
  marketStatus: {
    currentMarketStatus: "",
    marketStatus: "",
    error: null,
  },
  watchlistStatus: {
    watchlist: [],
    error: null,
  },
  newsletterSubStatus: {
    newsletterSub: [],
    error: null,
  }
};

const StateContext = createContext();

export function StateProvider({ children }) {
  const [state, dispatch] = useReducer(
    combineReducers({
      login: loginReducer,
      marketStatus: marketReducer,
      watchlistStatus: watchlistReducer,
      newsletterSubStatus: newsletterSubReducer,
    }),
    initialState,
  );

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
}

export function useStateContext() {
  return useContext(StateContext);
}
