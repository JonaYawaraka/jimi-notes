---
title: "料金表が読めない——価格テーブルの設計"
problem: "プランの差と推しが伝わらない料金表。"
category: レイアウト
tags: [料金表, 比較, CV]
date: 2026-06-20
sources: 11
draft: false
---

<style>
  .pri-tbl{border-collapse:collapse;width:100%;font-size:13px;color:#16150f;background:#fff}
  .pri-tbl th,.pri-tbl td{padding:7px 10px;text-align:left;color:#16150f}
  .pri-num{text-align:right;font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1}

  /* ✗ クリスマスツリー */
  .pri-xmas{width:100%;display:flex;gap:6px}
  .pri-xmas .pri-col{flex:1;border-radius:8px;padding:10px 6px;text-align:center;font-size:11px;font-weight:700}
  .pri-xmas .pri-c1{background:#1f9d55;color:#fff}
  .pri-xmas .pri-c2{background:#e3a008;color:#16150f}
  .pri-xmas .pri-c3{background:#7c3aed;color:#fff}
  .pri-xmas .pri-c4{background:#e3342f;color:#fff}

  /* ✓ 中立＋1列強調 */
  .pri-clean{width:100%;display:flex;gap:6px;align-items:center}
  .pri-clean .pri-col{flex:1;border-radius:8px;padding:10px 6px;text-align:center;font-size:11px;font-weight:700;background:#fff;border:1px solid var(--line);color:#16150f}
  .pri-clean .pri-feat{position:relative;border:2px solid #2563eb;background:#f5f8ff;box-shadow:0 8px 20px rgba(37,99,235,.18);transform:scale(1.06);z-index:1}
  .pri-clean .pri-badge{position:absolute;top:-9px;left:50%;transform:translateX(-50%);background:#2563eb;color:#fff;font-size:8px;font-weight:600;padding:2px 7px;border-radius:999px;white-space:nowrap}

  /* 数値整列デモ */
  .pri-rows{font-size:14px;line-height:1.9;color:#16150f}
  .pri-bad-num{font-family:Georgia,serif;text-align:left}
  .pri-good-num{font-variant-numeric:tabular-nums;font-feature-settings:"tnum" 1;text-align:right;width:96px}
  .pri-good-num .pri-amt{font-weight:700;color:#16150f;letter-spacing:-.01em}

  /* 罫線デモ */
  .pri-grid-hell{border-collapse:collapse;font-size:12px;color:#16150f;background:#fff}
  .pri-grid-hell td{border:2px solid #444;padding:6px 12px;color:#16150f}
  .pri-zebra{border-collapse:collapse;font-size:12px;color:#16150f;background:#fff;width:170px}
  .pri-zebra td{border:0;border-bottom:1px solid #e5e7eb;padding:6px 12px;color:#16150f}
  .pri-zebra tr:nth-child(even) td{background:rgba(0,0,0,.04)}

  /* boolean デモ */
  .pri-bool{font-size:13px;color:#16150f;line-height:1.8}
  .pri-bool .pri-yes{color:#1f9d55;font-weight:700}
  .pri-bool .pri-no{color:#8d8b80}
  .pri-bool .pri-strike{text-decoration:line-through;color:#8d8b80}
  .pri-wall{font-size:10.5px;color:#5c5a50;line-height:1.45;max-width:150px}

  /* 端数デモ */
  .pri-price-cheap{font-size:30px;font-weight:800;color:#16150f}
  .pri-price-cheap .pri-frac{font-size:15px;vertical-align:super;color:#8d8b80}
  .pri-price-pro{font-size:38px;font-weight:800;color:#16150f;letter-spacing:-.02em}

  /* モバイルデモ */
  .pri-phone{width:150px;height:150px;border:2px solid var(--line);border-radius:14px;background:#fff;overflow:hidden;position:relative}
  .pri-scroll-row{display:flex;width:300px;font-size:10px;color:#16150f}
  .pri-scroll-row>div{min-width:75px;padding:6px;border-right:1px solid #e5e7eb}
  .pri-scroll-hint{position:absolute;bottom:6px;right:6px;font-size:9px;color:#e3342f;font-weight:700}
  .pri-stack{padding:8px;font-size:10px;color:#16150f}
  .pri-stack-card{border:1px solid #e5e7eb;border-radius:8px;padding:6px;margin-bottom:6px}
  .pri-stack-card .pri-kv{display:flex;justify-content:space-between;padding:2px 0}
  .pri-stack-card .pri-k{color:#8d8b80}
</style>

## 結論

プロは価格テーブルを「読みやすさ（行高48px・1px薄罫線・等幅数字の右揃え・3〜10%ゼブラ）」と「選びやすさ（3〜4プラン構成で中段を1つだけ複合的に強調）」の2軸で設計する。鍵は、全列を色で塗る「クリスマスツリー化」を避け、周囲を中立色（白＋薄グレー罫線＋ダークテキスト）のアンカーに保ったまま、推奨列だけを badge＋色付きボーダー＋ブランド色CTA＋わずかな影と拡大で前面に浮かせること。CTAは全列同一文言にし、誘導は「色相」ではなく「CTAと背景のコントラスト」で効かせる。

## 01 — 推奨は1列だけ。全列を塗る「クリスマスツリー化」を避ける

列ごとに違う背景色・装飾を付けると、視覚ノイズだけが増えてどれが推奨なのか分からなくなる。Nick Babich の言葉を借りれば、それは「意思決定を助けるツールというよりクリスマスツリー」だ。強調は必ず1列だけにし、他の列は白＋薄グレー罫線＋ダークテキストの中立アンカーに保つ。推奨列の強調は単一手段に頼らず、淡い背景tint・色付きボーダー・drop shadow（奥行きで前面化）・わずかな拡大（scale 1.04〜1.06）・badge・目立つCTAを **複合** させるのがプロの手口。色相そのものより、CTAと地のコントラストが効く。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-xmas"><div class="pri-col pri-c1">Free</div><div class="pri-col pri-c2">Basic</div><div class="pri-col pri-c3">Pro</div><div class="pri-col pri-c4">Max</div></div></div><div class="label">✗ 全列を別色で塗る → どれが推奨か不明、安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-clean"><div class="pri-col">Free</div><div class="pri-col">Basic</div><div class="pri-col pri-feat"><span class="pri-badge">Most Popular</span>Pro</div><div class="pri-col">Max</div></div></div><div class="label">✓ 中立3列＋中段1列だけ複合強調 → 視線が推奨へ</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxplanet.org/best-practices-for-pricing-table-design-2d99e46201da" target="_blank" rel="noopener">Best Practices for Pricing Table Design — Nick Babich, UX Planet</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.getmonetizely.com/articles/how-does-anchoring-psychology-shape-customer-decisions-on-your-saas-pricing-page" target="_blank" rel="noopener">How Does Anchoring Psychology Shape Customer Decisions — Monetizely</a></p>

## 02 — 数値は等幅＋右揃え。桁が揃わなければ「読めない表」

価格や数量を左揃え・プロポーショナルフォントで縦に並べると、桁位置がバラついて金額の大小が一瞬で比較できない。価格列は小数点で右揃えし、`font-variant-numeric: tabular-nums`（`"tnum" 1`）で桁幅を固定する。これだけで縦の桁比較が成立する。価格は太字ダーク、単位やラベルは小さく薄いグレーにしてメリハリを付ける。テキスト列は西欧読み順で左揃えが原則。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-rows pri-bad-num">¥980<br>¥12,800<br>¥1,480<br>¥128,000</div></div><div class="label">✗ 左揃え＋プロポーショナル → 桁がガタつき比較不能</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-rows"><div class="pri-good-num"><span class="pri-amt">¥980</span></div><div class="pri-good-num"><span class="pri-amt">¥12,800</span></div><div class="pri-good-num"><span class="pri-amt">¥1,480</span></div><div class="pri-good-num"><span class="pri-amt">¥128,000</span></div></div></div><div class="label">✓ 等幅＋右揃え → 桁が揃い大小が即わかる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Pencil and Paper — Enterprise Data Tables</a></p>

## 03 — 罫線は1px薄グレーまで。区切りはゼブラと余白で

太く濃い罫線で全セルを囲う「グリッド地獄」は、罫線が本文と視覚的に競合して安っぽく古臭く見える。区切り線は **1px・ライトグレー（#e5e7eb）が上限**、縦罫線は付けない。行を区切りたいなら罫線を増やすのではなく、3〜10%グレーのゼブラストライプ（推奨初期値4%）か余白で。行数が多い表ではゼブラが横方向の視線誘導に効き、hover時に行全体を light yellow（#fffbeb）でハイライトすると「グリッド迷子」を防げる。疎な表なら縞より余白（Tufte流）が上品だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><table class="pri-grid-hell"><tr><td>ユーザー数</td><td>5</td></tr><tr><td>ストレージ</td><td>10GB</td></tr><tr><td>サポート</td><td>メール</td></tr></table></div><div class="label">✗ 太い濃罫線で全セル囲う → ノイズが本文と競合</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><table class="pri-zebra"><tr><td>ユーザー数</td><td class="pri-num">5</td></tr><tr><td>ストレージ</td><td class="pri-num">10GB</td></tr><tr><td>サポート</td><td class="pri-num">メール</td></tr></table></div><div class="label">✓ 1px薄罫線＋4%ゼブラ → 静かでスキャンしやすい</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.mindk.com/blog/better-data-table-design/" target="_blank" rel="noopener">MindK — Data Table Design Tips（ゼブラ3〜10%）</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Pencil and Paper — Enterprise Data Tables（行高40/48/56px・1px薄罫線）</a></p>

## 04 — 機能差はテキストでなく数値・チェック・取り消し線で

機能差をびっしりテキストで書くと、読む量が多くて差分が伝わらない。差分は数値（5 users）と boolean（✓=Yes / —=No）に置き換え、利用不可の機能は取り消し線で示す。上位プランでは「unlimited」を強調する。価格・主要数値は太字ダーク、ラベルは小さく薄く。これで各行が一目でスキャンできるようになる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-wall">最大5ユーザーまで利用でき、メールサポートが付属します。なおAPI連携機能はこのプランではご利用いただけません。優先サポートも対象外です。</div></div><div class="label">✗ 文章で差分を説明 → 読む負荷が高く比較できない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-bool">ユーザー数　<b>5</b><br>メールサポート　<span class="pri-yes">✓</span><br>API連携　<span class="pri-strike">利用不可</span><br>優先サポート　<span class="pri-no">—</span></div></div><div class="label">✓ 数値＋✓/—＋取り消し線 → 差分が瞬時に伝わる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxplanet.org/best-practices-for-pricing-table-design-2d99e46201da" target="_blank" rel="noopener">Best Practices for Pricing Table Design — Nick Babich, UX Planet</a></p>

## 05 — 端数を落として知覚コストを下げる

比較表に `$10.99` や `¥1,980` の端数をそのまま並べると、桁が増えて知覚コストが上がり「高い」と感じさせる。比較の文脈ではセント（端数）を落として `$10` のように見せると、視覚的負荷と価格知覚を同時に下げられる。ただし日本では税込表示義務など地域の価格表示法規があるため、端数除去の可否は要確認。あくまで「比較を軽くする」目的のチューニングだと割り切る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-price-cheap">$10<span class="pri-frac">.99</span></div></div><div class="label">✗ セント付き → 桁が増え知覚コストが上がる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-price-pro">$10</div></div><div class="label">✓ 端数を落とす → 軽く・安く見える（法規に注意）</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/content/7-design-strategies-for-a-successful-pricing-table/" target="_blank" rel="noopener">7 Design Strategies for a Successful Pricing Table — UX Movement</a></p>

## 06 — モバイルは横スクロール禁止。カード縦積みに切り替える

狭い画面で表を横スクロールさせるのは「遅く・面倒で・疲れる」操作で、比較中に列を見失う。モバイルでは `display:block` で各 td をブロック化し、`thead` を隠してカードの縦積みに切り替える。td に `data-label` を持たせ、`::before` で「ラベル：値」の2カラム表示にすれば、見出し行なしでも何の値か分かる。BPはプロジェクト方針の1080px1点で統一。長い表ではデスクトップ側で sticky header を併用する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-phone"><div class="pri-scroll-row"><div>ユーザー数<br>5</div><div>ストレージ<br>10GB</div><div>サポート<br>メール</div><div>API<br>—</div></div><div class="pri-scroll-hint">→ scroll</div></div></div><div class="label">✗ 表のまま横スクロール → 列を見失い疲れる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-phone"><div class="pri-stack"><div class="pri-stack-card"><div class="pri-kv"><span class="pri-k">ユーザー数</span><b>5</b></div><div class="pri-kv"><span class="pri-k">ストレージ</span><b>10GB</b></div></div><div class="pri-stack-card"><div class="pri-kv"><span class="pri-k">サポート</span><b>メール</b></div><div class="pri-kv"><span class="pri-k">API連携</span><b>—</b></div></div></div></div></div><div class="label">✓ カード縦積み＋ラベル:値 → 横スクロール不要</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/" target="_blank" rel="noopener">Designing A Perfect Pricing Plan Page — Smashing Magazine</a></p>

## 07 — 3〜4プラン・高→低の並びで「選びやすさ」を作る

プランを5つ以上並べると選択肢過多で決定麻痺を招く。定石は3〜4プラン。中段に「Most Popular」を置くと、ユーザーは高すぎず安すぎない中間を選ぶ傾向（compromise effect、中段選択は集計で約65%）に乗れる。さらに最も高いプランを最初（左）に置いて高値アンカーを提示すると、下位が割安に見える。decoy/center-stage効果は3〜4プランで最大化し、Ariely の the Economist 実験では decoy 追加で premium 選択が16%→84%へ跳ねた。ただし、おとりの乱用は誤認を招くダークパターンと紙一重。透明性とブランド信頼を最優先に。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-clean" style="font-size:9px"><div class="pri-col">P1</div><div class="pri-col">P2</div><div class="pri-col">P3</div><div class="pri-col">P4</div><div class="pri-col">P5</div><div class="pri-col">P6</div></div></div><div class="label">✗ 6プランをフラットに並べる → 決定麻痺、推しなし</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pri-clean"><div class="pri-col">¥9,800</div><div class="pri-col pri-feat"><span class="pri-badge">Recommended</span>¥4,800</div><div class="pri-col">¥1,800</div></div></div><div class="label">✓ 高→低の3プラン＋中段強調 → 中間が割安に見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/content/7-design-strategies-for-a-successful-pricing-table/" target="_blank" rel="noopener">7 Design Strategies for a Successful Pricing Table — UX Movement</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://theconversation.com/the-decoy-effect-how-you-are-influenced-to-choose-without-really-knowing-it-111259" target="_blank" rel="noopener">The decoy effect — The Conversation</a></p>

## 実装スニペット

```css
/* 等幅数字＋右揃えの価格セル（桁を揃える） */
.price-table td.num{
  text-align: right;
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
.price-table .amount{
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}
.price-table .label{ text-align: left; color: #6b7280; font-size: 0.875rem; }
```

```css
/* 行高3段階・1px薄罫線・ゼブラ3〜10% */
.price-table{ border-collapse: collapse; width: 100%; }
.price-table th,.price-table td{
  height: 48px;            /* Regular。密:40px / ゆったり:56px */
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb; /* 1px light grey、縦罫線は付けない */
  vertical-align: middle;  /* 〜3行まで中央。4行超は top */
}
.price-table tbody tr:nth-child(even){ background: rgba(0,0,0,0.04); } /* 4%グレー */
.price-table tbody tr:hover{ background: #fffbeb; }  /* light yellow hover */
```

```css
/* 推奨カードだけを浮かせる（クリスマスツリー回避） */
:root{ --brand:#2563eb; --neutral-bd:#e5e7eb; }
.plan{ background:#fff; border:1px solid var(--neutral-bd); border-radius:12px; padding:24px; }
.plan--featured{
  border:2px solid var(--brand);
  background:#f5f8ff;                 /* ごく淡いtint */
  box-shadow:0 12px 28px rgba(37,99,235,.18); /* 奥行きで前面化 */
  transform:scale(1.04);             /* わずかに拡大 */
  position:relative; z-index:1;
}
.plan--featured .badge{
  position:absolute; top:-12px; left:50%; transform:translateX(-50%);
  background:var(--brand); color:#fff; font-size:12px; font-weight:600;
  padding:4px 12px; border-radius:999px;
}
```

```css
/* モバイルは横スクロール禁止 → カード縦積み（BP1080px1点） */
@media (max-width: 1080px){
  .price-table, .price-table thead, .price-table tbody,
  .price-table tr, .price-table th, .price-table td{ display:block; width:100%; }
  .price-table thead{ display:none; }      /* 横スクロールさせない */
  .price-table tr{ border:1px solid #e5e7eb; border-radius:12px; margin-bottom:16px; }
  .price-table td{ display:flex; justify-content:space-between; height:auto; min-height:48px; border:0; border-bottom:1px solid #f0f0f0; }
  .price-table td::before{ content:attr(data-label); color:#6b7280; font-size:.875rem; }
}
```

## チェックリスト

<ul class="check">
  <li>プランは3〜4個に絞った（5つ以上は決定麻痺）</li>
  <li>強調は中段の1列だけ。他列は白＋薄グレー罫線＋ダークテキストの中立に保った</li>
  <li>推奨列は badge＋色付きボーダー＋drop shadow＋scale1.04＋ブランド色CTA を複合させた</li>
  <li>全列のCTAは同一文言（例: Choose Plan）。推奨列だけ視覚的に強い</li>
  <li>価格・数値列は小数点で右揃え＋`tabular-nums`で桁幅固定した</li>
  <li>罫線は1px薄グレーのみ。縦罫線なし、太い濃罫線で全セルを囲っていない</li>
  <li>行区切りはゼブラ3〜10%（初期値4%）か余白で。行高は48px基準</li>
  <li>機能差は数値・✓/—・取り消し線で表現し、テキスト説明を最小化した</li>
  <li>比較表の価格は端数を落とした（日本の税込表示など法規は確認済み）</li>
  <li>モバイルは横スクロールさせず、カード縦積み＋`data-label`に切り替えた（BP1080px）</li>
  <li>誘導は色相ではなくCTAと背景のコントラストで。色だけに依存せずbadge/ボーダー/サイズも併用（色覚多様性対応）</li>
  <li>おとり・アンカリングが誤認を招く構成になっていない（ダークパターン回避）</li>
</ul>

## 限界 / 出典

数値系のlift（+56% Optimizely / 強調なしで-22% / 中段選択+30〜40% / the Economist +43% / Stanford参照価格+40%）は二次CRO・マーケブログで繰り返し引用される値で、査読論文ではない。方向性の参考に留め、必ず自社のA/Bテストで検証すること。比較的堅い根拠は Ariely の decoy 分割（premium 84/16）と Williams-Sonoma 事例（$429追加で$275モデルが約2倍）のみ。具体的なpx/hexはほぼ Pencil&Paper（40/48/56px・1px薄グレー）と MindK（ゼブラ3〜10%）由来で、背景tint・影・scale=1.04・badge色などの実装値は本ブリーフでの推奨初期値であり要調整。anchoring/decoy の活用は誤認を誘うとダークパターン化しうるため、透明性とブランド信頼を優先すること。端数除去は地域の価格表示法規（日本の税込表示義務など）で可否が変わる。一次CRO複数（leadsuitenow, getmonetizely, netsuite, visionarygrid）は403/取得制限があり、アクセス可能な二次ソースに依存している点に留意。BP1080px1点はユーザーのプロジェクト方針に合わせた値で、一般原則ではない。

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxplanet.org/best-practices-for-pricing-table-design-2d99e46201da" target="_blank" rel="noopener">Best Practices for Pricing Table Design — Nick Babich, UX Planet</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.smashingmagazine.com/2022/07/designing-better-pricing-page/" target="_blank" rel="noopener">Designing A Perfect Pricing Plan Page — Smashing Magazine</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/content/7-design-strategies-for-a-successful-pricing-table/" target="_blank" rel="noopener">7 Design Strategies for a Successful Pricing Table — UX Movement</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://onextrapixel.com/comprehensive-guide-to-pricing-tables/" target="_blank" rel="noopener">Comprehensive Guide To Designing Comparison Tables & Pricing Pages — Onextrapixel</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Pencil and Paper — Enterprise Data Tables</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.mindk.com/blog/better-data-table-design/" target="_blank" rel="noopener">MindK — Data Table Design Tips</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/data-table-design-best-practices/" target="_blank" rel="noopener">LogRocket — Data Table Design Best Practices</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://theconversation.com/the-decoy-effect-how-you-are-influenced-to-choose-without-really-knowing-it-111259" target="_blank" rel="noopener">The decoy effect — The Conversation</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://fs.blog/how-williams-sonoma-inadvertently-sold-more-bread-machines/" target="_blank" rel="noopener">How Williams-Sonoma Inadvertently Sold More Bread Machines — Farnam Street</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.getmonetizely.com/articles/how-does-anchoring-psychology-shape-customer-decisions-on-your-saas-pricing-page" target="_blank" rel="noopener">How Does Anchoring Psychology Shape Customer Decisions — Monetizely</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.visionarygrid.studio/blog/how-to-use-psychological-anchoring-in-your-pricing-strategy" target="_blank" rel="noopener">How to use psychological anchoring in your pricing strategy — Visionary Grid</a></p>
