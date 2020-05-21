import { defaults, Middleware } from "react-sweet-state";
import * as db from "../../system/db";

const saveState: Middleware = (storeState) => (next) => (fn) => {
  const state = storeState.getState();
  const result = next(fn);
  const nextState = storeState.getState();
  if (
    state.storeId &&
    !!nextState &&
    JSON.stringify(state) !== JSON.stringify(nextState)
  ) {
    console.log("Saving state for", state.storeId, nextState, state);
    db.saveState(state.storeId, { ...storeState.getState() });
  }
  return result;
};

defaults.middlewares.add(saveState);
