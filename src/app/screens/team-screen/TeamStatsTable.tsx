import React, { FunctionComponent } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import {
  TeamStats,
  HitCounts,
  Possession,
} from "../../store/replays/ReplayJson";
import { keysOf } from "../../util/keysOf";
import { TeamReplayAnalysisData } from "../../store/replays";

type GenericTeamStats = { [key: string]: number } | HitCounts | Possession;

type Props = {
  name: string;
  stats: AnalysisData<any, AnalysisDataNode>;
  correlations: AnalysisData<any, PearsonCorrelationNode>;
} & React.HTMLAttributes<{}>;

export const TeamStatsTable: FunctionComponent<Props> = (props) => {
  const { stats, name, correlations } = props;

  const statsKeys = keysOf(stats);
  const statsValueKeys = keysOf(stats![statsKeys[0] as string]);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>goal correlation</TableCell>
            <TableCell>p-value</TableCell>
            {statsValueKeys.map((header) => (
              <TableCell key={header as string} align="right">
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {statsKeys.map((key: keyof GenericTeamStats) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell align="right">
                {correlations![key].correlation?.toFixed(5)}
              </TableCell>
              <TableCell align="right">
                {correlations![key].pValue?.toFixed(5)}
              </TableCell>
              {statsValueKeys.map((valueKey) => (
                <TableCell key={`${key}${valueKey as string}`} align="right">
                  {Math.round(stats[key]![valueKey])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
