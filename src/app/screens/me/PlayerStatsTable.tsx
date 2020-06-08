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
import { PlayerStats } from "../../store/replays/ReplayJson";
import { keysOf } from "../../util/keysOf";
import { ReplayAnalysisData } from "../../store/replays";

type Props = {
  name: string;
  analysis: ReplayAnalysisData;
  stat: keyof PlayerStats;
} & React.HTMLAttributes<{}>;

export const PlayerStatsTable: FunctionComponent<Props> = (props) => {
  const { analysis, stat, name } = props;
  const statGrp = analysis.stats[stat]!;
  const statsKeys = keysOf(statGrp);
  const statsValueKeys = keysOf(analysis.stats[stat]![statsKeys[0]]);
  console.log("grp");
  console.log(statGrp);
  console.log("statsKeys");
  console.log(statsKeys);

  console.log("statsValueKeys");
  console.log(statsValueKeys);
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
          {statsKeys.map((key: keyof PlayerStats) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell align="right">
                {analysis.goalDiffCorr[stat]![key].correlation?.toFixed(3)}
              </TableCell>
              <TableCell align="right">
                {analysis.goalDiffCorr[stat]![key].pValue?.toFixed(5)}
              </TableCell>
              {statsValueKeys.map((valueKey) => (
                <TableCell key={`${key}${valueKey as string}`} align="right">
                  {Math.round(statGrp[key]![valueKey])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
