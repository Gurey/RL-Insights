import React, { useEffect } from "react";
import * as db from "../../../system/db";
import {
  Typography,
  makeStyles,
  Theme,
  createStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import { PlaylistIndexContainer } from "../../../system/db/types";
import { PlayerStats } from "../../store/replays/ReplayJson";
import { useReplays } from "../../store/replays";
import { PlayerStatsTable } from "./PlayerStatsTable";
import { ReplaysAnalysis } from "../../analysis/Analysis";
import { useParams } from "react-router-dom";

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
  setPlayerStats: (
    playerStats: AnalysisData<PlayerStats, AnalysisDataNode>,
  ) => void,
) {
  const replays = Object.keys(files);
  const filesLength = replays.length;
  console.log("Number of replays", filesLength);
  setStatus("Loading files...");
  const replayFiles: string[] = [];
  for (const replayIndexKey of replays) {
    const replayIndex = files[replayIndexKey];
    replayFiles.push(replayIndex.jsonPath);
  }
  const analysis = new ReplaysAnalysis(replayFiles, playerId);
  setPlayerStats(analysis.playerStats(setStatus));
}

export default function Me(props: any) {
  const { playerId } = useParams();
  const [replays, replayActions] = useReplays();
  const classes = useStyles();
  const playlists = db.replayIndex().getPlaylists();
  const files = db.replayIndex().getReplays(playlists[0]);
  const playerStats = replays.playersAnalysisData[playerId];
  const playerName = db.replayIndex().getPlayerNameById(playerId, playlists[0]);
  useEffect(() => {
    if (playlists) {
      replayActions.loadPlayerStats(playerId, playlists[0]);
    }
  }, [replays.lastImportTime]);
  if (!playlists) {
    return <Typography>No replays imported yet!</Typography>;
  }
  return (
    <div>
      <div className={classes.header}>
        <Typography variant="h4">{playerName}</Typography>
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
