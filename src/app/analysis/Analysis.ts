import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import { readFileAsObject } from "../../system/file/readFiles";
import {
  ReplayJSON,
  PlayerStats,
  TeamStats,
} from "../store/replays/ReplayJson";
import { getStats, pValue, correlation } from "../objectMath/objectMath";

export class ReplaysAnalysis {
  private readonly FIVE_MINUTES = 60 * 5;
  private replayJsonFiles: string[];
  private playerId: string;
  private games: CarballAnalysisHandler[];

  private DEFAULT_CALLBACK = () => {};

  private teamMode = false;

  constructor(replayJsonPaths: string[], playerId: string) {
    this.replayJsonFiles = replayJsonPaths;
    this.playerId = playerId;
  }

  getGames() {
    if (!this.games) {
      let games: CarballAnalysisHandler[] = [];
      for (const filePath of this.replayJsonFiles) {
        const fileContent = readFileAsObject<ReplayJSON>(filePath);
        const carballHandler = new CarballAnalysisHandler(
          fileContent,
          this.playerId,
        );
        games.push(carballHandler);
      }
      this.games = games;
    }
    return this.games;
  }

  playerStats(
    statusCallback: (status: string) => void = this.DEFAULT_CALLBACK,
  ) {
    const playerStatsList: PlayerStats[] = [];
    for (const carballHandler of this.getGames()) {
      playerStatsList.push(
        carballHandler.getPlayerStatsNormalized(this.playerId),
      );
    }
    statusCallback("Getting stats...");
    const stats = getStats(playerStatsList);
    statusCallback("Stats done!");
    return stats;
  }

  teamStats() {
    const teamStatsList: TeamStats[] = [];
    for (const carballHandler of this.getGames()) {
      teamStatsList.push(carballHandler.getTeamStatsNormalized());
    }
    const stats = getStats(teamStatsList);
    return stats;
  }

  getTeamGoalDiffCorrelation() {
    return this.getTeamPearsonCorrelation(
      (g) =>
        (g.getTeams().myTeam.score - g.getTeams().otherTeam.score) /
        g.getNormalizer(),
    );
  }

  getWinLossPValue() {
    const games = this.getGames();
    const winLoss = games.map((g) => (g.didWeWin() ? 1 : 0));
    const playerStatsList: PlayerStats[] = [];
    for (const carballHandler of games) {
      playerStatsList.push(
        carballHandler.getPlayerStatsNormalized(this.playerId),
      );
    }
    const corr = pValue(playerStatsList, winLoss) as PlayerStats;
    return corr;
  }

  getPlayerGoalDiffCorrelation() {
    return this.getPlayerPearsonCorrelation(
      (g) =>
        (g.getTeams().myTeam.score - g.getTeams().otherTeam.score) /
        g.getNormalizer(),
    );
  }

  getMyTeamScoreCorrelation() {
    return this.getPlayerPearsonCorrelation((g) => g.getTeams().myTeam.score);
  }

  getOtherTeamScoreCorrelation() {
    return this.getPlayerPearsonCorrelation(
      (g) => g.getTeams().otherTeam.score,
    );
  }

  getPlayerPearsonCorrelation(
    select: (game: CarballAnalysisHandler) => number,
  ) {
    const games = this.getGames();
    const compareWith = games.map(select);
    const playerStatsList: PlayerStats[] = [];
    for (const carballHandler of games) {
      playerStatsList.push(
        carballHandler.getPlayerStatsNormalized(this.playerId),
      );
    }
    const corr = correlation(playerStatsList, compareWith) as AnalysisData<
      PlayerStats,
      PearsonCorrelationNode
    >;
    return corr;
  }

  getTeamPearsonCorrelation(select: (game: CarballAnalysisHandler) => number) {
    const games = this.getGames();
    const compareWith = games.map(select);
    const teamStatsList: TeamStats[] = [];
    for (const carballHandler of games) {
      teamStatsList.push(carballHandler.getTeamStatsNormalized());
    }
    const corr = correlation(teamStatsList, compareWith) as AnalysisData<
      TeamStats,
      PearsonCorrelationNode
    >;
    return corr;
  }
}
