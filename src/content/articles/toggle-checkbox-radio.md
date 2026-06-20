---
title: "チェック類が安っぽい——トグル/チェック/ラジオ"
problem: "選択UIの当たり判定や状態表現が雑。"
category: 細部
tags: [フォーム, トグル, 選択]
date: 2026-06-20
sources: 13
draft: false
---

<style>
  /* ===== Toggle / Check / Radio demos ===== */
  .tog-row{display:flex;flex-direction:column;gap:14px;align-items:flex-start}

  /* --- OFF枠コントラスト: ヘアライン vs 明確な暗値 --- */
  .tog-box{width:26px;height:26px;border-radius:5px;background:var(--paper);box-sizing:border-box}
  .tog-box-bad{border:1px solid rgba(22,21,15,.08)}      /* ほぼ白のヘアライン枠 */
  .tog-box-good{border:2px solid rgba(22,21,15,.55)}     /* #16150f 約54% */
  .tog-lbl{display:flex;align-items:center;gap:10px;color:#16150f;font-weight:600;font-size:14px}

  /* --- on色 彩度/コントラスト --- */
  .tog-track{position:relative;width:52px;height:32px;border-radius:16px;flex:none}
  .tog-thumb{position:absolute;top:4px;right:4px;width:24px;height:24px;border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3)}
  .tog-track-bad{background:#cdbfe6}                      /* 低彩度・低コントラストon色 */
  .tog-track-good{background:#6200ee}                     /* 高彩度アクセント */

  /* --- ヒット領域 可視化 --- */
  .tog-hit{position:relative;display:inline-flex;align-items:center;justify-content:center}
  .tog-hit::after{content:"";position:absolute;border:1.5px dashed var(--accent);border-radius:8px}
  .tog-hit-bad::after{width:16px;height:16px}            /* グリフ=ヒット領域 */
  .tog-hit-good::after{width:48px;height:48px}           /* 48px拡張 */
  .tog-glyph{width:16px;height:16px;border-radius:4px;background:#6200ee;flex:none}

  /* --- 状態レイヤー --- */
  .tog-sl{position:relative;display:inline-grid;place-items:center;width:48px;height:48px}
  .tog-sl::before{content:"";position:absolute;inset:0;border-radius:50%;background:#6200ee;pointer-events:none}
  .tog-sl-bad::before{opacity:0}                         /* レイヤーなし=平板 */
  .tog-sl-good::before{opacity:.10}                      /* focus/pressed 0.10相当 */
  .tog-sl .tog-glyph{position:relative}

  /* --- focusリング --- */
  .tog-foc{width:26px;height:26px;border-radius:5px;background:#6200ee}
  .tog-foc-bad{outline:none}
  .tog-foc-good{outline:3px solid #6200ee;outline-offset:3px}

  /* --- 色だけ vs 位置+ラベル --- */
  .tog-sw{position:relative;width:52px;height:32px;border-radius:16px;flex:none}
  .tog-sw .tog-thumb{transition:none}
  .tog-sw-bad{background:#9e9e9e}                         /* 位置同じ・色だけ */
  .tog-sw-bad .tog-thumb{left:4px;right:auto}
  .tog-sw-good{background:#6200ee}
  .tog-sw-labels{display:flex;align-items:center;gap:8px;color:#16150f;font-size:12px;font-weight:700}

  /* --- サム拡大 --- */
  .tog-th2{position:absolute;top:50%;transform:translateY(-50%);border-radius:50%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.3)}
  .tog-th-bad{width:16px;height:16px;right:8px}           /* 固定16px */
  .tog-th-good{width:24px;height:24px;right:4px}          /* 24pxへ拡大 */
</style>

## 結論

プロは「見えるグリフ」と「当たり判定」を分離して設計する。グリフは18〜24pxでも、タップ領域はpaddingや透明な疑似要素でWCAG最低24px・推奨44〜48pxまで広げ、off/on/disabled/focusの全状態を数値で組む。鍵は、各状態の輪郭・チェックマーク・サムが隣接色に対しWCAG 1.4.11の3:1コントラストを個別に満たすこと、on色を高彩度にすること、そしてMaterial 3の円形状態レイヤー（hover .08 / focus .10 / pressed .10）で触感を足すことだ。

## 01 — off枠は「見える暗値」にする（ヘアライン禁止）

安っぽさの最頻原因が、未選択枠をほぼ白の細線にすることだ。背景に対し3:1未満ならWCAG 1.4.11（非テキストコントラスト）違反で、そもそもコントロールが「ある」ことすら伝わらない。Materialは未選択チェックボックス枠を `#000` の54%、offトラックを38%という明確な暗値で描く。淡いグレー枠を引きたくなったら、必ずコントラストを計測する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-row"><span class="tog-lbl"><span class="tog-box tog-box-bad"></span>利用規約に同意する</span><span class="tog-lbl"><span class="tog-box tog-box-bad"></span>メール通知を受け取る</span></div></div><div class="label">✗ ほぼ白のヘアライン枠（3:1未満）→ 枠が消えて存在感ゼロ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-row"><span class="tog-lbl"><span class="tog-box tog-box-good"></span>利用規約に同意する</span><span class="tog-lbl"><span class="tog-box tog-box-good"></span>メール通知を受け取る</span></div></div><div class="label">✓ #16150f 約54%・2px枠 → 未選択でもはっきり見える</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast | W3C WAI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.mdui.org/en/design/1/components/selection-controls.html" target="_blank" rel="noopener">Selection controls - Material Design</a></p>

## 02 — on色は高彩度・高コントラストにする

NN/gが挙げる最頻の失敗が、低彩度・低コントラストのon色だ。on色がぼんやりしていると、on/offが判別できず一気に安く見える。Materialはサムをアクセント色（Swatch 500）100%、トラックを同色50%にして高コントラストを確保する。ダークテーマでは、より明るいSwatch 200側へ寄せてコントラストを維持する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-track tog-track-bad"><span class="tog-thumb"></span></div></div><div class="label">✗ 低彩度の薄紫トラック → onなのに「効いている」感が出ない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-track tog-track-good"><span class="tog-thumb"></span></div></div><div class="label">✓ 高彩度アクセント（#6200ee）→ 状態が一目で伝わる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/toggle-switch-guidelines/" target="_blank" rel="noopener">Toggle-Switch Guidelines - NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/switch/specs" target="_blank" rel="noopener">Switch – Material Design 3</a></p>

## 03 — ヒット領域は見えるグリフと分離して44〜48px確保

ネイティブのcheckbox/radioは約13〜16px。これはWCAG 2.5.8 AA（24px）すら満たさず、押しづらさが「雑な作り」として伝わる。プロはグリフを小さく保ったまま、paddingや透明な疑似要素で当たり判定だけを44〜48pxへ広げる（Apple 44px・Material 48dp・Fluent 40px）。リスト状に並ぶ場合は隣接間を約10px以上空け、誤タップを防ぐ。下のデモは破線でヒット領域を可視化している。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-hit tog-hit-bad"><span class="tog-glyph"></span></span></div><div class="label">✗ ヒット領域=グリフ16px → 指で押すと外す（WCAG 2.5.8未達）</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-hit tog-hit-good"><span class="tog-glyph"></span></span></div><div class="label">✓ グリフ16pxのまま当たり判定48px（破線）→ 確実に押せる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" target="_blank" rel="noopener">Understanding SC 2.5.8 Target Size (Minimum) | W3C WCAG 2.2</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://support.google.com/accessibility/android/answer/7101858?hl=en" target="_blank" rel="noopener">Touch target size — Android Accessibility Help</a></p>

## 04 — 円形の状態レイヤーで触感を足す

「高級な手応え」の正体が、Material 3の状態レイヤーだ。コントロール上にon色の円形オーバーレイを重ね、hover .08 / focus .10 / pressed .10 / dragged .16 という低不透明度で反応を表現する（同時に1状態のみ）。この層を省くと反応が平板になり、それ自体が安っぽさの主因になる。`:has()` を使えば兄弟構造に縛られず親ラッパーから実装できる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-sl tog-sl-bad"><span class="tog-glyph"></span></span></div><div class="label">✗ 状態レイヤーなし → hover/pressでも無反応・平板</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-sl tog-sl-good"><span class="tog-glyph"></span></span></div><div class="label">✓ on色の円形レイヤー .10 → 触れている手応えが出る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states/state-layers" target="_blank" rel="noopener">States / State layers — Material Design 3</a></p>

## 05 — focusリングは消さず、太め+offsetで自前可視化

`outline:none` でフォーカス表示を消すと、キーボード操作者が現在地を失い操作不能になる（WCAG違反）。デフォルトのfocusリングはコントラスト免除だが、上書きした瞬間に「隣接色に3:1のリングを自前で出す」責務が発生する。`:focus-visible` でゲートすればマウスクリックでは出さず、キーボード時だけ太め（3px）+ offsetのリングを出せる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-foc tog-foc-bad"></span></div><div class="label">✗ outline:none → キーボードで「今どこ？」が分からない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tog-foc tog-foc-good"></span></div><div class="label">✓ 3px solid + offset 3px → :focus-visibleでキーボード時のみ表示</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/" target="_blank" rel="noopener">Inclusively Hiding &amp; Styling Checkboxes and Radio Buttons | Sara Soueidan</a></p>

## 06 — 状態は「色だけ」に頼らず、位置とラベルでも伝える

色のみのon/off表現は、色覚特性やWindows High Contrast Modeで破綻する。トグルはサム位置の移動＋色変化の二重表現にし、必要ならOn/Offラベルを左右に添える。さらにサムは未選択16px→選択24pxへ拡大すると、サイズという非色の手がかりも加わる（固定サイズのままは手抜きの典型サイン）。背景画像や影は強制色モードで無視されるため、状態は実SVGのstroke/fillで描くのが安全だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-sw tog-sw-bad"><span class="tog-thumb"></span></div></div><div class="label">✗ サム位置は同じで色だけ変化 → 強制色モードで状態消失</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tog-sw-labels">Off<div class="tog-sw tog-sw-good"><span class="tog-thumb"></span></div>On</div></div><div class="label">✓ サム位置の移動＋ラベル＋色 → 色なしでも判別できる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/toggle-switch-guidelines/" target="_blank" rel="noopener">Toggle-Switch Guidelines - NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/" target="_blank" rel="noopener">Inclusively Hiding &amp; Styling Checkboxes and Radio Buttons | Sara Soueidan</a></p>

## 実装スニペット

ネイティブinputは `display:none` ではなく、物理的に残したまま真上に重ねるのが定石。SVG/疑似要素を `:checked` / `:focus-visible` で切り替える。

カスタムトグルスイッチ（ヒット領域48px・高コントラストon色・サム16→24px拡大）：

```css
.switch{display:inline-flex;align-items:center;position:relative;
  /* 見えるトラックは52x32だが、最小48pxのタップ領域をpaddingで確保 */
  min-width:48px;min-height:48px;justify-content:center;cursor:pointer}
.switch input{position:absolute;opacity:0;width:1em;height:1em;margin:0}
.switch .track{width:52px;height:32px;border-radius:16px;
  background:rgba(0,0,0,.38);              /* OFFトラック: #000 38% = 3:1確保 */
  transition:background .2s ease}
.switch .thumb{position:absolute;left:4px;top:50%;transform:translateY(-50%);
  width:16px;height:16px;border-radius:50%;background:#FAFAFA; /* 未選択16px */
  box-shadow:0 1px 2px rgba(0,0,0,.3);
  transition:transform .2s ease,width .2s ease,height .2s ease}
.switch input:checked ~ .track{background:rgba(98,0,238,.5)}      /* アクセント色50% */
.switch input:checked ~ .thumb{transform:translateY(-50%) translateX(20px);
  width:24px;height:24px;background:#6200EE}                      /* 選択で24pxに拡大+彩度高い色 */
.switch input:disabled ~ .track{background:rgba(0,0,0,.12)}
.switch input:disabled ~ .thumb{background:#BDBDBD}
.switch input:focus-visible ~ .track{outline:3px solid #6200EE;outline-offset:3px}
```

アクセシブルなカスタムチェックボックス（input非表示＋SVG＋focus-visible＋forced-colors）：

```css
.check{display:inline-flex;align-items:center;gap:.5em;cursor:pointer;
  min-height:24px}                          /* WCAG 2.5.8 AA: 24px最小 */
.check input{position:absolute;opacity:0;width:1em;height:1em}
.check svg{width:1.25em;height:1.25em;flex:none;
  transition:all .1s linear}
.check svg .box{fill:none;stroke:rgba(0,0,0,.54);stroke-width:2}  /* 未選択枠: #000 54% で3:1 */
.check svg .tick{stroke:#fff;stroke-width:3;stroke-linecap:round;
  stroke-linejoin:round;opacity:0}
.check input:checked + svg .box{fill:#6200EE;stroke:#6200EE}     /* 選択塗りは彩度高い色 */
.check input:checked + svg .tick{opacity:1}
.check input:disabled + svg .box{stroke:rgba(0,0,0,.26)}        /* disabledは明確に減光 */
.check input:focus-visible + svg{outline:3px solid #6200EE;outline-offset:2px}
.check input:focus:not(:focus-visible) + svg{outline:none}
@media (forced-colors:active){
  .check svg .box{stroke:windowText}
  .check input:checked + svg .tick{stroke:highlight}}
/* HTML: <label class=check><input type=checkbox>
   <svg aria-hidden=true focusable=false><rect class=box .../><polyline class=tick .../></svg>ラベル</label> */
```

ヒット領域だけ広げる軽量版（グリフ20pxのまま透明な::afterで44px確保・SVG不要）：

```css
.opt{position:relative;display:inline-flex;align-items:center;gap:8px}
.opt input{appearance:none;width:20px;height:20px;margin:0;
  border:2px solid rgba(0,0,0,.54);border-radius:4px;  /* 見える枠は20px・3:1 */
  position:relative;cursor:pointer}
/* 透明な疑似要素でクリック領域を44pxに拡張 */
.opt input::after{content:"";position:absolute;
  top:50%;left:50%;transform:translate(-50%,-50%);
  width:44px;height:44px}
.opt input:checked{background:#6200EE;border-color:#6200EE}
.opt input:checked::before{content:"";position:absolute;
  left:5px;top:1px;width:5px;height:10px;border:solid #fff;
  border-width:0 2px 2px 0;transform:rotate(45deg)}
.opt input:focus-visible{outline:3px solid #6200EE;outline-offset:2px}
.opt + .opt{margin-top:10px}    /* 隣接コントロール間の最小間隔 */
```

状態レイヤー（hover/focus/pressed）を `:has()` で実装するオーバーレイ（トグル/チェック/ラジオ共通）：

```css
.sc{position:relative;display:inline-grid;place-items:center;
  width:48px;height:48px}                 /* Material 48dpタップ領域 */
.sc::before{content:"";position:absolute;inset:0;border-radius:50%;
  background:#6200EE;opacity:0;                   /* on色の円形レイヤー */
  transition:opacity .15s ease;pointer-events:none}
.sc:hover::before{opacity:.08}                   /* hover 0.08 */
.sc:has(input:focus-visible)::before{opacity:.10}/* focus 0.10 */
.sc:active::before{opacity:.10}                  /* pressed 0.10 */
```

## チェックリスト

<ul class="check">
  <li>off枠・チェックマーク・選択時の塗り・サム/トラック・focusリングが、それぞれ隣接色に対し3:1以上（WCAG 1.4.11）か計測したか</li>
  <li>未選択枠を「ほぼ白のヘアライン」にしていないか（Material参考値: off枠 #000 54% / offトラック 38%）</li>
  <li>on色は高彩度・高コントラストか（サム=アクセント色100% / トラック同色50%）</li>
  <li>当たり判定をグリフと分離し、最低24px・推奨44〜48px確保したか（padding/透明::after/&lt;label&gt;包含）</li>
  <li>リスト状の選択肢で、隣接コントロール間を約10px以上空けたか</li>
  <li>hover .08 / focus .10 / pressed .10 の円形状態レイヤーを入れたか</li>
  <li>focusを上書きしたなら、:focus-visibleで太め+offsetの3:1リングを自前で出しているか</li>
  <li>状態を色だけでなく、サム位置の移動・サイズ拡大（16→24px）・On/Offラベルでも伝えているか</li>
  <li>ネイティブinputをdisplay:noneで消さず、opacity:0で物理的に残したか</li>
  <li>背景画像/影でなく実SVGのstroke/fillで描き、@media (forced-colors:active)に対応したか</li>
  <li>コントロール種別は正しいか（トグル=即時2択 / チェック=複数選択・送信前提 / ラジオ=排他単一）</li>
</ul>

## 限界 / 出典

掲載した数値は各デザインシステムの既定値だ。ブランドカラーに合わせる際は、必ずコントラスト計測ツールで各状態の3:1を再検証すること（特にアクセント色が淡い場合、on色やfocusリングが3:1を割りやすい）。Material色値の一部は1次の m3.material.io でなくミラー（mdui.org）由来で、Material 2系の値を含むため最新M3トークンと微差がある可能性がある。タップ領域はWCAG 24px（AA）が法的最低だが、実機操作品質ではApple 44px / Material 48dpが事実上の基準で、LP/バナーのモバイル前提なら44〜48pxを推奨する。`:has()`・`accent-color`・`forced-colors` は2024〜2026年のモダンブラウザ前提で、レガシー対応が必要なら `:checked` 兄弟セレクタや `-ms-high-contrast` のフォールバックを残すこと。disabledと未上書きのデフォルトfocusリングはコントラスト免除だが、focusを上書きした瞬間に3:1責務が発生する点に注意。URLの生存性・最新性は本稿執筆時点で未確認。

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast | W3C WAI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html" target="_blank" rel="noopener">Understanding SC 2.5.8 Target Size (Minimum) | W3C WCAG 2.2</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html" target="_blank" rel="noopener">Understanding SC 2.5.5 Target Size (Enhanced) | W3C WCAG 2.2</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/switch/specs" target="_blank" rel="noopener">Switch – Material Design 3</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.mdui.org/en/design/1/components/selection-controls.html" target="_blank" rel="noopener">Selection controls - Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/foundations/interaction/states/state-layers" target="_blank" rel="noopener">States / State layers — Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/toggle-switch-guidelines/" target="_blank" rel="noopener">Toggle-Switch Guidelines - NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.sarasoueidan.com/blog/inclusively-hiding-and-styling-checkboxes-and-radio-buttons/" target="_blank" rel="noopener">Inclusively Hiding &amp; Styling Checkboxes and Radio Buttons | Sara Soueidan</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://support.google.com/accessibility/android/answer/7101858?hl=en" target="_blank" rel="noopener">Touch target size — Android Accessibility Help</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/" target="_blank" rel="noopener">All accessible touch target sizes — LogRocket Blog</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.accessibilitychecker.org/wcag-guides/all-touch-targets-must-be-24px-large-or-leave-sufficient-space/" target="_blank" rel="noopener">All touch targets must be 24px large… — AccessibilityChecker</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.eleken.co/blog-posts/checkbox-ux" target="_blank" rel="noopener">Checkbox UX: Best Practices, Common Mistakes &amp; Design Tips</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/animation/css-transitions/" target="_blank" rel="noopener">An Interactive Guide to CSS Transitions • Josh W. Comeau</a></p>
