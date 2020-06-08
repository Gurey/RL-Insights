import { CarballAnalysisHandler } from "../../system/carball/carball-json";
import { readFileAsObject } from "../../system/file/readFiles";
import { ReplayJSON, PlayerStats } from "../store/replays/ReplayJson";
import { getStats, pValue, correlation } from "../objectMath/objectMath";

export class ReplaysAnalysis {
  private readonly FIVE_MINUTES = 60 * 5;
  private replayJsonFiles: string[];
  private playerId: string;
  private games: CarballAnalysisHandler[];

  private DEFAULT_CALLBACK = () => {};

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
    const stats = getStats(playerStatsList) as AnalysisData<
      PlayerStats,
      AnalysisDataNode
    >;
    statusCallback("Stats done!");
    return stats;
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
    console.log(corr);
    return corr;
  }

  getGoalDiffCorrelation() {
    return this.getPearsonCorrelation(
      (g) => g.getTeams().myTeam.score - g.getTeams().otherTeam.score,
    );
  }

  getMyTeamScoreCorrelation() {
    return this.getPearsonCorrelation((g) => g.getTeams().myTeam.score);
  }

  getOtherTeamScoreCorrelation() {
    return this.getPearsonCorrelation((g) => g.getTeams().otherTeam.score);
  }

  getPearsonCorrelation(select: (game: CarballAnalysisHandler) => number) {
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
}
