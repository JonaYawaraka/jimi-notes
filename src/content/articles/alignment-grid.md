---
title: "微妙にズレる——整列とグリッドの規律"
problem: "要素が微妙に揃わず、全体がプロっぽくならない。"
category: レイアウト
tags: [整列, グリッド, レイアウト]
date: 2026-06-20
sources: 13
draft: false
---

<style>
  .al-sq{width:120px;height:120px;display:flex;align-items:center;justify-content:center}
  .al-circ{width:64px;height:64px;border-radius:50%;background:#16150f;display:flex;align-items:center;justify-content:center}
  .al-tri-bad{width:0;height:0;border-style:solid;border-width:14px 0 14px 24px;border-color:transparent transparent transparent #f4f2ec}
  .al-tri-good{width:0;height:0;border-style:solid;border-width:14px 0 14px 24px;border-color:transparent transparent transparent #f4f2ec;transform:translateX(3px)}

  /* baseline offset demo */
  .al-row{display:flex;align-items:center;gap:8px;font-size:18px;font-weight:700;color:#16150f;line-height:1.5}
  .al-ic{width:18px;height:18px;fill:#16150f;flex:none}
  .al-ic-bad{}
  .al-ic-good{transform:translateY(2px)}

  /* overshoot equal-weight demo */
  .al-weighrow{display:flex;gap:20px;align-items:center}
  .al-box{width:36px;height:36px;background:#16150f}
  .al-cir-bad{width:36px;height:36px;border-radius:50%;background:#16150f}
  .al-cir-good{width:40px;height:40px;border-radius:50%;background:#16150f}
  .al-tg-bad{width:0;height:0;border-style:solid;border-width:18px 0 18px 31px;border-color:transparent transparent transparent #16150f}
  .al-tg-good{width:0;height:0;border-style:solid;border-width:21px 0 21px 36px;border-color:transparent transparent transparent #16150f}

  /* color demo */
  .al-crow{display:flex;align-items:center;gap:10px;font-size:20px;font-weight:800}
  .al-crow svg{width:22px;height:22px;flex:none}
  .al-txt-bad{color:#5c5a50}
  .al-ico-bad{fill:#5c5a50}
  .al-txt-good{color:#3a392f}
  .al-ico-good{fill:#6f6d62}

  /* grid gutter demo */
  .al-grid{display:grid;grid-template-columns:repeat(4,1fr);column-gap:16px;width:100%;max-width:280px}
  .al-gcol{height:80px;background:rgba(22,21,15,.10);position:relative}
  .al-gfill{position:absolute;inset:0;background:#16150f}
  .al-gbad{left:-8px;right:-8px;width:auto}
  .al-cap{font:600 12px/1 monospace;color:#16150f}
</style>

## 結論

プロは「数学的整列が先、光学微調整が後」の順序を必ず守る。まず 8px 基準グリッド（アイコン・タイポは 4px 細グリッド）に全要素を機械的に揃え、その上で**目が読むのは外接矩形の座標ではなく視覚的重心**だという事実に従って、重心と逆方向へ意図的にずらす。決定的なのは、その「微妙なズレ」の補正を目分量でやらず、86px/70px や +4px のように**数値化してトークン／keyline に固定する**ことだ。

## 01 — まずピクセルグリッド、次に光学補正

順序を逆にしてはいけない。最初に 8px（コンポーネント）と 4px（アイコン・タイポのベースライン）のグリッドに全要素を機械的にスナップさせ、サイズと余白を 8 の倍数（8/16/24/40）で刻む。土台が乱れたまま光学調整に入ると、何を直しているのか分からなくなる。光学補正は土台が正しく敷けてから初めて意味を持つ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;flex-direction:column;gap:7px;align-items:flex-start"><div style="height:14px;width:90px;background:#16150f"></div><div style="height:14px;width:130px;background:#16150f;margin-left:5px"></div><div style="height:14px;width:60px;background:#16150f;margin-left:-3px"></div></div></div><div class="label">✗ 端が 5px / -3px と揃わない → 目分量で刻んだ余白</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;flex-direction:column;gap:8px;align-items:flex-start"><div style="height:14px;width:88px;background:#16150f"></div><div style="height:14px;width:128px;background:#16150f"></div><div style="height:14px;width:56px;background:#16150f"></div></div></div><div class="label">✓ 左端と gap を 8px グリッドに固定 → 静かに揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/layout/metrics-keylines.html" target="_blank" rel="noopener">Metrics & keylines — Material Design</a></p>

## 02 — 視覚的重心の反対方向へずらす

play 三角や矢印など非対称シルエットは、外接矩形の座標で中央に置くと「左に寄って」見える。三角は視覚的重心が左にあるため、**右へずらして初めて中央に見える**。RingCentral の実測ではコンテナ内で左 86px / 右 70px の非対称マージン（左 > 右）で光学中央を達成している。方向則はシンプルで、要素を重心と逆方向へ動かすだけだ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-circ"><div class="al-tri-bad"></div></div></div><div class="label">✗ 矩形座標で中央配置 → 三角が左に沈んで見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-circ"><div class="al-tri-good"></div></div></div><div class="label">✓ 右へ +3px ずらす → 視覚的に中央へ収まる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/ringcentral-ux/eyeballing-or-optical-alignment-in-design-4ef5ab2d326f" target="_blank" rel="noopener">'Eyeballing' or Optical Alignment in Design — RingCentral UX</a></p>

## 03 — 等重量に見せるためのオーバーシュート

円・三角・菱形は、同じ実寸の正方形より小さく・軽く見える。アイコンセットやボタン群を「同じ大きさ」に見せたいなら、実寸を**揃えるのではなく超えさせる**。Material の keyline は正方形 18×18dp に対し円は 20dp 径（2dp 大きい）、三角ボタンは矩形ボタンより約 40px 幅広にして等重量に見せる。座標上の同寸は、目には不揃いに映る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-weighrow"><div class="al-box"></div><div class="al-cir-bad"></div><div class="al-tg-bad"></div></div></div><div class="label">✗ 全部 36px 実寸 → 円と三角が小さく軽く見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-weighrow"><div class="al-box"></div><div class="al-cir-good"></div><div class="al-tg-good"></div></div></div><div class="label">✓ 円+4px / 三角を拡大 → 三つが等しい大きさに見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/design-bridges/optical-effects-9fca82b4cd9a" target="_blank" rel="noopener">Optical effects in user interfaces — Design Bridges</a></p>

## 04 — アイコン-テキストのベースラインオフセットを計算する

アイコンとテキストを横並びにすると、テキストは**ベースラインで重心が下がる**ため、ボックス中央で揃えるとアイコンだけ「浮いて」見える。目分量で下げず、式で出す。`baselineDistance = font-size × line-height`、`iconOffset = (baselineDistance − iconSize) / 2`。16px / 1.5 / 16px なら 24px − 16px の半分で **+4px** 下げる。アイコンがテキストの 2 倍大なら値は負になり、自動で上方向補正される。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-row"><svg class="al-ic al-ic-bad" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg><span>ダウンロード</span></div></div><div class="label">✗ ボックス中央揃え → アイコンが上に浮く</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-row"><svg class="al-ic al-ic-good" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg><span>ダウンロード</span></div></div><div class="label">✓ +2px（算出値）下げ → 文字の重心に揃う</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/improving-icons-for-ui-elements-with-typographic-alignment-and-scale/" target="_blank" rel="noopener">Improving Icons for UI Elements with Typographic Alignment and Scale — CSS-Tricks</a></p>

## 05 — アイコンとテキストに同一 hex を使わない

同じ色値でも、テキストはアイコンより**暗く（薄く）見える**。細い文字のストロークが面で塗られたアイコンより視覚的に軽くなるためだ。同一 hex は「手抜き」に見え、アイコンを少し明るく、またはテキストを少し暗くする補正が要る。下の例はどちらも見出しとアイコンに同系の濃度を使っているが、左は完全同値、右はアイコンだけ一段明るくして見た目の濃度を揃えている。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-crow"><svg class="al-ico-bad" viewBox="0 0 24 24"><path d="M12 2 2 22h20z"/></svg><span class="al-txt-bad">警告メッセージ</span></div></div><div class="label">✗ 同一 hex (#5c5a50) → 文字だけ沈んで見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-crow"><svg class="al-ico-good" viewBox="0 0 24 24"><path d="M12 2 2 22h20z"/></svg><span class="al-txt-good">警告メッセージ</span></div></div><div class="label">✓ アイコンを一段明るく → 濃度が揃って見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/ringcentral-ux/eyeballing-or-optical-alignment-in-design-4ef5ab2d326f" target="_blank" rel="noopener">'Eyeballing' or Optical Alignment in Design — RingCentral UX</a></p>

## 06 — コンテンツをガター（溝）に置かない

レスポンシブ列グリッドでは、コンテンツは**列内に収め、ガターは空ける**のが規律だ。要素がガターに侵食すると整列が崩れ、一気に素人っぽく見える。端の列を画面端までフラッシュさせたいときは負マージンで明示的に出す——溝へにじませるのではなく。下の図は同じ 4 カラムで、左は要素が gap に食い込み、右は列の幅にきっちり収まっている。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-grid"><div class="al-gcol"><div class="al-gfill al-gbad"></div></div><div class="al-gcol"><div class="al-gfill"></div></div><div class="al-gcol"><div class="al-gfill al-gbad"></div></div><div class="al-gcol"><div class="al-gfill"></div></div></div></div><div class="label">✗ ブロックが gutter に侵食 → 列が揃わない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="al-grid"><div class="al-gcol"><div class="al-gfill"></div></div><div class="al-gcol"><div class="al-gfill"></div></div><div class="al-gcol"><div class="al-gfill"></div></div><div class="al-gcol"><div class="al-gfill"></div></div></div></div><div class="label">✓ 列幅にきっちり収め gutter を空ける</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://supercharge.design/blog/ui-design-grids-explained" target="_blank" rel="noopener">UI Design Grids Explained — Supercharge</a></p>

## 実装スニペット

```css
/* 基準グリッドのトークン (8px / 4px) — Material 準拠 */
:root {
  --grid-base: 8px;        /* コンポーネント */
  --grid-fine: 4px;        /* アイコン・タイポのベースライン */
  --space-1: 8px;
  --space-2: 16px;         /* mobile margin */
  --space-3: 24px;         /* tablet margin */
  --space-5: 40px;
  --touch-min: 48px;       /* 最小タップ領域 48×48dp */
  --content-keyline: 72px; /* アイコン付きコンテンツ左マージン(mobile) */
}
/* 12カラム, frame幅 375/600/900/1200px。コンテンツはガターに置かない */
```

```css
/* アイコン-テキストのベースライン補正 (CSS変数 + 計算) */
.icon-text {
  --fontSize: 16px;
  --lineHeight: 1.5;
  --iconSize: 16px;
  --baselineDistance: calc(var(--fontSize) * var(--lineHeight)); /* 24px */
  --iconOffset: calc((var(--baselineDistance) - var(--iconSize)) / 2); /* 4px */
}
.icon-text svg {
  transform: translateY(var(--iconOffset));
}
/* アイコンがテキストより大きいとオフセットは負(例 16px/1.6/32px → −3.2px)になり自動で上方向補正される */
```

```css
/* モダンCSS: lh/em 単位でベースライン補正(手計算不要) */
.icon {
  /* テキストと同サイズ系アイコン */
  transform: translateY(calc(.5em - .5lh));
}
.icon-variable {
  /* 可変サイズアイコン (vertical-align:middle前提) */
  --icon-size: 24px;
  vertical-align: middle;
  --icon-block-offset: calc((1lh - var(--icon-size)) * 0.5);
  margin-block-start: var(--icon-block-offset);
}
/* lh単位はモダンブラウザ前提。古い環境向けには px計算フォールバックを併記する */
```

```css
/* play三角形の光学センタリング (非対称マージン) */
.play-button {
  display: flex;
  align-items: center;
  justify-content: center;
}
.play-button .triangle {
  /* 視覚重心が左にあるので右へ寄せる: 左86 / 右70 の比率 */
  margin-left: 86px;
  margin-right: 70px;
  /* 三角ボタンは矩形より約40px幅広にして等サイズに見せる */
}
/* RingCentral実測の左86px/右70px。寸法は容器に合わせ比率(left>right)を保って調整 */
```

## チェックリスト

<ul class="check">
  <li>全要素を 8px グリッドに、アイコン・タイポのベースラインを 4px 細グリッドにスナップさせたか（光学調整より先に）</li>
  <li>サイズ・余白は 8 の倍数（8/16/24/40）から選んでいるか</li>
  <li>三角・矢印など非対称シルエットを、視覚的重心と逆方向へずらしたか</li>
  <li>円・三角を正方形と同列に置くとき、実寸をオーバーシュートさせたか（円 +2dp など）</li>
  <li>アイコン+テキストの縦位置を `(font-size×line-height − iconSize)/2` の算出値で補正したか</li>
  <li>アイコンとテキストに完全同一 hex を使っていないか（濃度差を補正したか）</li>
  <li>コンテンツが列内に収まり、ガターに侵食していないか</li>
  <li>タップ領域は 48×48dp 以上、隣接間隔 8dp 以上を確保したか</li>
  <li>補正値を目分量でなく数値（86px/70px・+4px 等）でトークン／keyline に固定したか</li>
  <li>補正リソースを最も目立つ要素（大見出し・主要 CTA）に集中投下したか</li>
</ul>

## 限界 / 出典

<div class="note"><b>数値はコンテキスト依存：</b>左 86px / 右 70px は特定コンテナでの RingCentral 実測値で、容器寸法が変われば比率（左 > 右）を保って再計算が要る。CSS-Tricks のオフセット値（4px / −3.2px / −12.8px）はそれぞれの font-size / line-height / iconSize でのみ成立し、式で都度算出すべき。</div>

<div class="note"><b>環境と過剰補正の注意：</b>`lh` 単位はモダンブラウザ前提で、古い環境には px フォールバックを併記する。Material 1 の keyline 値（18/20dp 等）は M1 由来で、M3 では形は変わるが「幾何ベース形を保つ」方針は継続。trim / live / padding 等の dp 値は SVG 設計レイヤーの話で Web 実装の余白とは別物。そして「全要素を光学補正」は過剰——最も目立つ要素を優先するのが現実的だ。具体オフセット値の多くはブログ実例ベースなので、自プロジェクトでは必ず目視で微調整すること。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/layout/metrics-keylines.html" target="_blank" rel="noopener">Metrics & keylines - Layout - Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/icons/designing-icons" target="_blank" rel="noopener">Icons — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/layout/responsive-layout-grid.html" target="_blank" rel="noopener">Responsive layout grid — Material Design</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.mdui.org/en/design/1/style/icons.html" target="_blank" rel="noopener">Icons – Style – Material Design 1</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://css-tricks.com/improving-icons-for-ui-elements-with-typographic-alignment-and-scale/" target="_blank" rel="noopener">Improving Icons for UI Elements with Typographic Alignment and Scale — CSS-Tricks</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://ixdf.org/literature/topics/visual-alignment" target="_blank" rel="noopener">What is Visual Alignment? — Interaction Design Foundation</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://railsdesigner.com/mathematical-optical-alignment-design/" target="_blank" rel="noopener">Mathematical and Optically alignment in (visual/UI) design — Rails Designer</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/ringcentral-ux/eyeballing-or-optical-alignment-in-design-4ef5ab2d326f" target="_blank" rel="noopener">'Eyeballing' or Optical Alignment in Design — RingCentral UX</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/design-bridges/optical-effects-9fca82b4cd9a" target="_blank" rel="noopener">Optical effects in user interfaces — Design Bridges</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uiprep.com/blog/everything-you-need-to-know-about-spacing-layout-grids" target="_blank" rel="noopener">Everything you need to know about spacing & layout grids — UI Prep</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://supercharge.design/blog/ui-design-grids-explained" target="_blank" rel="noopener">UI Design Grids Explained — Supercharge</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://liferay.design/articles/best-practices/measured-vs-optical-alignment/" target="_blank" rel="noopener">Measured vs Optical Alignment — Liferay.Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.thenounproject.com/graphic-design-fundamentals-alignment-and-grid-systems/" target="_blank" rel="noopener">Graphic Design Principles: Alignment and Grid Systems — The Noun Project</a></p>
