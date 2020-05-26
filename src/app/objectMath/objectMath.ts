import * as stats from "stats-lite";

export function percentDiff(obj1: any, obj2: any) {
  return walkObject(
    obj2,
    obj1,
    (o1v, o2v) => Math.round(((o1v - o2v) / o1v) * 100 * 100) / 100,
  );
}

export function normalize(obj: any, divideBy: number) {
  return walkObject(obj, obj, (baseVal) => baseVal / divideBy);
}

export function packNumbers(objects: any[]) {
  let base = {};
  objects.forEach((o) =>
    walkObject(base, o, (base, value) => [...(base || []), value]),
  );
  return base;
}

export function getStats(objects: any[]) {
  const allNumbers = packNumbers(objects);
  console.log(allNumbers);
  return walkObject(
    {},
    allNumbers,
    (_, values: number[], key) => {
      try {
        return {
          max: Math.max(...values),
          min: Math.min(...values),
          mean: stats.mean(values),
          stdDev: stats.stdev(values),
          numberOfDataPoints: values.length,
        } as AnalysisDataNode;
      } catch (error) {
        console.log(`Failed to analyze (${key})`, values);
        return Number.NaN;
      }
    },
    undefined,
    true,
  );
}

export function walkObject(
  base: any,
  obj: any,
  fn: (baseVal: any, objVal: any, key: string) => any,
  parrentKeys?: string,
  lookForNumberArray: boolean = false,
) {
  if (!obj) {
    return obj;
  }
  const keys = Object.keys(obj);
  if (!base) {
    base = {};
  }
  for (const key of keys) {
    const currentKey = parrentKeys ? [parrentKeys, key].join(".") : key;
    const objValue = obj[key];
    const baseValue = base[key];
    try {
      if (
        lookForNumberArray &&
        Array.isArray(objValue) &&
        typeof objValue[0] === "number"
      ) {
        if (!base[key]) {
          base[key] = [];
        }
        base[key] = fn(baseValue, objValue, currentKey);
        continue;
      }
      if (!lookForNumberArray && typeof obj[key] === "number") {
        if (!base[key]) {
          base[key] = 0;
        }
        base[key] = fn(baseValue, objValue, currentKey);
      }
      if (typeof obj[key] === "object") {
        base[key] = walkObject(
          baseValue,
          objValue,
          fn,
          currentKey,
          lookForNumberArray,
        );
        continue;
      }
    } catch (error) {
      console.error(parrentKeys);
      throw error;
    }
  }
  return base;
}
