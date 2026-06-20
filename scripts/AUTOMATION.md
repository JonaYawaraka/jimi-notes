# 日次自動化（毎日リサーチ→3記事→deploy）

在庫(`data/topic-backlog.json`)から「まだ記事の無い」3テーマを選び、deep-research方式で記事化 →
ビルド → Cloudflare Pages デプロイ → git push までを毎日自動で行う仕組み。

## 構成

| ファイル | 役割 |
|---|---|
| `data/topic-backlog.json` | ネタ在庫（38テーマ）。`status` は参考、生成済み判定は記事ファイルの有無 |
| `scripts/pick-topics.mjs` | 在庫から未生成の上位N件を JSON 出力（冪等の核） |
| `scripts/batch-articles.mjs` | リサーチ→執筆ワークフロー（`args`=トピック配列、文字列でもparse対応） |
| `scripts/assemble-result.mjs` | ワークフロー出力→`src/content/articles/*.md` に frontmatter付きで書き出し |
| `.claude/commands/daily-articles.md` | 上記を順に実行する slash コマンド |
| `scripts/run-daily.sh` | launchd から呼ばれるラッパー（`claude -p "/daily-articles"`） |
| `scripts/com.jimi-notes.daily.plist` | launchd 定義（毎日 9:30） |

サムネ（モチーフSVG）と図解アニメは共通の仕組みなので、新記事も自動で付与される。

## テスト（まず1回手動で）

```bash
cd ~/Desktop/projects/jimi-notes
node scripts/pick-topics.mjs 3        # 次に作る3件を確認（安全）
bash scripts/run-daily.sh             # 実際に生成→deploy→push まで通す
tail -f logs/latest.log               # 進捗を見る
```

※ `run-daily.sh` は `claude -p "/daily-articles" --dangerously-skip-permissions` を起動し、
承認なしで deploy/push まで行う**自律エージェント**。中身を理解した上で実行すること。

## 常駐化（毎日自動）

```bash
cp ~/Desktop/projects/jimi-notes/scripts/com.jimi-notes.daily.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.jimi-notes.daily.plist
launchctl list | grep jimi-notes      # 登録確認
```

- 実行時刻の変更：plist の `Hour`/`Minute` を編集して load し直す。
- Mac がスリープ/電源OFFだとその日のジョブは走らない（次回起動時に1回 catch-up）。

## 一時停止 / 解除

```bash
launchctl unload ~/Library/LaunchAgents/com.jimi-notes.daily.plist
```

## ネタを足す

`data/topic-backlog.json` の `topics` に追記するだけ（slug/title/problem/category/tags/angles）。
`category` は 色/余白/タイポ/画像/レイアウト/質感/細部。在庫が尽きると `pick-topics` は空を返し、
`run-daily.sh` は何もせず終了する（`BACKLOG EMPTY`）。

## 既知の注意

- Cloudflare/GitHub はローカル認証（wrangler=jonayawaraka@gmail.com / gh=JonaYawaraka）を使う。
- デプロイは wrangler 直アップロード方式。git push しても自動デプロイはされない（run-daily が両方やる）。
- Workflow の `args` は**生JSON文字列**で届くため、`batch-articles.mjs` 側で `JSON.parse` している。
