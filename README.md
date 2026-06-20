# Jimi Notes

地味だけど本当に困るデザインの悩みを、**根拠（リサーチ）＋実演（ライブデモ）＋実装**で解くデザインノート。

派手なトレンド記事ではなく、「背景に逃げる」「影が安っぽい」「余白が決まらない」といった毎回マジで困る急所を、出典付きで裏取りし、コピペできるCSS/SVGデモ付きで一つずつ潰していく。

## 技術構成

- **Astro 5**（Content Collections / Markdown）
- ホスティング：**Cloudflare Pages**（push自動デプロイ・無料）
- サイト自身が「脱・無地」を実演（ダーク+グロー＋SVGグレイン背景）

## 開発

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ に静的出力
```

## 記事を追加する

`src/content/articles/` に Markdown を1つ追加するだけ。frontmatter は `src/content.config.ts` のスキーマに従う。

```yaml
---
title: 記事タイトル
problem: 一言の悩み（共感フック）
category: 質感   # 色/余白/タイポ/画像/レイアウト/質感/細部
tags: [タグ]
date: 2026-06-20
sources: 23      # リサーチで裏取りしたソース数（任意）
draft: false     # true で一覧/ビルドから除外
---
```

記事固有のデモCSSは各Markdown冒頭の `<style>` に、共通枠は `src/styles/global.css` に。

## 記事の作り方（パイプライン）

1. 悩みを選ぶ
2. ディープリサーチで裏取り（出典＋検証）
3. 8ブロックのテンプレに流し込む（結論→原則→ライブデモ→実装→チェックリスト→出典→限界）
4. `draft: false` にして push → Cloudflare Pages が自動デプロイ
