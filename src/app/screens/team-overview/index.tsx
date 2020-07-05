import React, { useEffect } from "react";
import { useReplays } from "../../store/replays";
import { useHistory } from "react-router-dom";
import { getTeamId } from "../../../system/db/util/ids";

export default function TeamOverview(props: any) {
  const [replaysState, replaysActions] = useReplays();
  const history = useHistory();
  useEffect(() => {
    replaysActions.loadMyTeams();
  }, []);
  return (
    <div>
      {replaysState.myTeams
        .filter((t) => t.games.length > 3)
        .map((t) => (
          <div
            key={t.teamId}
            onClick={() => history.push(`/MyTeams/${t.teamId}/${t.playlist}`)}
          >
            {t.players.map((p) => p.name).join(", ")} {t.games.length} games
          </div>
        ))}
    </div>
  );
}
