import React, { FunctionComponent } from "react";
import { Typography, makeStyles, createStyles } from "@material-ui/core";
import { CarballAnalysisHandler } from "../../../../system/carball/carball-json";
import { TeamStats } from "../../../store/replays/ReplayJson";
import { GenericTeamStatsTable } from "./GenericTeamStatsTable";
import { TeamReplayAnalysisData } from "../../../store/replays";

type Props = {
  analysis: CarballAnalysisHandler;
  teamStats: TeamReplayAnalysisData;
} & React.HTMLAttributes<{}>;

function getTimeString(time: number) {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  const potentialZero = seconds < 10 ? "0" : "";
  return `${minutes}:${potentialZero}${Math.round(seconds)}`;
}

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

export const Team: FunctionComponent<Props> = (props) => {
  const { analysis, teamStats } = props;
  const classes = useStyle();
  const myTeamStats = analysis.getTeamStatsNormalized();
  const otherTeamStats = analysis.getTeamStatsNormalized("otherTeam");
  return (
    <div className={`${props.className}`}>
      <Typography className={classes.header} variant="h4">
        Team stats
      </Typography>
      <div className={classes.tableContainer}>
        <GenericTeamStatsTable
          title="Possession"
          myTeamStats={myTeamStats.possession}
          otherTeamStats={otherTeamStats.possession}
          teamStats={teamStats.stats.possession}
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericTeamStatsTable
          title="Hit counts"
          myTeamStats={myTeamStats.hitCounts}
          otherTeamStats={otherTeamStats.hitCounts}
          teamStats={teamStats.stats.hitCounts}
        />
      </div>
      <div className={classes.tableContainer}>
        <GenericTeamStatsTable
          title="Center of mass"
          myTeamStats={myTeamStats.centerOfMass.positionalTendencies}
          otherTeamStats={otherTeamStats.centerOfMass.positionalTendencies}
          teamStats={teamStats.stats.centerOfMass.positionalTendencies}
        />
      </div>
    </div>
  );
};
