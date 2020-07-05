import { CustomDemo, CustomGoal, CustomTeams, GameTime } from "./types";
import { ReplayJSON, PlayerStats, Team } from "../../store/replays/ReplayJson";
import { normalize } from "../../objectMath/objectMath";

export class CarballAnalysisHandler {
  private readonly FIVE_MINUTES = 5 * 60;
  private json: ReplayJSON;
  private playerId: string;
  private normalizer: number | null = null;

  constructor(json: ReplayJSON, playerId: string) {
    this.json = json;
    this.playerId = playerId;
  }

  getFramesWithNoTimer() {
    const { goals } = this.json.gameMetadata;
    const { kickoffStats } = this.json.gameStats;
    console.log(goals, kickoffStats);
    let framesToRemove = kickoffStats[0].touchFrame;
    const removals = goals.map(
      (g, i) => kickoffStats[i + 1].touchFrame - g.frameNumber,
    );
  }

  getGameTime(): GameTime {
    const replayTime = this.json.gameMetadata.length;
    const replayTimeWithoutKickoffs =
      replayTime -
      this.json.gameStats.kickoffStats.reduce(
        (acc, kickoff) => acc + kickoff.touchTime,
        0,
      );
    return {
      replayTime,
      replayTimeWithoutKickoffs,
    };
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

  getNormalizer() {
    if (!this.normalizer) {
      this.normalizer = this.getGameTime().replayTime / this.FIVE_MINUTES;
    }

    return this.normalizer;
  }

  getPlayer(playerId: string) {
    return this.getPlayers().find((p) => p.id.id === playerId)!;
  }

  getPlayerStats(playerId: string) {
    return this.getPlayer(playerId).stats;
  }

  getPlayerStatsNormalized(playerId: string) {
    const stats = this.getPlayer(playerId).stats;

    const normalized = normalize(stats, this.getNormalizer()) as PlayerStats;

    return normalized;
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
    if (!demos) return [];
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
