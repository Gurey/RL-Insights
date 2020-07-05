import {
  ReplayJSON,
  Team,
  PlayerStats,
  TeamStats,
} from "../../app/store/replays/ReplayJson";
import { CustomDemo, CustomGoal, CustomTeams, GameTime } from "./types";
import { normalize } from "../../app/objectMath/objectMath";
import memo from "fast-memoize";

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
    this.normalizer =
      this.getGameTime().replayTimeWithoutKickoffs / this.FIVE_MINUTES;
    return this.normalizer;
  }

  getPlayer(playerId: string) {
    return this.getPlayers().find((p) => p.id.id === playerId)!;
  }

  getPlayerStats(playerId: string) {
    return this.getPlayer(playerId).stats;
  }

  private _getPlayerStatsNormalized(playerId: string) {
    const stats = this.getPlayer(playerId).stats;
    const normalized = normalize(
      stats,
      this.getNormalizer(),
      /average/g,
    ) as PlayerStats;
    return normalized;
  }

  getPlayerStatsNormalized = memo((playerId: string) =>
    this._getPlayerStatsNormalized(playerId),
  );

  private _getTeamStatsNormalized(
    selectTeam: "myTeam" | "otherTeam" = "myTeam",
  ) {
    const team =
      selectTeam === "myTeam"
        ? this.getTeams().myTeam
        : this.getTeams().otherTeam;
    const stats = team.stats;
    const normalized = normalize(
      stats,
      this.getNormalizer(),
      /average/g,
    ) as TeamStats;
    return normalized;
  }

  getTeamStatsNormalized = memo(
    (selectTeam: "myTeam" | "otherTeam" = "myTeam") =>
      this._getTeamStatsNormalized(selectTeam),
  );

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
