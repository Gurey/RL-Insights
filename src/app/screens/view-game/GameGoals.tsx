import React, { FunctionComponent } from "react";
import { Paper, Typography, makeStyles, createStyles } from "@material-ui/core";
import { GameMetadata } from "../../store/replays/ReplayJson";
import { CustomGoal } from "../../carball/types";

type Props = { gameGoals: CustomGoal[] } & React.HTMLAttributes<{}>;

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

function displayKeyValuePair(goal: CustomGoal) {
  return (
    <Typography key={goal.time}>
      <b>{getTimeString(goal.time)} </b>
      {goal.player}
    </Typography>
  );
}

export const GameGoals: FunctionComponent<Props> = (props) => {
  const { gameGoals } = props;
  const classes = useStyle();
  return (
    <Paper className={`${classes.infoContainer} ${props.className}`}>
      <Typography variant="h4">Goals</Typography>
      {gameGoals.map((goal) => displayKeyValuePair(goal))}
    </Paper>
  );
};
