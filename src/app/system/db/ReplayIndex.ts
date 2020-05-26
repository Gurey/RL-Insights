import ElectronStore from "electron-store";
import { ReplayIndex, PlaylistIndex, PlaylistIndexContainer } from "./types";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { sortObject, sortObjectByKey } from "../../util/sortObject";

export class ReplayIndexDB {
  private store: ElectronStore;
  constructor(store: ElectronStore) {
    this.store = store;
  }

  saveReplayIndex(playlist: string, index: PlaylistIndex) {
    const key = `index.playlist.${playlist}.${index.fileName}`;
    this.store.set(key, index);
    console.log(this.store.path);
  }

  getPlaylists() {
    const index = this.store.get("index.playlist");
    return Object.keys(index);
  }

  getReplays(playlist: string) {
    const files = this.store.get(`index.playlist.${playlist}`) as PlaylistIndex;
    return sortObjectByKey(files, "gameDate") as PlaylistIndexContainer;
  }
}
