export default function npmPackageToMarkdownLink(key: string, value: string): string {
  return `[\`${key}@${value}\`](${new URL(`${key}/v/${value}`, 'https://npmjs.com/package/')})`;
}
