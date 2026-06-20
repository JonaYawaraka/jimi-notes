---
title: "カードが平凡——情報カードの設計"
problem: "カードがただの枠で、情報の優先順位も質感も出ていない。"
category: レイアウト
tags: [カード, レイアウト, 階層]
date: 2026-06-20
sources: 13
draft: false
---

<style>
  .car-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;width:100%;max-width:340px}
  .car-grid-tight{display:grid;grid-template-columns:repeat(2,1fr);gap:6px;width:100%;max-width:340px}
  .car-cell{background:#fff;color:#16150f;border-radius:10px;padding:14px;font-size:12px}
  .car-cell-pad{padding:22px}
  .car-cell b{display:block;font-weight:700;font-size:13px;margin-bottom:4px}
  .car-cell span{color:#6b7280}

  /* separation */
  .car-sep{width:140px;background:#fff;color:#16150f;border-radius:10px;padding:16px;font-size:12px}
  .car-sep b{display:block;font-weight:700;font-size:13px;margin-bottom:4px}
  .car-sep-noise{border:1px solid #c9c7bd;box-shadow:0 6px 14px rgba(0,0,0,.28),inset 0 0 0 2px #fff;background:#f0eee6}
  .car-sep-clean{border:none;box-shadow:0 1px 1px hsl(220 60% 50% / .10),0 2px 4px hsl(220 60% 50% / .10),0 4px 8px hsl(220 60% 50% / .10)}

  /* shadow */
  .car-chip{width:130px;height:84px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;color:#16150f;font-weight:700;font-size:13px}
  .car-sh-bad{box-shadow:0 4px 8px rgba(0,0,0,.45)}
  .car-sh-good{box-shadow:0.5px 1px 1px hsl(220 60% 50% / .10),1px 2px 2px hsl(220 60% 50% / .10),2px 4px 4px hsl(220 60% 50% / .10)}

  /* hierarchy card */
  .car-info{width:160px;background:#fff;color:#16150f;border-radius:10px;padding:16px;text-align:left}
  .car-info .car-thumb{width:100%;aspect-ratio:16/9;border-radius:6px;background:linear-gradient(135deg,#c7cdd6,#9aa3b0);margin-bottom:10px}
  .car-flat .car-t,.car-flat .car-m,.car-flat .car-d{font-size:13px;font-weight:400;color:#16150f;line-height:1.5;margin:0}
  .car-hier .car-t{font-size:16px;font-weight:700;line-height:1.3;margin:0 0 6px;font-feature-settings:"palt"}
  .car-hier .car-m{font-size:11px;font-weight:400;color:#8d8b80;margin:0 0 6px;letter-spacing:.04em}
  .car-hier .car-d{font-size:13px;font-weight:400;color:#5c5a50;line-height:1.5;margin:0}

  /* alignment */
  .car-row{display:flex;gap:8px;align-items:flex-start;width:100%;max-width:340px}
  .car-mini{flex:1;background:#fff;color:#16150f;border-radius:8px;padding:12px;font-size:11px;line-height:1.5}
  .car-mini b{display:block;font-weight:700;font-size:12px;margin-bottom:4px}
  .car-row-align .car-mini{display:flex;flex-direction:column}
  .car-row-align .car-clamp{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
</style>

## 結論

プロがカードを「非凡」にするのは装飾ではなく規律だ。共通解は3層で確定する——(1) 分離は影/枠線/塗りの**いずれか1つだけ**を選んで重ねない、(2) 全スペーシングを8px（補助4px）グリッドに乗せ「**内側パディング ≤ カード間ギャップ**」を守る、(3) media→title→supporting→actions の固定スタック順で並べ、サイズ・ウェイト・色・位置の差で**主役を1つだけ立てる**。影は単発の黒影でなく、ぼかし違いを重ねて背景の色相で色付けし、強い影は hover/focus にだけ予約する。

## 01 — 分離手段は1つだけ選ぶ

カードを背景から浮かせる手段は3つ——影（elevated）、枠線（outlined）、対比塗り（filled）。やってはいけないのは、これらを**同時に重ねる**こと。枠線＋濃い影＋内側ハイライトを全部盛りすると、各エッジが競合して視覚ノイズになり、グリッドのスキャン性が落ちる。グリッド全体でどれか1つに統一し、影を使うなら枠線は付けない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-sep car-sep-noise"><b>Noise</b>枠線・影・内側線を全部盛り</div></div><div class="label">✗ 影＋枠線＋inset を重ねる → エッジが競合してうるさい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-sep car-sep-clean"><b>Elevated</b>影だけで分離</div></div><div class="label">✓ elevated を1つだけ選ぶ → 静かで読みやすい</div></div>
</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://uxdesign.cc/8-best-practices-for-ui-card-design-898f45bb60cc" target="_blank" rel="noopener">8 best practices for UI card design — UX Collective</a></p>

## 02 — 影は多層・背景色相で色付け

単発のグレー box-shadow（`0 4px 8px rgba(0,0,0,.x)`）は光の減衰を再現せず、いわゆるAI/テンプレ感の元凶になる。プロは**ぼかし違い（1/2/4px…）を重ねて各層の不透明度を下げ**、垂直オフセットを水平の2倍（H:V=1:2）に固定し、影色を黒でなく**背景の色相**で薄く乗せる。光源を全要素で統一すると、縁がにじまず自然な距離感が出る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-chip car-sh-bad">cheap</div></div><div class="label">✗ 単一の濃い黒影（0 4px 8px / .45）→ 縁がくっきり安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-chip car-sh-good">pro</div></div><div class="label">✓ 低不透明度を3層・H:V=1:2・色相付き → 自然な深さ</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh Comeau</a></p>

## 03 — rest は軽く、hover/focus で持ち上げる

全カードに重い影を常時付けると「深さ」の意味が消え、どれも同じ高さに見える。Material準拠で **rest は 0〜2dp相当の軽い影**にとどめ、hover/focus でだけ 4〜8dp相当へ持ち上げる。`transition` で滑らかに段差を付ければ、触れる要素だけが前に出てインタラクションが読める。ホバー不可のモバイルでは 1dp相当のごく軽い影を初期値にする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-chip" style="box-shadow:0 10px 24px rgba(0,0,0,.30)">rest</div></div><div class="label">✗ rest から重い影 → 全部が浮いて段差が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-chip car-sh-good">rest→hover</div></div><div class="label">✓ rest は軽い影。hover/focus で box-shadow を増層＋translateY(-2px)</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/cards" target="_blank" rel="noopener">Cards — Material Design (M2)</a></p>

## 04 — 内側パディング ≤ カード間ギャップ

スペーシングはすべて **8pxグリッド（微調整のみ4px補助）** に乗せる。5pxや10pxの半端な値は1.5x DPIで7.5px等になりエッジがにじみ、グリッドの律動が崩れる。さらに重要なのが近接の法則——**内側パディングをカード間ギャップ以下**に保つこと。内側が外側より広いと隣接カードが1つの塊に見え、分離が読めなくなる。desktopはギャップ24〜32px・内側16〜24px、mobileは内外を詰める。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-grid-tight"><div class="car-cell car-cell-pad"><b>A</b><span>内パディング＞ギャップ</span></div><div class="car-cell car-cell-pad"><b>B</b><span>隣と癒着</span></div></div></div><div class="label">✗ 内側パディング＞ギャップ → 2枚が1つの塊に見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-grid"><div class="car-cell"><b>A</b><span>内16 ≤ 外24</span></div><div class="car-cell"><b>B</b><span>個別に読める</span></div></div></div><div class="label">✓ padding 16 ≤ gap 24（共に8の倍数）→ 各カードが独立</div></div>
</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://cieden.com/book/sub-atomic/spacing/spacing-best-practices" target="_blank" rel="noopener">Spacing best practices — Cieden</a> <a href="https://www.conceptfusion.co.uk/post/web-design-spacing-and-sizing-best-practices" target="_blank" rel="noopener">Web Design Spacing — Concept Fusion</a></p>

## 05 — 固定スタック順で階層を1つ立てる

タイトル・メタ・本文が**等しい強さ**で並ぶと、カードは即座に平凡化する。media→title→supporting→actions の順を固定し、主役（タイトルや値）を **サイズ＋ウェイト＋色＋位置** の4軸で突出させる。タイトルは大きく太く濃く、メタは小さく淡く、本文はその中間。タイトルは5〜7語、メタ10〜15語、ボタン1〜3語の動詞句に制限し、本文は最小16px。日本語は約物が空くので `font-feature-settings:"palt"` を当てる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-info car-flat"><div class="car-thumb"></div><p class="car-m">CATEGORY</p><p class="car-t">記事のタイトルが入ります</p><p class="car-d">補足の説明テキストがここに続きます</p></div></div><div class="label">✗ 全要素が同じサイズ・色・ウェイト → 主役が無い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-info car-hier"><div class="car-thumb"></div><p class="car-m">CATEGORY</p><p class="car-t">記事のタイトル</p><p class="car-d">補足の説明テキストがここに続きます</p></div></div><div class="label">✓ title=16px/700/濃、meta=11px/淡、desc=中間 → 階層が立つ</div></div>
</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://eightshapes.com/articles/cards-and-composability-in-design-systems/" target="_blank" rel="noopener">Cards and Composability in Design Systems — Eightshapes</a> <a href="https://blog.logrocket.com/ux-design/ui-card-design/" target="_blank" rel="noopener">Card interface design — LogRocket</a></p>

## 06 — 比率固定とtruncationで行を揃える

内容量の差をそのまま流すと、行の高さがガタついて雑に見える。CSS標準の `aspect-ratio` でメディアを16:9または1:1に固定し、`-webkit-line-clamp` で本文を省略すれば、JSなしでグリッドの行が揃う。溢れたときは**タイトルより先に description を truncate** し、画像やdescriptionが無くても崩れない構造にしておく。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-row"><div class="car-mini"><b>短い</b>1行だけ</div><div class="car-mini"><b>長い</b>説明が長くて行高が伸びてしまい隣と揃わずガタつく</div></div></div><div class="label">✗ 内容量を生流し → 高さ不揃いでガタつく</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="car-row car-row-align"><div class="car-mini"><b>短い</b><span class="car-clamp">1行だけ</span></div><div class="car-mini"><b>長い</b><span class="car-clamp">説明が長くても2行でclampされ行が揃って整列する</span></div></div></div><div class="label">✓ line-clamp:2 ＋ aspect-ratio固定 → 行が揃う</div></div>
</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://prototypr.io/post/8-best-practices-for-ui-card-design" target="_blank" rel="noopener">8 best practices for UI card design — Prototypr</a> <a href="https://m1.material.io/components/cards.html" target="_blank" rel="noopener">Cards — Material Design (M1)</a></p>

## 実装スニペット

```css
/* 非凡な影：多層・色相付き・hoverで持ち上げ。border併用しない */
.card {
  --shadow-color: 220deg 60% 50%;
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow:
    0.5px 1px 1px hsl(var(--shadow-color) / 0.10),
    1px 2px 2px hsl(var(--shadow-color) / 0.10),
    2px 4px 4px hsl(var(--shadow-color) / 0.10);
  transition: box-shadow .2s ease, transform .2s ease;
}
.card:hover, .card:focus-within {
  box-shadow:
    1px 2px 2px hsl(var(--shadow-color) / 0.12),
    2px 4px 4px hsl(var(--shadow-color) / 0.12),
    4px 8px 8px hsl(var(--shadow-color) / 0.12),
    8px 16px 16px hsl(var(--shadow-color) / 0.12);
  transform: translateY(-2px);
}
```

```css
/* 内側 ≤ ギャップ を守る8pxグリッド */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;            /* カード間ギャップ ≥ 内側padding */
}
.card { padding: 16px; }  /* 16 ≤ 24 */

@media (max-width: 1080px) {
  .card-grid { gap: 16px; }
  .card { padding: 16px; } /* mobileは内外を詰める */
}
```

```css
/* 分離は1手段だけ：どちらか一方をグリッド全体で使う */
.card--elevated {
  border: none;
  box-shadow: 0 2px 8px hsl(220 60% 50% / 0.10);
}
.card--outlined {
  box-shadow: none;
  border: 1px solid #e5e7eb;
  background: #fff;
}
/* NG: border と box-shadow を同時指定しない */
```

```css
/* 固定スタック順 ＋ 階層 ＋ 比率固定 */
.card { display: flex; flex-direction: column; gap: 12px; }
.card__media {                      /* media: 比率固定 */
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
  border-radius: 8px;
}
.card__title {                      /* 主役: 大きく太く */
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  font-feature-settings: "palt";    /* 日本語の約物詰め */
}
.card__meta { font-size: 0.875rem; color: #6b7280; }  /* 従: 小さく淡く */
.card__desc {                       /* 溢れたらここから省略 */
  font-size: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

## チェックリスト

<ul class="check">
  <li>分離手段は elevated / outlined / filled の<b>1つだけ</b>に統一し、影と枠線を併用していない</li>
  <li>影は単発の黒影でなく、ぼかし違いを2〜3層に重ね、背景の色相で色付けしている（H:V=1:2）</li>
  <li>rest は軽い影、hover/focus でだけ box-shadow を増層して持ち上げている</li>
  <li>パディング・ギャップ・マージンが全て<b>8の倍数</b>（微調整のみ4px）。5pxや10pxの半端な値が無い</li>
  <li>カード内パディング ≤ カード間ギャップ になっている（例：padding16 ≤ gap24）</li>
  <li>media→title→supporting→actions の固定スタック順で並んでいる</li>
  <li>タイトル（大・太・濃）／メタ（小・淡）／本文の差で主役が1つ立っている。本文は最小16px</li>
  <li>日本語タイトルに <code>font-feature-settings:"palt"</code> を当てている</li>
  <li>メディアは <code>aspect-ratio</code> で16:9か1:1に固定。description は <code>line-clamp</code> で省略し行が揃う</li>
  <li>画像やdescriptionが無くてもカードが崩れない構造になっている</li>
</ul>

## 限界 / 出典

数値は出典横断で概ね一致するが、いくつか幅と注意がある。**(1)** rest の elevation は M1 が2dp、M2 desktop が0dpと出典で食い違う——密度・プラットフォームの文脈で選ぶこと。**(2)** 多層シャドウの具体的な不透明度/オフセット値は Josh Comeau 個人ブログ（権威ある一次仕様ではなく定評ある実践記）の実装例で、唯一解ではない。スニペットの値は出発点として調整前提。**(3)** padding/gutter の帯（16〜24px／24〜32px等）は推奨レンジであり厳密な閾値ではない。最終はコンテンツ密度とBPで決める。**(4)** 「内側≤外側」と8pxグリッドはGestalt近接則の応用で広く支持されるが絶対則ではなく、意図的グルーピングのためにあえて崩す場合がある。**(5)** UX Collective / LogRocket / Concept Fusion / Cieden 等は secondary/blog であり、Material（primary）に比べると規範性は劣る——具体値はクロスチェックの上で採用した。**(6)** 本記事は提供された3アングルの調査結果の統合であり、新規のWeb検証や出典URLの生存確認は行っていない。

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh Comeau</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/cards" target="_blank" rel="noopener">Cards — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/elevation" target="_blank" rel="noopener">Elevation — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/components/cards.html" target="_blank" rel="noopener">Cards — Components — Material Design (M1)</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://uxdesign.cc/8-best-practices-for-ui-card-design-898f45bb60cc" target="_blank" rel="noopener">8 best practices for UI card design — UX Collective</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://eightshapes.com/articles/cards-and-composability-in-design-systems/" target="_blank" rel="noopener">Cards and Composability in Design Systems — Eightshapes</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://blog.logrocket.com/ux-design/ui-card-design/" target="_blank" rel="noopener">Card interface design — LogRocket</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://cieden.com/book/sub-atomic/spacing/spacing-best-practices" target="_blank" rel="noopener">Spacing best practices — Cieden</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.conceptfusion.co.uk/post/web-design-spacing-and-sizing-best-practices" target="_blank" rel="noopener">Web Design Spacing and Sizing Best Practices — Concept Fusion</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://prototypr.io/post/8-best-practices-for-ui-card-design" target="_blank" rel="noopener">8 best practices for UI card design — Prototypr</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.mockplus.com/blog/post/card-ui-design" target="_blank" rel="noopener">Card UI Design: Best Practices and Examples — Mockplus</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.mass.gov/info-details/corner-radius-and-elevation" target="_blank" rel="noopener">Corner radius and elevation — Mass.gov Design System</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uiprep.com/blog/everything-you-need-to-know-about-spacing-layout-grids" target="_blank" rel="noopener">Everything you need to know about spacing & layout grids — UIPrep</a></p>
