---
title: "影が安っぽい——のっぺりを脱する影の設計"
problem: "影をつい単一の濃い黒影で付けてしまい、安っぽく・のっぺり見える。"
category: 質感
tags: [影, シャドウ, エレベーション]
date: 2026-06-20
sources: 11
draft: false
---

<style>
  .sh-box{width:140px;height:90px;border-radius:12px;background:#fff;color:#16150f;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px}
  /* 01 single vs layered */
  .sh-single{box-shadow:0 3px 3px rgba(0,0,0,.2)}
  .sh-layered{box-shadow:0 1px 1px rgba(0,0,0,.12),0 2px 2px rgba(0,0,0,.12),0 4px 4px rgba(0,0,0,.12),0 8px 8px rgba(0,0,0,.12),0 16px 16px rgba(0,0,0,.12)}
  /* 02 black vs tinted on colored bg */
  .sh-tintwrap{display:flex;align-items:center;justify-content:center;width:100%;height:100%}
  .sh-tile{width:140px;height:90px;border-radius:12px;background:hsl(220 90% 88%);color:#16150f;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px}
  .sh-blackshadow{box-shadow:1px 2px 2px hsl(0 0% 0% / .333),2px 4px 4px hsl(0 0% 0% / .333),3px 6px 6px hsl(0 0% 0% / .333)}
  .sh-tinted{box-shadow:1px 2px 2px hsl(220 60% 50% / .333),2px 4px 4px hsl(220 60% 50% / .333),3px 6px 6px hsl(220 60% 50% / .333)}
  /* 03 light source consistency */
  .sh-row{display:flex;gap:18px;align-items:center;justify-content:center}
  .sh-mini{width:60px;height:60px;border-radius:10px;background:#fff;color:#16150f;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
  .sh-ls1{box-shadow:-3px 4px 8px rgba(20,18,12,.28)}
  .sh-ls2{box-shadow:5px -2px 8px rgba(20,18,12,.28)}
  .sh-ls3{box-shadow:0 5px 8px rgba(20,18,12,.28)}
  .sh-uni{box-shadow:2px 4px 8px rgba(20,18,12,.18),4px 8px 16px rgba(20,18,12,.12)}
  /* 04 elevation scale */
  .sh-elevwrap{display:flex;gap:16px;align-items:center;justify-content:center}
  .sh-e{width:64px;height:64px;border-radius:10px;background:#fff;color:#16150f;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center}
  .sh-e-flatlow{box-shadow:0 1px 10px rgba(20,18,12,.18)}
  .sh-e-flatmid{box-shadow:0 1px 10px rgba(20,18,12,.18)}
  .sh-e-flathigh{box-shadow:0 1px 10px rgba(20,18,12,.18)}
  .sh-e-low{box-shadow:.5px 1px 1px hsl(220 18% 30% / .7)}
  .sh-e-mid{box-shadow:1px 2px 2px hsl(220 18% 30% / .333),2px 4px 4px hsl(220 18% 30% / .333),3px 6px 6px hsl(220 18% 30% / .333)}
  .sh-e-high{box-shadow:1px 2px 2px hsl(220 18% 30% / .2),2px 4px 4px hsl(220 18% 30% / .2),4px 8px 8px hsl(220 18% 30% / .2),8px 16px 16px hsl(220 18% 30% / .2),16px 32px 32px hsl(220 18% 30% / .2)}
  /* 05 dark mode surface overlay vs black shadow */
  .sh-darkcanvas{background:#121212 !important}
  .sh-darktile{width:140px;height:90px;border-radius:12px;background:#121212;color:#f4f2ec;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px}
  .sh-darkblack{box-shadow:0 8px 16px rgba(0,0,0,.6)}
  .sh-darkover{background-image:linear-gradient(rgba(255,255,255,.12),rgba(255,255,255,.12))}
  /* 06 box-shadow vs drop-shadow on non-rect */
  .sh-star{width:0;height:0}
  .sh-starshape{width:96px;height:96px;background:hsl(45 90% 55%);clip-path:polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)}
  .sh-boxsh{box-shadow:3px 5px 8px hsl(220 60% 50% / .5)}
  .sh-dropsh{filter:drop-shadow(3px 5px 8px hsl(220 60% 50% / .5))}
</style>

## 結論

プロは影を「1枚の濃い黒」で済ませない。ブラーとオフセットを倍々に増やした5〜6層のレイヤード影で実世界の半影（ペナンブラ）の減衰を再現し、影色は純黒を捨てて背景の色相を借り、ページ全体で光源を1つに固定する（縦オフセット＝横オフセット×2）。浮き上がり（elevation）はオフセット・ブラー・不透明度の3パラメータを同時に動かして表現し、ダークモードでは影でなく面を明るくして高さを出す。

## 01 — 単一影をやめ、5層に重ねる

`box-shadow` のぼかし関数は1つだけ。1枚のぼけたシルエットを貼るだけなので、実世界の影にある減衰グラデーションが欠落し「四角く貼り付けた」安っぽさになる。Tobias Ahlin の言葉では *square で clumsy*。代わりにオフセットとブラーを 1→2→4→8→16px と倍々に増やした5層をスタックすると、わずかに異なるぼかしが重なって滑らかなペナンブラが生まれる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-box sh-single">cheap</div></div><div class="label">✗ 単一 box-shadow（0 3px 3px / .2）→ 縁がくっきり四角い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-box sh-layered">pro</div></div><div class="label">✓ 倍々ブラーの5層（全層 opacity .12）→ 自然に減衰</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://tobiasahlin.com/blog/layered-smooth-box-shadows/" target="_blank" rel="noopener">Smoother & sharper shadows with layered box-shadows | Tobias Ahlin</a></p>

## 02 — 影色は黒でなく背景の色相に寄せる

`hsl(0 0% 0% / .4)` のような透明黒は下地を脱彩（desaturate）させ、washed-out なグレーの濁りを生む。影が画面から浮いて雑に見える原因がこれ。背景の色相を借り、彩度は中程度・明度は下げた色を `--shadow-color` に入れて一括管理すれば、彩度を保ったまま自然に沈む。下の例はどちらも同じ青タイル上、同じ3層構成で影色だけが違う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-tintwrap"><div class="sh-tile sh-blackshadow">cheap</div></div></div><div class="label">✗ 純黒の影 → 青が濁ってグレーに沈む</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-tintwrap"><div class="sh-tile sh-tinted">pro</div></div></div><div class="label">✓ 背景hue 220 を借りた影 → 彩度が保たれ馴染む</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>

## 03 — 光源を1つに固定する（縦＝横×2）

要素ごとに影の方向や縦横比が違うと、複数の光源が存在するように見えて一気にフェイクになる。ページ上の全ての影が同じ縦横オフセット比を共有すると、遠くの単一光源（太陽のような）から照らされた一貫性が出る。Comeau の慣習は縦オフセット＝横オフセットの2倍（1/2、2/4…）。下の左は3枚がバラバラの方向、右は全て右下・縦＝横×2で統一。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-row"><div class="sh-mini sh-ls1">A</div><div class="sh-mini sh-ls2">B</div><div class="sh-mini sh-ls3">C</div></div></div><div class="label">✗ 影の向きがバラバラ → 光源が複数に見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-row"><div class="sh-mini sh-uni">A</div><div class="sh-mini sh-uni">B</div><div class="sh-mini sh-uni">C</div></div></div><div class="label">✓ 全要素 右下・縦=横×2 → 単一光源で統一</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>

## 04 — elevation は3パラメータを同時に動かす

浮き上がりをオフセットだけ、あるいはブラーだけで表現すると不自然。実際はオフセット拡大・ブラー拡大・不透明度減少が必ず同時に起こる。低い要素は単層で小さく濃く（opacity .7）、高い要素は多層で大きく薄く（.2）。これで low / mid / high の3段スケールを作る。下の左は3枚とも同じ影でelevation差が出ていない例、右は3段で距離が読み取れる例。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-elevwrap"><div class="sh-e sh-e-flatlow">low</div><div class="sh-e sh-e-flatmid">mid</div><div class="sh-e sh-e-flathigh">high</div></div></div><div class="label">✗ 全部同じ影 → 階層の差が伝わらない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-elevwrap"><div class="sh-e sh-e-low">low</div><div class="sh-e sh-e-mid">mid</div><div class="sh-e sh-e-high">high</div></div></div><div class="label">✓ offset↑/blur↑/opacity↓ を同時に → 距離が読める</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a> <span class="badge b-primary">primary</span><a href="https://m2.material.io/design/environment/light-shadows.html" target="_blank" rel="noopener">Light and shadows — Material Design (M2)</a></p>

## 05 — ダークモードは影でなく面を明るくする

暗い面の上では黒い影はほぼ視認できず、深さが伝わらない。Material（M2）は #121212 を基準に白オーバーレイを重ねて高さを表現する（1dp=5%、8dp=12%、24dp=16%）。ライト用の影トークンを使い回すとダークでのっぺりする。下はどちらも暗いキャンバス上、左は黒影（ほぼ見えない）、右は白12%オーバーレイで面を持ち上げた例。

<div class="grid g2">
  <div class="demo"><div class="canvas sh-darkcanvas"><div class="sh-darktile sh-darkblack">cheap</div></div><div class="label">✗ 暗い面に黒影 → 影が消えてのっぺり</div></div>
  <div class="demo"><div class="canvas sh-darkcanvas"><div class="sh-darktile sh-darkover">pro</div></div><div class="label">✓ 白オーバーレイ 12% で面を明るく → 高さが出る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a> <span class="badge b-primary">primary</span><a href="https://m3.material.io/blog/tone-based-surface-color-m3" target="_blank" rel="noopener">Introducing Tone-based Surfaces in Material 3</a></p>

## 06 — 非矩形・透過画像は drop-shadow を使う

`box-shadow` はバウンディングボックス（外接矩形）に影を落とすため、透過部分のあるアイコンや切り抜き画像では形に沿わない四角い影が出る。`filter: drop-shadow()` なら要素の実形状（切り抜き含む）に沿って影が落ちる。下は同じ星形に同じ影パラメータを適用し、左が `box-shadow`、右が `drop-shadow`。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-starshape sh-boxsh"></div></div><div class="label">✗ box-shadow → 外接矩形の四角い影が出る</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sh-starshape sh-dropsh"></div></div><div class="label">✓ drop-shadow → 星の形に沿った影になる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>

## 実装スニペット

レイヤード影の基本形（Tobias Ahlin・opacity一定）。オフセット・ブラーを倍々にし、全層 .12 でニュートラルな滑らかさ。シャープにしたいときは上から .25/.20/.15/.10/.05 に振る。

```css
.card {
  box-shadow:
    0 1px 1px rgba(0,0,0,0.12),
    0 2px 2px rgba(0,0,0,0.12),
    0 4px 4px rgba(0,0,0,0.12),
    0 8px 8px rgba(0,0,0,0.12),
    0 16px 16px rgba(0,0,0,0.12);
}
```

色付き影・elevation 3段（Josh Comeau）。縦＝横×2 の比を全段で維持して光源を統一し、`--shadow-color` を背景の色相に差し替えるだけで脱彩を防ぐ。

```css
:root { --shadow-color: 220deg 60% 50%; }

/* 低: 単層で小さく濃い */
.elev-low  { box-shadow: 0.5px 1px 1px hsl(var(--shadow-color) / 0.7); }

/* 中: 3層 */
.elev-mid {
  box-shadow:
    1px 2px 2px hsl(var(--shadow-color) / 0.333),
    2px 4px 4px hsl(var(--shadow-color) / 0.333),
    3px 6px 6px hsl(var(--shadow-color) / 0.333);
}

/* 高: 5層・薄く大きく */
.elev-high {
  box-shadow:
    1px 2px 2px hsl(var(--shadow-color) / 0.2),
    2px 4px 4px hsl(var(--shadow-color) / 0.2),
    4px 8px 8px hsl(var(--shadow-color) / 0.2),
    8px 16px 16px hsl(var(--shadow-color) / 0.2),
    16px 32px 32px hsl(var(--shadow-color) / 0.2);
}
```

ダークモード：影でなく面を明るくする（Material M2準拠）。高さ＝白オーバーレイの濃度で表現する。完全対応表は 0dp 0% / 1dp 5% / 2dp 7% / 3dp 8% / 4dp 9% / 6dp 11% / 8dp 12% / 12dp 14% / 16dp 15% / 24dp 16%。

```css
.surface-dark { background: #121212; }

.elev-1dp  { background-image: linear-gradient(rgba(255,255,255,0.05),rgba(255,255,255,0.05)); } /* card */
.elev-8dp  { background-image: linear-gradient(rgba(255,255,255,0.12),rgba(255,255,255,0.12)); } /* bottom app bar */
.elev-24dp { background-image: linear-gradient(rgba(255,255,255,0.16),rgba(255,255,255,0.16)); } /* dialog */
```

非矩形は drop-shadow、フォトリアルなカードは接触影＋環境影の2枚重ね。接触影が要素を地面に固定し、環境影が柔らかいハローを作る。

```css
/* 透過PNG/アイコンは形状に沿う drop-shadow */
.logo { filter: drop-shadow(1px 2px 4px hsl(220deg 60% 50% / 0.4)); }

/* 接触影(濃く短い) + 環境影(薄く広い) */
.product {
  box-shadow:
    0 1px 2px hsl(220deg 60% 50% / 0.4),    /* contact */
    0 12px 24px hsl(220deg 60% 50% / 0.15); /* ambient */
}
```

## チェックリスト

<ul class="check">
  <li>影は単一でなく、ブラー＆オフセットを倍々にした5〜6層のレイヤードにしたか</li>
  <li>影色を純黒・透明黒でなく、背景の色相を借りた色（彩度中・明度低）にしたか</li>
  <li>ページ全体で光源を1つに固定し、全要素で縦オフセット＝横オフセット×2の比を共有しているか</li>
  <li>elevation は offset↑・blur↑・opacity↓ を同時に動かし、low / mid / high の3段でトークン化したか</li>
  <li>フォトリアルなカードは接触影（濃く短い）＋環境影（薄く広い）の2枚を重ねたか</li>
  <li>ダークモードでライト用の影トークンを流用せず、白／トーナルの面オーバーレイで高さを出したか</li>
  <li>透過PNG・SVGアイコン・切り抜き画像には box-shadow でなく filter: drop-shadow() を使ったか</li>
  <li>モバイルで層数（6層超）やblurを使いすぎて描画コストが膨らんでいないか確認したか</li>
</ul>

## 限界 / 出典

数値はあくまで「出発点」。レイヤードの倍々（1→2→4→8→16px）・opacityランプ・縦＝横×2比・elevation 3段の hsl 値は Tobias Ahlin と Josh Comeau の記事から取得した信頼度の高い値だが、実際の背景色・要素サイズ・余白に応じて opacity と色相の微調整は必須。Comeau の青（hue 220）は例示なので、必ず自分の背景の実色相に差し替えること。Material のダーク白オーバーレイ完全対応表（0dp〜24dp）は M2公式＋二次ソースで裏取り済みだが二次ソースは blog 扱い、key umbra 0.20 / penumbra 0.14 / ambient 0.12 のトークン値も MDL 由来で一次ではない。M2（1〜24dp）と M3（0〜5レベル・トーナル優先）はバージョンで体系が異なるため、どちらに準拠するか明示が必要。`hsl(220 60% 50% / .3)` のスペース区切り構文はモダンブラウザ前提で、古い環境にはカンマ構文／rgba のフォールバックを。影の重ねすぎ（6層超）やblur多用はモバイルで描画コストが増えるため、バナー・広告など軽量が要る場面では層数を抑える。

<p class="src"><span class="badge b-primary">primary</span><a href="https://tobiasahlin.com/blog/layered-smooth-box-shadows/" target="_blank" rel="noopener">Smoother & sharper shadows with layered box-shadows | Tobias Ahlin</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/designing-beautiful-shadows-in-css/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS | CSS-Tricks</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/environment/light-shadows.html" target="_blank" rel="noopener">Light and shadows — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/elevation" target="_blank" rel="noopener">Elevation — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/elevation/applying-elevation" target="_blank" rel="noopener">Applying elevation — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/blog/tone-based-surface-color-m3" target="_blank" rel="noopener">Introducing Tone-based Surfaces in Material 3</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://codepen.io/owens/pen/ZKeevY" target="_blank" rel="noopener">Elevation (Shadows) in Material Design — CodePen (MDL values)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/snapp-mobile/design-for-the-dark-theme-9a2185bbb1d5" target="_blank" rel="noopener">Design for the Dark Theme — Snapp Mobile (Medium)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://dev.to/alphashark/the-anatomy-of-a-good-box-shadow-and-why-most-look-fake-7h" target="_blank" rel="noopener">The Anatomy of a Good Box Shadow (and Why Most Look Fake) — DEV</a></p>
