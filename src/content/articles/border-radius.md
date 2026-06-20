---
title: "角丸がバラバラ——半径の統一とネスト"
problem: "角丸の半径が要素ごとにバラバラで、入れ子で歪む。"
category: 細部
tags: [角丸, radius, 細部]
date: 2026-06-20
sources: 9
draft: false
---

<style>
  .br-box{display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px}
  /* 01 — トークン */
  .br-tok{display:flex;gap:14px;flex-wrap:wrap;align-items:center;justify-content:center}
  .br-swatch{width:64px;height:64px;background:var(--ink);color:var(--paper);display:flex;align-items:flex-end;justify-content:flex-start;padding:6px;font-size:10px;font-weight:700}
  .br-r0{border-radius:0}.br-r2{border-radius:2px}.br-r4{border-radius:4px}
  .br-r8{border-radius:8px}.br-r12{border-radius:12px}.br-r16{border-radius:16px}
  .br-rand1{border-radius:6px}.br-rand2{border-radius:11px}.br-rand3{border-radius:3px}.br-rand4{border-radius:14px}.br-rand5{border-radius:9px}.br-rand6{border-radius:17px}
  /* 02 — ネスト同心円 */
  .br-outer{width:150px;height:120px;padding:20px;background:var(--ink);box-sizing:border-box;border-radius:36px}
  .br-inner{width:100%;height:100%;background:var(--accent)}
  .br-bad-inner{border-radius:36px}    /* 親と同じ → 膨らむ */
  .br-good-inner{border-radius:16px}   /* 36 - 20 = 16 → 同心円 */
  /* 03 — calc連動 */
  .br-card{width:160px;background:var(--ink);box-sizing:border-box;border-radius:var(--br-outer-r,24px);padding:var(--br-pad,8px)}
  .br-card .br-thumb{height:80px;background:var(--paper-2);border-radius:calc(var(--br-outer-r,24px) - var(--br-pad,8px));display:flex;align-items:center;justify-content:center;color:#16150f;font-size:11px;font-weight:700}
  .br-c1{--br-outer-r:24px;--br-pad:8px}
  .br-c2{--br-outer-r:24px;--br-pad:16px}
  /* 04 — サイズ比例 */
  .br-chip{height:30px;padding:0 14px;background:var(--ink);color:var(--paper);display:inline-flex;align-items:center;font-size:12px;font-weight:700}
  .br-bigcard{width:180px;height:110px;background:var(--ink);color:var(--paper)}
  .br-fixed{border-radius:16px}
  .br-prop-chip{border-radius:9999px}
  .br-prop-card{border-radius:12px}
  /* 05 — クランプ */
  .br-clampbox{width:140px;height:110px;padding:28px;box-sizing:border-box;background:var(--ink);border-radius:20px}
  .br-clampbox .br-ci{width:100%;height:100%;background:var(--accent)}
  .br-neg{border-radius:-8px}  /* 20-28=-8 → 0扱い、角が直角 */
  .br-clamped{border-radius:max(4px, -8px)} /* → 4pxを保証 */
  /* 06 — 用途別 */
  .br-tone{width:150px;height:64px;display:flex;align-items:center;justify-content:center;color:var(--paper);font-weight:700;font-size:12px;background:var(--ink)}
  .br-tone-sharp{border-radius:0}
  .br-tone-b2b{border-radius:4px}
  .br-tone-ec{border-radius:10px}
  .br-tone-soft{border-radius:20px}
</style>

## 結論

プロは角丸を「半径スケールのトークン化」と「ネスト時の同心円補正」の2軸で必ず統一する。None/XS/S/M/L/XL/Full の意味的トークン（M3: 4/8/12/16/28dp）にpx直書きを禁止して固定し、入れ子では黄金式「**内側半径 = 外側半径 − padding**」を `calc()` で動的に導出して中心点を共有させる。数式は出発点であり、最後は必ず目視で微調整する——この2軸を守るだけで「素人っぽさ」のほとんどが消える。

## 01 — px直書きをやめ、半径スケールにトークン化する

6px・10px・14px と現場ごとに目分量で打つと、画面全体で半径が不揃いになり安っぽく見え、後から一括変更もできない。None=0 / XS=2 / S=4 / M=8 / L=12 / XL=16 / Full=9999px の7段に固定し、すべてトークン参照に統一する。M3 の 4/8/12/16/28dp と整合させるのが鉄板。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-tok">
    <div class="br-swatch br-rand1">6</div><div class="br-swatch br-rand2">11</div><div class="br-swatch br-rand3">3</div><div class="br-swatch br-rand4">14</div><div class="br-swatch br-rand5">9</div><div class="br-swatch br-rand6">17</div>
  </div></div><div class="label">✗ 6/11/3/14/9/17px とバラバラ → 不揃いで安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-tok">
    <div class="br-swatch br-r0">0</div><div class="br-swatch br-r2">2</div><div class="br-swatch br-r4">4</div><div class="br-swatch br-r8">8</div><div class="br-swatch br-r12">12</div><div class="br-swatch br-r16">16</div>
  </div></div><div class="label">✓ 0/2/4/8/12/16 の意味的スケール → リズムが揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/shape/corner-radius-scale" target="_blank" rel="noopener">Shape – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.telerik.com/design-system/docs/foundation/border-radius/" target="_blank" rel="noopener">Overview of Border Radius – Telerik Design System Kit</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/design-bootcamp/building-a-consistent-corner-radius-system-in-ui-1f86eed56dd3" target="_blank" rel="noopener">Building a consistent corner radius system in UI – Bootcamp</a></p>

## 02 — ネストは黄金式「内側 = 外側 − padding」で同心円にする

丸い親の中に丸い子を入れるとき、親子で同じ半径を使うのは最大の地雷だ。半径が同じでも弧の中心点が違うため平行にならず、角の隙間だけ太く膨らんで（bulge）見える。**内側半径 = 外側半径 − padding** で中心を共有させれば、弧が平行になり同心円に整う。下は外36px・padding20pxのカード。内側を 36 − 20 = 16px に落とすだけで角の膨らみが消える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-outer"><div class="br-inner br-bad-inner"></div></div></div><div class="label">✗ 内も外も36px → 角の隙間だけ膨らんで素人っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-outer"><div class="br-inner br-good-inner"></div></div></div><div class="label">✓ 内側 36−20=16px → 弧が平行で同心円に整う</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/" target="_blank" rel="noopener">The Math Behind Nesting Rounded Corners – Cloud Four</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.ondrejkonecny.com/blog/nested-rounded-corners/" target="_blank" rel="noopener">Nested rounded corners – Ondřej Konečný</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/" target="_blank" rel="noopener">Careful With Your Nested Border-Radii – CSS-Tricks</a></p>

## 03 — 内側半径は calc() で自動導出して保守可能にする

数式を手計算でハードコードすると、paddingを変えた瞬間に同心円が崩れる。親に `--outer-radius` と `--pad` を定義し、子の `border-radius` を `calc(var(--outer-radius) - var(--pad))` で算出すれば、paddingを変えても内側半径が連動して破綻しない。下は両方とも外側24pxの同一カード。paddingだけ 8px → 16px に変えても、子のサムネは自動で同心円を保つ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-card br-c1"><div class="br-thumb">pad 8 → 内16</div></div></div><div class="label">✓ pad 8px：calc(24−8)=16px が自動算出</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-card br-c2"><div class="br-thumb">pad 16 → 内8</div></div></div><div class="label">✓ pad 16px：同じ式で calc(24−16)=8px に連動</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/" target="_blank" rel="noopener">The Classic Border Radius Advice, Plus an Unusual Trick – Frontend Masters</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://pv21design.pt/concentric-radius-nested-corners-done-right/" target="_blank" rel="noopener">Concentric Radius: Nested Corners Done Right – PV21Design</a></p>

## 04 — 半径は要素サイズに比例させる

同じ16pxでも、32pxのチップではほぼピル化し、400pxのカードではほぼ直角に見える。固定pxを全要素に当てると知覚がチグハグになる。小さい要素ほど相対的に大きい半径（チップは Full でピル化）、大きい要素はトークン上位でも控えめに段を選ぶ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;flex-direction:column;gap:16px;align-items:center">
    <div class="br-chip br-fixed">chip 16px</div>
    <div class="br-box br-bigcard br-fixed">card 16px</div>
  </div></div><div class="label">✗ 一律16px → チップは角ばり、カードはほぼ直角</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;flex-direction:column;gap:16px;align-items:center">
    <div class="br-chip br-prop-chip">chip Full</div>
    <div class="br-box br-bigcard br-prop-card">card 12px</div>
  </div></div><div class="label">✓ チップはFullでピル、カードは控えめ → 知覚が揃う</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.92learns.com/border-radius-rules/" target="_blank" rel="noopener">Border Radius Rules Every Designer Must Know (2026) – 92learns</a></p>

## 05 — マイナス半径は max() でクランプする

paddingが外側半径を超えると、内側半径が負になりブラウザは0扱いにする。補正せず放置すると角だけ直角になり破綻する。`max(4px, calc(...))` で最小値を保証し、角の丸みを残す。下は外20px・padding28pxで内側が −8px に振り切れたケース。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-clampbox"><div class="br-ci br-neg"></div></div></div><div class="label">✗ 20−28=−8px を放置 → 内側だけ直角で破綻</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-clampbox"><div class="br-ci br-clamped"></div></div></div><div class="label">✓ max(4px, −8px)=4px → 最小の丸みを保証</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/" target="_blank" rel="noopener">Careful With Your Nested Border-Radii – CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/" target="_blank" rel="noopener">The Classic Border Radius Advice, Plus an Unusual Trick – Frontend Masters</a></p>

## 06 — 用途でトーンを使い分け、一律適用を避ける

ボタンもカードも区切り線も同じ角丸にすると、全部が混ざってのっぺりし階層が消える。直角は技術的/権威（ダッシュボード・エディトリアル）、2-4pxはB2B/銀行、8-12pxはEC/一般アプリ、16-24pxは消費者向け/ウェルネスと、プロダクトのトーンで丸み量を選ぶ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="br-tone br-tone-ec">全部 10px 一律</div></div><div class="label">✗ 全UIに同じ角丸 → 階層もトーンも消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
    <div class="br-tone br-tone-sharp" style="width:auto;padding:0 12px;height:44px">0 技術</div>
    <div class="br-tone br-tone-b2b" style="width:auto;padding:0 12px;height:44px">4 B2B</div>
    <div class="br-tone br-tone-ec" style="width:auto;padding:0 12px;height:44px">10 EC</div>
    <div class="br-tone br-tone-soft" style="width:auto;padding:0 12px;height:44px">20 消費者</div>
  </div></div><div class="label">✓ トーンで丸み量を選ぶ → 性格が立つ</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.92learns.com/border-radius-rules/" target="_blank" rel="noopener">Border Radius Rules Every Designer Must Know (2026) – 92learns</a></p>

## 実装スニペット

角丸トークン（px直書きを禁止し、全箇所でこのトークンを参照）。M3 の 4/8/12/16/28dp と整合させる。

```css
:root{
  --radius-none: 0px;
  --radius-xs: 2px;
  --radius-s: 4px;
  --radius-m: 8px;    /* card / input / button */
  --radius-l: 12px;   /* large card / modal */
  --radius-xl: 16px;
  --radius-full: 9999px; /* pill / avatar */
}
```

ネストの同心円化を calc() で自動導出。親のpaddingを変えても内側半径が連動する（代表例: 外24 − pad8 = 内16）。

```css
.card{
  --pad: 8px;
  --outer-radius: var(--radius-xl); /* 16px */
  padding: var(--pad);
  border-radius: var(--outer-radius);
}
.card > .thumb{
  /* 16 - 8 = 8px → 同心円 */
  border-radius: calc(var(--outer-radius) - var(--pad));
}
```

padが半径を超えても内側を負にしないクランプ。`max()` で最小4pxを保証（0で良ければ `max(0px, ...)`）。枠線がある box では `inner = radius − padding − border` まで引く。

```css
.nested{
  border-radius: max(
    4px,
    calc(var(--outer-radius) - var(--pad))
  );
}
```

子に半径を付けず、親のクリップで同心円を実現する代替手法（2026時点でクロスブラウザ未成熟、フォールバック併用推奨）。

```css
.card{
  border-radius: var(--radius-xl);
  overflow: clip;
  overflow-clip-margin: content-box;
}
/* 子は border-radius 不要 */
```

## チェックリスト

<ul class="check">
  <li>border-radius に px を直書きしていないか。すべて半径トークン（--radius-*）参照になっているか</li>
  <li>半径スケールは None/XS/S/M/L/XL/Full の1本に統一され、画面全体で揃っているか</li>
  <li>丸い親の中の丸い子に、親と同じ半径を使っていないか（角が膨らんでいないか）</li>
  <li>ネストの内側半径は <code>calc(外側 − padding)</code> で導出し、paddingを変えても連動するか</li>
  <li>padが半径を超える箇所で内側半径が負（=直角化）になっていないか。<code>max(4px, …)</code> でクランプしたか</li>
  <li>枠線のある box では <code>inner = radius − padding − border</code> まで引いているか</li>
  <li>チップ/ボタンとカード/モーダルで、サイズに応じて半径の段を選んでいるか（固定px当てはめになっていないか）</li>
  <li>プロダクトのトーン（技術系=0 / B2B=2-4 / EC=8-12 / 消費者=16-24）に合った丸み量か。全要素一律になっていないか</li>
  <li>数式適用後に角を目視で確認し、違和感があれば微調整したか</li>
</ul>

## 限界 / 出典

黄金式 `inner = outer − padding` と calc() 実装は Cloud Four / CSS-Tricks / Frontend Masters / Konečný / PV21 の5ソースで一致しており高確度。M3スケール（4/8/12/16/28dp）と Telerik（0.25rem倍数）は一次ソースで確実。一方「用途別の角丸量（0px=技術系, 8-12px=EC 等）」と「要素サイズ比例」は単一ブログ（92learns）由来の主観的傾向であり規範ではない（中確度）。XS=2px などの細値はソース間で揺れがある（M3はXS=4dp始まり）ため、自プロジェクトでスケールを一本化して採用すること。枠線込みの拡張式 `inner = radius − padding − border` は box に枠線がある時のみ必要。overflow:clip 代替と Apple ConcentricRectangle（WWDC 2025）/ Sketch の corner 'auto' は2025-2026の新潮流だが、クロスブラウザ/プラットフォーム制約があるため、Web本番では calc() 手法を主、新手法を実験扱いにする。全ソース共通で「数式は出発点、最終は目視微調整」と明記されている点に留意。

<p class="src"><span class="badge b-blog">blog</span><a href="https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/" target="_blank" rel="noopener">The Math Behind Nesting Rounded Corners – Cloud Four</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/" target="_blank" rel="noopener">Careful With Your Nested Border-Radii – CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/" target="_blank" rel="noopener">The Classic Border Radius Advice, Plus an Unusual Trick – Frontend Masters</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.ondrejkonecny.com/blog/nested-rounded-corners/" target="_blank" rel="noopener">Nested rounded corners – Ondřej Konečný</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/shape/corner-radius-scale" target="_blank" rel="noopener">Shape – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.telerik.com/design-system/docs/foundation/border-radius/" target="_blank" rel="noopener">Overview of Border Radius – Telerik Design System Kit</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.92learns.com/border-radius-rules/" target="_blank" rel="noopener">Border Radius Rules Every Designer Must Know (2026) – 92learns</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/design-bootcamp/building-a-consistent-corner-radius-system-in-ui-1f86eed56dd3" target="_blank" rel="noopener">Building a consistent corner radius system in UI – Bootcamp</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://pv21design.pt/concentric-radius-nested-corners-done-right/" target="_blank" rel="noopener">Concentric Radius: Nested Corners Done Right – PV21Design</a></p>
