import sharp from 'sharp';
import { buildMotif } from '../lib/motif.js';

function svg() {
  const W = 1200, H = 630;
  const seeds = ['type-scale', 'shadow-depth', 'neutral-grey', 'spacing-rhythm', 'alignment-grid'];
  const cats = ['タイポ', '質感', '色', '余白', 'レイアウト'];
  // 下部に小さなモチーフを5つ並べる装飾
  const strip = seeds.map((s, i) => {
    const { inner } = buildMotif(s, cats[i], [], { anim: false });
    const x = 80 + i * 210;
    return `<rect x="${x}" y="430" width="180" height="135" fill="#eceae2" stroke="rgba(22,21,15,.16)"/>
      <svg x="${x}" y="430" width="180" height="135" viewBox="0 0 320 240" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <rect width="${W}" height="${H}" fill="#f4f2ec"/>
    <rect x="0" y="0" width="${W}" height="12" fill="#de3c24"/>
    <g transform="translate(80,90)">
      <rect width="22" height="22" fill="#de3c24"/><rect x="28" width="22" height="22" fill="#16150f"/>
      <rect y="28" width="22" height="22" fill="#16150f"/><rect x="28" y="28" width="22" height="22" fill="#16150f"/>
      <text x="70" y="42" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="800" fill="#16150f">Jimi Notes</text>
    </g>
    <text x="80" y="250" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans',sans-serif" font-size="68" font-weight="800" fill="#16150f">地味だけど本当に困る</text>
    <text x="80" y="335" font-family="'Hiragino Kaku Gothic ProN','Hiragino Sans',sans-serif" font-size="68" font-weight="800" fill="#16150f"><tspan fill="#de3c24">デザインの悩み</tspan>を、解く。</text>
    <text x="80" y="392" font-family="'Hiragino Sans',sans-serif" font-size="26" fill="#5c5a50">出典付きリサーチ＋コピペできる実演で、毎回マジで困る急所を一つずつ。</text>
    ${strip}
  </svg>`;
}

export async function GET() {
  const png = await sharp(Buffer.from(svg())).png().toBuffer();
  return new Response(png, {
    headers: { 'Content-Type': 'image/png', 'Cache-Control': 'public, max-age=86400' },
  });
}
