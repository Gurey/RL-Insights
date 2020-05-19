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
import { CarballAnalysisHandler } from "../../../carball/carball-json";
import { keysOf } from "../../../util/keysOf";

type Props = { analysis: CarballAnalysisHandler } & React.HTMLAttributes<{}>;

export const TeamPossessionTable: FunctionComponent<Props> = (props) => {
  const { analysis } = props;
  const { myTeam, otherTeam } = analysis.getTeams();
  const myTeamPos = myTeam.stats.possession;
  const otherTeamPos = otherTeam.stats.possession;
  const keys = keysOf(myTeamPos);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Possession</TableCell>
            <TableCell align="right">Your Team</TableCell>
            <TableCell align="right">Other Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell align="right">
                {Math.round(myTeamPos[key] as number)}
              </TableCell>
              <TableCell align="right">
                {Math.round(otherTeamPos[key] as number)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
