import { getCollection } from 'astro:content';
import sharp from 'sharp';
import { buildMotif } from '../../lib/motif.js';

export async function getStaticPaths() {
  const arts = (await getCollection('articles')).filter((a) => !a.data.draft);
  return arts.map((a) => ({ params: { id: a.id }, props: { article: a } }));
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function wrapJP(str, max) {
  const out = []; let line = '';
  for (const ch of str) { line += ch; if ([...line].length >= max) { out.push(line); line = ''; } }
  if (line) out.push(line);
  return out;
}

function ogSvg(a) {
  const { bg, inner } = buildMotif(a.id, a.data.category, a.data.tags, { anim: false });
  const W = 1200, H = 630;
  const [hook, sub] = a.data.title.split('——');
  const hookLines = wrapJP(hook, 8).slice(0, 3);
  const hookY = 230;
  const hookSvg = hookLines.map((l, i) => `<tspan x="80" dy="${i === 0 ? 0 : 86}">${esc(l)}</tspan>`).join('');
  const subY = hookY + (hookLines.length - 1) * 86 + 56;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="${bg}"/>
    <rect x="0" y="0" width="${W}" height="12" fill="#de3c24"/>
    <rect x="700" y="12" width="500" height="${H - 12}" fill="#eceae2"/>
    <line x1="700" y1="12" x2="700" y2="${H}" stroke="rgba(22,21,15,.16)" stroke-width="1"/>
    <svg x="775" y="135" width="350" height="360" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid meet">${inner}</svg>
    <text x="80" y="130" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="5" fill="#c5311b">${esc(a.data.category)}</text>
    <text y="${hookY}" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans',sans-serif" font-size="70" font-weight="800" fill="#16150f">${hookSvg}</text>
    ${sub ? `<text x="80" y="${subY}" font-family="'Hiragino Sans',sans-serif" font-size="30" fill="#5c5a50">${esc([...sub].slice(0, 22).join(''))}</text>` : ''}
    <g transform="translate(80,548)">
      <rect width="15" height="15" fill="#de3c24"/><rect x="19" width="15" height="15" fill="#16150f"/>
      <rect y="19" width="15" height="15" fill="#16150f"/><rect x="19" y="19" width="15" height="15" fill="#16150f"/>
      <text x="48" y="28" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="800" fill="#16150f">Jimi Notes</text>
    </g>
  </svg>`;
}

export async function GET({ props }) {
  const png = await sharp(Buffer.from(ogSvg(props.article))).png().toBuffer();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=31536000, immutable' },
  });
}
