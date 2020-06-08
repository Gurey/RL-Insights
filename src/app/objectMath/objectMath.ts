import * as stats from "stats-lite";
import * as vectorMath from "@seregpie/vector-math";
import * as anova from "ml-anova";
import * as ttest from "ttest";
import * as jstat from "jstat";

export function percentDiff(obj1: any, obj2: any) {
  return walkObject(
    obj2,
    obj1,
    (o1v, o2v) => Math.round(((o1v - o2v) / o1v) * 100 * 100) / 100,
  );
}

export function normalize(obj: any, divideBy: number) {
  const copy = Object.assign({}, obj);
  return walkObject({}, copy, (_, objVal) => objVal / divideBy);
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

export function pValue(objects: any[], correlateTo: number[]) {
  const allNumbers = packNumbers(objects);
  console.log(allNumbers);
  return walkObject(
    {},
    allNumbers,
    (_, values: number[], key) => {
      try {
        if (values.length === correlateTo.length) {
          const samples = [vectorMath.normalize(values), correlateTo];
          const anovaRes = anova.oneWay(samples[0], samples[1]);
          console.log(key, anovaRes);
          return anovaRes.rejected ? anovaRes.pValue : anovaRes.pValue;
        }
        return Number.NaN;
      } catch (error) {
        console.log(`Failed to analyze (${key})`, values);
        return Number.NaN;
      }
    },
    undefined,
    true,
  );
}

export function correlation(objects: any[], correlateTo: number[]) {
  const allNumbers = packNumbers(objects);
  console.log(allNumbers);
  return walkObject(
    {},
    allNumbers,
    (_, values: number[], key) => {
      try {
        if (values.length === correlateTo.length) {
          const samples = [values, correlateTo];
          const correlation = vectorMath.pearsonCorrelationCoefficient(
            samples[1],
            samples[0],
          );
          const n = values.length;
          const tScore =
            (correlation * Math.sqrt(n - 2)) /
            Math.sqrt(1 - Math.pow(correlation, 2));
          const pValue = jstat.ttest(tScore, n, 2);
          const significant = pValue < 0.05;
          return {
            correlation,
            pValue: significant ? pValue : undefined,
          } as PearsonCorrelationNode;
        }
        return Number.NaN;
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
