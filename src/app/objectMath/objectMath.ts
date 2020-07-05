import * as stats from "stats-lite";

// @ts-ignore
import * as vectorMath from "@seregpie/vector-math";
import * as anova from "ml-anova";
// @ts-ignore
import * as jstat from "jstat";
import { multiIndex } from "../util/arrayUtils";

export function percentDiff(obj1: any, obj2: any) {
  return walkObject(
    obj2,
    obj1,
    (o1v, o2v) => Math.round(((o1v - o2v) / o1v) * 100 * 100) / 100,
  );
}

export function normalize(obj: any, divideBy: number, ignorePattern?: RegExp) {
  const copy = Object.assign({}, obj);
  return walkObject({}, copy, (_, objVal, key) => {
    if (ignorePattern && key.match(ignorePattern)) {
      return objVal;
    }
    return objVal / divideBy;
  });
}

export function packNumbers(objects: any[], includeUndefined: boolean = false) {
  let base = {};
  objects.forEach((o) =>
    walkObject(
      base,
      o,
      (base, value) => [...(base || []), value],
      undefined,
      undefined,
      includeUndefined,
    ),
  );
  return base;
}

export function getStats<T>(objects: T[]) {
  const allNumbers = packNumbers(objects);
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
  ) as AnalysisData<T, AnalysisDataNode>;
}

export function pValue(objects: any[], correlateTo: number[]) {
  const allNumbers = packNumbers(objects);
  return walkObject(
    {},
    allNumbers,
    (_, values: number[], key) => {
      try {
        if (values.length === correlateTo.length) {
          const samples = [vectorMath.normalize(values), correlateTo];
          const anovaRes = anova.oneWay(samples[0], samples[1]);
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
  const allNumbers = packNumbers(objects, true);
  console.log(allNumbers);
  return walkObject(
    {},
    allNumbers,
    (_, values: number[], key) => {
      try {
        const missing = multiIndex(values, undefined);
        // console.log(values);
        if (missing.length > 0) {
          console.log("missing", missing);
        }
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
  includeUndefined: boolean = false,
) {
  if (!obj) {
    return obj;
  }
  const objKeys = Object.keys(obj);
  const baseKeys = Object.keys(base || {});
  const allKeys = new Set<string>();
  objKeys.forEach((key) => allKeys.add(key));
  baseKeys.forEach((key) => allKeys.add(key));
  const keys = Array.from(allKeys.values());
  if (!base) {
    base = {};
  }
  for (const key of keys) {
    const currentKey = parrentKeys ? [parrentKeys, key].join(".") : key;
    const objValue = obj[key];
    const baseValue = base[key];
    if (key === "totalPasses" && !objValue) {
      console.log(`base: ${baseValue} obj: ${objValue} ${key}`);
    }
    try {
      if (
        lookForNumberArray &&
        Array.isArray(objValue) &&
        typeof objValue[0] === "number"
      ) {
        if (!base[key]) {
          base[key] = [];
        }
        base[key] = runFn(fn, baseValue, objValue, currentKey);
        continue;
      } else if (
        typeof objValue === "number" ||
        (includeUndefined &&
          typeof objValue === "undefined" &&
          Array.isArray(baseValue))
      ) {
        if (!base[key]) {
          base[key] = 0;
        }
        base[key] = runFn(fn, baseValue, objValue, currentKey);
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

function runFn(
  fn: (base: any, obj: any, key: string) => any,
  baseValue: any,
  objValue: any,
  currentKey: string,
) {
  try {
    if (objValue === undefined) {
      console.log("Running function with", currentKey, "value as undefined");
    }
    const res = fn(baseValue, objValue, currentKey);
    if (objValue === undefined) {
      console.log(res);
    }
    return res;
  } catch (error) {
    console.error(
      `Could not run function with parameters (base: ${baseValue} objValue: ${objValue}: currentKey: ${currentKey})`,
    );
    throw error;
  }
}
