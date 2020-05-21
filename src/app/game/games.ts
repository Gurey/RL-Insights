import * as files from "../system/file/readFiles";
import { ReplayJSON } from "../store/replays/ReplayJson";
import { CarballAnalysisHandler } from "../system/carball/carball-json";
import { ReplayIndex, PlaylistIndex } from "../system/db/types";
import { Replay } from "@material-ui/icons";

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
  replayJson: CarballAnalysisHandler,
): PlaylistIndex {
  const { gameMetadata, players } = replayJson.getJson();
  const index: PlaylistIndex = {
    fileName: gameMetadata.id,
    gameDate: +gameMetadata.time,
    players: players.map((p) => ({
      name: p.name,
      playerId: p.id.id,
      score: p.score,
    })),
    replayName: gameMetadata.name,
    win: replayJson.didWeWin(),
  };
  return index;
}
