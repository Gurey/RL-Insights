import React, { useEffect, useState, useMemo } from "react";
import {
  CircularProgress,
  Paper,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { RouteComponentProps, useParams } from "react-router-dom";
import { ReplayJSON } from "../../store/replays/ReplayJson";
import { useSettings } from "../../store/settings/settingsStore";
import { useReplays } from "../../store/replays";
import * as fileService from "../../../system/file/readFiles";
import { GMetadata } from "./GameMetadata";
import { GameGoals } from "./GameGoals";
import { GameDemos } from "./GameDemos";
import { Team } from "./Team/Team";
import { CarballAnalysisHandler } from "../../../system/carball/carball-json";
import { Players } from "./Players/Players";
import * as db from "../../../system/db";

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

function fmtMSS(ss: number) {
  let s = Math.round(ss);
  return (s - (s %= 60)) / 60 + (9 < s ? ":" : ":0") + s;
}

function howLongIsTheGame(json: ReplayJSON) {
  // This function works with 2344956F4849E60C6C17D4ABCD04F57A-1590607581.json
  console.log("Game claims to be", json.gameMetadata.length / 60, "minutes");
  console.log("Frames", json.gameMetadata.frames);
  const { goals } = json.gameMetadata;
  const { kickoffStats } = json.gameStats;
  console.log(goals, kickoffStats);
  let framesToRemove = kickoffStats[0].touchFrame;
  const removals = goals.map(
    (g, i) => kickoffStats[i + 1].touchFrame - g.frameNumber,
  );
}

export default function ViewGame(props: Props) {
  const { gameId } = useParams();
  const classes = useStyle();
  const [replayJson, setReplayJson] = useState<ReplayJSON>();
  const [settings, _] = useSettings();
  const [replays, replayActions] = useReplays();
  const replay = db.replayIndex().getReplay(gameId);
  useEffect(() => {
    if (replay && replay.jsonPath) {
      console.log("Loading replay...");
      const obj = fileService.readFileAsObject<ReplayJSON>(replay.jsonPath);
      console.log("Loading replay done!");
      setReplayJson((state) => obj);
    }
  }, [replay && replay.fileName]);
  const json = useMemo(() => {
    if (replayJson) {
      return new CarballAnalysisHandler(replayJson, settings.playerId);
    }
  }, [replayJson?.gameMetadata.id]);

  if (!replay) {
    return <Typography>No Replay found</Typography>;
  }
  if (!replayJson || !json) return <CircularProgress />;

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
        <Players
          analysis={json}
          playerStats={replays.playersAnalysisData}
        ></Players>
      </div>
    </div>
  );
}
