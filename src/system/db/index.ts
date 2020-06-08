import EStore from "electron-store";
import { ReplayIndexDB } from "./ReplayIndex";
const db = new EStore();
console.log("Database:", db.path);

export function saveState(storeId: string, state: any) {
  console.log(` Saving state (${storeId})`, state);
  db.set(`state.${storeId}`, state);
}

export function getState(storeId: string, def: any = {}) {
  return db.get(`state.${storeId}`, def);
}

export function getPlayerId() {
  return getState("settings").playerId;
}

export function replayIndex() {
  return new ReplayIndexDB(db);
}
