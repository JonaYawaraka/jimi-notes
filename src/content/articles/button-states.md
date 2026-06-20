---
title: "ボタンの状態が雑——hover/active/disabled/focusの詰め"
problem: "ボタンのhover/active/disabled/focusを詰め切れず、触り心地が安っぽい。"
category: 細部
tags: [ボタン, 状態, インタラクション]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .bt-btn{position:relative;isolation:isolate;background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;cursor:pointer;transition:background-color 120ms ease}
  .bt-btn::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:#fff;opacity:0;transition:opacity 120ms ease}
  .bt-btn:hover::after{opacity:.08}
  .bt-btn:focus-visible::after{opacity:.10}
  .bt-btn:active::after{opacity:.10}
  .bt-btn:focus:not(:focus-visible){outline:none}

  /* ✗ color-only cheap button */
  .bt-cheap{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;cursor:pointer;transition:all .3s}
  .bt-cheap:hover{background:#7a64bb}
  .bt-cheap:active{background:#8d77ce}

  /* focus ring demos */
  .bt-fbtn{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;cursor:pointer}
  .bt-nofocus:focus{outline:none}
  .bt-thinfocus{outline:1px solid #6750a4;outline-offset:0}
  .bt-ring:focus-visible{outline:3px solid #16150f;outline-offset:2px;box-shadow:0 0 0 6px #f4f2ec}
  .bt-ringnote{font-size:12px;color:#5c5a50}

  /* always-on ring to make the demo visible without tab */
  .bt-ring-bad{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;outline:none}
  .bt-ring-good{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;outline:3px solid #16150f;outline-offset:2px;box-shadow:0 0 0 6px #f4f2ec}

  /* transition timing demos */
  .bt-3d-bad,.bt-3d-good{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;cursor:pointer}
  .bt-3d-bad{transition:transform .3s ease}
  .bt-3d-bad:hover{transform:translateY(-6px)}
  .bt-3d-bad:active{transform:translateY(-6px)}
  .bt-3d-good{transition:transform 600ms cubic-bezier(.3,.7,.4,1);-webkit-tap-highlight-color:transparent}
  .bt-3d-good:hover{transform:translateY(-6px);transition-duration:250ms;transition-timing-function:cubic-bezier(.3,.7,.4,1.5)}
  .bt-3d-good:active{transform:translateY(-2px);transition-duration:34ms}

  /* disabled demos */
  .bt-dis-bad{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;opacity:.25;cursor:pointer}
  .bt-dis-good{background:rgba(22,21,15,.10);color:rgba(22,21,15,.40);border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;cursor:not-allowed}

  /* touch / hover-only demo */
  .bt-touchwrap{display:flex;flex-direction:column;gap:10px;align-items:center;color:#16150f;font-size:12px}
  .bt-hoveronly{background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px;transition:background-color 120ms ease}
  .bt-hoveronly:hover{background:#54407f}
  .bt-statelayer{position:relative;isolation:isolate;background:#6750a4;color:#fff;border:none;border-radius:8px;padding:12px 22px;font-weight:700;font-size:15px}
  .bt-statelayer::after{content:"";position:absolute;inset:0;z-index:-1;border-radius:inherit;background:#fff;opacity:0;transition:opacity 120ms ease}
  .bt-statelayer:hover::after{opacity:.08}
  .bt-statelayer:active::after{opacity:.12}

  /* swatch row showing the MD3 ratios */
  .bt-layers{display:flex;gap:0;border-radius:8px;overflow:hidden}
  .bt-layer{width:64px;height:84px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font-size:11px;font-weight:700;color:#fff;position:relative;background:#6750a4}
  .bt-layer span{position:relative;z-index:1}
  .bt-layer::after{content:"";position:absolute;inset:0;background:#fff}
  .bt-l0::after{opacity:0}.bt-l8::after{opacity:.08}.bt-l10::after{opacity:.10}.bt-l16::after{opacity:.16}
</style>

## 結論

プロは状態を「色をなんとなく変える」では作らない。状態ごとに不透明度・トランジション時間・コントラストを数値で固定し（Material Design 3 は hover 8% / focus 10% / pressed 10% / dragged 16%、disabled は content 38% / container 12%）、focus は `:focus-visible` でキーボード時だけ 2px 厚・隣接色 3:1 のリングを出し、押下は 34–150ms で即応・戻りはゆっくりと非対称に動かす。disabled は色だけでなく cursor や aria でも伝える——この4点を定量化するだけで触り心地は一段プロになる。

## 01 — 状態は色ではなく「不透明度レイヤー」で作る

状態差を `background` の色いじりで作ると、色覚特性や低視力のユーザーに伝わらず、値も場当たりになる。プロは on-color（白）を半透明オーバーレイとして重ねる **state layer 方式**で、hover 8% / pressed 10% / focus 10% / dragged 16% と比率を固定する。1レイヤーで全状態を一貫管理でき、design token 化すれば全ボタンで揃う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-cheap">hover してみて</button></div><div class="label">✗ background を別の紫に差し替え＝感覚で作った色、伝達は色のみ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-statelayer">hover してみて</button></div><div class="label">✓ 白オーバーレイ hover 8% / active 12% を重畳＝比率が固定</div></div>
</div>

<div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="bt-layers"><div class="bt-layer bt-l0"><span>0%</span></div><div class="bt-layer bt-l8"><span>hover<br>8%</span></div><div class="bt-layer bt-l10"><span>press<br>10%</span></div><div class="bt-layer bt-l16"><span>drag<br>16%</span></div></div></div><div class="label">MD3 の state layer 不透明度を可視化（白オーバーレイの重なり）</div></div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states/state-layers" target="_blank" rel="noopener">States (State layers) — Material Design 3</a></p>

## 02 — focus は `:focus-visible` でゲートし、消すなら代わりを置く

最も典型的な「雑」サインが `button:focus{outline:none}` の裸書きだ。代替なしでアウトラインを消すとキーボード操作者が現在地を見失い、WCAG 2.4.7 違反になる。上書きした瞬間、3:1 確保の義務が自分に移る。正解は `:focus-visible` でキーボード時のみリングを出し、マウスクリック時の残留リングは `:focus:not(:focus-visible)` で抑える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-ring-bad">outline:none（裸）</button></div><div class="label">✗ アウトラインを消しただけ＝キーボードで現在地が消える・2.4.7違反</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-ring-good">focus リングあり</button></div><div class="label">✓ 二色リングを代替として付与＝任意背景でも現在地が見える</div></div>
</div>

<div class="note"><b>ポイント：</b>下のボタンを実際に Tab で辿ると、マウスクリック時はリングが出ず、キーボード時のみ出るのが分かる（<code>:focus-visible</code> の挙動）。</div>

<div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-fbtn bt-ring">Tab で辿ってみて</button></div><div class="label">✓ クリックでは無音、キーボードでだけリング点灯</div></div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" target="_blank" rel="noopener">:focus-visible — MDN</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://testparty.ai/blog/wcag-focus-appearance-minimum" target="_blank" rel="noopener">WCAG 2.4.11 Focus Appearance Minimum — TestParty</a></p>

## 03 — focus リングは「2px 厚相当・隣接色 3:1」を満たす

リングを出してもペラペラの 1px・低コントラストでは低視力ユーザーに見えない。WCAG 2.4.13 は焦点表示に「2px 厚の周長と同等以上の面積」かつ focused/unfocused 間 3:1 を要求する。solid なら 2px、dashed/dotted は約 4px、内側 outline は 3px 以上。色だけでなく stroke/outline の太さで示し、比率は四捨五入せず計算する（2.999:1 は不合格）。任意背景に効かせるには outline + box-shadow の二色リングが堅い。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-fbtn bt-thinfocus" style="outline:1px solid #b3a7d6;outline-offset:0">1px 同系色リング</button></div><div class="label">✗ 1px・紫に近い色＝面積も色差も足りず見落とされる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-ring-good">3px ＋ 二色リング</button></div><div class="label">✓ outline 3px ＋ box-shadow 6px＝2px厚超・隣接3:1を満たす</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" target="_blank" rel="noopener">Understanding SC 2.4.13: Focus Appearance — W3C</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">Designing accessible WCAG-conformant focus indicators — Sara Soueidan</a></p>

## 04 — トランジションは非対称に。押下は即応、戻りはゆっくり

`transition:all .3s` で全状態をまとめて処理すると、押下が鈍く感じてユーザーが連打する。プロは時間を状態ごとに分ける——押下フィードバックは 34–150ms で即応、hover は 250ms 前後、戻り（equilibrium）は 600ms とゆっくり。Josh Comeau の 3D ボタンは active 34ms（60fps で約2フレーム）/ hover 250ms / 戻り 600ms と非対称に設計し、これが「押した感」を生む。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-3d-bad">hover / 押してみて</button></div><div class="label">✗ transition:all .3s で一括＝押下も戻りも 300ms、反応が鈍い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-3d-good">hover / 押してみて</button></div><div class="label">✓ active 34ms / hover 250ms / 戻り 600ms＝即応かつ滑らか</div></div>
</div>

<div class="note"><b>注意：</b>34/250/600ms や cubic-bezier 値は特定の作例の数字であって絶対基準ではない。守るべきは「非対称に・押下は短く・戻りは長く」という原則のほう。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/3d-button/" target="_blank" rel="noopener">Building a Magical 3D Button — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.nngroup.com/articles/button-states-communicate-interaction/" target="_blank" rel="noopener">Button States: Communicate Interaction — NN/g</a></p>

## 05 — disabled は色以外でも伝え、薄くしすぎない

disabled は 3:1 コントラスト義務から免除されるので低 opacity で構わない——が、`opacity:.25` でボタンごと消すのは雑だ。文面が読めなければ何のボタンか分からない。Material は content 38% / container 12% で「読めるが押せない」を担保する。さらに `cursor:not-allowed` と、必要なら `aria-disabled="true"`（タブ順を保ちつつ SR に無効と読ませる）で非色チャネルも併用する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-dis-bad">送信する</button></div><div class="label">✗ opacity:.25 でラベルごと判読不能＝何のボタンか消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="bt-dis-good">送信する</button></div><div class="label">✓ container 12% / content 38% ＋ not-allowed＝読めるが押せない</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/designing-button-states/" target="_blank" rel="noopener">Designing button states: best practices — LogRocket</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast — W3C WAI</a></p>

## 06 — hover を唯一の信号にしない（タッチ／キーボード対策）

hover だけで状態を伝えると、タッチ端末は default→active へ直行して hover を飛ばし、キーボードにもそもそも hover が無い。hover 単独依存はモバイルとキーボードで状態が消える。hover はあくまで一信号に留め、active と focus を独立して必ず用意する。下の左は hover でしか色が変わらず、タップでは何も起きない例。右は hover も active も同じ state layer で重畳されるので、タッチでも押下が伝わる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="bt-touchwrap"><button class="bt-hoveronly">hover 専用</button><span>タップ／キーボードでは無反応</span></div></div><div class="label">✗ hover だけで色変化＝タッチ・キーボードで状態が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="bt-touchwrap"><button class="bt-statelayer">hover ＋ active</button><span>押下でも即フィードバック</span></div></div><div class="label">✓ hover 8% / active 12% を別々に定義＝どの入力でも反応</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states" target="_blank" rel="noopener">States — Material Design 3</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/button-states/" target="_blank" rel="noopener">Button States Explained: Complete Design Guide 2026 — UXPin</a></p>

## 実装スニペット

状態レイヤー方式の基本ボタン（MD3 比率）。色を直接いじらず1レイヤーで全状態を管理する。

```css
.btn{
  position:relative; isolation:isolate;
  --on:255 255 255; /* on-color RGB */
  background:#6750a4; color:#fff;
  border:none; border-radius:8px; padding:12px 20px;
  cursor:pointer;
  transition:background-color 120ms ease;
}
.btn::after{ /* state layer overlay */
  content:""; position:absolute; inset:0; z-index:-1;
  border-radius:inherit;
  background:rgb(var(--on)); opacity:0;
  transition:opacity 120ms ease;
}
.btn:hover::after{opacity:.08}        /* hover 8%  */
.btn:focus-visible::after{opacity:.10}/* focus 10% */
.btn:active::after{opacity:.10}       /* pressed 10% */
```

WCAG 準拠の堅牢な focus リング（任意背景・強制カラー対応）。

```css
.btn:focus-visible{
  outline:3px solid #000;
  outline-offset:2px;
  box-shadow:0 0 0 6px #fff; /* 二色リングで任意背景に効く */
}
/* マウスクリック時はリングを出さない */
.btn:focus:not(:focus-visible){outline:none}
@media (forced-colors: active){
  .btn:focus-visible{outline-color:CanvasText}
}
```

disabled の正しい伝達（色以外の信号も付与）。

```css
.btn:disabled,
.btn[aria-disabled="true"]{
  background:rgba(0,0,0,.12);  /* container 12% */
  color:rgba(0,0,0,.38);       /* content 38% */
  cursor:not-allowed;
  box-shadow:none;
}
/* aria-disabled はクリックだけ無効化しフォーカスは維持 */
.btn[aria-disabled="true"]{pointer-events:none}
```

反応の良い押下感（非対称トランジション・CTA 向け）。

```css
.btn{
  transition:transform 600ms cubic-bezier(.3,.7,.4,1); /* 戻りはゆっくり */
  -webkit-tap-highlight-color:transparent;
}
.btn:hover{
  transform:translateY(-6px);
  transition-duration:250ms;
  transition-timing-function:cubic-bezier(.3,.7,.4,1.5); /* springy */
}
.btn:active{
  transform:translateY(-2px);
  transition-duration:34ms; /* 押下は即応 */
}
```

## チェックリスト

<ul class="check">
  <li>default / hover / active / focus / disabled の5状態すべてを定義したか（hover 単独依存になっていないか）</li>
  <li>状態差を色だけで作っていないか（hover=オーバーレイ、focus=outline、disabled=cursor＋opacity など非色チャネルを併用）</li>
  <li>`outline:none` を書いたなら、必ず `:focus-visible` の代替リングをセットにしたか</li>
  <li>focus リングは 2px 厚相当（solid 2px / dashed 4px / inner 3px）かつ隣接色 3:1 を満たすか（四捨五入せず計算）</li>
  <li>`transition:all .3s` で一括していないか。押下 34–150ms / 戻りはゆっくり、と非対称になっているか</li>
  <li>ラベル文字は default だけでなく暗転 hover / pressed でも 4.5:1（AA）を保つか</li>
  <li>disabled のテキストは判読可能か（content 38% 目安、消えるほど薄くしていないか）</li>
  <li>SR に無効を伝えたいなら `aria-disabled="true"`、タブ順から外したいなら native `disabled` と使い分けたか</li>
  <li>タッチ端末のヒットエリアは 44×44px 以上あるか</li>
</ul>

## 限界 / 出典

<div class="note"><b>数値の重みは出自で違う：</b>state layer の不透明度（8/10/10/16%、38/12%）は Material Design 3 固有のデザイン言語であって WCAG のような法準拠基準ではない——他のデザインシステムは別値でよい。Josh Comeau の 34/250/600ms や cubic-bezier 値も特定の 3D ボタン作例の数字で、絶対基準ではなく「非対称に・押下は短く・戻りは長く」という原則として転用する。一方、コントラスト系（3:1・4.5:1・2px 厚・44×44px）は WCAG の実測基準で、ここは厳守対象。<code>aria-disabled</code> と native <code>disabled</code> は挙動が異なり（前者はフォーカス維持＋クリック無効化を別途実装、後者はタブ順から除外）、用途で使い分ける——どちらが正解という単純な話ではない。focus 免除 / hover 免除は「ブラウザ既定 outline を使う前提」の話で、見た目を上書きした瞬間に 3:1 義務が作者へ移る。SC 2.4.13 は AAA のため法的必須でない案件が多い一方、上書きする限り AA の 2.4.7 / 1.4.11 は実質必須。各値は 2026年6月時点の各ソース記載に基づく。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states/state-layers" target="_blank" rel="noopener">States (State layers) — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states" target="_blank" rel="noopener">States — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" target="_blank" rel="noopener">Understanding SC 2.4.13: Focus Appearance — W3C</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast — W3C WAI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible" target="_blank" rel="noopener">:focus-visible — MDN</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">Designing accessible WCAG-conformant focus indicators — Sara Soueidan</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/3d-button/" target="_blank" rel="noopener">Building a Magical 3D Button — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.nngroup.com/articles/button-states-communicate-interaction/" target="_blank" rel="noopener">Button States: Communicate Interaction — NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/designing-button-states/" target="_blank" rel="noopener">Designing button states: best practices — LogRocket</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/button-states/" target="_blank" rel="noopener">Button States Explained: Complete Design Guide 2026 — UXPin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://testparty.ai/blog/wcag-focus-appearance-minimum" target="_blank" rel="noopener">How Do You Meet WCAG 2.4.11 Focus Appearance Minimum — TestParty</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.pope.tech/2026/03/04/a-guide-to-accessible-focus-indicators/" target="_blank" rel="noopener">A guide to accessible focus indicators — Pope Tech</a></p>
