export function anyStringIncludes(search: string, values: string[]) {
  return values.some((s) => s.includes(search));
}

export function unique(array: any[]) {
  const set = new Set<any>();
  array.forEach((v) => set.add(v));
  return Array.from(set.keys());
}

export function multiIndex(array: any[], searchFor: any) {
  const result: number[] = [];
  array.forEach((value, index) => {
    if (value === searchFor) {
      result.push(index);
    }
  });
  return result;
}
