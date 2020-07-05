import * as files from "../../system/file/readFiles";
import {
  ReplayJSON,
  ReplayJSONPlayer,
  Team,
} from "../../app/store/replays/ReplayJson";
import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import { PlaylistIndex, Player } from "../../system/db/types";

export async function getWinsAndLosses(
  paths: string[],
  playerId: string,
): Promise<WinsLosses> {
  const winAndLoss = await Promise.all(
    paths.map((path) => {
      const replay = files.readFileAsObject<ReplayJSON>(path);
      const analysis = new CarballAnalysisHandler(replay, playerId);
      return analysis.didWeWin() ? 1 : 0;
    }),
  );
  return winAndLoss.reduce(
    (acc, curr) => {
      if (curr === 1) {
        acc.wins += 1;
      } else {
        acc.losses += 1;
      }
      return acc;
    },
    {
      wins: 0,
      losses: 0,
    },
  );
}

export function createReplayIndex(
  jsonPath: string,
  replayJson: CarballAnalysisHandler,
): PlaylistIndex {
  const { gameMetadata, players } = replayJson.getJson();
  const { myTeam, otherTeam } = replayJson.getTeams();
  const index: PlaylistIndex = {
    fileName: gameMetadata.id,
    jsonPath,
    gameDate: +gameMetadata.time,
    myTeam: playersToIndexPlayers(players, myTeam),
    otherTeam: playersToIndexPlayers(players, otherTeam),
    replayName: gameMetadata.name,
    win: replayJson.didWeWin(),
  };
  return index;
}

function playersToIndexPlayers(
  rawPlayers: ReplayJSONPlayer[],
  team: Team,
): Player[] {
  return rawPlayers
    .filter((p) => team.playerIds.some((p2) => p2.id === p.id.id))
    .map((p) => ({
      name: p.name,
      playerId: p.id.id,
      score: p.score,
    }));
}
