export default function mergeMap<K, V>(...deps: ReadonlyMap<K, V>[]): ReadonlyMap<K, V> {
  return Object.freeze(
    new Map<K, V>(deps.reduce<[K, V][]>((merged, dep) => [...merged, ...Array.from(dep.entries())], []))
  );
}
