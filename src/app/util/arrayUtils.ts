export function anyStringIncludes(search: string, values: string[]) {
  return values.some((s) => s.includes(search));
}

export function unique(array: any[]) {
  const set = new Set<any>();
  array.forEach((v) => set.add(v));
  return Array.from(set.keys());
}
