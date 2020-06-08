import { Team } from "../../app/store/replays/ReplayJson";

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

export type GameTime = {
  replayTime: number;
  replayTimeWithoutKickoffs: number;
};

export type FramesWithNoTimer = {
  firstKickOffTouch: number;
  goals: GoalToKickoffFrames[];
};

export type GoalToKickoffFrames = {
  goal: number;
  goalFrame: number;
  kickoffStart: number;
  kickoffTouch: number;
};
