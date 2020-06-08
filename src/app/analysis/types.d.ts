type AnalysisDataNode = {
  min: number;
  max: number;
  mean: number;
  stdDev: number;
  numberOfDataPoints: number;
};

type PearsonCorrelationNode = {
  correlation: number;
  pValue: number;
};

type AnalysisData<T, U> = {
  [K in keyof T]: T[K] extends object
    ? AnalysisData<T[K], U>
    : T[K] extends number
    ? U
    : T[K];
};
