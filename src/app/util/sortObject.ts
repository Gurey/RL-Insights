export function sortObject(obj: any) {
  const ordered: any = {};
  Object.keys(obj)
    .sort((k1: string, k2: string) => +obj[k1] - +obj[k2])
    .forEach((key) => (ordered[key] = obj[key]));
  return ordered;
}

export function sortObjectByKey(
  obj: any,
  sortKey: string,
  descending: boolean = true,
) {
  if (!obj) return obj;
  const ordered: any = {};
  Object.keys(obj)
    .sort((k1: string, k2: string) => {
      if (descending) {
        return +obj[k2][sortKey] - +obj[k1][sortKey];
      } else {
        return +obj[k1][sortKey] - +obj[k2][sortKey];
      }
    })
    .forEach((key) => (ordered[key] = obj[key]));
  return ordered;
}
