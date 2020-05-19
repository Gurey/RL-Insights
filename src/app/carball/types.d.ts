import { Team } from "../store/replays/ReplayJson";

export type CustomGoal = {
  player: string;
  time: number;
};

export type CustomDemo = {
  attacker: string;
  victim: string;
  time: number;
};

export type CustomTeams = {
  myTeam: Team;
  otherTeam: Team;
};
