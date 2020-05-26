import React, { useMemo } from "react";
import * as db from "../../system/db";
import { usePlayers } from "../../store/player";

export default function Me(props: any) {
  const [playersState, playersActions] = usePlayers();
  const playlists = db.replayIndex().getPlaylists();
  console.log(playlists);
  const files = db.replayIndex().getReplays(playlists[0]);
  console.log(files);
  return <div>me</div>;
}
