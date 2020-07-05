import React, { FunctionComponent } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
  Tooltip,
} from "@material-ui/core";
import { keysOf } from "../../../util/keysOf";
import { HitCounts, Possession } from "../../../store/replays/ReplayJson";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";

type GenericTeamStats = { [key: string]: number } | HitCounts | Possession;

type Props = {
  title: string;
  myTeamStats: GenericTeamStats;
  otherTeamStats: GenericTeamStats;
  teamStats: AnalysisData<any, AnalyserNode>;
} & React.HTMLAttributes<{}>;

function renderOutlier(value: number, analysisNode: AnalysisDataNode) {
  if (!analysisNode) {
    return null;
  }
  const { stdDev, mean, numberOfDataPoints } = analysisNode;
  if (numberOfDataPoints < 10) {
    return null;
  }
  const stdDevLimit = stdDev * 1;
  if (value < mean - stdDevLimit || value > mean + stdDevLimit) {
    const diff = (value - mean) / mean;
    let percentageDiff = diff * 100;
    const title = `${Math.round(percentageDiff)}%`;
    return (
      <Tooltip title={title}>
        <ErrorOutlineIcon />
      </Tooltip>
    );
  }
}

export const GenericTeamStatsTable: FunctionComponent<Props> = (props) => {
  const { title, myTeamStats, otherTeamStats, teamStats } = props;
  const keys = keysOf(myTeamStats);

  const renderTeamTableCell = (key: string, value: number) => {
    const analysisNode = teamStats[key];
    return (
      <TableCell key={key} align="right">
        {analysisNode && renderOutlier(value, analysisNode)} {Math.round(value)}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{title}</TableCell>
            <TableCell align="right">Your Team</TableCell>
            <TableCell align="right">Other Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => {
            const myTeamValue = myTeamStats[key] as number;
            return (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                {renderTeamTableCell(key, myTeamValue)}
                <TableCell align="right">
                  {Math.round(otherTeamStats[key] as number)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
