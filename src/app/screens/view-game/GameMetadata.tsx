import React, { FunctionComponent } from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { GameMetadata } from "../../store/replays/ReplayJson";
import { CarballAnalysisHandler } from "../../carball/carball-json";
import { green, red } from "@material-ui/core/colors";

type Props = {
  analysis: CarballAnalysisHandler;
} & React.HTMLAttributes<{}>;

function getTimeString(time: number) {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  return `${minutes}min ${Math.round(seconds)}sec`;
}

const useStyle = makeStyles((theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
    },
  }),
);

function displayKeyValuePair(key: string, value: string | number) {
  return (
    <Typography>
      <b>{key} </b>
      {value}
    </Typography>
  );
}

function renderWinLoss(isWin: boolean) {
  return isWin ? (
    <span style={{ color: green[500] }}>WIN</span>
  ) : (
    <span style={{ color: red[500] }}>LOSS</span>
  );
}

export const GMetadata: FunctionComponent<Props> = (props) => {
  const { analysis } = props;
  const { gameMetadata } = analysis.getJson();
  const classes = useStyle();
  const isWin = analysis.didWeWin();
  return (
    <Paper className={`${props.className} ${classes.infoContainer}`}>
      <Typography variant="h4">Game {renderWinLoss(isWin)}</Typography>

      {displayKeyValuePair("Playlist", gameMetadata.playlist)}
      {displayKeyValuePair("Time", getTimeString(gameMetadata.length))}
      {displayKeyValuePair("Goals", gameMetadata.goals.length)}
      {displayKeyValuePair("Map", gameMetadata.map)}
    </Paper>
  );
};
