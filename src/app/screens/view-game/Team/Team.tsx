import React, { FunctionComponent } from "react";
import {
  Paper,
  Typography,
  makeStyles,
  createStyles,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import { CarballAnalysisHandler } from "../../../../system/carball/carball-json";
import { CustomDemo } from "../../../../system/carball/types";
import { Possession } from "../../../store/replays/ReplayJson";
import { keysOf } from "../../../util/keysOf";
import { TeamPossessionTable } from "./TeamPossessionTable";
import { TeamHitCountsTable } from "./TeamHitCountsTable";
import { TeamCenterOfMassTable } from "./TeamCenterOfMassTable";

type Props = { analysis: CarballAnalysisHandler } & React.HTMLAttributes<{}>;

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
  const { analysis } = props;
  const classes = useStyle();

  return (
    <div className={`${props.className}`}>
      <Typography className={classes.header} variant="h4">
        Team stats
      </Typography>
      <div className={classes.tableContainer}>
        <TeamPossessionTable analysis={analysis}></TeamPossessionTable>
      </div>
      <div className={classes.tableContainer}>
        <TeamHitCountsTable analysis={analysis}></TeamHitCountsTable>
      </div>
      <div className={classes.tableContainer}>
        <TeamCenterOfMassTable analysis={analysis}></TeamCenterOfMassTable>
      </div>
    </div>
  );
};
