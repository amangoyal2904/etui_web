// loginReducer.ts
import { Reducer } from "react";

interface LoginState {
  isLogin: boolean;
  isPrime: boolean;
  ssoReady: boolean;
  userInfo: any | null;
  ssoid: any | null;
  ticketId: any | null;
  accessibleFeatures: any | null;
  permissions: any | null;
  error: any | null;
}

type LoginAction = { type: "LOGIN_SUCCESS"; payload: any } | { type: "LOGOUT"; payload: any } | { type: "SETPINKTHEME"; payload: any };

const loginReducer: Reducer<LoginState, LoginAction> = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { 
        ...state, 
        ssoReady: action.payload.ssoReady, 
        isLogin: true,
        isPrime: action.payload.isPrime,
        ssoid: action.payload.ssoid, 
        ticketId: action.payload.ticketId,  
        userInfo: action.payload.userInfo,
        accessibleFeatures: action.payload.accessibleFeatures,
        permissions: action.payload.permissions, 
        email: action.payload.userInfo?.primaryEmail,
        isAdfree: action.payload.isAdfree,
        error: null ,
        subscriptionDetails: action.payload.subscriptionDetails,
      };
    case "LOGOUT":
      return { 
        ...state, 
        ssoReady: action.payload.ssoReady, 
        isLogin: false, 
        isPrime: false,
        ssoid: "", 
        ticketId: "", 
        userInfo: {}, 
        accessibleFeatures: [], 
        permissions: [], 
        email: "",
        isAdfree: action.payload.ssoReady,
        error: null,
        subscriptionDetails: {}
      };
    case "SETPINKTHEME": 
      return {
        ...state,
        isPink: action.payload.isPink,
      }; 
    default:
      return state;
  }
};

export default loginReducer;
