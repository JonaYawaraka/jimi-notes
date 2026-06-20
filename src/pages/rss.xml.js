import { getCollection } from 'astro:content';

const SITE = 'https://jimi-notes.pages.dev';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function GET() {
  const articles = (await getCollection('articles'))
    .filter((a) => !a.data.draft)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const items = articles.map((a) =>
    `    <item>\n` +
    `      <title>${esc(a.data.title)}</title>\n` +
    `      <link>${SITE}/articles/${a.id}/</link>\n` +
    `      <guid isPermaLink="true">${SITE}/articles/${a.id}/</guid>\n` +
    `      <category>${esc(a.data.category)}</category>\n` +
    `      <description>${esc(a.data.problem)}</description>\n` +
    `      <pubDate>${new Date(a.data.date).toUTCString()}</pubDate>\n` +
    `    </item>`
  ).join('\n');
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n` +
    `    <title>Jimi Notes</title>\n` +
    `    <link>${SITE}/</link>\n` +
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />\n` +
    `    <description>地味だけど本当に困るデザインの悩みを、出典付きリサーチと実演で解く。</description>\n` +
    `    <language>ja</language>\n` +
    items + `\n  </channel>\n</rss>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
