---
title: "フォントサイズが行き当たりばったり——タイプスケールとジャンプ率"
problem: "見出し/本文のサイズを都度決めてしまい、階層もリズムも出ない。"
category: タイポ
tags: [タイポ, タイプスケール, 階層]
date: 2026-06-20
sources: 11
draft: false
---

<style>
  .ts-row{display:flex;flex-direction:column;gap:6px;color:#16150f;font-family:Georgia,serif;line-height:1.1;text-align:center;padding:0 12px}
  .ts-row span{display:block}
  /* 行き当たりばったり: 階層が潰れた近接サイズ */
  .ts-bad-1{font-size:30px;font-weight:700}
  .ts-bad-2{font-size:28px;font-weight:700}
  .ts-bad-3{font-size:26px;font-weight:400}
  .ts-bad-4{font-size:24px;font-weight:400}
  /* Major Third 1.25 で生成 */
  .ts-good-1{font-size:39px;font-weight:700}
  .ts-good-2{font-size:25px;font-weight:700}
  .ts-good-3{font-size:20px;font-weight:400}
  .ts-good-4{font-size:16px;font-weight:400}

  /* 25%ルール */
  .ts-near{display:flex;align-items:baseline;gap:14px;color:#16150f;font-family:Georgia,serif}
  .ts-near .a{font-size:46px;font-weight:700}
  .ts-near .b{font-size:48px;font-weight:700}
  .ts-far{display:flex;align-items:baseline;gap:14px;color:#16150f;font-family:Georgia,serif}
  .ts-far .a{font-size:31px;font-weight:700}
  .ts-far .b{font-size:39px;font-weight:700}

  /* 比率の使い分け */
  .ts-stack{display:flex;flex-direction:column;gap:4px;color:#16150f;font-family:Georgia,serif;line-height:1.05;text-align:center}
  .ts-tight .l1{font-size:34px;font-weight:700}
  .ts-tight .l2{font-size:28px;font-weight:700}
  .ts-tight .l3{font-size:23px;font-weight:400}
  .ts-bold .l1{font-size:51px;font-weight:700}
  .ts-bold .l2{font-size:28px;font-weight:700}
  .ts-bold .l3{font-size:16px;font-weight:400}

  /* weight/色で階層 */
  .ts-card{width:200px;color:#16150f;font-family:system-ui,sans-serif;text-align:left;line-height:1.4}
  .ts-card .t{font-size:16px;margin-bottom:2px}
  .ts-thin .t{font-weight:300;color:#16150f}
  .ts-thin .sub{font-weight:300;font-size:16px;color:#16150f}
  .ts-weight .t{font-weight:700}
  .ts-weight .sub{font-weight:400;font-size:14px;color:#5c5a50}

  /* fluid clamp プレビュー */
  .ts-fluid-box{color:#f4f2ec;background:#16150f;width:90%;padding:18px;border-radius:8px;text-align:center}
  .ts-fluid-box .h{font-family:Georgia,serif;font-weight:700;line-height:1.15;font-size:clamp(1.6rem,4vw + 0.6rem,2.6rem)}
  .ts-fixed-box{color:#16150f;background:var(--paper);border:1px solid var(--line);width:90%;padding:18px;border-radius:8px;text-align:center}
  .ts-fixed-box .h{font-family:Georgia,serif;font-weight:700;line-height:1.15;font-size:52px}
</style>

## 結論

プロはフォントサイズを 1 つずつ手で決めない。ベース 16px に固定比率（ジャンプ率）を繰り返し掛ける **モジュラータイプスケール** で全サイズを機械的に導出し、そこから選ぶだけにする。本文中心の UI は Major Third(1.25) 前後、エディトリアル/LP は Perfect Fourth(1.333)〜黄金比(1.618) で見出しのコントラストを強め、レスポンシブは `clamp()` で補間しつつ `max ≤ 2.5×min` を守ってアクセシビリティを担保する。

## 01 — 比率を1つ決めてスケールを生成し、そこから選ぶ

「この見出しは 30px くらい？」と都度決めると、階層もリズムも出ない。やめるべきは「決める」こと自体だ。ベース 16px に固定比率 r を掛け続け（base × ratio^n）、生成された段から**選ぶ**だけにする。Major Third(1.25) なら 16 → 20 → 25 → 31 → 39px。下の悪い例は 30/28/26/24px と近接サイズの寄せ集めで、見出しと本文の差が消えている。良い例は同じ 4 段でも比率生成なので、各段が明確に分離する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-row"><span class="ts-bad-1">見出し 30</span><span class="ts-bad-2">小見出し 28</span><span class="ts-bad-3">本文 26</span><span class="ts-bad-4">注釈 24</span></div></div><div class="label">✗ 都度決めた近接サイズ → 階層が潰れる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-row"><span class="ts-good-1">見出し 39</span><span class="ts-good-2">小見出し 25</span><span class="ts-good-3">本文 20</span><span class="ts-good-4">注釈 16</span></div></div><div class="label">✓ 16×1.25ⁿ で生成 → 各段が明確に分離</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pacgie.com/guides/what-is-type-scale" target="_blank" rel="noopener">Type Scale Guide — Pacgie</a></p>

## 02 — スケール内の2値を約25%より近づけない

「46px か 48px か」で迷うのは、差が小さすぎて視覚的に区別できないからだ。Refactoring UI の指針では、隣接値を約 25% 以上離せば選択が機械的に決まり、行き当たりばったりが消える。これは線形（等差）ではなく**指数（比率）ベース**にすることと同義で、近接サイズで悩むこと自体が「スケールが等差になっている」サインだ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-near"><span class="a">46</span><span class="b">48</span></div></div><div class="label">✗ 46 vs 48（差 4%）→ 区別不能、悩むだけ無駄</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-far"><span class="a">31</span><span class="b">39</span></div></div><div class="label">✓ 31 vs 39（差 25%）→ 機械的に決まる</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI</a></p>

## 03 — 用途で比率を使い分ける

比率が大きいほどジャンプ率（段階間コントラスト）が強くなる。小要素（ラベル/識別子）は 1.067〜1.125、本文の多い画面は 1.200〜1.333 がスイートスポット、ポスター/プレゼン/大胆なエディトリアルは 1.414〜1.618。ダッシュボードのような密度の高い UI で 1.618 を使うと見出しが巨大化してスペースを浪費するので避ける。下は同じ 3 段を、本文密度の高い UI 向けの控えめな比率と、LP 向けの強い比率で比較したもの。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-stack ts-tight"><span class="l1">Dashboard</span><span class="l2">Section</span><span class="l3">本文テキスト</span></div></div><div class="label">✓ 密度の高いUI → 1.2〜1.25（窮屈にならない）</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-stack ts-bold"><span class="l1">Hero</span><span class="l2">Lead</span><span class="l3">本文テキスト</span></div></div><div class="label">✓ LP/エディトリアル → 1.333〜1.618（強い対比）</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://designshack.net/articles/typography/guide-to-responsive-typography-sizing-and-scales/" target="_blank" rel="noopener">2025 Guide to Responsive Typography — Design Shack</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://supercharge.design/blog/what-is-a-type-scale" target="_blank" rel="noopener">What Is a Type Scale? — Supercharge</a></p>

## 04 — 階層はサイズだけでなくウェイトと色でも作る

サイズ段数を増やす前に、ウェイトと色で差をつける。16px bold のサブヘッダーは 16px regular の本文に十分際立つ。主要要素を目立たせるコツは「二次要素を淡色・小サイズで弱める」（emphasize by de-emphasizing）こと。ただし**弱化に weight 400 未満を使ってはいけない**——細いウェイトは小サイズで可読性が落ちチープに見えるので、弱めたい要素はサイズ縮小か淡色で対応する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-card ts-thin"><div class="t">注文 #1042</div><div class="sub">2026年6月20日 / 配送済み</div></div></div><div class="label">✗ 細字(300)で弱化 → 可読性が落ち安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-card ts-weight"><div class="t">注文 #1042</div><div class="sub">2026年6月20日 / 配送済み</div></div></div><div class="label">✓ 主役をbold、補助を淡色＋小サイズで弱化</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI</a></p>

## 05 — clamp()で補間し、max ≤ 2.5×min を守る

レスポンシブな見出しはブレークポイントごとに手書きせず、`clamp(min, vw + rem, max)` でビューポート間を線形補間する。preferred 値は vw と rem の和で構成し、min/max は **rem** で指定してユーザーのズーム/ブラウザ設定に追従させる。重要なガードは `max ≤ 2.5 × min`——ブラウザはズーム時に vw をスケールしないため、純粋な vw や過大な上限は WCAG 1.4.4（テキスト 200% 拡大）に失敗する。下の左は px 固定で巨大化しズームに追従しない例、右は clamp で滑らかに補間する例（ウィンドウ幅を変えると右だけ追従する）。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-fixed-box"><div class="h">52px 固定</div></div></div><div class="label">✗ px固定 → ズーム/小画面に追従せず破綻</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="ts-fluid-box"><div class="h">clamp で補間</div></div></div><div class="label">✓ clamp(1.6rem, 4vw+.6rem, 2.6rem) → 滑らかに拡縮</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/" target="_blank" rel="noopener">Modern Fluid Typography Using CSS Clamp — Smashing</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" target="_blank" rel="noopener">Addressing Accessibility Concerns With Fluid Type — Smashing</a></p>

## 実装スニペット

Major Third (1.25) スケール。本文密度の高い UI/アプリ向けの中庸なジャンプ率。

```css
:root{
  --fs-base: 1rem;        /* 16px */
  --ratio: 1.25;
  --fs-caption: 0.64rem;  /* 約10px = 16/1.25/1.25 */
  --fs-small: 0.8rem;     /* 約13px */
  --fs-body: 1rem;        /* 16px */
  --fs-h3: 1.25rem;       /* 20px */
  --fs-h2: 1.5625rem;     /* 25px */
  --fs-h1: 1.953rem;      /* 約31px */
  --fs-display: 2.441rem; /* 約39px */
}
body{font-size:var(--fs-body);line-height:1.5;}
h1{font-size:var(--fs-h1);line-height:1.25;}
```

Perfect Fourth (1.333) スケール。段間の breathing room が大きく、LP/エディトリアル向けの強い視覚階層を作る。

```css
:root{
  --fs-body: 1rem;     /* 16px */
  --fs-h4: 1.333rem;   /* 約21px */
  --fs-h3: 1.777rem;   /* 約28px */
  --fs-h2: 2.369rem;   /* 約38px */
  --fs-h1: 3.157rem;   /* 約51px */
  --fs-hero: 4.209rem; /* 約67px */
}
```

fluid な見出し（36px → 52px を 600px → 1400px で補間）。max÷min = 1.44 ≤ 2.5 で WCAG 1.4.4 をパス。

```css
h1{
  /* min 2.25rem(36px), max 3.25rem(52px) */
  font-size: clamp(2.25rem, 2vw + 1.5rem, 3.25rem);
  line-height: 1.2;
}
```

WCAG ガード付き fluid 本文（Utopia 的な 2 スケール補間、`max ≤ 2.5×min` を厳守）。

```css
:root{
  /* 16px→18px, ユーザー設定に追従するrem基準 */
  --step-0: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  /* 28px→40px, 40/28=1.43 ≤ 2.5 */
  --step-3: clamp(1.75rem, 1.5vw + 1.375rem, 2.5rem);
}
body{font-size:var(--step-0);line-height:1.5;}
h2{font-size:var(--step-3);line-height:1.25;}
p{max-width:38em;} /* 1行を詰め込みすぎない */
```

## チェックリスト

<ul class="check">
  <li>ベース 16px に固定比率を掛けてスケールを生成し、サイズは毎回手で決めず生成段から選んでいる</li>
  <li>隣接する 2 値が約 25% 以上離れている（46 vs 48 のような近接値で悩んでいない）</li>
  <li>スケールが線形（等差）でなく指数（比率）ベースになっている</li>
  <li>比率を用途で選んだ（密度の高い UI=1.2〜1.25 / ブログ・LP=1.25〜1.333 / 大胆なエディトリアル=1.414〜1.618）</li>
  <li>密度の高いアプリで黄金比 1.618 を使って見出しを巨大化させていない</li>
  <li>サイズ段を増やす前に weight・色で階層をつけられないか検討した</li>
  <li>補助テキストの弱化に weight 400 未満を使っていない（縮小か淡色で対応）</li>
  <li>fluid 化した見出しの min/max を px でなく rem で指定している</li>
  <li>すべての clamp で max ≤ 2.5×min を満たし、200% 拡大に耐える</li>
  <li>見出し line-height 1.2〜1.3 / 本文 1.5〜1.6、段落幅も詰め込みすぎていない</li>
</ul>

## 限界 / 出典

比率 → px の計算例はソースごとに丸め方が異なり微妙にずれる（16×1.25 の上限が 39px の版と 49px の版がある＝どのステップを基準に置くかの違い）。提示した px 値は四捨五入の一例で、実装では生成器の出力に従うこと。「max ≤ 2.5×min」と「隣接値 25% 以上」は出典が異なる別ルールで、前者はアクセシビリティ（fluid 時の max/min 比）、後者はスケール設計（隣接段差）の話なので混同しない。Refactoring UI の該当ソースは公式書籍ではなく第三者の GitHub Gist メモであり、weight≥400 や色での弱化は UI 文脈の指針で、装飾的な大見出しには当てはまらない場合がある。日本語タイポでは英文の 45–75 字目安がそのまま適用できず字数感覚が異なる点、本ブリーフのソースが英語圏中心で日本語特有の約物詰め（palt）等は別途考慮が必要な点にも注意。比率の用途区分（LP=1.333 等）は慣習的な定説であり厳密な実証ではない。

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pacgie.com/guides/what-is-type-scale" target="_blank" rel="noopener">Type Scale Guide: Typography for UI and Material Design — Pacgie</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://supercharge.design/blog/what-is-a-type-scale" target="_blank" rel="noopener">What Is a Type Scale? How It Works in UI Design — Supercharge</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://designshack.net/articles/typography/guide-to-responsive-typography-sizing-and-scales/" target="_blank" rel="noopener">The 2025 Guide to Responsive Typography Sizing and Scales — Design Shack</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/typography/type-scale-tokens" target="_blank" rel="noopener">Typography – Material Design 3</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI (GitHub Gist)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://cieden.com/book/sub-atomic/typography/establishing-a-type-scale" target="_blank" rel="noopener">How do I establish a type scale for my project? — Cieden</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.artattackk.com/blogs/ui-ux/type-scale-ratio/" target="_blank" rel="noopener">What Is Type Scale? — Art Attackk</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/" target="_blank" rel="noopener">Modern Fluid Typography Using CSS Clamp — Smashing Magazine</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/" target="_blank" rel="noopener">Addressing Accessibility Concerns With Using Fluid Type — Smashing Magazine</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://utopia.fyi/type/calculator/" target="_blank" rel="noopener">Fluid type scale calculator — Utopia</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/typographic-scaling/" target="_blank" rel="noopener">Typographic scaling: Definition, Figma tutorial, and examples — LogRocket</a></p>
