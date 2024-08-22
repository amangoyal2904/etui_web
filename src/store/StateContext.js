"use client";

import React, { createContext, useContext, useReducer } from "react";
import combineReducers from "./combinedReducers";
import loginReducer from "../Reducers/loginReducer.ts";

const initialState = {
  login: {
    ssoReady: "",
    isLogin: "",
    isPrime: "",
    userInfo: {},
    ssoid: "",
    ticketId: "",
    email: "",
    error: null,
    permissions: [],
    isAdfree: "",
    isPink: false
  }
};

const StateContext = createContext();

export function StateProvider({ children }) {
  const [state, dispatch] = useReducer(
    combineReducers({
      login: loginReducer
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
