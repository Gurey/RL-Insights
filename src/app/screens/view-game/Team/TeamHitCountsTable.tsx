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
import { CarballAnalysisHandler } from "../../../system/carball/carball-json";
import { keysOf } from "../../../util/keysOf";

type Props = { analysis: CarballAnalysisHandler } & React.HTMLAttributes<{}>;

export const TeamHitCountsTable: FunctionComponent<Props> = (props) => {
  const { analysis } = props;
  const { myTeam, otherTeam } = analysis.getTeams();
  const myTeamHits = myTeam.stats.hitCounts;
  const otherTeamHits = otherTeam.stats.hitCounts;
  const keys = keysOf(myTeamHits);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Hit counts</TableCell>
            <TableCell align="right">Your Team</TableCell>
            <TableCell align="right">Other Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell align="right">
                {Math.round(myTeamHits[key] as number)}
              </TableCell>
              <TableCell align="right">
                {Math.round(otherTeamHits[key] as number)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
