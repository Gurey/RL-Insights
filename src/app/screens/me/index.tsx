import React, { useMemo, useState } from "react";
import * as db from "../../system/db";
import { usePlayers } from "../../store/player";
import { useSettings } from "../../store/settings/settingsStore";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import { readFileAsObject } from "../../system/file/readFiles";
import { PlaylistIndex, PlaylistIndexContainer } from "../../system/db/types";
import { ReplayJSON, PlayerStats } from "../../store/replays/ReplayJson";
import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import { getStats } from "../../objectMath/objectMath";
import { PlayerStatsTable } from "./PlayerStatsTable";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      flex: 1,
      display: "flex",
      justifyContent: "space-between",
    },
    tableContainer: {
      marginBottom: theme.spacing(3),
    },
  }),
);

function calculateMeans(
  files: PlaylistIndexContainer,
  playerId: string,
  setStatus: (status: string) => void,
  setPlayerStats: (playerStats: AnalysisData<PlayerStats>) => void,
) {
  const replays = Object.keys(files);
  const filesLength = replays.length;
  console.log("Number of replays", filesLength);
  setStatus("Loading files...");
  const playerStats: PlayerStats[] = [];
  for (const replayIndexKey of replays) {
    const replayIndex = files[replayIndexKey];
    const fileContent = readFileAsObject<ReplayJSON>(replayIndex.jsonPath);
    const carballHandler = new CarballAnalysisHandler(fileContent, playerId);
    playerStats.push(carballHandler.getPlayer(playerId).stats);
  }
  setStatus("Getting stats...");
  const stats = getStats(playerStats) as AnalysisData<PlayerStats>;
  setStatus("Stats done!");
  setPlayerStats(stats);
  console.log("Done reading all the files");
}

export default function Me(props: any) {
  const [playersState, playersActions] = usePlayers();
  const [settingsState, settingsActions] = useSettings();
  const [status, setStatus] = useState("");
  const [playerStats, setPlayerStats] = useState(
    {} as AnalysisData<PlayerStats>,
  );
  const classes = useStyles();
  const playlists = db.replayIndex().getPlaylists();
  const files = db.replayIndex().getReplays(playlists[0]);
  useMemo(
    () =>
      calculateMeans(files, settingsState.playerId, setStatus, setPlayerStats),
    [],
  );
  return (
    <div>
      <div className={classes.header}>
        <Typography variant="h4">{settingsState.playerName}</Typography>
        <Typography variant="h4">{playlists[0]}</Typography>
      </div>
      <Card>
        <CardContent>
          <Typography>
            wins:{" "}
            {Object.values(files).reduce(
              (acc, file) => (file.win ? acc + 1 : acc),
              0,
            )}
          </Typography>
          <Typography>
            losses{" "}
            {Object.values(files).reduce(
              (acc, file) => (file.win ? acc : acc + 1),
              0,
            )}
          </Typography>
        </CardContent>
      </Card>
      <div>
        {playerStats && (
          <div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="boost"
                name="Boost"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="hitCounts"
                name="Hit counts"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="distance"
                name="Distance"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="speed"
                name="Speed"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="possession"
                name="Possession"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="positionalTendencies"
                name="Positional tendencies"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="relativePositioning"
                name="Relative positioning"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="kickoffStats"
                name="Kickoff"
              />
            </div>
            <div className={classes.tableContainer}>
              <PlayerStatsTable
                analysis={playerStats}
                stat="averages"
                name="Averages"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
