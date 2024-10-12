export default function sortKeyAsString<T>(dependencies: ReadonlyMap<string, T>): ReadonlyMap<string, T> {
  return Object.freeze(new Map(Array.from(dependencies.entries()).sort(([x], [y]) => x.localeCompare(y))));
}
