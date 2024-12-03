// watchlistReducer.ts
import { Reducer } from "react";

interface newsletterSubState {
  newsletterSub: [];
  error: any | null;
}

type newsletterSubAction = { type: "SET_NEWSLETTER_SUBSCRIPTION_STATUS"; payload: any };

const newsletterSubReducer: Reducer<newsletterSubState, newsletterSubAction> = (
  state,
  action,
) => {
  switch (action.type) {
    case "SET_NEWSLETTER_SUBSCRIPTION_STATUS":
      return {
        ...state,
        newsletterSub: action?.payload?.newsletterSub || [],
        error: null,
      };
    default:
      return state;
  }
};

export default newsletterSubReducer;
