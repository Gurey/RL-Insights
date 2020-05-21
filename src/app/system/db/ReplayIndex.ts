import ElectronStore from "electron-store";
import { ReplayIndex, PlaylistIndex } from "./types";

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
}
