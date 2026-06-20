---
title: "グレーが濁る——使えるニュートラルと色の作り方"
problem: "グレーやニュートラルが濁って安っぽい。色の選び方に芯がない。"
category: 色
tags: [色, グレー, 彩度]
date: 2026-06-20
sources: 9
draft: false
---

<style>
  .nc-sw{width:100%;height:64px;display:flex;align-items:flex-end;padding:6px 8px;font:600 11px/1 ui-monospace,monospace;box-sizing:border-box}
  .nc-ramp{display:flex;flex-direction:column;width:170px;border:1px solid var(--line)}
  .nc-card{width:150px;padding:16px;border-radius:10px;font-weight:700;text-align:center;box-sizing:border-box}
  /* 純グレー (彩度0%) */
  .nc-flat-50{background:hsl(0 0% 98%);color:#16150f}
  .nc-flat-200{background:hsl(0 0% 90%);color:#16150f}
  .nc-flat-500{background:hsl(0 0% 53%);color:#fff}
  .nc-flat-900{background:hsl(0 0% 13%);color:#f4f2ec}
  /* 青みのある灰色 (低彩度tint) */
  .nc-tint-50{background:hsl(220 16% 98%);color:#16150f}
  .nc-tint-200{background:hsl(220 13% 90%);color:#16150f}
  .nc-tint-500{background:hsl(220 10% 46%);color:#f4f2ec}
  .nc-tint-900{background:hsl(220 18% 14%);color:#f4f2ec}
  /* 真っ黒 vs とても暗いグレー */
  .nc-blk-bad{background:#000;color:#f4f2ec}
  .nc-blk-good{background:hsl(220 18% 14%);color:#f4f2ec}
  /* 3段ランプ vs 9段ランプ */
  .nc-r3>div{height:28px}
  .nc-r9>div{height:9.3px}
  /* くすみ過ぎ (S=40%) vs 狙いのbluish grey (S=12%) */
  .nc-dirty{background:hsl(220 42% 62%);color:#16150f}
  .nc-clean{background:hsl(220 12% 62%);color:#16150f}
  /* 温度: 寒色ブランド背景に純グレー vs ウォームグレー */
  .nc-stage{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:hsl(212 60% 42%)}
  .nc-onbrand{width:120px;height:96px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px;color:#16150f}
  .nc-onbrand.bad{background:hsl(0 0% 88%)}
  .nc-onbrand.good{background:hsl(40 16% 88%)}
  /* 影 */
  .nc-shadowbox{width:140px;height:90px;border-radius:12px;background:#fff;color:#16150f;display:flex;align-items:center;justify-content:center;font-weight:700}
  .nc-sh-bad{box-shadow:0 4px 12px rgba(0,0,0,.18)}
  .nc-sh-good{box-shadow:0 1px 2px hsl(220 40% 20% / .08),0 4px 12px hsl(220 40% 20% / .12)}
  /* WCAG サブテキスト */
  .nc-txtcell{width:100%;padding:18px;background:#fff;color:#16150f;box-sizing:border-box;text-align:left}
  .nc-mut-bad{color:#aaaaaa}
  .nc-mut-good{color:#767676}
  .nc-ratio{font:600 11px/1.4 ui-monospace,monospace;margin-top:8px}
</style>

## 結論

プロは「グレー＝無彩色」を捨てる。彩度0%（`S 0%`）のグレーは色温度ゼロで死んで濁って見えるので、ブランドに寄せた色相を低彩度（目安 `S 10〜30%`）で仕込み、真っ黒・真っ白を避けて8〜10段の階調を組む。最後は数値で固めず目で詰め、本文グレーだけは輝度コントラストでWCAG AA（白地4.5:1=`#767676`以下）を必ず実測する。

## 01 — 彩度0%を捨て、低彩度で色相を仕込む

`hsl()` の `S=0%` は純グレースケール、つまり色温度がない＝濁り・無生命さの正体。ブランドに関連する色相を `H` で固定し、`S` を 10〜30% に抑えると、「灰色っぽい青（greyish blue）」ではなく「青みのある灰色（bluish grey）」になり、意図した tinted neutral として読める。クールは青寄り、ウォームは黄/オレンジ寄りに振る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;gap:6px"><div class="nc-sw nc-flat-50">50</div><div class="nc-sw nc-flat-200">200</div><div class="nc-sw nc-flat-500">500</div><div class="nc-sw nc-flat-900">900</div></div></div><div class="label">✗ S 0% の純グレー → 冷たく死んで濁る</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div style="display:flex;gap:6px"><div class="nc-sw nc-tint-50">50</div><div class="nc-sw nc-tint-200">200</div><div class="nc-sw nc-tint-500">500</div><div class="nc-sw nc-tint-900">900</div></div></div><div class="label">✓ H220・S 8〜18% を仕込む → 青みのある灰色で生きる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/color-formats/" target="_blank" rel="noopener">Color Formats in CSS — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>

## 02 — 真っ黒・真っ白を避け、8〜10段で組む

`#000` は自然界にない不自然な黒で、画面が硬く安っぽくなる。最暗は「とても暗いグレー」から始め、最明はわずかにオフホワイトの背景までを一定刻みで上げる。3〜4段だと必ず「`#2`より暗く`#3`より明るい」が欲しくなるので8〜10段持つ。最暗＝最も暗い文字色、最明＝控えめな背景からアンカーを逆算する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-card nc-blk-bad">#000</div></div><div class="label">✗ 真っ黒 → 縁が硬く沈んで安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-card nc-blk-good">hsl(220 18% 14%)</div></div><div class="label">✓ とても暗いグレー → 黒の代替として自然</div></div>
</div>

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-ramp nc-r3"><div class="nc-tint-50"></div><div class="nc-tint-500"></div><div class="nc-tint-900"></div></div></div><div class="label">✗ 3段 → 中間が足りずすぐ詰められなくなる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-ramp nc-r9"><div style="background:hsl(220 16% 98%)"></div><div style="background:hsl(220 14% 95%)"></div><div style="background:hsl(220 13% 90%)"></div><div style="background:hsl(220 12% 82%)"></div><div style="background:hsl(220 11% 64%)"></div><div style="background:hsl(220 10% 46%)"></div><div style="background:hsl(220 12% 36%)"></div><div style="background:hsl(220 14% 26%)"></div><div style="background:hsl(220 18% 14%)"></div></div></div><div class="label">✓ 9段 → 端から端まで刻みが取れて詰めが効く</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://refactoringui.com/previews/building-your-color-palette/" target="_blank" rel="noopener">Building Your Color Palette — Refactoring UI</a></p>

## 03 — 端ほど彩度を上げ、くすみ過ぎは避ける

明度が50%から遠いシェード（とても暗い／とても明るい）ほど、同じ彩度では色が抜けて washed out に見える。最暗・最明の端ほど `S` を足して色を保つ。ただし全体はあくまで低彩度。`S` が 30% を超えると tint が強すぎて「ニュートラル」ではなく「くすんだ色」に転び、UIが薄汚れて見える。狙いは bluish grey であって greyish blue ではない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-card nc-dirty">S 42%</div></div><div class="label">✗ 彩度を盛りすぎ → くすんだ青、UIが薄汚れる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-card nc-clean">S 12%</div></div><div class="label">✓ 低彩度に抑える → ニュートラルとして読める</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://colorarchive.org/guides/saturation-chroma-design-guide/" target="_blank" rel="noopener">Saturation and Chroma in Design — ColorArchive</a></p>

## 04 — グレーの温度はブランド色の逆に振る

完全無彩色のグレーを色の付いた背景に置くと浮く。ブランドの色温度を取り、グレーは反対方向（暖色ブランドなら寒色グレー、寒色ブランドならウォームグレー）へ少しだけ振ると、画面がまとまり高見えする。「ブランド色を足す」とは矛盾せず、量と方向を文脈で選ぶ話。下は寒色ブランド背景に置いたカード。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2);padding:0"><div class="nc-stage"><div class="nc-onbrand bad">純グレー</div></div></div><div class="label">✗ 無彩色グレー → 青背景の上で冷たく浮く</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2);padding:0"><div class="nc-stage"><div class="nc-onbrand good">ウォーム</div></div></div><div class="label">✓ 逆温度のウォームグレー → 背景に馴染んで高見え</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="http://medium.com/design-bootcamp/my-approach-to-colors-on-interfaces-part-1-understanding-grays-e1a93a5bfc6f" target="_blank" rel="noopener">Understanding grays — Bootcamp (Medium)</a></p>

## 05 — 影は灰色でなく「色相＋低明度低彩度」で作る

`box-shadow` を灰色や純黒で置くと、洗い流したように浅く安っぽい影になる。要素の色相に `hue` を揃え、`saturation` と `lightness` を下げた tinted shadow を低い alpha で重ねると、自然で深い影になる。グレー濁り回避の典型的な応用。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-shadowbox nc-sh-bad">gray</div></div><div class="label">✗ rgba(0,0,0,.18) → 灰色で浅く安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-shadowbox nc-sh-good">tinted</div></div><div class="label">✓ hsl(220 40% 20%) を2層 → 色味のある深い影</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>

## 06 — 本文グレーはWCAG AAを輝度で実測する

コントラストは色相ではなく明度（輝度）で決まる。色相を足したグレーでも、最終はこの輝度比でクランプする。白地・通常テキストで AA（4.5:1）を満たす最も明るいグレーは `#767676`。`#777777` は 4.47:1 で不合格（切り上げ不可）。大文字（18px以上、または14px以上のbold）は 3:1 まで緩和され、見出しはより明るいグレーが使える。色相距離でなく必ず輝度比を測る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-txtcell"><b style="color:#16150f">見出しは黒</b><div class="nc-mut-bad">この補足テキストは薄すぎる</div><div class="nc-ratio" style="color:#16150f">#aaaaaa = 約2.3:1 → 不合格</div></div></div><div class="label">✗ 明るすぎるグレー → 白地で判読しづらい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nc-txtcell"><b style="color:#16150f">見出しは黒</b><div class="nc-mut-good">この補足テキストは読める</div><div class="nc-ratio" style="color:#16150f">#767676 = 4.5:1 → AA合格</div></div></div><div class="label">✓ #767676 → 白地サブテキストの実用的な下限</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>

## 実装スニペット

クール（寒色）ニュートラルランプ。色相を固定し、50%輝度から離れる両端ほど `S` を上げて washed out を防ぐ。

```css
:root{
  /* 青みのある灰色: H=220固定, S=8〜18%, 端ほどS↑ */
  --gray-50:  hsl(220 16% 98%); /* オフホワイト背景 */
  --gray-100: hsl(220 14% 95%);
  --gray-200: hsl(220 13% 90%); /* border */
  --gray-300: hsl(220 12% 82%);
  --gray-400: hsl(220 11% 64%);
  --gray-500: hsl(220 10% 46%); /* AA本文の境目付近 */
  --gray-600: hsl(220 12% 36%);
  --gray-700: hsl(220 14% 26%);
  --gray-900: hsl(220 18% 14%); /* 最暗=純黒の代替 */
}
body{ color: var(--gray-900); background: var(--gray-50); }
```

ウォーム（暖色）ニュートラル。寒色ブランドの背景に当てると浮きが消える。`S` は最大でも20%程度に留める。

```css
:root{
  /* 黄みのある灰色: H=40, S=10〜20% */
  --warm-50:  hsl(40 20% 98%);
  --warm-200: hsl(40 14% 89%); /* border */
  --warm-500: hsl(40 8% 45%);
  --warm-900: hsl(36 16% 13%); /* 最暗、純黒の代替 */
}
.card{ background:var(--warm-50); border:1px solid var(--warm-200); color:var(--warm-900); }
```

WCAG AA を満たすサブテキスト用グレー（白地）。色相を足したグレーでも最終はこの輝度比でクランプ。

```css
/* 白(#fff)地・通常テキストで 4.5:1 を満たす最明グレー */
.text-muted{ color:#767676; }      /* 4.5:1 = AA合格 */
/* NG: #777777 は 4.47:1 で不合格(切り上げ不可) */

/* 見出し(18px+ または 14px+ bold)は 3:1 まで緩和 → より明るくできる */
.heading-muted{ color:#949494; font-size:24px; }
```

tinted shadow。`hue` を要素に揃え、`lightness` を下げて alpha で重ねる。

```css
.card{
  /* 要素色相に合わせた青寄り・低明度低彩度の影を重ねる */
  box-shadow:
    0 1px 2px hsl(220 40% 20% / .08),
    0 4px 12px hsl(220 40% 20% / .12);
}
/* NG: 0 4px 12px rgba(0,0,0,.15) → 灰色で浅く安っぽい */
```

## チェックリスト

<ul class="check">
  <li>グレーの `S` は 0% ではなく 10〜30% に入っているか（純グレースケールを排除したか）</li>
  <li>色相 `H` はブランド色に関連づけたか（クール＝青寄り／ウォーム＝黄オレンジ寄り）</li>
  <li>`S` が 30% を超えて「くすんだ色」に転んでいないか（狙いは bluish grey）</li>
  <li>最暗は `#000` でなく「とても暗いグレー」、最明は純白でなくオフホワイトか</li>
  <li>ランプは8〜10段あるか（バナー単発でも最低5段）</li>
  <li>50%輝度から離れる両端ほど彩度を少し上げて washed out を防いだか</li>
  <li>色の付いた背景に置くグレーは、ブランドの逆温度に振ったか</li>
  <li>影は灰色／純黒でなく、要素色相に揃えた低明度低彩度の tinted shadow か</li>
  <li>本文・サブテキストは白地で AA 4.5:1（`#767676`以下）を実機/ツールで実測したか</li>
  <li>大文字・半透明重ね・白以外の背景は別計算でコントラストを取り直したか</li>
  <li>初期値を出したあと、最後は数値でなく目で詰めたか（Trust your eyes, not the numbers）</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>数値レシピは出典で粒度が違う。Refactoring UI と Josh Comeau の一次／著者ページは「色ごとに挙動が違う」として固定の彩度値・開始明度をあえて示さず「目で詰めろ」と明言している。`S 10〜30%` という具体レンジは ColorArchive 等の二次ブログ由来で規範性は中程度。コントラスト依存箇所（本文・サブテキスト）は色相を足すと輝度がわずかに動くため、AA(4.5:1)を必ず再実測すること。`#767676`/`#777777` の境界は「白地・通常テキスト」限定で、背景が白以外・大文字・半透明重ねでは別計算になる。OKLCH や Material 3 の生成ロジックは新しめでブラウザ対応フォールバックやツール依存があり、提示の hex をそのまま流用せず自プロジェクトのブランド色相から作り直すのが前提。バナー等の単発制作でも最低限のコントラスト実測は省略しない。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://refactoringui.com/previews/building-your-color-palette/" target="_blank" rel="noopener">Building Your Color Palette — Refactoring UI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/color-formats/" target="_blank" rel="noopener">Color Formats in CSS — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="http://medium.com/design-bootcamp/my-approach-to-colors-on-interfaces-part-1-understanding-grays-e1a93a5bfc6f" target="_blank" rel="noopener">Understanding grays — Bootcamp (Medium)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://colorarchive.org/guides/saturation-chroma-design-guide/" target="_blank" rel="noopener">Saturation and Chroma in Design — ColorArchive</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/blog/tone-based-surface-color-m3" target="_blank" rel="noopener">Tone-based Surfaces in Material 3</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/cortes-studio/a-systematic-approach-to-harmonious-neutral-color-palettes-in-product-design-9b4aa19e2156" target="_blank" rel="noopener">How to Pick the Grays in Your Design System — Cortes Studio</a></p>
