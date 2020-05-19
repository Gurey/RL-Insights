import { ReplayJSON, Team } from "../store/replays/ReplayJson";
import { CustomDemo, CustomGoal, CustomTeams } from "./types";

export class CarballAnalysisHandler {
  private json: ReplayJSON;
  private playerId: string;

  constructor(json: ReplayJSON, playerId: string) {
    this.json = json;
    this.playerId = playerId;
  }
  getJson() {
    return this.json;
  }

  didWeWin() {
    const myTeam = this.json.teams.find((team) =>
      team.playerIds.some((pid) => pid.id === this.playerId),
    )!;
    const otherTeam = this.json.teams.find((team) => team !== myTeam)!;
    return myTeam.score > otherTeam.score;
  }

  getMyPlayerId() {
    return this.playerId;
  }

  getPlayer(playerId: string) {
    return this.getPlayers().find((p) => p.id.id === playerId)!;
  }

  getPlayers() {
    return this.json.players;
  }

  getGameGoals(): CustomGoal[] {
    const players = this.getPlayers();
    const frameDivisor = this.getTimeDivisor();
    return this.json.gameMetadata.goals.map((goal) => ({
      player: players.find((p) => p.id.id === goal.playerId.id)!.name,
      time: goal.frameNumber / frameDivisor,
    }));
  }

  getDemos() {
    const demos = this.json.gameMetadata.demos;
    const response: CustomDemo[] = demos.map((d) => ({
      attacker: this.getPlayer(d.attackerId.id).name,
      victim: this.getPlayer(d.victimId.id).name,
      time: d.frameNumber / this.getTimeDivisor(),
    }));
    return response;
  }

  getTimeDivisor() {
    return this.json.gameMetadata.frames / this.json.gameMetadata.length;
  }

  getMyTeam(): Team {
    return this.json.teams.find((team) =>
      team.playerIds.some((p) => p.id === this.playerId),
    )!;
  }

  getTeams(): CustomTeams {
    const myTeam = this.getMyTeam();
    const otherTeam = this.json.teams.find((team) => team !== myTeam)!;
    return {
      myTeam,
      otherTeam,
    };
  }
}
