#!/usr/bin/env node
// batch-articles ワークフローの出力(JSON)を読み、frontmatterを付けて
// src/content/articles/<slug>.md に書き出す。日次自動化と手動の両方で使う。
// usage: node scripts/assemble-result.mjs <workflow-output.json>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(root, 'src/content/articles');
const CATEGORIES = ['色', '余白', 'タイポ', '画像', 'レイアウト', '質感', '細部'];

const outFile = process.argv[2];
if (!outFile) { console.error('usage: assemble-result.mjs <output.json>'); process.exit(1); }

const raw = JSON.parse(readFileSync(outFile, 'utf8'));
const arr = Array.isArray(raw) ? raw : (raw.result ?? raw.articles ?? []);

const unescapeHtml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const stripFences = (s) => {
  let t = s.trim();
  if (t.startsWith('```')) { t = t.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```\s*$/, ''); }
  return t;
};
// JSON.stringify は YAML のダブルクォート・スカラとして安全（引用符/バックスラッシュ/制御文字を処理）
const y = (s) => JSON.stringify(String(s));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };

// 書き出し前のバリデーション。不正なら理由を返す。
function validate(a) {
  if (!a || typeof a !== 'object') return 'not an object';
  if (!a.slug || !/^[a-z0-9-]+$/.test(a.slug)) return `bad slug: ${a?.slug}`;
  if (!a.title || !a.problem) return 'missing title/problem';
  if (!CATEGORIES.includes(a.category)) return `bad category: ${a.category}`;
  if (!Array.isArray(a.tags)) return 'tags not array';
  if (!a.body || a.body.length < 200) return 'body too short/empty';
  return null;
}

let written = 0, skipped = 0; const slugs = [];
for (const a of arr) {
  const err = validate(a);
  if (err) { console.error(`SKIP ${a?.slug ?? '?'}: ${err}`); skipped++; continue; }
  let body = stripFences(a.body);
  if (body.includes('&lt;style') && !body.includes('<style')) body = unescapeHtml(body);
  const fm = [
    '---',
    `title: ${y(a.title)}`,
    `problem: ${y(a.problem)}`,
    `category: ${a.category}`,
    `tags: [${a.tags.map((t) => y(t)).join(', ')}]`,
    `date: ${a.date || today()}`,
    `sources: ${Number(a.sourceCount) || 0}`,
    `draft: false`,
    '---', '', body.trim(), '',
  ].join('\n');
  writeFileSync(join(DEST, `${a.slug}.md`), fm);
  written++; slugs.push(a.slug);
  console.log(`wrote ${a.slug}.md (${a.sourceCount} sources)`);
}
console.log(`done: ${written} written, ${skipped} skipped -> ${slugs.join(', ')}`);
// 1本も書けなかったら失敗としてデプロイを止める（run-daily.sh が検知）
if (written === 0) { console.error('ERROR: no valid articles written'); process.exit(1); }
