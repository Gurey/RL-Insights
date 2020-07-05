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

    test("Can pack undefined", () => {
      const data = [{ test1: 1 }, { test1: 1 }, { test1: 1 }, {}];
      const res = oMath.packNumbers(data, true);
      expect(res).toEqual({ test1: [1, 1, 1, undefined] });
    });

    test("Can pack deep undefined", () => {
      const data = [
        { test1: { test2: 2 } },
        { test1: { test2: 2 } },
        { test1: { test2: 2 } },
        { test1: {} },
      ];
      const res = oMath.packNumbers(data, true);
      expect(res).toEqual({ test1: { test2: [2, 2, 2, undefined] } });
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
    test("Can get stats nested", () => {
      const data = [
        { test: 3, nest: { value: 1 } },
        { test: 3, nest: { value: 1 } },
      ];
      const res = oMath.getStats(data);
      expect(res.nest.value).toEqual({
        max: 1,
        min: 1,
        mean: 1,
        stdDev: 0,
        numberOfDataPoints: 2,
      });
    });
  });
});
