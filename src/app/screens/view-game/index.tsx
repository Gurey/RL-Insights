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
import GameMetadata from "./GameMetadata";

const useStyle = makeStyles((theme) =>
  createStyles({
    category: {
      paddingBottom: theme.spacing(3),
    },
  }),
);

type Props = RouteComponentProps;

export default function ViewGame(props: Props) {
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
  console.log(replayJson);

  return (
    <div>
      <GameMetadata gameMetadata={replayJson.gameMetadata}></GameMetadata>
    </div>
  );
}
