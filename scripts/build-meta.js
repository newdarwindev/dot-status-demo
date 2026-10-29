import { writeFile } from 'node:fs/promises';
const commit = process.env.GITHUB_SHA ?? 'local';
await writeFile(
  'dist/build.json',
  `${JSON.stringify({ commit, synthetic: true, sampleTimestamp: '2026-10-29T09:41:00Z' }, null, 2)}\n`,
);
