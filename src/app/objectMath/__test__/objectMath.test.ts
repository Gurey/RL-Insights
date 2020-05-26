import * as oMath from "../objectMath";

const plusOneFn = (base: number, obj: number) => obj + 1;
const createArray = (base: any, obj: number) => [...(base || []), obj];

describe("Object math", () => {
  describe("Walk object", () => {
    test("Can do simple math", () => {
      const res = oMath.walkObject({}, { test: 1 }, plusOneFn);
      expect(res.test).toEqual(2);
    });
    test("Can handle nested stuff", () => {
      const res = oMath.walkObject(
        {},
        { test: 1, nest: { test: 2 } },
        plusOneFn,
      );
      expect(res).toEqual({ test: 2, nest: { test: 3 } });
    });
    test("Can do what i want with base object", () => {
      const res = oMath.walkObject(
        {},
        { test: 1, nest: { test: 2 } },
        createArray,
      );
      expect(res).toEqual({ test: [1], nest: { test: [2] } });
    });
  });
  describe("Pack numbers", () => {
    test("Can pack simple example", () => {
      const data = [{ test1: 1 }, { test1: 2 }, { test1: 3 }];
      const res = oMath.packNumbers(data);
      expect(res).toEqual({ test1: [1, 2, 3] });
    });
    test("Can pack more complex objects", () => {
      const data = [
        { test1: 1, nest: { test2: 1 } },
        { test2: 2 },
        { test1: 3, nest: { test2: 1 } },
      ];
      const res = oMath.packNumbers(data);
      expect(res).toEqual({
        test1: [1, 3],
        test2: [2],
        nest: { test2: [1, 1] },
      });
    });
  });
  describe("Get stats", () => {
    test("Can get stats simple example", () => {
      const data = [{ test: 1 }, { test: 2 }, { test: 3 }];
      const res = oMath.getStats(data);
      expect(res.test).toEqual({
        max: 3,
        mean: 2,
        min: 1,
        numberOfDataPoints: 3,
        stdDev: 0.816496580927726,
      });
    });
  });
});
