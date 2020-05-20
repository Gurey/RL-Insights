import React, { useMemo, useEffect, useState } from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import { ReplayJSON } from "../../store/replays/ReplayJson";
import * as fileService from "../../system/readFiles";
import { GMetadata } from "./GameMetadata";
import { GameGoals } from "./GameGoals";
import { GameDemos } from "./GameDemos";
import { Team } from "./Team/Team";
import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import { Players } from "./Players/Players";

const useStyle = makeStyles((theme) =>
  createStyles({
    category: {
      margin: theme.spacing(1.5),
      width: `calc(50% - ${theme.spacing(3)}px)`,
    },
    gameInfo: {
      margin: theme.spacing(-1.5),
      position: "relative",
      display: "flex",
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
    },
    team: {
      marginTop: theme.spacing(3),
    },
  }),
);

type Props = RouteComponentProps;

export default function ViewGame(props: Props) {
  const classes = useStyle();
  const { replay } = props.location.state as {
    replay: { file: string; time: number; path: string };
  };
  const [replayJson, setReplayJson] = useState<ReplayJSON>();
  useEffect(() => {
    console.log("Loading replay...");
    fileService.readFileAsObject<ReplayJSON>(replay.path).then((obj) => {
      console.log("Loading replay done!");
      setReplayJson((state) => ({ ...state, ...obj }));
    });
  }, [replay.file]);
  if (!replayJson) return <CircularProgress />;
  const json = new CarballAnalysisHandler(replayJson, "76561197994894847");

  return (
    <div>
      <div className={classes.gameInfo}>
        <GMetadata className={classes.category} analysis={json} />
        <GameGoals
          className={classes.category}
          gameGoals={json.getGameGoals()}
        />
        <GameDemos className={classes.category} gameDemos={json.getDemos()} />
      </div>
      <div className={classes.team}>
        <Team analysis={json}></Team>
      </div>
      <div className={classes.team}>
        <Players analysis={json}></Players>
      </div>
    </div>
  );
}
