import { Team } from "../../../app/store/replays/ReplayJson";

export function getTeamId(ids: string[]) {
  return ids.sort().join("-");
}

export function getTeamIdFromReplayJson(playedId: string, teams: Team[]) {
  const myTeam = teams.find((team) =>
    team.playerIds.some((pid) => pid.id === playedId),
  );
  return getTeamId(myTeam!.playerIds.map((p) => p.id));
}
