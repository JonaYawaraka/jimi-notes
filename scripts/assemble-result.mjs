#!/usr/bin/env node
// batch-articles ワークフローの出力(JSON)を読み、frontmatterを付けて
// src/content/articles/<slug>.md に書き出す。日次自動化と手動の両方で使う。
// usage: node scripts/assemble-result.mjs <workflow-output.json>
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const DEST = join(root, 'src/content/articles');
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
const yamlStr = (s) => '"' + String(s).replace(/"/g, '\\"') + '"';
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };

let written = 0; const slugs = [];
for (const a of arr) {
  if (!a || !a.slug || !a.body) { console.log('skip malformed', a?.slug); continue; }
  let body = stripFences(a.body);
  if (body.includes('&lt;style') && !body.includes('<style')) body = unescapeHtml(body);
  const fm = [
    '---',
    `title: ${yamlStr(a.title)}`,
    `problem: ${yamlStr(a.problem)}`,
    `category: ${a.category}`,
    `tags: [${(a.tags || []).join(', ')}]`,
    `date: ${a.date || today()}`,
    `sources: ${a.sourceCount ?? 0}`,
    `draft: false`,
    '---', '', body.trim(), '',
  ].join('\n');
  writeFileSync(join(DEST, `${a.slug}.md`), fm);
  written++; slugs.push(a.slug);
  console.log(`wrote ${a.slug}.md (${a.sourceCount} sources)`);
}
console.log(`done: ${written} articles -> ${slugs.join(', ')}`);
