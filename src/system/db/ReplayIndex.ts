import ElectronStore from "electron-store";
import {
  ReplayIndex,
  PlaylistIndex,
  PlaylistIndexContainer,
  GameSession,
} from "./types";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { sortObject, sortObjectByKey } from "../../app/util/sortObject";

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
    if (!index) return index;
    return Object.keys(index);
  }

  getReplays(playlist: string) {
    const files = this.store.get(`index.playlist.${playlist}`) as PlaylistIndex;
    return sortObjectByKey(files, "gameDate") as PlaylistIndexContainer;
  }

  getReplay(replayName: string) {
    console.log(replayName);
    const playlists = this.getPlaylists();
    for (const playlist of playlists) {
      console.log(playlist);
      const replay = this.store.get(`index.playlist.${playlist}.${replayName}`);
      if (replay) {
        return replay as PlaylistIndex;
      }
    }
    return null;
  }

  getSessions(playlist: string) {
    const replayList = this.getReplays(playlist);
    if (!replayList) return [];
    const keys = Object.keys(replayList);
    const response: GameSession[] = [];
    let currentSession = {} as Partial<GameSession>;
    for (const replayId of keys) {
      const { replays } = currentSession;
      const replay = replayList[replayId];
      const addReplay = () => {
        const array = currentSession.replays || [];
        array.push(replay);
        if (!currentSession.to) {
          currentSession.to = replay.gameDate;
        }
        console.log("Adding from");
        currentSession.from = replay.gameDate;
        currentSession.replays = array;
      };
      if (
        !replays ||
        replays[replays.length - 1].gameDate - replay.gameDate < 3600
      ) {
        addReplay();
      } else {
        console.log("Creating new session");
        currentSession.wins = currentSession.replays!.reduce(
          (acc, r) => (r.win ? acc + 1 : acc),
          0,
        );
        currentSession.losses =
          currentSession.replays!.length - currentSession.wins;
        response.push(currentSession as GameSession);
        currentSession = {};
        addReplay();
      }
    }
    if (response.indexOf(currentSession as GameSession) === -1) {
      response.push(currentSession as GameSession);
    }
    console.log(response);
    return response;
  }

  getTeams() {}
}
