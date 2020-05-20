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
import { unique } from "../../../util/arrayUtils";
import {
  PlayerStats,
  ReplayJSONPlayer,
} from "../../../store/replays/ReplayJson";

type Props = {
  name: string;
  analysis: CarballAnalysisHandler;
  stat: keyof PlayerStats;
} & React.HTMLAttributes<{}>;

export const GenericPlayersStatsTable: FunctionComponent<Props> = (props) => {
  const { analysis, stat, name } = props;
  const players = analysis.getPlayers();
  const playersBoost = players.map((p) => p.stats[stat]!);
  const keys = keysOf(playersBoost[0]);
  const myPlayerId = analysis.getMyPlayerId();
  const { myTeam, otherTeam } = analysis.getTeams();
  const playerOrder = unique([
    myPlayerId,
    ...myTeam.playerIds.map((pid) => pid.id),
    ...otherTeam.playerIds.map((pid) => pid.id),
  ]);
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{name}</TableCell>
            {playerOrder.map((pid) => (
              <TableCell key={pid} align="right">
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
                  {Math.round(analysis.getPlayer(pid).stats[stat]![key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
