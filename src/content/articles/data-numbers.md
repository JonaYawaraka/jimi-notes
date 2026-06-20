---
title: "数字が揃わない——データと数値の組版"
problem: "価格やデータの数字が揃わず、桁も読みづらい。"
category: タイポ
tags: [数字, 組版, tabular]
date: 2026-06-20
sources: 13
draft: false
---

<style>
  .dat-tbl{border-collapse:collapse;font-size:15px;color:#16150f;width:100%;max-width:280px}
  .dat-tbl th,.dat-tbl td{padding:4px 12px;border-bottom:1px solid rgba(22,21,15,.16)}
  .dat-tbl thead th{font-size:11px;letter-spacing:.04em;color:#5c5a50;text-transform:uppercase}
  .dat-prop{font-variant-numeric:proportional-nums}
  .dat-tab{font-variant-numeric:lining-nums tabular-nums}
  .dat-r{text-align:right}
  .dat-l{text-align:left}
  .dat-c{text-align:center}
  .dat-hide{visibility:hidden}

  .dat-counter{font-size:40px;font-weight:700;color:#f4f2ec;letter-spacing:0;font-variant-numeric:proportional-nums}
  .dat-counter.dat-tab{font-variant-numeric:tabular-nums}
  .dat-strip{display:flex;align-items:center;gap:8px;color:#8d8b80;font-size:12px}
  .dat-rail{width:4px;height:48px;background:var(--accent)}

  .dat-price{display:inline-flex;align-items:baseline;color:#16150f;font-variant-numeric:lining-nums tabular-nums;font-weight:700;font-size:34px}
  .dat-price--bad .dat-sym{vertical-align:super;font-size:18px;font-weight:400}
  .dat-price--bad .dat-cents{font-weight:300;color:#16150f}
  .dat-sym{font-size:.7em}
  .dat-cents{font-size:.6em;color:hsl(220 30% 50%)}

  .dat-mono{font-family:ui-monospace,"SF Mono",Menlo,monospace;font-size:15px;color:#16150f}

  .dat-stack{display:flex;flex-direction:column;gap:2px;font-variant-numeric:lining-nums tabular-nums;color:#16150f;font-size:16px}
</style>

## 結論

プロは「数字が揃わない」を CSS の `font-variant-numeric: tabular-nums`（OpenType の `tnum`）で解く。全桁を同一 advance width にして列の縦揃えとインプレース更新のレイアウトシフトを同時に潰すのが中核だ。揃え方は「数値は右揃え／小数桁が不揃いなら小数点揃え、中央揃えは禁止」、価格は通貨記号も含めて等幅化し、階層はサイズ＋色で作る——monospace への逃げと擬似上付きが安っぽさの典型である。

## 01 — 等幅数字は font-variant-numeric で指定する

既定の数字（proportional, `pnum`）は桁ごとに字幅が違う。`1` は細く `0` は太いため、テーブルやカウンタで列がガタつく。高レベルプロパティ `font-variant-numeric: tabular-nums` が OpenType `tnum` にマップし、全桁を同一字幅に揃える。`font-feature-settings: "tnum" 1` でも同じトグルだが、同一要素の他の OpenType 機能を上書き（clobber）してしまうので非推奨。Inter / Roboto / SF / Lato / Open Sans は `tnum` 対応。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="dat-tbl"><thead><tr><th class="dat-l">項目</th><th class="dat-r">金額</th></tr></thead>
    <tbody class="dat-prop">
    <tr><td class="dat-l">小計</td><td class="dat-r">1,118</td></tr>
    <tr><td class="dat-l">送料</td><td class="dat-r">990</td></tr>
    <tr><td class="dat-l">合計</td><td class="dat-r">12,408</td></tr>
    </tbody></table>
  </div><div class="label">✗ proportional のまま → 桁が左右にずれて列が揃わない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="dat-tbl"><thead><tr><th class="dat-l">項目</th><th class="dat-r">金額</th></tr></thead>
    <tbody class="dat-tab">
    <tr><td class="dat-l">小計</td><td class="dat-r">1,118</td></tr>
    <tr><td class="dat-l">送料</td><td class="dat-r">990</td></tr>
    <tr><td class="dat-l">合計</td><td class="dat-r">12,408</td></tr>
    </tbody></table>
  </div><div class="label">✓ tabular-nums → 全桁が同一字幅で縦に揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric" target="_blank" rel="noopener">font-variant-numeric — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.authon.dev/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks" target="_blank" rel="noopener">Tabular Numbers in CSS — Authon Blog</a></p>

## 02 — カウンタ／タイマーのガタつきは tnum で止める（monospace に逃げない）

ストップウォッチやカウントアップは値が更新されるたび桁の字幅差で横にジッタする。これを「揃わないから」と全体を monospace / コードフォントに差し替えるのは過剰な逃げ——質感が丸ごとコード風に変わり、字幅も無駄に広い。既存フォントのまま `font-variant-numeric: tabular-nums` をかければ、字幅は固定され見た目はそのままだ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="dat-strip"><div class="dat-rail"></div>
      <div class="dat-mono" style="color:#16150f">00:01:11</div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:#8d8b80">monospace に差し替え</div>
  </div><div class="label">✗ monospace へ逃げる → 質感がコード風、字幅も無駄に広い</div></div>
  <div class="demo"><div class="canvas" style="background:#16150f">
    <div class="dat-counter dat-tab">00:01:11</div>
    <div style="margin-top:8px;font-size:11px;color:#8d8b80">既存フォント＋tabular-nums</div>
  </div><div class="label">✓ 既存フォントのまま等幅化 → 更新してもガタつかない</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://sebastiandedeyne.com/tabular-numbers/" target="_blank" rel="noopener">Tabular numbers — Sebastian De Deyne</a></p>

## 03 — 数値は右揃え、テキストは左揃え。中央揃えは禁止

数値は右から（一の位→十の位→百の位）読んで比較するため、右揃えだと桁が縦に並んで比較が一瞬で済む。中央揃えは ragged edge（ギザギザの端）を生み、桁ぞろえを破壊してスキャンを阻害する。ヘッダもデータと揃え（数値ヘッダは右、テキストヘッダは左）。本文中の数字は逆に proportional（既定）のままが読みやすく、揃え目的でない箇所に `tnum` を撒くと窮屈になる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="dat-tbl"><thead><tr><th class="dat-c">商品</th><th class="dat-c">在庫</th></tr></thead>
    <tbody class="dat-tab">
    <tr><td class="dat-c">A</td><td class="dat-c">7</td></tr>
    <tr><td class="dat-c">B</td><td class="dat-c">340</td></tr>
    <tr><td class="dat-c">C</td><td class="dat-c">28</td></tr>
    </tbody></table>
  </div><div class="label">✗ 中央揃え → 端がギザギザで桁が比較できない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <table class="dat-tbl"><thead><tr><th class="dat-l">商品</th><th class="dat-r">在庫</th></tr></thead>
    <tbody class="dat-tab">
    <tr><td class="dat-l">A</td><td class="dat-r">7</td></tr>
    <tr><td class="dat-l">B</td><td class="dat-r">340</td></tr>
    <tr><td class="dat-l">C</td><td class="dat-r">28</td></tr>
    </tbody></table>
  </div><div class="label">✓ テキスト左／数値右 → 桁が縦に揃いスキャンできる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/mission-log/design-better-data-tables-430a30a00d8c" target="_blank" rel="noopener">Design Better Data Tables — Matthew Ström</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://sebastiandedeyne.com/tabular-numbers/" target="_blank" rel="noopener">Tabular numbers — Sebastian De Deyne</a></p>

## 04 — 小数桁が不揃いなら小数点揃えにする

単位が同じでも小数桁がバラバラな列は、右揃えだと桁（magnitude）がずれて `1` と `12.75` が誤って隣り合う。小数点で揃えれば多様なデータでも桁が比較できる。CSS Text L4 の `text-align: "." right` は仕様にあるが2024時点で実装ブラウザは皆無。`aria-hidden` のダミー span に不可視の小数を足し、`visibility:hidden`（`display:none` は不可、幅を保持できない）で物理的に桁を揃える。スクリーンリーダは実数だけ読む。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="dat-stack dat-r" style="text-align:right">
      <span>1</span><span>1.5</span><span>12.75</span><span>340</span>
    </div>
  </div><div class="label">✗ 右揃えのみ → 小数点の位置がバラバラで桁がずれる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="dat-stack dat-r" style="text-align:right">
      <span>1<span class="dat-hide" aria-hidden="true">.00</span></span>
      <span>1.5<span class="dat-hide" aria-hidden="true">0</span></span>
      <span>12.75</span>
      <span>340<span class="dat-hide" aria-hidden="true">.00</span></span>
    </div>
  </div><div class="label">✓ aria-hidden ダミーで小数点揃え → 桁が一列に</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://cssence.com/2024/text-align-decimal/" target="_blank" rel="noopener">Character-based alignment — CSSence.com</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://alistapart.com/article/web-typography-tables/" target="_blank" rel="noopener">Web Typography: Designing Tables to be Read — A List Apart</a></p>

## 05 — 価格の通貨記号も等幅にし、階層はサイズ＋色で作る

価格を揃えるには数字を `lining-nums tabular-nums` にするだけでなく、通貨記号も等幅でないと揃いが崩れる。記号は cap height 基準で lining 数字と並ぶよう設計されている。階層は「ウェイトを軽くする」ではなくサイズ＋色で作るのが正解——記号のストローク太さは数字のウェイトに合わせ、セントは小さいサイズ＋同系色相の低彩度色（灰色にしない）で弱める。通貨記号をエディタの上付きボタンで縮小する擬似 superscript は、人工的に縮小された lining 記号が細く軽く見えて安っぽい。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <span class="dat-price dat-price--bad"><span class="dat-sym">$</span>1,234<span class="dat-cents">.56</span></span>
  </div><div class="label">✗ 擬似上付きの記号＋軽いウェイトのセント → 重さがちぐはぐ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <span class="dat-price"><span class="dat-sym">$</span>1,234<span class="dat-cents">.56</span></span>
  </div><div class="label">✓ 記号は同じ太さでサイズ調整、セントはサイズ＋低彩度色で従属</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://learn.microsoft.com/en-us/typography/develop/character-design-standards/figures" target="_blank" rel="noopener">Character design standards: Figures — Microsoft Typography</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://type.today/en/journal/currency" target="_blank" rel="noopener">Manual: Currency Symbols — type.today</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>

## 06 — 通貨フォーマットはロケール駆動、フィールド幅は全変種に合わせる

記号位置・区切り・小数桁数はロケール固有だ。US は `$10.20`、仏は `10,00 $ USD`（カンマ小数・右記号）、日本/韓国は `¥10,000`（小数無）、一部中東通貨は小数3桁。フィールド幅はこの全変種に合わせて設計する。表記規約も押さえる——4桁以上はカンマ、大きな額は K/M/B で略す、負は記号の前にマイナス（`-$25`）、機密数字は1文字1ドットでマスク（`●●●●1234`）。すべて `tabular-nums` で等幅化して列を揃える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="dat-stack dat-prop dat-r" style="text-align:right;font-size:15px">
      <span>$10.20</span><span>¥10000</span><span>-25</span><span>1234.5</span>
    </div>
  </div><div class="label">✗ proportional・桁区切り無し・負号バラバラ → 列も規約も崩壊</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="dat-stack dat-r" style="text-align:right;font-size:15px">
      <span>$10.20</span><span>¥10,000</span><span>-$25.00</span><span>$1,234.50</span>
    </div>
  </div><div class="label">✓ ロケール準拠＋カンマ＋負は記号前＋tabular で全幅統一</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/workday-design/the-ux-of-currency-display-whats-in-a-sign-6447cbc4fb88" target="_blank" rel="noopener">The UX of Currency Display — Workday Design</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://contentdesign.intuit.com/style-and-usage/numbers/" target="_blank" rel="noopener">Numbers — Intuit Content Design</a></p>

## 実装スニペット

```css
/* テーブル数値列: 等幅 + 右揃え */
.num-cell {
  font-variant-numeric: lining-nums tabular-nums;
  text-align: right;
  font-feature-settings: normal; /* clobber回避: tnumを直接書かない */
}
/* レガシー(古いブラウザ)フォールバック */
@supports not (font-variant-numeric: tabular-nums) {
  .num-cell { font-feature-settings: "lnum", "tnum"; }
}
```

```css
/* アニメカウンタ/タイマーのガタつき防止 */
.counter, .timer {
  font-variant-numeric: tabular-nums;
  /* monospaceフォントに替えない: 既存フォントのまま等幅化 */
}
```

```css
/* 小数点揃え(text-align decimal 未実装の疑似実装) */
td {
  font-variant-numeric: lining-nums tabular-nums;
  text-align: right;
}
td [aria-hidden] { visibility: hidden; } /* display:none不可・幅を保持 */

/* HTML: 整数値に不可視の小数ダミーを足して桁を揃える
   <td>1<span aria-hidden="true">.00</span></td>
   <td>12<span aria-hidden="true">.75</span></td> */
```

```css
/* 価格の階層(サイズ+色、通貨記号も等幅) */
.price {
  font-variant-numeric: lining-nums tabular-nums; /* 記号も含め等幅 */
  display: inline-flex;
  align-items: baseline;
}
.price__symbol { font-size: 0.7em; }        /* 上付きボタンでなくサイズ調整 */
.price__cents  {
  font-size: 0.6em;
  color: hsl(220 30% 55%);                  /* 同系色相・低彩度で弱める(灰色にしない) */
}

/* HTML: $1,234.56 / 末尾ゼロは通貨では保持
   <span class="price"><span class="price__symbol">$</span>1,234<span class="price__cents">.56</span></span> */
```

## チェックリスト

<ul class="check">
  <li>テーブル列・価格・タイマー・カウンタに <code>font-variant-numeric: tabular-nums</code> を指定したか</li>
  <li>本文中の数字には <code>tnum</code> を撒かず proportional（既定）のままにしたか</li>
  <li><code>font-feature-settings: "tnum" 1</code> を避け、高レベルプロパティを使ったか</li>
  <li>数値列は右揃え、テキスト列は左揃え、中央揃えを使っていないか</li>
  <li>ヘッダもデータと揃えたか（数値ヘッダ右／テキストヘッダ左）</li>
  <li>小数桁が不揃いな列は小数点揃え（aria-hidden ダミー span）にしたか</li>
  <li>価格の通貨記号も等幅化し、擬似上付きで縮小していないか</li>
  <li>価格の階層をサイズ＋色で作り、記号の太さを数字のウェイトに合わせたか</li>
  <li>カンマ区切り・負号の位置・ロケール別小数桁を全変種のフィールド幅で吸収したか</li>
  <li>採用フォントが実機で <code>tnum</code>/<code>lnum</code> グリフを持つか確認したか</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>CSS は要求に過ぎず、フォント側に <code>tnum</code>/<code>lnum</code> グリフが無ければ効かない。Inter / Roboto / SF / Lato / Open Sans 等は対応するが、採用フォントの数字機能を実機で確認すること。小数点揃えのネイティブ構文 <code>text-align: "." right</code> は2024時点で実装ブラウザ皆無で、aria-hidden ダミー span はあくまで疑似実装——生成/編集ワークフローに不可視 span 混入の手間が残る。価格の記号:数字のサイズ比（0.7em/0.6em）は一般的な出発値で、フォントごとに目視調整が必要。ロケール別フォーマットは代表例であり、個別通貨は別途検証推奨。色での弱め方など一部原則は単一ブログ由来。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric" target="_blank" rel="noopener">font-variant-numeric — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://sebastiandedeyne.com/tabular-numbers/" target="_blank" rel="noopener">Tabular numbers — Sebastian De Deyne</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.authon.dev/tabular-numbers-in-css-font-variant-numeric-vs-monospace-hacks" target="_blank" rel="noopener">Tabular Numbers in CSS — font-variant-numeric vs monospace hacks — Authon Blog</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/mission-log/design-better-data-tables-430a30a00d8c" target="_blank" rel="noopener">Design Better Data Tables — Matthew Ström (Mission Log)</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://alistapart.com/article/web-typography-tables/" target="_blank" rel="noopener">Web Typography: Designing Tables to be Read, Not Looked At — A List Apart</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://cssence.com/2024/text-align-decimal/" target="_blank" rel="noopener">Character-based alignment — CSSence.com</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.csescienceeditor.org/article/best-practices-in-table-design/" target="_blank" rel="noopener">Best Practices in Table Design — Science Editor</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://learn.microsoft.com/en-us/typography/develop/character-design-standards/figures" target="_blank" rel="noopener">Character design standards: Figures for Latin 1 — Microsoft Typography</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://type.today/en/journal/currency" target="_blank" rel="noopener">Manual: Currency Symbols — type.today</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/workday-design/the-ux-of-currency-display-whats-in-a-sign-6447cbc4fb88" target="_blank" rel="noopener">The UX of Currency Display — What's in a $ Sign? — Workday Design</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://contentdesign.intuit.com/style-and-usage/numbers/" target="_blank" rel="noopener">Numbers — Intuit Content Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://tailwindcss.com/docs/font-variant-numeric" target="_blank" rel="noopener">font-variant-numeric — Tailwind CSS</a></p>
