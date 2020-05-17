import React, { useMemo } from "react";
import { useReplays } from "../../store/replays";
import { CircularProgress } from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";

type Props = RouteComponentProps;

export default function Sessions(props: Props) {
  console.log(props);
  const [state, actions] = useReplays();
  useMemo(actions.loadReplayJsons, []);
  if (state.replayJsons.length < 0) {
    return <CircularProgress />;
  }
  return (
    <div>
      {state.replayJsons.map((replay) => (
        <div
          key={replay.file}
          onClick={() =>
            props.history.push({
              pathname: "/ViewGame",
              state: {
                replay,
              },
            })
          }
        >
          {replay.file}
        </div>
      ))}
    </div>
  );
}
