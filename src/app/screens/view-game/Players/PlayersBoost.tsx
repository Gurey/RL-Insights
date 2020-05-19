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
import { unique } from "../../../util/arrayUtils";

type Props = { analysis: CarballAnalysisHandler } & React.HTMLAttributes<{}>;

export const PlayersBoost: FunctionComponent<Props> = (props) => {
  const { analysis } = props;
  const players = analysis.getPlayers();
  const playersBoost = players.map((p) => p.stats.boost);
  const keys = keysOf(playersBoost[0]);
  const myPlayerId = analysis.getMyPlayerId();
  const { myTeam, otherTeam } = analysis.getTeams();
  const playerOrder = unique([
    myPlayerId,
    ...myTeam.playerIds.map((pid) => pid.id),
    ...otherTeam.playerIds.map((pid) => pid.id),
  ]);
  console.log(myPlayerId, playerOrder, keys);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Boost</TableCell>
            {playerOrder.map((pid) => (
              <TableCell align="right">
                {analysis.getPlayer(pid).name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              {playerOrder.map((pid) => (
                <TableCell key={`${pid}${key}`} align="right">
                  {Math.round(analysis.getPlayer(pid).stats.boost[key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
