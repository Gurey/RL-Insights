import ElectronStore from "electron-store";
import {
  ReplayIndex,
  PlaylistIndex,
  PlaylistIndexContainer,
  GameSession,
  PlaylistTeam,
  Player,
} from "./types";
import { keys } from "@material-ui/core/styles/createBreakpoints";
import { sortObject, sortObjectByKey } from "../../app/util/sortObject";
import { getTeamId } from "./util/ids";

export class ReplayIndexDB {
  private store: ElectronStore;
  constructor(store: ElectronStore) {
    this.store = store;
  }

  saveReplayIndex(playlist: string, index: PlaylistIndex) {
    const key = `index.playlist.${playlist}.${index.fileName}`;
    this.store.set(key, index);
  }

  getPlaylists(): string[] {
    const index = this.store.get("index.playlist");
    if (!index) return index;
    return Object.keys(index);
  }

  getReplays(playlist: string) {
    const files = this.store.get(`index.playlist.${playlist}`) as PlaylistIndex;
    return sortObjectByKey(files, "gameDate") as PlaylistIndexContainer;
  }

  getTeamReplays(playlist: string, teamId: string) {
    const files = this.getReplays(playlist);

    const replayIds = Object.keys(files);
    const response: PlaylistIndex[] = [];
    for (const replayId of replayIds) {
      const replay = files[replayId];
      const myTeam = replay.myTeam;
      console.log(myTeam);
      if (this.teamIdFromPlayers(myTeam) === teamId) {
        response.push(replay);
      }
    }

    return response;
  }

  getReplay(replayName: string) {
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

  getSessions(playlist: string, teamId: string | null = null) {
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
    if (teamId) {
      return response
        .map((sess) => {
          sess.replays = sess.replays.filter(
            (players) => this.teamIdFromPlayers(players.myTeam) === teamId,
          );
          return sess;
        })
        .filter((sess) => sess.replays.length > 0);
    }
    return response;
  }

  getTeams() {
    const teamMap = new Map<string, PlaylistTeam>();
    const playLists = this.getPlaylists();
    playLists.forEach((playlist) => {
      const replays = this.getReplays(playlist);
      const keys = Object.keys(replays);
      keys.forEach((key) => {
        const replay = replays[key];
        const teamId = this.teamIdFromPlayers(replay.myTeam);
        if (!teamMap.has(teamId)) {
          teamMap.set(teamId, {
            teamId: teamId,
            players: replay.myTeam.map((p) => ({
              name: p.name,
              playerId: p.playerId,
            })),
            games: [replay],
            playlist: playlist,
          });
        } else {
          const team = teamMap.get(teamId);
          team!.games.push(replay);
          teamMap.set(teamId, team!);
        }
      });
    });
    return Array.from(teamMap.values());
  }

  private teamIdFromPlayers(players: Player[]) {
    return getTeamId(players.map((p) => p.playerId));
  }

  getPlayerNameById(playerId: string, playlist: string) {
    const replays = this.getReplays(playlist);
    for (const replay of Array.from(Object.values(replays))) {
      const player = replay.myTeam.find((p) => p.playerId === playerId);
      if (player) {
        return player.name;
      }
    }
    playerId;
  }
}
