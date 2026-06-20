---
title: "余白がなんとなく——8pxで決める余白とリズム"
problem: "余白を感覚で置いてしまい、詰まり/スカスカ・不揃いになる。"
category: 余白
tags: [余白, スペーシング, リズム]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .sp-stack > div{background:#16150f;color:#f4f2ec;padding:8px 14px;border-radius:4px;font-weight:600;font-size:13px;text-align:center;width:150px}
  .sp-bad-stack > div{margin-bottom:7px}
  .sp-bad-stack > div:nth-child(2){margin-bottom:13px}
  .sp-bad-stack > div:nth-child(3){margin-bottom:6px}
  .sp-good-stack > div{margin-bottom:16px}
  .sp-good-stack > div:last-child{margin-bottom:0}

  .sp-form{width:180px;color:#16150f;text-align:left}
  .sp-form .sp-lbl{font-size:12px;font-weight:600}
  .sp-form .sp-inp{height:22px;background:#fff;border:1px solid var(--line);border-radius:3px}
  /* BAD: label far from its own input, fields cramped together */
  .sp-bad-form .sp-lbl{margin-bottom:16px}
  .sp-bad-form .sp-field{margin-bottom:4px}
  /* GOOD: label hugs input, fields separated */
  .sp-good-form .sp-lbl{margin-bottom:4px}
  .sp-good-form .sp-field{margin-bottom:20px}
  .sp-good-form .sp-field:last-child{margin-bottom:0}

  .sp-scale{display:flex;align-items:flex-end;gap:6px;color:#16150f}
  .sp-scale span{background:var(--accent);width:18px;display:block;border-radius:2px 2px 0 0}
  .sp-scale small{display:block;text-align:center;font-size:9px;color:var(--ink-2);margin-top:3px}
  .sp-scale i{display:flex;flex-direction:column-reverse;font-style:normal}

  .sp-rhythm{width:180px;color:#16150f;text-align:left}
  .sp-rhythm h5{font-weight:700;margin:0}
  .sp-rhythm p{margin:0;font-size:12px;color:var(--ink-2)}
  .sp-bad-rhythm h5{font-size:16px;line-height:1.31;margin-bottom:9px}
  .sp-bad-rhythm p{line-height:1.45}
  .sp-good-rhythm h5{font-size:16px;line-height:24px;margin-bottom:8px}
  .sp-good-rhythm p{line-height:24px}
  .sp-grid-bg{background-image:repeating-linear-gradient(var(--paper-2),var(--paper-2) 7px,rgba(222,60,36,.14) 7px,rgba(222,60,36,.14) 8px)}

  .sp-size{display:flex;flex-direction:column;align-items:center;color:#16150f}
  .sp-size .sp-h{background:#16150f;color:#f4f2ec;border-radius:4px;display:flex;align-items:center;justify-content:center;font-weight:700;width:150px}
  .sp-size .sp-b{background:var(--paper);border:1px solid var(--line);border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:11px;width:150px;height:30px}
  .sp-bad-size .sp-h{height:30px;margin-bottom:8px}
  .sp-good-size .sp-h{height:44px;margin-bottom:24px}
</style>

## 結論

プロは余白を感覚で置かない。まず「8の倍数(8/16/24/32/48…)」をトークン化して全 padding・margin・gap をそれに吸着させ、細部だけ 4px のハーフステップを許す。その上で「内側の余白 ≤ 外側の余白(internal ≤ external)」を絶対ルールにしてグルーピングを成立させ、上に行くほど刻みが粗くなる非線形スケールで目分量を排除する。「なんとなく」が消えるのは、この3点を仕組みにした時だけだ。

## 01 — 余白を8の倍数トークンに吸着させる

7px・13px・15px・20px のような任意値を都度入力すると、開発者ですら「13px だったか 14px だったか」を再現できず、全体の整合が崩れて安っぽく見える。dimensions / padding / margin / gap を 8・16・24・32・40・48… に限定し、選択肢を減らすことが一貫性の正体だ。Material / Atlassian / InVision が共通で採る業界標準で、root 16px なら 0.5rem = 8px に一致する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-stack sp-bad-stack"><div>7px</div><div>13px</div><div>6px</div><div>15px</div></div></div><div class="label">✗ スケール外の任意値を目分量で → 不揃いで再現不能</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-stack sp-good-stack"><div>16px</div><div>16px</div><div>16px</div></div></div><div class="label">✓ 8の倍数(16px)に吸着 → 揃って意図が読める</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.designsystems.com/space-grids-and-layouts/" target="_blank" rel="noopener">Spacing, grids, and layouts — InVision</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/layout/spacing-methods.html" target="_blank" rel="noopener">Spacing methods — Material Design</a></p>

## 02 — internal ≤ external でグループを成立させる

「曖昧な余白」は素人っぽさの最大要因だ。グループ内の隙間がグループ間より広いと近接の法則が壊れ、どこからどこまでが1つの塊かが読めなくなる。最も典型的なのが、ラベルが「自分の入力欄」より「上のフィールド」に近いフォーム。ある塊の padding(内側)を、その塊を隣から隔てる margin(外側)以下に保つ——この単一ルールだけで近接が成立する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-form sp-bad-form"><div class="sp-field"><div class="sp-lbl">氏名</div><div class="sp-inp"></div></div><div class="sp-field"><div class="sp-lbl">メール</div><div class="sp-inp"></div></div></div></div><div class="label">✗ ラベルが自分の入力欄より前のフィールドに近い → 塊が読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-form sp-good-form"><div class="sp-field"><div class="sp-lbl">氏名</div><div class="sp-inp"></div></div><div class="sp-field"><div class="sp-lbl">メール</div><div class="sp-inp"></div></div></div></div><div class="label">✓ 内側4px &lt; 外側20px → ラベルが入力欄に属して見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://cieden.com/book/sub-atomic/spacing/spacing-best-practices" target="_blank" rel="noopener">Spacing best practices — Cieden</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from 'Refactoring UI' — Gist</a></p>

## 03 — 非線形スケール+隣接は最低約25%差

4・8・12・16・…・60・64 のように大きい値まで等間隔で刻むと、16→20px は +25% でも 240→256px は +6.7%。大きい値ほど隣接差が知覚できず、無意味なトークンが量産されて決定疲れを生む。正解は数学的等比ではなく、手で選んだ知覚的に均等な値 = 4/8/12/16/24/32/48/64/96/128px。下は細かく、上は粗く。隣り合う2値は約25%以上離す(近すぎると選べない)。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-scale"><i><span style="height:20px"></span><small>4</small></i><i><span style="height:40px"></span><small>8</small></i><i><span style="height:60px"></span><small>12</small></i><i><span style="height:80px"></span><small>16</small></i><i><span style="height:100px"></span><small>20</small></i><i><span style="height:120px"></span><small>24</small></i></div></div><div class="label">✗ 線形(+4等間隔) → 上ほど差が消え冗長</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-scale"><i><span style="height:14px"></span><small>4</small></i><i><span style="height:28px"></span><small>8</small></i><i><span style="height:56px"></span><small>16</small></i><i><span style="height:84px"></span><small>24</small></i><i><span style="height:112px"></span><small>48</small></i><i><span style="height:140px"></span><small>96</small></i></div></div><div class="label">✓ 非線形(隣接 ≥ 約25%差) → 各段に意味がある</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from 'Refactoring UI' — Gist</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@linz07m/stop-guessing-ui-spacing-a-simple-system-that-works-6a2945ea97d3" target="_blank" rel="noopener">Stop Guessing UI Spacing — Lince Mathew</a></p>

## 04 — 要素の大小に合わせて余白も変える

見出しも本文も同じ margin、カードもバッジも同じ padding——一律にすると階層が出ない。余白は「関係性」を表すものであり、大きい要素ほど周囲の余白も大きくするのが原則だ。用途別レンジで割り当てる:Small 0–8px=密結合/アイコン↔テキスト、Medium 12–24px=コンテナ内の別要素、Large 32–80px=セクション区切り。関連が近いほど小さく、無関連ほど大きく(Gestalt 近接)。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-size sp-bad-size"><div class="sp-h">見出し</div><div class="sp-b">本文テキスト</div></div></div><div class="label">✗ 見出しも本文も同じ高さ・同じ余白 → 階層なし</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-size sp-good-size"><div class="sp-h">見出し</div><div class="sp-b">本文テキスト</div></div></div><div class="label">✓ 大きい要素ほど余白も大きく(8→24px) → 階層が立つ</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/spacing" target="_blank" rel="noopener">Spacing — Atlassian Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@linz07m/stop-guessing-ui-spacing-a-simple-system-that-works-6a2945ea97d3" target="_blank" rel="noopener">Stop Guessing UI Spacing — Lince Mathew</a></p>

## 05 — vertical rhythm:line-heightを8(または4)の倍数に固定

font-size はデバイスで 14/15/18/21px と変動してよいが、line-height を 8 の倍数(8/16/24/32、許容で 4 の倍数の 20/24/28)に固定すると、テキストブロックの高さが 8px グリッドに乗り、縦のリズムが揃う。タイポ系と余白系が同じ数列で整合するのがポイント。1.45 のような端数倍率はグリッドから外れ、行ごとに微妙にズレる。

<div class="grid g2">
  <div class="demo"><div class="canvas sp-grid-bg"><div class="sp-rhythm sp-bad-rhythm"><h5>見出し</h5><p>端数のline-heightで<br>行が赤グリッドから<br>少しずつズレる</p></div></div><div class="label">✗ line-height:1.45 等の端数 → 8pxグリッドに乗らない</div></div>
  <div class="demo"><div class="canvas sp-grid-bg"><div class="sp-rhythm sp-good-rhythm"><h5>見出し</h5><p>line-heightを24pxに<br>固定すると各行が<br>グリッド線に乗る</p></div></div><div class="label">✓ line-height:24px 固定 → 行が赤グリッドに整列</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.freecodecamp.org/news/8-point-grid-typography-on-the-web-be5dc97db6bc/" target="_blank" rel="noopener">8-Point Grid: Typography On The Web — freeCodeCamp</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.designsystems.com/space-grids-and-layouts/" target="_blank" rel="noopener">Spacing, grids, and layouts — InVision</a></p>

## 06 — まず多すぎる余白から入れて削る

Web は構造上どうしても余白不足になりがちだ。詰めた状態から足していくと窮屈なまま固定されてしまう。逆に、最初に過剰なほど余白を入れて満足するまで削る方が、破綻が見えやすく速い。下の例は同じ要素で密度だけを変えたもの——「ケチって始める」より「盛って削る」が正解だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-stack sp-bad-stack" style="gap:0"><div style="margin-bottom:2px">行1</div><div style="margin-bottom:2px">行2</div><div>行3</div></div></div><div class="label">✗ under-add:最初から詰める → 窮屈なまま固定される</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="sp-stack"><div style="margin-bottom:16px">行1</div><div style="margin-bottom:16px">行2</div><div>行3</div></div></div><div class="label">✓ まず余白を盛り、満足するまで削る → 呼吸できる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxengineer.com/principles-of-design/negative-space" target="_blank" rel="noopener">Principles of Design: Negative Space — UX Engineer</a></p>

## 実装スニペット

非線形 8px スケールを CSS custom properties で定義する(Refactoring UI 流)。20px や 36px のような中間値はスケールに無い限り使わない。

```css
:root {
  /* 下は細かく、上は粗く(隣接 ≥ 約25%差) */
  --space-1: 4px;   /* 密結合: アイコン↔テキスト */
  --space-2: 8px;   /* 関連要素・コンポーネント内 */
  --space-3: 12px;  /* 4px half-step */
  --space-4: 16px;  /* 標準gap・カードpadding */
  --space-6: 24px;  /* コンテナ内の別要素 */
  --space-8: 32px;  /* セクション区切り */
  --space-12: 48px; /* ページセクション */
  --space-16: 64px; /* heroの余白 */
  --space-24: 96px;
  --space-32: 128px;
}
```

internal ≤ external を守ったカード+フォーム。内側 4px < 外側 24px で近接が成立する。

```css
.card {
  padding: var(--space-4);       /* 内側=16px */
  margin-bottom: var(--space-8); /* 外側=32px(内側より大) */
}
/* ラベルは自分の入力欄に近づけ、前のフィールド群から離す */
.field { margin-bottom: var(--space-6); }        /* グループ間=24px */
.field label { margin-bottom: var(--space-1); }  /* グループ内=4px */
.field input { display: block; width: 100%; }
```

vertical rhythm:line-height を 8 の倍数に固定し、余白も 8px で刻む。縦 margin は rem、横 padding は px が原則。

```css
body { font-size: 1rem; }                                            /* 16px */
h2   { font-size: 1.5rem;   line-height: 32px; margin: 48px 0 16px; }
p    { font-size: 1.125rem; line-height: 24px; margin: 0 0 24px; }   /* 18/24 */
small{ font-size: 0.875rem; line-height: 20px; }                     /* 14/20 */
```

px / rem の使い分け + タッチターゲット最小 48×48px・間隔 8px(Material)。

```css
.btn {
  font-size: 1rem;       /* rem: 文字拡大に追従 */
  min-height: 48px;      /* px: タッチターゲット最小 */
  padding: 12px 24px;    /* 横paddingはpx */
  margin-bottom: 1.5rem; /* 縦marginはrem=24px */
  border: 1px solid;     /* borderはpx */
}
.btn + .btn { margin-left: 8px; } /* 隣接ターゲット間 ≥ 8px */
```

## チェックリスト

<ul class="check">
  <li>すべての padding / margin / gap が 8 の倍数(8/16/24/32/48…)に乗っているか。細部の調整だけ 4px ハーフステップに留めているか。</li>
  <li>7px・13px・15px・20px などスケール外の任意値が紛れていないか。</li>
  <li>どの塊も internal ≤ external か(padding ≤ それを隔てる margin)。グループ内 < グループ間になっているか。</li>
  <li>ラベルが「上のフィールド」より「自分の入力欄」に近いか。</li>
  <li>スケールは非線形で、隣り合う2値が約25%以上離れているか。大きい値の等間隔トークンを乱発していないか。</li>
  <li>大きい要素ほど周囲の余白も大きいか(一律 margin になっていないか)。</li>
  <li>line-height が 8(許容で 4)の倍数で、テキストブロックが縦グリッドに乗っているか。</li>
  <li>font-size と縦 margin は rem、横 padding と border は px にしているか。</li>
  <li>タッチターゲットは最小 48×48px、隣接間 8px 以上あるか。</li>
  <li>「ケチって始めて」いないか。まず盛って削ったか。</li>
</ul>

## 限界 / 出典

<div class="note"><b>正直な但し書き：</b>「主要解像度が8で割り切れる」という8px採用の根拠は spec.fm の主張で、デバイスが多様化した現在は装飾的理由に近い(本質は選択肢を減らす一貫性)。internal ≤ external のうち「padding ≤ margin」という厳密な不等式は Cieden の定式化で、Refactoring UI の原文は「グループの周囲の余白 > 内側の余白」とより緩い。px vs rem 指針は Josh Comeau 個人の推奨で、固定サイズのバナーでは px 中心で問題ない。NYT 見出し:本文比 2:1 は Medium 記事の引用で一次確認は未取得。25%差・非線形は知覚則であって厳密な閾値ではなく目安。Tailwind 新スケールやトークン命名3方式の一部はブログ/Discussion の提案段階で、一次規格ではない(中核の 8px グリッドと Material/Atlassian/InVision のトークンは一次ソース)。</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from 'Refactoring UI' — GitHub Gist</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://cieden.com/book/sub-atomic/spacing/spacing-best-practices" target="_blank" rel="noopener">Spacing best practices — Cieden</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/spacing" target="_blank" rel="noopener">Overview - Spacing — Atlassian Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/layout/spacing-methods.html" target="_blank" rel="noopener">Spacing methods — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.designsystems.com/space-grids-and-layouts/" target="_blank" rel="noopener">Spacing, grids, and layouts — Design Systems by InVision</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/" target="_blank" rel="noopener">The Surprising Truth About Pixels and Accessibility — Josh Comeau</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.freecodecamp.org/news/8-point-grid-typography-on-the-web-be5dc97db6bc/" target="_blank" rel="noopener">8-Point Grid: Typography On The Web — freeCodeCamp</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://spec.fm/specifics/8-pt-grid" target="_blank" rel="noopener">8-Point Grid — spec.fm</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.designary.com/p/spacing-systems-and-scales-ui-design" target="_blank" rel="noopener">Basics: Spacing systems & scales in UI design — Designary</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@linz07m/stop-guessing-ui-spacing-a-simple-system-that-works-6a2945ea97d3" target="_blank" rel="noopener">Stop Guessing UI Spacing — Lince Mathew (Medium)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://github.com/tailwindlabs/tailwindcss/discussions/12263" target="_blank" rel="noopener">A new default spacing scale · Tailwind Discussion #12263</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxengineer.com/principles-of-design/negative-space" target="_blank" rel="noopener">Principles of Design: Negative Space — UX Engineer</a></p>
