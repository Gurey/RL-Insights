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
import { CarballAnalysisHandler } from "../../../../system/carball/carball-json";
import { keysOf } from "../../../util/keysOf";

type Props = { analysis: CarballAnalysisHandler } & React.HTMLAttributes<{}>;

export const TeamCenterOfMassTable: FunctionComponent<Props> = (props) => {
  const { analysis } = props;
  const { myTeam, otherTeam } = analysis.getTeams();
  if (!myTeam.stats.centerOfMass) return null;
  const { positionalTendencies: myPt, ...myRest } = myTeam.stats.centerOfMass;
  const {
    positionalTendencies: otherPt,
    ...otherRest
  } = otherTeam.stats.centerOfMass;
  const myTeamCenterOfMass = { ...myPt, ...myRest };
  const otherTeamCenterOfMass = { ...otherPt, ...otherRest };

  const keys = keysOf(myTeamCenterOfMass);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Center of mass</TableCell>
            <TableCell align="right">Your Team</TableCell>
            <TableCell align="right">Other Team</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              <TableCell align="right">
                {Math.round(myTeamCenterOfMass[key] as number)}
              </TableCell>
              <TableCell align="right">
                {Math.round(otherTeamCenterOfMass[key] as number)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
