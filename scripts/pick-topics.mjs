#!/usr/bin/env node
// バックログから「まだ記事ファイルが無い」トピックを上から N 件選び、
// batch-articles ワークフローの args 形状（key付き）で JSON 出力する。
// usage: node scripts/pick-topics.mjs [N]
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const N = Number(process.argv[2] || 3);
const backlog = JSON.parse(readFileSync(join(root, 'data/topic-backlog.json'), 'utf8'));

const key = (slug) => slug.replace(/[^a-z]/g, '').slice(0, 3) || 'jn';
const picked = [];
for (const t of backlog.topics) {
  if (picked.length >= N) break;
  const exists = existsSync(join(root, 'src/content/articles', `${t.slug}.md`));
  if (exists) continue;
  picked.push({
    key: key(t.slug), slug: t.slug, category: t.category,
    title: t.title, problem: t.problem, tags: t.tags, angles: t.angles,
  });
}
process.stdout.write(JSON.stringify(picked));
