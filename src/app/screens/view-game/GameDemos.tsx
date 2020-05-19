import React, { FunctionComponent } from "react";
import { Paper, Typography, makeStyles, createStyles } from "@material-ui/core";
import { CustomDemo } from "../../carball/types";

type Props = { gameDemos: CustomDemo[] } & React.HTMLAttributes<{}>;

function getTimeString(time: number) {
  const seconds = time % 60;
  const minutes = (time - seconds) / 60;
  const potentialZero = seconds < 10 ? "0" : "";
  return `${minutes}:${potentialZero}${Math.round(seconds)}`;
}

const useStyle = makeStyles((theme) =>
  createStyles({
    infoContainer: {
      padding: theme.spacing(2),
    },
  }),
);

function displayKeyValuePair(demo: CustomDemo) {
  return (
    <Typography key={demo.time}>
      <b>{getTimeString(demo.time)} </b>
      {demo.attacker} demoed {demo.victim}
    </Typography>
  );
}

export const GameDemos: FunctionComponent<Props> = (props) => {
  const { gameDemos } = props;
  const classes = useStyle();
  return (
    <Paper className={`${classes.infoContainer} ${props.className}`}>
      <Typography variant="h4">Demos</Typography>
      {gameDemos.map((demo) => displayKeyValuePair(demo))}
    </Paper>
  );
};
