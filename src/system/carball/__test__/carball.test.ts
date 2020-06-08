import * as fs from "../../file/readFiles";
import { ReplayJSON } from "../../../app/store/replays/ReplayJson";

describe("Carball", () => {
  const findReplaysWithOvertime = () => {
    const files = fs.getFiles("./jsons");
    const kickoffTypes = new Set<string>();
    for (const file of files) {
      if (file.includes(".json")) {
        const json = fs.readFileAsObject<ReplayJSON>(`./jsons/${file}`);
        const { goals } = json.gameMetadata;
        const { kickoffStats } = json.gameStats;
        kickoffStats.forEach((s) => kickoffTypes.add(s.type));
        console.log(
          goals.length,
          kickoffStats.length,
          json.gameStats.kickoffs.length,
        );
        if (kickoffStats.length - goals.length > 1) {
          console.log("Found a overtime!");
        }
      }
    }
    console.log(kickoffTypes);
  };
  test("test", () => {
    findReplaysWithOvertime();
    expect(true).toBeTruthy();
  });
});
