import { getCollection } from 'astro:content';

const SITE = 'https://jimi-notes.pages.dev';
const iso = (d) => new Date(d).toISOString().slice(0, 10);

export async function GET() {
  const articles = (await getCollection('articles')).filter((a) => !a.data.draft);
  const entries = [
    { loc: `${SITE}/`, lastmod: iso(Date.now()) },
    ...articles
      .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
      .map((a) => ({ loc: `${SITE}/articles/${a.id}/`, lastmod: iso(a.data.updated || a.data.date) })),
  ];
  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    entries.map((e) => `  <url><loc>${e.loc}</loc><lastmod>${e.lastmod}</lastmod></url>`).join('\n') +
    `\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
