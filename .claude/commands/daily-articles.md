---
description: 在庫から次の3テーマを deep-research 方式で記事化し、ビルド→Cloudflare デプロイ→git push する日次ジョブ
---

You are running the **Jimi Notes daily article job**. Work in this repo (`/Users/otsu_naoya/Desktop/projects/jimi-notes`). Execute these steps in order, autonomously. Do NOT ask questions.

1. **Pick topics**: run `node scripts/pick-topics.mjs 3` and parse the JSON array it prints (topics whose article file does not yet exist).
   - If the array is **empty**, print `BACKLOG EMPTY — nothing to generate` and STOP (do not build or deploy). Done.

2. **Generate**: call the `Workflow` tool with `scriptPath: "scripts/batch-articles.mjs"` and `args` set to the exact topics array from step 1. Wait for it to finish. From the tool result, note the **output-file** path (the `.output` file). Each topic produces an article body with live CSS demos.

3. **Assemble**: run `node scripts/assemble-result.mjs <output-file-path>` to write the new `src/content/articles/<slug>.md` files (frontmatter is added automatically). Confirm it reports the expected slugs.

4. **Build**: run `npm run build`. If the build FAILS, fix only the offending generated article minimally (or set its `draft: true`) so the build passes, then rebuild. Never deploy a broken build.

5. **Deploy**: run `wrangler pages deploy dist --project-name jimi-notes --branch main`.

6. **Commit & push**: 
   `git add -A && git -c user.name="otsu_naoya" -c user.email="naoya.otsu@anker.com" commit -m "daily: <slug1>, <slug2>, <slug3>" && git push origin main`

7. **Report**: print the new article slugs and the production URLs (`https://jimi-notes.pages.dev/articles/<slug>/`).

Notes:
- Thumbnails and figure animations are automatic (global component + CSS) — new articles get them with no extra work.
- The job is idempotent: `pick-topics.mjs` skips topics that already have an article file, so re-running never duplicates.
- Add more topics anytime by editing `data/topic-backlog.json`.
