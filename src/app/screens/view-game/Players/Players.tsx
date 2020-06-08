import React, { FunctionComponent } from "react";
import { Typography, makeStyles, createStyles } from "@material-ui/core";
import { CarballAnalysisHandler } from "../../../../system/carball/carball-json";
import { GenericPlayersStatsTable } from "./GenericPlayersStatsTable";
import { PlayerStats } from "../../../store/replays/ReplayJson";
import { ReplaysState, PlayersAnalysisData } from "../../../store/replays";

type Props = {
  analysis: CarballAnalysisHandler;
  //playerStats: { [key: string]: AnalysisData<PlayerStats> };
  playerStats: PlayersAnalysisData;
} & React.HTMLAttributes<{}>;

const useStyle = makeStyles((theme) =>
  createStyles({
    header: {
      paddingBottom: theme.spacing(2),
    },
    tableContainer: {
      marginBottom: theme.spacing(3),
    },
  }),
);

export const Players: FunctionComponent<Props> = (props) => {
  const { analysis, playerStats } = props;
  const classes = useStyle();

  return (
    <div className={`${props.className}`}>
      <Typography className={classes.header} variant="h4">
        Player stats
      </Typography>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="boost"
          name="Boost"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="hitCounts"
          name="Hit counts"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="distance"
          name="Distance"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="speed"
          name="Speed"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="possession"
          name="Possession"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="positionalTendencies"
          name="Positional tendencies"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="relativePositioning"
          name="Relative positioning"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="kickoffStats"
          name="Kickoff"
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericPlayersStatsTable
          analysis={analysis}
          stat="averages"
          name="Averages"
        />
      </div>
    </div>
  );
};
