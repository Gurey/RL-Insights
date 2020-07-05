export type ReplayIndex = { [key: string]: PlaylistIndex };

export type PlaylistIndexContainer = {
  [key: string]: PlaylistIndex;
};

export type PlaylistIndex = {
  fileName: string;
  jsonPath: string;
  replayName: string;
  gameDate: number;
  win: boolean | null;
  myTeam: Player[];
  otherTeam: Player[];
};

export type Player = {
  playerId: string;
  name: string;
  score: number;
};

export type GameSession = {
  wins: number;
  losses: number;
  from: number;
  to: number;
  replays: PlaylistIndex[];
};

export type PlaylistTeam = {
  teamId: string;
  playlist: string;
  players: TeamMember[];
  games: PlaylistIndex[];
};

export type TeamMember = {
  playerId: string;
  name: string;
};
