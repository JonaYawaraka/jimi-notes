---
title: "重なりがバグる——z-indexとレイヤー管理"
problem: "z-indexを場当たりで盛って破綻する。"
category: レイアウト
tags: [z-index, 重なり, スタッキング]
date: 2026-06-20
sources: 11
draft: false
---

<style>
  .zin-stage{position:relative;width:170px;height:140px}
  .zin-box{position:absolute;width:96px;height:64px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:#16150f}
  .zin-header{top:10px;left:10px;background:#cdb98a;z-index:2;color:#16150f}
  .zin-main{top:46px;left:38px;width:120px;height:80px;background:var(--paper);border:1px solid var(--line);color:#5c5a50;font-size:11px;align-items:flex-start;justify-content:flex-start;padding:6px}
  .zin-tip{top:62px;left:54px;background:var(--accent);color:#f4f2ec;z-index:999999;width:90px;height:44px;font-size:12px}
  .zin-iso{isolation:isolate}

  /* section 02 — isolation */
  .zin-card{position:relative;width:130px;height:96px;background:var(--paper);border:1px solid var(--line);border-radius:10px;color:#16150f}
  .zin-card-leak{/* no isolation: badge escapes into page war */}
  .zin-badge{position:absolute;top:-10px;right:-10px;width:38px;height:38px;border-radius:50%;background:var(--accent);color:#f4f2ec;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;z-index:50}
  .zin-sibling{position:absolute;top:18px;left:-14px;width:60px;height:60px;border-radius:8px;background:#16150f;color:#f4f2ec;display:flex;align-items:center;justify-content:center;font-size:10px;z-index:40}

  /* section 03 — token ladder */
  .zin-ladder{display:flex;flex-direction:column;gap:5px;width:160px}
  .zin-rung{display:flex;justify-content:space-between;align-items:center;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:600;color:#f4f2ec}
  .zin-rung b{font-variant-numeric:tabular-nums;opacity:.7;font-weight:700}
  .zin-magic span{display:block;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;color:#f4f2ec;margin-bottom:5px;background:#7a5b52}

  /* section 04 — elevation vs z-index */
  .zin-elev{position:relative;width:120px;height:90px;border-radius:10px;background:var(--paper);color:#16150f;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;text-align:center}
  .zin-e-flat{box-shadow:0 1px 2px rgba(20,18,12,.10)}
  .zin-e-pop{box-shadow:0 6px 12px rgba(20,18,12,.14)}
  .zin-e-broken{box-shadow:0 12px 24px rgba(20,18,12,.20);position:absolute;top:14px;left:14px;z-index:1}
  .zin-e-under{position:absolute;top:42px;left:60px;width:110px;height:70px;border-radius:10px;background:#16150f;color:#f4f2ec;display:flex;align-items:flex-start;justify-content:flex-end;padding:6px;font-size:10px;z-index:2;box-shadow:0 1px 2px rgba(20,18,12,.10)}

  /* section 05 — top layer */
  .zin-tl-stage{position:relative;width:170px;height:140px}
  .zin-tl-page{position:absolute;inset:0;border-radius:8px;background:var(--paper-2);border:1px solid var(--line)}
  .zin-tl-head{position:absolute;top:8px;left:8px;right:8px;height:26px;border-radius:6px;background:#cdb98a;color:#16150f;display:flex;align-items:center;padding:0 10px;font-size:11px;font-weight:700;z-index:5}
  .zin-tl-modal{position:absolute;top:46px;left:24px;width:122px;height:74px;border-radius:8px;background:#16150f;color:#f4f2ec;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}
  .zin-tl-trap{z-index:1}
  .zin-tl-win{z-index:99}
</style>

## 結論

z-index が効かないとき、プロは数字を見ない——「この要素はどのスタッキングコンテキストに閉じ込められているか」を疑う。z-index は同じコンテキスト内の兄弟としか比較されないローカルな値なので、親の `opacity:0.99` や `transform` が作ったコンテキストの中では `z-index:999999` でも外には出られない。解は2つ——`isolation:isolate` で副作用ゼロのコンテキストを意図的に作り、すべての z-index は CSS変数の命名トークン階段から引く。そして「elevation（影＝奥行きの見た目）」と「z-index（重なり順）」を別物として設計する。

## 01 — まず「どのフォルダに閉じ込められたか」を疑う

ブラウザはまず親コンテキスト（フォルダ）を並べ、その中で子（紙）を並べる。だから子は別フォルダの紙の間に割り込めない。`tooltip:999999` が `header:2` の下に潜るのは、親 `main` に `position:relative; z-index:1` が付いてツールチップがローカルコンテキストに封印されているから。数字を上げる前に、効かない要素の祖先を DevTools で遡って `opacity<1` / `transform` / `position:fixed` を探すのが第一手。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-stage"><div class="zin-box zin-header">header z:2</div><div class="zin-box zin-main">main · z:1<br>(opacity:.99)<div class="zin-box zin-tip" style="position:absolute">tip z:999999</div></div></div></div><div class="label">✗ 親mainが opacity:.99 でコンテキスト化 → tipは999999でもmain内に封印され、headerの下</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-stage"><div class="zin-box zin-header">header z:2</div><div class="zin-box zin-main" style="opacity:1">main · z:1<br>(opacity:1)</div><div class="zin-box zin-tip" style="top:62px;left:54px">tip z:5</div></div></div><div class="label">✓ 余計なコンテキストを外す → tipはたった z:5 でheaderの上に出る</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/stacking-contexts/" target="_blank" rel="noopener">What The Heck, z-index?? — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context" target="_blank" rel="noopener">Stacking context — MDN Web Docs</a></p>

## 02 — コンテキストは isolation:isolate で意図的に作る

`opacity:0.99` や `transform:translateX(0)`（実質no-op）でうっかりコンテキストを作るのをやめ、`isolation:isolate` を使う。これは「新しいスタッキングコンテキストを作る」だけの仕事をし、視覚的副作用ゼロ・`position` 不要・z-index値の指定も不要。コンポーネント内部の重なりをローカルに閉じ込められるので、外側の z-index 戦争に巻き込まれない再利用可能な部品になる。z-index 自体は `!important` と同じ「最後の手段」と捉える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-card zin-card-leak"><div class="zin-sibling">隣のUI<br>z:40</div><div class="zin-badge">NEW</div></div></div><div class="label">✗ isolationなし → カード内のbadge(z:50)が外の兄弟(z:40)とグローバルに殴り合う</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-card zin-iso"><div class="zin-sibling" style="z-index:1">隣のUI<br>z:1</div><div class="zin-badge">NEW</div></div></div><div class="label">✓ isolation:isolate → badgeの重なりはカード内で完結、外へ漏れない（値は指定不要）</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/stacking-contexts/" target="_blank" rel="noopener">What The Heck, z-index?? — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://css-tricks.com/the-value-of-z-index/" target="_blank" rel="noopener">The Value of z-index | CSS-Tricks</a></p>

## 03 — 魔法の数字をやめ、命名トークンの階段から引く

`999` や `10001` を直書きすると、後続が読めなくなり「z-index 軍拡競争」が始まる。少数・広間隔の命名トークンを `:root` に定義し、すべての z-index はそこを参照する。Atlassian の実ラダー（nav 200 → dropdown 300 → modal 510 → tooltip 800）は100刻みで、後から層を差し込める。値の大小は本質ではなく「単一の命名トークン源から引く」ことが肝。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-magic"><span>nav: 100</span><span>modal: 9999</span><span>toast: 99999</span><span>tooltip: 2147483647</span></div></div><div class="label">✗ 各所で盛った任意値 → 序列が一望できず、新しい層を入れる隙間が読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-ladder"><div class="zin-rung" style="background:#5c5a50">nav <b>200</b></div><div class="zin-rung" style="background:#4a4a6a">dropdown <b>300</b></div><div class="zin-rung" style="background:#3a4a7a">modal <b>510</b></div><div class="zin-rung" style="background:#7a5b52">tooltip <b>800</b></div></div></div><div class="label">✓ 100刻みの命名階段 → 序列が一望でき、間に層を挿せる（Atlassian実値）</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://css-tricks.com/the-value-of-z-index/" target="_blank" rel="noopener">The Value of z-index | CSS-Tricks</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Overview - Elevation - Atlassian Design</a></p>

## 04 — elevation（影）と z-index（重なり順）を分離する

「浮いて見える（elevation＝影スタイル）」と「DOM上で前にある（z-index＝重なり順）」は別概念。同じ elevation を共有する2要素でも z-index は別々に振る必要がある。混同すると「影は浮いているのに重なり順が逆」という安っぽい破綻が出る。Atlassian は surface トークンと shadow トークンのペア必須を明文化、Material は影を奥行きの見た目として z-index と独立管理する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-elev zin-e-broken">強い影<br>(浮いてる風)</div><div class="zin-e-under">z:2 で<br>手前</div></div><div class="label">✗ 影は強い＝手前に見えるのに z-index は下 → 影と重なり順が矛盾し破綻</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-elev zin-e-flat" style="position:absolute;top:14px;left:14px;z-index:1">card<br>shadow-1 / z-base</div><div class="zin-elev zin-e-pop" style="position:absolute;top:46px;left:60px;z-index:2;width:110px;height:70px">popover<br>shadow-3 / z-popup</div></div><div class="label">✓ 影トークンと z-index トークンをペアで設計 → 浮きと順序が一致</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/environment/elevation.html" target="_blank" rel="noopener">Elevation — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Overview - Elevation - Atlassian Design</a></p>

## 05 — モーダルは top layer に逃がして z-index 戦争から降りる

`position:fixed/sticky` なヘッダーは z-index 不要で常にコンテキストを作るので、固定ヘッダー自身が「フォルダ」になり外側のモーダルとの上下が数字どおりにならない。`open` 状態の `<dialog>` や Popover API は、ブラウザの **top layer** に昇格してページの z-index 序列を完全に飛び越え最前面に出る。モーダル/トーストでラダーを管理する手間が減る方向。ただしレガシー対応やフォーカストラップは別途必要。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-tl-stage"><div class="zin-tl-page"></div><div class="zin-tl-head">sticky header</div><div class="zin-tl-modal zin-tl-trap">modal z:1<br>(headerの下)</div></div></div><div class="label">✗ stickyヘッダーがコンテキスト化 → 普通のmodalは数字を盛ってもヘッダーに勝てない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="zin-tl-stage"><div class="zin-tl-page"></div><div class="zin-tl-head">sticky header</div><div class="zin-tl-modal zin-tl-win">&lt;dialog&gt;<br>top layer ↑</div></div></div><div class="label">✓ &lt;dialog&gt;/Popover APIはtop layerへ昇格 → z-index不要でヘッダーの上に出る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context" target="_blank" rel="noopener">Stacking context — MDN Web Docs</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2026/01/unstacking-css-stacking-contexts/" target="_blank" rel="noopener">Unstacking CSS Stacking Contexts — Smashing Magazine</a></p>

## 実装スニペット

z-index トークン階段（CSS変数・100刻み、将来挿入の余地あり）。Atlassian の実ラダー値を採用し、直書きの 999/10001 を全廃する。

```css
:root {
  /* グローバルz-indexラダー：全z-indexはここから引く */
  --z-base:        0;
  --z-nav:         200;
  --z-dropdown:    300;
  --z-popup:       400;
  --z-blanket:     500;  /* モーダル背景の幕 */
  --z-modal:       510;
  --z-flag:        600;  /* トースト/通知 */
  --z-spotlight:   700;
  --z-tooltip:     800;
}

.site-header    { z-index: var(--z-nav); }
.modal          { z-index: var(--z-modal); }
/* 一緒に動く要素はcalc()で相対に縛る：間に割り込ませない */
.modal__blanket { z-index: calc(var(--z-modal) - 1); }
.tooltip        { z-index: var(--z-tooltip); }
```

`isolation:isolate` でコンポーネントの z-index をローカルに閉じ込める。`opacity:0.99` や `transform` の代わりにこれを使い、無意見で再利用可能な部品にする。

```css
/* このカードは『フォルダ』になる：中のz-indexは外へ漏れず、
   外のz-index戦争にも巻き込まれない。視覚的副作用ゼロ・position不要 */
.card {
  isolation: isolate;
}
.card__badge   { position: absolute; z-index: 2; } /* カード内でだけ効く */
.card__overlay { position: absolute; z-index: 1; }
/* z-index値を一切指定せずコンテキストを作れるのが利点。IE以外の全ブラウザで動作 */
```

スタッキングコンテキストを静かに作る要注意プロパティ（MDN準拠・バグ調査チェックリスト）。「z-index が効かない」時は DevTools で効かない要素の祖先を遡り、これらを探す。

```css
/* これらが祖先にあると、子のz-indexはその中に封印される＝バグ源 */
.x { opacity: 0.99; }                 /* opacity < 1 で発生（1なら発生しない） */
.x { transform: translateX(0); }      /* no-opでも発生。scale/rotate/translateも */
.x { filter: blur(0); }               /* filter/backdrop-filter != none */
.x { mix-blend-mode: multiply; }      /* normal以外で発生 */
.x { position: fixed; }               /* fixed/sticky はz-index不要で常に発生 */
.x { will-change: transform; }        /* opacity/transform指定で発生 */
.x { contain: paint; }                /* layout/paint/strict/content */
.x { container-type: inline-size; }   /* コンテナクエリ導入の隠れトラップ */
/* flex/grid の子は position 無しでも z-index:0 でコンテキスト生成 */
```

elevation（影）と z-index（重なり順）を分離して持つ。影＝奥行きの「見た目」、z-index＝重なりの「順序」を独立管理する。

```css
:root {
  /* elevation = 影スタイル（Material M3: 0/1/3/6/8/12dp 相当） */
  --shadow-1: 0 1px 2px rgba(0,0,0,.10);   /* card */
  --shadow-3: 0 6px 12px rgba(0,0,0,.14);  /* menu/popover */
  --shadow-5: 0 12px 24px rgba(0,0,0,.18); /* dialog */
}
/* 同じ影でも重なり順は別トークンで振る */
.card    { box-shadow: var(--shadow-1); z-index: var(--z-base); }
.popover { box-shadow: var(--shadow-3); z-index: var(--z-popup); }
.dialog  { box-shadow: var(--shadow-5); z-index: var(--z-modal); }
```

## チェックリスト

<ul class="check">
  <li>z-index が効かないとき、数字を上げる前に DevTools で祖先を遡り、コンテキスト生成プロパティ（opacity&lt;1 / transform / filter / position:fixed/sticky / will-change / contain / container-type）を探したか</li>
  <li>コンポーネント内部の重なりは <code>isolation:isolate</code> でローカル化したか（opacity:0.99 や transform で偶発的に作っていないか）</li>
  <li>すべての z-index を <code>:root</code> の命名トークン（var(--z-*)）から引いているか。999/10001 の直書きはゼロか</li>
  <li>レイヤー序列（ラダー）を1か所に明文化し、プロジェクトで100刻み派か5刻み低値派のどちらか一方に統一したか</li>
  <li>一緒に動くペア（モーダル＋背景幕など）は <code>calc(var(--z-modal) - 1)</code> で相対に縛り、間に割り込めないようにしたか</li>
  <li>elevation（影トークン）と z-index（重なり順トークン）を別物として振り、「影は浮くのに順序が逆」になっていないか</li>
  <li>最前面に出すべきモーダル/トーストは <code>&lt;dialog&gt;</code>/Popover API の top layer を検討したか（フォーカストラップ等 a11y は別途）</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>原典は主に英語圏のデザインシステム/解説で、日本語LP・バナー特化の検証ではない（ただし z-index/スタッキングコンテキストの挙動はブラウザ仕様なので言語非依存で適用可）。2つのトークン戦略（100刻みの CSS-Tricks/Atlassian 派 vs 5刻み・低値の OutSystems 派）は思想が相反するため、どちらか一方をプロジェクトで統一する必要があり「両方とも正解」ではない。Atlassian のラダー実値（nav200〜tooltip800）や USWDS の top:99999 は「任意値を使うな」と一見矛盾して見えるが、要点は値の大小ではなく「数字を直書きせず単一の命名トークン源から引く」こと。Material の dp 値は影のレンダリング指標であり z-index 値そのものではない（elevation と z-index は別管理）。<code>isolation:isolate</code> は IE 非対応だが 2024–2026 時点では実務上問題なし。コンテキスト生成プロパティの最終確認は MDN（primary）を正とすること。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/stacking-contexts/" target="_blank" rel="noopener">What The Heck, z-index?? — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context" target="_blank" rel="noopener">Stacking context — MDN Web Docs</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2026/01/unstacking-css-stacking-contexts/" target="_blank" rel="noopener">Unstacking CSS Stacking Contexts — Smashing Magazine</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://css-tricks.com/the-value-of-z-index/" target="_blank" rel="noopener">The Value of z-index | CSS-Tricks</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Overview - Elevation - Atlassian Design</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://medium.com/@bernardocardoso/outsystems-ui-layer-system-managing-z-index-at-scale-68dca9e543de" target="_blank" rel="noopener">OutSystems UI Layer System: Managing z-index at scale</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/elevation/tokens" target="_blank" rel="noopener">Elevation – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/environment/elevation.html" target="_blank" rel="noopener">Elevation — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://designsystem.digital.gov/design-tokens/z-index/" target="_blank" rel="noopener">Z-index | U.S. Web Design System (USWDS)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://designsystems.surf/articles/depth-with-purpose-how-elevation-adds-realism-and-hierarchy" target="_blank" rel="noopener">Elevation Design Patterns: Tokens, Shadows, and Roles</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.edge-cases.com/css/css-stacking-context-creation" target="_blank" rel="noopener">The 16 Ways CSS Creates Stacking Contexts — EdgeCases</a></p>
