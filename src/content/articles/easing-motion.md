---
title: "動きがカクつく——イージングとトランジションの質"
problem: "transitionが直線的・速すぎ/遅すぎで、動きが安っぽい。"
category: 細部
tags: [モーション, イージング, トランジション]
date: 2026-06-20
sources: 8
draft: false
---

<style>
  .eas-box{width:120px;height:120px;border-radius:14px;background:var(--accent);display:flex;align-items:center;justify-content:center;color:#f4f2ec;font-weight:700;font-size:13px;cursor:pointer}
  /* slide demo */
  .eas-track{width:100%;height:120px;position:relative;overflow:hidden;border-radius:8px}
  .eas-runner{position:absolute;top:50%;left:8px;width:64px;height:64px;margin-top:-32px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#f4f2ec;font-weight:700;font-size:12px;background:var(--ink);animation:eas-slide 2.4s infinite}
  .eas-runner.eas-lin{animation-timing-function:linear}
  .eas-runner.eas-out{animation-timing-function:cubic-bezier(0.05,0.7,0.1,1)}
  @keyframes eas-slide{0%{transform:translateX(0)}45%{transform:translateX(calc(100% + 56px))}55%{transform:translateX(calc(100% + 56px))}100%{transform:translateX(0)}}

  /* enter/exit symmetric vs asymmetric */
  .eas-pulse{width:90px;height:90px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#f4f2ec;font-weight:700;font-size:12px;background:var(--ink)}
  .eas-sym{animation:eas-symA 2.2s infinite}
  @keyframes eas-symA{0%{opacity:0;transform:scale(.9)}25%{opacity:1;transform:scale(1)}60%{opacity:1;transform:scale(1)}85%{opacity:0;transform:scale(.9)}100%{opacity:0;transform:scale(.9)}}
  .eas-asyEnter{animation:eas-asyA 2.2s infinite}
  @keyframes eas-asyA{
    0%{opacity:0;transform:scale(.9);animation-timing-function:cubic-bezier(0.05,0.7,0.1,1)}
    25%{opacity:1;transform:scale(1)}
    62%{opacity:1;transform:scale(1);animation-timing-function:cubic-bezier(0.3,0,0.8,0.15)}
    80%{opacity:0;transform:scale(.9)}
    100%{opacity:0;transform:scale(.9)}}

  /* layout vs transform jank */
  .eas-grow-bad{width:80px;height:80px;border-radius:10px;background:var(--accent);animation:eas-w 1.8s infinite cubic-bezier(0.2,0,0,1)}
  @keyframes eas-w{0%,100%{width:80px;height:80px}50%{width:150px;height:150px}}
  .eas-grow-good{width:80px;height:80px;border-radius:10px;background:var(--accent);animation:eas-s 1.8s infinite cubic-bezier(0.2,0,0,1)}
  @keyframes eas-s{0%,100%{transform:scale(1)}50%{transform:scale(1.55)}}

  /* duration demo */
  .eas-dotrail{width:70px;height:70px;border-radius:50%;background:var(--ink);animation:eas-fade 2s infinite cubic-bezier(0.2,0,0,1)}
  .eas-slow{animation-duration:3s}
  @keyframes eas-fade{0%{opacity:.15;transform:translateY(18px)}40%{opacity:1;transform:translateY(0)}70%{opacity:1;transform:translateY(0)}100%{opacity:.15;transform:translateY(18px)}}

  /* hover demo */
  .eas-card{width:150px;height:96px;border-radius:12px;background:var(--paper);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;color:#16150f;font-weight:700;font-size:12px;will-change:transform;transform:translateY(0)}
  .eas-card.eas-h-bad{transition:transform 450ms cubic-bezier(0.2,0,0,1),box-shadow 450ms cubic-bezier(0.2,0,0,1)}
  .eas-card.eas-h-bad:hover{transform:translateY(-6px);box-shadow:0 12px 28px rgba(0,0,0,.18)}
  .eas-card.eas-h-good{transition:transform 450ms cubic-bezier(0.2,0,0,1),box-shadow 450ms cubic-bezier(0.2,0,0,1)}
  .eas-card.eas-h-good:hover{transform:translateY(-6px);box-shadow:0 12px 28px rgba(0,0,0,.18);transition:transform 125ms cubic-bezier(0.2,0,0,1),box-shadow 125ms cubic-bezier(0.2,0,0,1)}

  /* curve swatches */
  .eas-curverow{display:flex;gap:18px;flex-wrap:wrap;justify-content:center}
  .eas-cv{text-align:center;color:#16150f;font-size:11px;font-weight:600}
  .eas-cv svg{display:block;background:var(--paper);border:1px solid var(--line);border-radius:8px}
</style>

「カクつき」の正体はフレーム落ちだけではない。プロは (1) UI移動に `linear` を使わず役割ごとにイージングを選び分け、(2) 入る要素は減速・長め(ease-out, ~225ms)／出る要素は加速・短め(ease-in, ~195ms)と**非対称**に振り、(3) `transform`/`opacity` だけをアニメさせて合成層に乗せる——この3点で「安っぽさ」を消す。所要時間は実用100〜400ms、スイートスポットは200〜250msに収め、Material Design 3 のトークンをそのまま CSS 変数化するのが堅実だ。

## 01 — linear をやめて「減速」を効かせる

人の目は、動くものが止まる瞬間に**減速**を期待する。`linear`（等速 = `cubic-bezier(0,0,1,1)`）は加減速がゼロで、止まる手前まで同じ速度のまま唐突に停止するため、最も機械的・安っぽく見える。UI の移動には `ease-out` 系を当て、終端に向けてなめらかに減速させるのが基本。等速が正しいのは無限ローディングスピナーなど一部の例外だけだ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-track"><div class="eas-runner eas-lin">linear</div></div></div><div class="label">✗ linear（等速）→ 止まり際が唐突で機械的</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-track"><div class="eas-runner eas-out">ease-out</div></div></div><div class="label">✓ decelerate → 終端で静かに減速し着地する</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.svgator.com/blog/easing-functions/" target="_blank" rel="noopener">Easing Functions Explained – SVGator</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://joshcollinsworth.com/blog/easing-curves" target="_blank" rel="noopener">Understanding easing and cubic-bezier curves in CSS – Josh Collinsworth</a></p>

## 02 — enter は減速・長め / exit は加速・短めに振り分ける

入る要素と出る要素を**同じ秒数・同じカーブ**で動かすと、テンプレートそのままの無料感が出る。プロは非対称にする：画面に入る要素は `ease-out` 系で約225msかけて静かに着地させ、出る要素は `ease-in` 系で約195msと素早く退場させる（Material の enter225ms / exit195ms）。3つの出典がすべて一致する最重要原則で、モーダル・ドロワー・トースト全般に効く。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-pulse eas-sym">sym</div></div><div class="label">✗ enter/exit 同カーブ・同秒 → 出入りが平板</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-pulse eas-asyEnter">async</div></div><div class="label">✓ 入り=減速で長く / 出=加速で短く → 表情が出る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://mui.com/material-ui/customization/transitions/" target="_blank" rel="noopener">Transitions – Material UI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/animation-duration/" target="_blank" rel="noopener">Executing UX Animations: Duration and Motion Characteristics – NN/g</a></p>

## 03 — width/height ではなく transform/opacity を動かす

`width`・`height`・`top`・`left`・`margin` をアニメさせると、毎フレーム**レイアウト再計算とリペイント**が走り、GPU 合成に乗らないためフレームが落ちて文字どおりカクつく。同じ「大きくなる」表現でも `transform: scale()` なら合成層だけで処理され、`will-change: transform` で明示すればサブピクセル描画も効く。動かすのは `transform` と `opacity` に限定するのが根本対策だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-grow-bad"></div></div><div class="label">✗ width/height をアニメ → layout再計算でフレーム落ち</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-grow-good"></div></div><div class="label">✓ transform:scale → 合成層だけで滑らかに拡大</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/css-transitions/" target="_blank" rel="noopener">An Interactive Guide to CSS Transitions – Josh W. Comeau</a></p>

## 04 — 所要時間は 100〜400ms に収める

`<80ms` は「壊れて見える」、`>500ms`（モバイルは特に）は「もたつく・ラグい」と感じる。Doherty 閾値の約400msを体感の上限に据え、micro（トグル/タップ）100〜200ms・画面遷移200〜250ms・ヒーロー/モーダル300〜400ms を初期値にする。600ms以上の長尺は、面積の大きい装飾的ヒーロー演出など例外に限る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-dotrail eas-slow"></div></div><div class="label">✗ 約600ms以上 → 一拍遅れて「重い・ラグい」</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-dotrail"></div></div><div class="label">✓ 200〜250ms → キビキビ即応する</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/animation-duration/" target="_blank" rel="noopener">Executing UX Animations: Duration and Motion Characteristics – NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.appypie.com/blog/mobile-app-animation-guide" target="_blank" rel="noopener">Mobile App Animation Guide: Timing, Easing, and What Works</a></p>

## 05 — hover だけは直感を逆転させる（速く入って、ゆるく出る）

画面遷移とは逆に、hover は**係合時に即応・離脱時に上品**が正解。マウスを乗せた瞬間（enter）は ~125ms とスナッピーに反応させ、離した後（exit）は ~450ms とゆったり戻す。CSS では基準の transition を要素側に書き、`:hover` 側に短い transition を上書きすると enter だけ速くなる（Comeau 式）。下のカードにカーソルを乗せて違いを確かめてほしい。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-card eas-h-bad">hover me</div></div><div class="label">✗ enter/exit とも 450ms → 反応が鈍く感じる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="eas-card eas-h-good">hover me</div></div><div class="label">✓ enter 125ms / exit 450ms → 即応かつ上品</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/css-transitions/" target="_blank" rel="noopener">An Interactive Guide to CSS Transitions – Josh W. Comeau</a></p>

## 06 — カーブと秒数を Material Design 3 トークンで一元管理する

カーブと秒数を毎回手打ちすると、コンポーネント間で値がばらつき品質が落ちる。Material Design 3 のトークンをそのまま CSS 変数化し、以後は `var()` 参照だけで方向ごとに付け替えるのが堅実だ。standard（汎用 = `cubic-bezier(0.2,0,0,1)`）、emphasized-decelerate（enter）、emphasized-accelerate（exit）の3本を押さえる。M2 standard `cubic-bezier(0.4,0,0.2,1)` と M3 `cubic-bezier(0.2,0,0,1)` は別物なので混在禁止。

<div class="eas-curverow">
  <div class="eas-cv">
    <svg width="120" height="120" viewBox="0 0 100 100"><path d="M0,100 C20,100 0,0 100,0" fill="none" stroke="#16150f" stroke-width="3"/></svg>
    decelerate (enter)
  </div>
  <div class="eas-cv">
    <svg width="120" height="120" viewBox="0 0 100 100"><path d="M0,100 C20,0 0,15 100,0" fill="none" stroke="#16150f" stroke-width="3"/></svg>
    standard (汎用)
  </div>
  <div class="eas-cv">
    <svg width="120" height="120" viewBox="0 0 100 100"><path d="M0,100 C30,100 80,85 100,0" fill="none" stroke="#16150f" stroke-width="3"/></svg>
    accelerate (exit)
  </div>
</div>

<div class="note"><b>ポイント：</b>decelerate は立ち上がりが急で終端がなだらか（=減速）、accelerate は逆で出だしが緩く終端が急（=加速）。曲線の形がそのまま体感に対応する。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/motion/easing-and-duration/tokens-specs" target="_blank" rel="noopener">Easing and duration – Material Design 3</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.mdui.org/en/docs/2/styles/design-tokens" target="_blank" rel="noopener">Design Tokens – MDUI (Material Design 3)</a></p>

## 実装スニペット

再利用トークン。カーブと秒数を一元化し、以後は `var()` 参照だけで方向ごとに付け替える。

```css
:root{
  /* easing tokens (Material Design 3) */
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);          /* 汎用 */
  --ease-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);  /* enter */
  --ease-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);  /* exit */
  /* duration tokens */
  --dur-short: 150ms;   /* micro */
  --dur-base: 250ms;    /* 画面遷移スイートスポット */
  --dur-long: 400ms;    /* hero/modal */
}
```

enter/exit を非対称にしたモーダル。enter 側を長く減速、exit 側を短く加速させる（M2 の enter225ms / exit195ms を踏襲）。

```css
.modal{
  opacity: 0;
  transform: translateY(8px) scale(.98);
  /* exit: 加速・短め */
  transition: opacity 195ms var(--ease-accelerate),
              transform 195ms var(--ease-accelerate);
}
.modal.is-open{
  opacity: 1;
  transform: translateY(0) scale(1);
  /* enter: 減速・長め */
  transition: opacity 225ms var(--ease-decelerate),
              transform 225ms var(--ease-decelerate);
}
```

hover は逆転タイミング（snappy in / relaxed out）。`transform`/`opacity` のみアニメし、`:hover` 側に短い transition を書くと enter が速くなる。

```css
.card{
  will-change: transform;
  transform: translateY(0);
  /* 離脱: ゆるく */
  transition: transform 450ms var(--ease-standard),
              box-shadow 450ms var(--ease-standard);
}
.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,.18);
  /* 係合: 速く */
  transition: transform 125ms var(--ease-standard),
              box-shadow 125ms var(--ease-standard);
}
```

`prefers-reduced-motion` フォールバック（必須）。完全な0ではなく `.01ms` にすると `transitionend` 等の JS フックを壊さず動きだけ消せる。

```css
@media (prefers-reduced-motion: reduce){
  *, *::before, *::after{
    transition-duration: .01ms !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

## チェックリスト

<ul class="check">
  <li>UI の移動に <code>linear</code> を使っていない（スピナー等の等速が正しい例外を除く）</li>
  <li>enter は減速・長め（ease-out, ~225ms）、exit は加速・短め（ease-in, ~195ms）に振り分けた</li>
  <li>アニメ対象は <code>transform</code> / <code>opacity</code> のみ。<code>width</code>/<code>height</code>/<code>top</code>/<code>left</code>/<code>margin</code> を動かしていない</li>
  <li>所要時間は実用100〜400ms、スイートスポット200〜250msに収めた（80ms未満・500ms超を避けた）</li>
  <li>hover は enter ~125ms / exit ~450ms と逆転させた</li>
  <li>カーブと秒数は CSS 変数（M3 トークン）で一元管理。M2 と M3 のカーブを混在させていない</li>
  <li><code>@media (prefers-reduced-motion: reduce)</code> を実装した</li>
  <li>多階層メニューは <code>transition-delay</code> で doom flicker を吸収した</li>
  <li>実機（特に低速端末）で目視確認した</li>
</ul>

## 限界 / 出典

出典の質には差がある。最も確度が高いのは NN/g と MUI（Material 公式実装）で、cubic-bezier 値はここで実トークンとして確認できる。Material 公式（M2/M3）のページ自体は JS レンダリングで本文取得が不安定なため、数値は MUI および mdui ミラー経由で突合した二次確認である点に注意（**M2 standard `cubic-bezier(0.4,0,0.2,1)` と M3 standard `cubic-bezier(0.2,0,0,1)` は別物なので混在禁止**）。Josh Comeau / Collinsworth / SVGator / Appy Pie はブログで、特に hover の 125ms / 450ms や micro 時間帯は経験則であり厳密な実験値ではない。秒数（100〜400ms 中心、Doherty 約400ms）はすべて体感ガイドラインで、移動距離・面積・端末性能で適正値は動くため、最終的には実機での目視調整が前提だ。`linear` は原則 UI 移動では避けるが、無限ローディングスピナーなど等速が正しい例外は存在する。overshoot/bounce（制御点 Y>1）は「organic だが過剰だと安っぽい」両刃で、コーポレート系 UI では多用しないこと。値はいずれも 2026-06 時点。

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/css-transitions/" target="_blank" rel="noopener">An Interactive Guide to CSS Transitions – Josh W. Comeau</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://mui.com/material-ui/customization/transitions/" target="_blank" rel="noopener">Transitions – Material UI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/motion/easing-and-duration/tokens-specs" target="_blank" rel="noopener">Easing and duration – Material Design 3</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.mdui.org/en/docs/2/styles/design-tokens" target="_blank" rel="noopener">Design Tokens – MDUI (Material Design 3)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/animation-duration/" target="_blank" rel="noopener">Executing UX Animations: Duration and Motion Characteristics – NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://joshcollinsworth.com/blog/easing-curves" target="_blank" rel="noopener">Understanding easing and cubic-bezier curves in CSS – Josh Collinsworth</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.svgator.com/blog/easing-functions/" target="_blank" rel="noopener">Easing Functions Explained – SVGator</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.appypie.com/blog/mobile-app-animation-guide" target="_blank" rel="noopener">Mobile App Animation Guide: Timing, Easing, and What Works</a></p>
