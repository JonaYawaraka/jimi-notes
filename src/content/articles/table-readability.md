---
title: "表が読みにくい——テーブルの可読性"
problem: "罫線だらけ/詰まりすぎで表が読みづらい。"
category: レイアウト
tags: [テーブル, 可読性, 罫線]
date: 2026-06-20
sources: 8
draft: false
---

<style>
  .tab-t{width:100%;border-collapse:collapse;font-size:13px;background:#fff;color:#16150f}
  .tab-t th,.tab-t td{padding:8px 10px}
  .tab-t thead th{color:#5c5a50;font-weight:700;text-align:left}

  /* ✗ 格子＋中央＋プロポーショナル数字 */
  .tab-bad th,.tab-bad td{border:1px solid #8d8b80;text-align:center}
  .tab-bad td.tab-n{text-align:center;font-variant-numeric:proportional-nums}

  /* ✓ 横罫線のみ＋整列＋tabular-nums */
  .tab-good thead th{border-bottom:2px solid rgba(22,21,15,.18)}
  .tab-good tbody td{border-bottom:1px solid rgba(22,21,15,.12)}
  .tab-good td.tab-n,.tab-good th.tab-n{text-align:right;font-variant-numeric:tabular-nums lining-nums;font-feature-settings:"tnum" 1,"lnum" 1}

  /* 整列デモ */
  .tab-align{width:170px;font-size:14px;background:#fff;color:#16150f;border-collapse:collapse}
  .tab-align td{padding:3px 12px;border-bottom:1px solid rgba(22,21,15,.12)}
  .tab-rag td{text-align:center;font-variant-numeric:proportional-nums}
  .tab-aligned td{text-align:right;font-variant-numeric:tabular-nums lining-nums}

  /* ゼブラ濃淡デモ */
  .tab-z{width:100%;font-size:13px;background:#fff;color:#16150f;border-collapse:collapse}
  .tab-z td{padding:7px 12px;text-align:left}
  .tab-z .tab-n{text-align:right;font-variant-numeric:tabular-nums lining-nums}
  .tab-zhard tr:nth-child(even){background:#b9b6a8}
  .tab-zsoft tr:nth-child(even){background:rgba(22,21,15,.04)}

  /* 密度デモ */
  .tab-d{width:100%;font-size:13px;background:#fff;color:#16150f;border-collapse:collapse}
  .tab-d td{padding-left:12px;padding-right:12px;border-bottom:1px solid rgba(22,21,15,.12)}
  .tab-cram td{height:26px;padding-top:0;padding-bottom:0}
  .tab-reg td{height:48px}

  /* sticky デモ */
  .tab-scroll{width:100%;max-height:150px;overflow:auto;background:#fff;border:1px solid rgba(22,21,15,.12)}
  .tab-s{width:100%;font-size:13px;background:#fff;color:#16150f;border-collapse:collapse}
  .tab-s td,.tab-s th{padding:7px 12px;text-align:left;border-bottom:1px solid rgba(22,21,15,.12)}
  .tab-s .tab-n{text-align:right;font-variant-numeric:tabular-nums lining-nums}
  .tab-s-stick thead th{position:sticky;top:0;background:#fff;color:#5c5a50;box-shadow:0 1px 0 rgba(22,21,15,.18)}
  .tab-s-nostick thead th{color:#5c5a50}
</style>

## 結論

プロは表を「飾る」のではなく、ノイズを引くことで読みやすくする。文字は左揃え・数値は右揃え＋等幅数字（tabular-nums）で桁を縦に揃え、罫線は1pxの極薄グレーかゼブラのどちらか一方だけ、行高は40/48/56pxの3段密度・セル左右16px（列間32px）を守る。Material Designのトークン（行52px／ヘッダ56px、罫線on-surface 12%、hover 4%）を信頼できるベースラインにすれば、ほとんどの表は「装飾を増やさず」読みやすくなる。

## 01 — 数値は右揃え＋tabular-nums、文字は左揃え

最も安っぽく見える原因は数値の中央揃え・左揃えだ。数字は一の位から右→左へ桁を比較するので**右揃え**が原則。文字は左→右に読み辞書順で比べるので**左揃え**。中央揃えは行頭・行末がギザギザ（ragged）になり視線が左右に飛ぶため、チェックボックスや星アイコンだけに限定する。ヘッダの揃えも列データに追従させると縦のエッジが揃う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-align tab-rag"><tr><td>1,250</td></tr><tr><td>98</td></tr><tr><td>14,008</td></tr><tr><td>307</td></tr></table>
  </div><div class="label">✗ 中央揃え → 桁がバラけて大小が比較できない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-align tab-aligned"><tr><td>1,250</td></tr><tr><td>98</td></tr><tr><td>14,008</td></tr><tr><td>307</td></tr></table>
  </div><div class="label">✓ 右揃え → 一の位が揃い、桁数＝大小が一目で分かる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/mission-log/design-better-data-tables-430a30a00d8c" target="_blank" rel="noopener">Design Better Data Tables — Matthew Ström (Mission Log)</a></p>

## 02 — 等幅数字（tabular-nums）で桁を縦に揃える

右揃えにしても、プロポーショナル数字のままだと「1」と「8」で字幅が違い、桁が縦に揃わずガタつく。`font-variant-numeric: tabular-nums lining-nums`（古い環境用に`font-feature-settings:"tnum" 1,"lnum" 1`）で全数字を等幅化すると、列がきれいな縦のグリッドになる。SF Pro／Work Sansは真のtabular figuresを持つ。なければmonospaceがフォールバック。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-align" style="font-variant-numeric:proportional-nums;text-align:right"><tr><td style="text-align:right">1,111</td></tr><tr><td style="text-align:right">8,888</td></tr><tr><td style="text-align:right">1,818</td></tr><tr><td style="text-align:right">10,945</td></tr></table>
  </div><div class="label">✗ プロポーショナル数字 → 右揃えでも桁の縦線がガタつく</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-align tab-aligned"><tr><td>1,111</td></tr><tr><td>8,888</td></tr><tr><td>1,818</td></tr><tr><td>10,945</td></tr></table>
  </div><div class="label">✓ tabular-nums → 各桁が等幅で縦にぴったり揃う</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/mission-log/design-better-data-tables-430a30a00d8c" target="_blank" rel="noopener">Design Better Data Tables — Matthew Ström (Mission Log)</a></p>

## 03 — 罫線かゼブラ、どちらか一方に絞る

縦横フル罫線の格子は、データより罫線が目立ち1990年代のスプレッドシート印象になる。構造は**余白と整列**で作り、罫線は1px極薄グレー（Material基準 on-surface 12%）の横線のみ・必要箇所だけ。ゼブラを使うなら罫線は外す——交互の塗りが行区切りの役割を果たすので併用は冗長でノイズになる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-t tab-bad"><thead><tr><th>商品</th><th class="tab-n">在庫</th></tr></thead><tbody>
    <tr><td>USB-Cケーブル</td><td class="tab-n">120</td></tr>
    <tr><td>充電器</td><td class="tab-n">45</td></tr>
    <tr><td>モバイルバッテリー</td><td class="tab-n">8</td></tr></tbody></table>
  </div><div class="label">✗ 全セルに濃い格子 → 罫線がデータより目立つ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-t tab-good"><thead><tr><th>商品</th><th class="tab-n">在庫</th></tr></thead><tbody>
    <tr><td>USB-Cケーブル</td><td class="tab-n">120</td></tr>
    <tr><td>充電器</td><td class="tab-n">45</td></tr>
    <tr><td>モバイルバッテリー</td><td class="tab-n">8</td></tr></tbody></table>
  </div><div class="label">✓ 横罫線のみ・極薄 → 余白と整列で構造を作る</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/content/9-design-techniques-for-user-friendly-tables/" target="_blank" rel="noopener">9 Design Techniques for User-Friendly Tables — UX Movement</a></p>

## 04 — ゼブラは「1色・1行ごと・極薄4%」が最安全解

行の取り違えを防ぐゼブラだが、濃い色で塗ると縞模様自体がノイズになる。正解は on-surface 約4% opacity の極薄グレーで、1行交互の単色。A List Apartの実証（n=2,276）では単色1行ゼブラが8問中3問で素のテーブルより正答率が有意に高く、残りも有意差なし＝**悪化させない安全策**。迷ったら密で長い表のデフォルトにする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-z tab-zhard"><tr><td>東京</td><td class="tab-n">1,250</td></tr><tr><td>大阪</td><td class="tab-n">980</td></tr><tr><td>名古屋</td><td class="tab-n">640</td></tr><tr><td>福岡</td><td class="tab-n">410</td></tr></table>
  </div><div class="label">✗ 濃いゼブラ → 縞そのものがノイズになり読みにくい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-z tab-zsoft"><tr><td>東京</td><td class="tab-n">1,250</td></tr><tr><td>大阪</td><td class="tab-n">980</td></tr><tr><td>名古屋</td><td class="tab-n">640</td></tr><tr><td>福岡</td><td class="tab-n">410</td></tr></table>
  </div><div class="label">✓ 4% opacityの極薄ストライプ → 行は追えるが邪魔しない</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://alistapart.com/article/zebrastripingmoredataforthecase/" target="_blank" rel="noopener">Zebra Striping: More Data for the Case — A List Apart</a></p>

## 05 — 行を詰めすぎない（40/48/56pxの3段密度）

密度を上げすぎる（30px以下）とパースエラーが増え、かえって読みにくくなる。行高は **Condensed 40px / Regular 48px / Relaxed 56px** の名前付き3モードを基本に、セル左右パディングは最低16px（列間32px）。Materialの基準は行52px・ヘッダ56px。読み物用途ならRegular 48px固定で十分だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-d tab-cram"><tr><td>注文 #1042</td><td class="tab-n">¥3,200</td></tr><tr><td>注文 #1043</td><td class="tab-n">¥980</td></tr><tr><td>注文 #1044</td><td class="tab-n">¥12,400</td></tr><tr><td>注文 #1045</td><td class="tab-n">¥540</td></tr></table>
  </div><div class="label">✗ 26pxに詰めすぎ → 行の取り違え・誤読が増える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="tab-d tab-reg"><tr><td>注文 #1042</td><td class="tab-n">¥3,200</td></tr><tr><td>注文 #1043</td><td class="tab-n">¥980</td></tr></table>
  </div><div class="label">✓ Regular 48px＋左右16px → 行に呼吸があり追いやすい</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Data Table Design UX Patterns & Best Practices — Pencil & Paper</a></p>

## 06 — ヘッダは sticky で固定する

縦スクロールで列ラベル（＝文脈）が消えると、どの列が何の数値か分からなくなる。`position:sticky; top:0` でヘッダを固定すれば、スクロール中もラベルが残る。注意点は背景——sticky要素は不透明背景（`#fff`など）にしないと下の行が透けて破綻する。下のデモは両方ともスクロールできる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2);padding:12px">
    <div class="tab-scroll"><table class="tab-s tab-s-nostick"><thead><tr><th>日付</th><th class="tab-n">売上</th></tr></thead><tbody>
    <tr><td>06/14</td><td class="tab-n">1,200</td></tr><tr><td>06/15</td><td class="tab-n">980</td></tr><tr><td>06/16</td><td class="tab-n">1,540</td></tr><tr><td>06/17</td><td class="tab-n">760</td></tr><tr><td>06/18</td><td class="tab-n">2,010</td></tr><tr><td>06/19</td><td class="tab-n">1,330</td></tr><tr><td>06/20</td><td class="tab-n">890</td></tr></tbody></table></div>
  </div><div class="label">✗ 固定なし → スクロールするとヘッダが消え文脈を失う</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2);padding:12px">
    <div class="tab-scroll"><table class="tab-s tab-s-stick"><thead><tr><th>日付</th><th class="tab-n">売上</th></tr></thead><tbody>
    <tr><td>06/14</td><td class="tab-n">1,200</td></tr><tr><td>06/15</td><td class="tab-n">980</td></tr><tr><td>06/16</td><td class="tab-n">1,540</td></tr><tr><td>06/17</td><td class="tab-n">760</td></tr><tr><td>06/18</td><td class="tab-n">2,010</td></tr><tr><td>06/19</td><td class="tab-n">1,330</td></tr><tr><td>06/20</td><td class="tab-n">890</td></tr></tbody></table></div>
  </div><div class="label">✓ sticky＋不透明背景 → スクロールしてもラベルが残る</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Data Table Design UX Patterns & Best Practices — Pencil & Paper</a></p>

## 実装スニペット

読みやすいベーステーブル。罫線は横線のみ・極薄、文字左揃え・数値右揃え＋tabular-nums。

```css
table {
  width: 100%;
  border-collapse: collapse;
  font-feature-settings: "palt"; /* 日本語の約物詰め */
}
th, td {
  padding: 14px 16px;            /* 縦14 / 左右16（列間32） */
  text-align: left;              /* 文字は左揃え */
  vertical-align: middle;
  border-bottom: 1px solid rgba(0,0,0,.12); /* Material: on-surface 12% */
  color: rgba(0,0,0,.87);        /* 本文 on-surface 87% */
}
thead th {
  height: 56px;                  /* ヘッダはボディ+4px */
  font-weight: 600;
  color: rgba(0,0,0,.6);
  border-bottom: 2px solid rgba(0,0,0,.12);
}
tbody tr { height: 52px; }       /* Material 基準行高 */

/* 数値列: 右揃え＋等幅数字 */
.num, td.num, th.num {
  text-align: right;
  font-variant-numeric: tabular-nums lining-nums;
  font-feature-settings: "tnum" 1, "lnum" 1; /* 古い環境のフォールバック */
}
```

ゼブラを使うなら横罫線は消す（冗長回避）。塗りは4% opacityまで。

```css
tbody tr:nth-child(even) { background: rgba(0,0,0,.04); } /* on-surface 4% */
tbody tr:nth-child(even) td,
tbody tr:nth-child(odd)  td { border-bottom: none; }

/* hover / 選択も極薄に */
tbody tr:hover { background: rgba(0,0,0,.04); }
tbody tr[aria-selected="true"] { background: rgba(25,118,210,.04); } /* primary 4% */
```

sticky ヘッダ＋左端列固定。固定要素は必ず不透明背景に。

```css
.table-scroll { overflow: auto; max-height: 70vh; }

thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  background: #fff;              /* 透けないよう不透明背景必須 */
}
/* 左端の識別子列を横スクロールで固定 */
th:first-child, td:first-child {
  position: sticky;
  left: 0;
  background: #fff;
  z-index: 1;
}
thead th:first-child { z-index: 3; } /* 角は最前面 */
```

密度3モード＋レスポンシブ。`data-density`属性で切り替える。

```css
:root { --row-h: 48px; --cell-py: 12px; --cell-px: 16px; } /* Regular */
[data-density="condensed"] { --row-h: 40px; --cell-py: 8px;  }
[data-density="relaxed"]   { --row-h: 56px; --cell-py: 22px; }

tbody tr { height: var(--row-h); }
th, td   { padding: var(--cell-py) var(--cell-px); }

/* タッチ操作対象は密度に関係なく48px確保 */
td .action, td input[type="checkbox"] { min-height: 48px; min-width: 48px; }

@media (max-width: 1080px) {
  :root { --cell-py: 8px; --cell-px: 10px; } /* モバイルは詰める */
}
```

## チェックリスト

<ul class="check">
<li>文字セルは左揃え、数値セルは右揃えになっているか（中央揃えはチェックボックス・星・アイコンのみ）</li>
<li>数値列に <code>font-variant-numeric: tabular-nums lining-nums</code> を指定し、桁が縦に揃っているか</li>
<li>ヘッダの揃えを列データに追従させたか（数値列のヘッダは右揃え）</li>
<li>罫線かゼブラのどちらか一方に絞ったか（両方併用していないか）</li>
<li>罫線は1px・極薄グレー（on-surface 12%相当）の横線のみで、縦の格子を引いていないか</li>
<li>ゼブラは単色・1行交互・4% opacityの極薄に抑えたか</li>
<li>行高は40/48/56pxのいずれか、セル左右パディングは最低16px（列間32px）あるか</li>
<li>長い表でヘッダを <code>position:sticky</code> 固定し、その背景を不透明にしたか</li>
<li>同一列内で小数桁・桁区切り・通貨表記を統一したか</li>
<li>タッチUIなら操作対象（チェックボックス等）が48px以上あるか</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>(1) Materialの52px等は「デフォルト」であり絶対値ではない。密度3段（40/48/56）のRegular相当で、プロジェクトでは48px固定でも妥当。 (2) A List Apartのゼブラ研究は2008年前後の古いデータで、8問中4問は有意差なし＝ゼブラは「悪化させない安全策」であって万能ではない。短い／インタラクティブな表ではむしろ外す。 (3) 整列・tabular-numsの主張は主にブログ由来でRCTではないが、専門家間のコンセンサスは非常に強く実務的に信頼できる。 (4) opacityベースのトークンはsticky・重なり要素で透けて破綻するため、固定列・固定ヘッダは必ず不透明背景に解決する。 (5) 16px/32pxパディングはデスクトップ前提。モバイルは8〜10pxまで詰めてよい。 (6) <code>font-variant-numeric</code> はフォントがtabular figuresを持つ場合のみ有効。 (7) 触り対象48pxはタッチUI限定で、ポインタ専用の業務画面では緩めてよい。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://raw.githubusercontent.com/material-components/material-components-web/master/packages/mdc-data-table/_data-table-theme.scss" target="_blank" rel="noopener">material-components-web mdc-data-table _data-table-theme.scss</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/data-tables/web" target="_blank" rel="noopener">Data tables — Material Design (m2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://alistapart.com/article/zebrastripingmoredataforthecase/" target="_blank" rel="noopener">Zebra Striping: More Data for the Case — A List Apart</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/mission-log/design-better-data-tables-430a30a00d8c" target="_blank" rel="noopener">Design Better Data Tables — Matthew Ström (Mission Log)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables" target="_blank" rel="noopener">Data Table Design UX Patterns & Best Practices — Pencil & Paper</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uiprep.com/blog/the-ultimate-guide-to-designing-data-tables" target="_blank" rel="noopener">The Ultimate Guide to Designing Data Tables — UI Prep</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/content/9-design-techniques-for-user-friendly-tables/" target="_blank" rel="noopener">9 Design Techniques for User-Friendly Tables — UX Movement</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/data-table-ui-design" target="_blank" rel="noopener">Data table UI design reference guide for 2026 — Setproduct</a></p>
