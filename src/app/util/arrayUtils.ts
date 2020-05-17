export function anyStringIncludes(search: string, values: string[]) {
  return values.some((s) => s.includes(search));
}
