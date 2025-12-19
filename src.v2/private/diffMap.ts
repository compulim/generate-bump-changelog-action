export default function diffMap<K, V>(from: ReadonlyMap<K, V>, to: ReadonlyMap<K, V>): ReadonlyMap<K, V> {
  const diff = new Map();

  for (const [key, value] of to) {
    Object.is(from.get(key), value) || diff.set(key, value);
  }

  return Object.freeze(diff);
}
