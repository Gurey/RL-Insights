export type ReplayIndex = {
  playlist: { [key: string]: string[] };
};

export type PlaylistIndex = {
  fileName: string;
  replayName: string;
  gameDate: number;
  win: boolean | null;
  players: Player[];
};

export type Player = {
  playerId: string;
  name: string;
  score: number;
};
