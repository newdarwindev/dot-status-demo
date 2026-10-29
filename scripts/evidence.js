import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
const destination = 'dist/evidence';
await mkdir(destination, { recursive: true });
const entries = await readdir('test-results', { recursive: true });
const videos = entries.filter((entry) => entry.endsWith('.webm')).sort();
const screenshots = entries.filter((entry) => entry.endsWith('.png')).sort();
if (videos.length === 0 || screenshots.length === 0) {
  throw new Error('Missing UI videos or screenshots; refusing empty evidence.');
}
/** @param {string} value */
function escape(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
const cards = [];
for (const [index, video] of videos.entries()) {
  const name = `test-${index + 1}.webm`;
  await cp(join('test-results', video), join(destination, name));
  cards.push(
    `<section><h2>Recording ${index + 1}</h2><p class="path">${escape(video)}</p><video controls preload="metadata" src="${name}"></video><p><a href="${name}">Download WebM</a></p></section>`,
  );
}
const images = [];
for (const [index, screenshot] of screenshots.entries()) {
  const name = `screen-${index + 1}.png`;
  await cp(join('test-results', screenshot), join(destination, name));
  images.push(
    `<figure><a href="${name}"><img loading="lazy" src="${name}" alt="${escape(screenshot)}"></a><figcaption>${escape(screenshot)}</figcaption></figure>`,
  );
}
const sha = (process.env.GITHUB_SHA ?? 'local').replace(/[^a-zA-Z0-9]/gu, '');
await writeFile(
  join(destination, 'index.html'),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>dot status — visual test evidence</title><style>body{font:15px system-ui;max-width:1100px;margin:40px auto;padding:20px;background:#f5f6fa;color:#202631}a{color:#294daa}video{width:100%;max-height:650px;background:#202b43}section{margin:30px 0;background:white;padding:20px;border-radius:12px;border:1px solid #ddd}code,.path,figcaption{overflow-wrap:anywhere;font-size:12px}.screens{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}figure{margin:0;padding:12px;background:white}img{width:100%;height:300px;object-fit:contain;object-position:top}</style><h1>dot / status — visual evidence</h1><p>Successful deployment commit: <code>${sha}</code></p><p>Real Chromium interactions with synthetic fixtures only. Desktop and mobile recordings are retained for successful tests too. These are functional tests with visual evidence, not pixel-diff regression assertions.</p><p><a href="../">Back to dashboard</a> · <a href="https://github.com/newdarwindev/dot-status-demo/actions">CI runs and reports</a></p><h2>Scenario screenshots</h2><div class="screens">${images.join('')}</div><h2>Interaction recordings</h2>${cards.join('')}</html>`,
);
