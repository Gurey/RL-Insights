import React from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { GameMetadata } from "../../store/replays/ReplayJson";

type Propss = { gameMetadata: GameMetadata };

function getTimeString(time: number) {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  return `${minutes}min ${Math.round(seconds)}sec`;
}

export default function GMetadata(props: Propss) {
  const { gameMetadata } = props;
  return (
    <Paper>
      <Typography variant="h5">Game</Typography>
      <Typography>{gameMetadata.playlist}</Typography>
      <Typography>{getTimeString(gameMetadata.length)}</Typography>
    </Paper>
  );
}
