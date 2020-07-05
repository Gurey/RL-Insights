import React, { FunctionComponent, useEffect } from "react";
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
import { CarballAnalysisHandler } from "../../../../system/carball/carball-json";
import { keysOf } from "../../../util/keysOf";
import { unique } from "../../../util/arrayUtils";
import { PlayerStats } from "../../../store/replays/ReplayJson";
import { useReplays } from "../../../store/replays";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import { useHistory } from "react-router-dom";

type Props = {
  name: string;
  analysis: CarballAnalysisHandler;
  stat: keyof PlayerStats;
} & React.HTMLAttributes<{}>;

function renderOutlier(
  value: number,
  analysisNode: AnalysisDataNode,
  winCorr: number,
) {
  if (!analysisNode) {
    return null;
  }
  const { stdDev, mean, numberOfDataPoints } = analysisNode;
  if (numberOfDataPoints < 10) {
    return null;
  }
  const stdDevLimit = stdDev * 2;
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

export const GenericPlayersStatsTable: FunctionComponent<Props> = (props) => {
  const { analysis, stat, name } = props;
  const [replays, replaysActions] = useReplays();
  const players = analysis.getPlayers();
  const myPlayerId = analysis.getMyPlayerId();
  const { myTeam, otherTeam } = analysis.getTeams();
  const history = useHistory();
  const playerOrder = unique([
    myPlayerId,
    ...myTeam.playerIds.map((pid) => pid.id).sort(),
    ...otherTeam.playerIds.map((pid) => pid.id),
  ]);
  useEffect(() => {
    new Promise((resolve, reject) => {
      myTeam.playerIds.forEach((p) => {
        replaysActions.loadPlayerStats(
          p.id,
          analysis.getJson().gameMetadata.playlist,
        );
      });
      resolve();
    });
  }, []);
  const playerStats = players.map(
    (p) => analysis.getPlayerStatsNormalized(p.id.id)[stat]!,
  );
  if (!playerStats[0]) {
    return null;
  }
  const keys = keysOf(playerStats[0]);
  const renderPlayerTableCell = (
    pid: string,
    stat: string,
    key: string,
    playerStatIndex: number,
  ) => {
    const analysisNode =
      // @ts-ignore
      replays.playersAnalysisData[pid] &&
      // @ts-ignore
      replays.playersAnalysisData[pid].stats[stat] &&
      // @ts-ignore
      replays.playersAnalysisData[pid].stats[stat]![key];
    const winCorr =
      // @ts-ignore
      replays.playersAnalysisData[pid] &&
      // @ts-ignore
      replays.playersAnalysisData[pid].winLossCorr[stat] &&
      // @ts-ignore
      replays.playersAnalysisData[pid].winLossCorr[stat]![key];
    // @ts-ignore
    const value = playerStats[playerStatIndex][key];
    if (winCorr > 0.2 || winCorr < -0.2) {
      console.log(key, winCorr);
    }
    return (
      <TableCell key={`${pid}${key}`} align="right">
        {analysisNode && renderOutlier(value, analysisNode, winCorr)}{" "}
        {Math.round(value)}
      </TableCell>
    );
  };
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>{name}</TableCell>
            {playerOrder.map((pid) => (
              <TableCell
                key={pid}
                onClick={() => history.push(`/me/${pid}`)}
                align="right"
              >
                {analysis.getPlayer(pid).name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {keys.map((key: string) => (
            <TableRow key={key}>
              <TableCell>{key}</TableCell>
              {playerOrder.map((pid, i) =>
                renderPlayerTableCell(pid, stat, key, i),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
