import { defaults, Middleware } from "react-sweet-state";
import * as db from "../../system/db";

const saveState: Middleware = (storeState) => (next) => (fn) => {
  const state = storeState.getState();
  const res = next(fn);
  if (state.storeId) {
    console.log("Saving state for", state.storeId, storeState.getState());
    db.saveState(state.storeId, { ...storeState.getState() });
  }
  return res;
};

defaults.middlewares.add(saveState);
