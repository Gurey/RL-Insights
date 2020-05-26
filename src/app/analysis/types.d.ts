type AnalysisDataNode = {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  numberOfDataPoints: number;
};

type AnalysisData<T> = {
  [K in keyof T]: T[K] extends object
    ? AnalysisData<T[K]>
    : T[K] extends number
    ? AnalysisDataNode
    : T[K];
};
