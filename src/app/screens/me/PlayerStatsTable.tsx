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

type Props = {
  name: string;
  analysis: AnalysisData<PlayerStats>;
  stat: keyof PlayerStats;
} & React.HTMLAttributes<{}>;

export const PlayerStatsTable: FunctionComponent<Props> = (props) => {
  const { analysis, stat, name } = props;
  const statGrp = analysis[stat]!;
  const statsKeys = keysOf(statGrp);
  const statsValueKeys = keysOf(analysis[stat]![statsKeys[0]]);
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
            {statsValueKeys.map((header) => (
              <TableCell key={header as string} align="right">
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {statsKeys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              {statsValueKeys.map((valueKey) => (
                <TableCell key={`${key}`} align="right">
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
