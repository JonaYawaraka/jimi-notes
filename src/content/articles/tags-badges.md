---
title: "タグ・バッジが子どもっぽい——ラベルの設計"
problem: "タグやバッジの色・形・サイズが子どもっぽく安っぽい。"
category: 細部
tags: [タグ, バッジ, チップ]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .tag-base{display:inline-flex;align-items:center;font-size:13px;line-height:1;letter-spacing:.01em;font-weight:500}
  /* §1 ティント vs 原色ベタ塗り */
  .tag-bad1{background:hsl(217 91% 52%);color:#fff;font-weight:700;padding:9px 14px;border-radius:999px}
  .tag-good1{background:hsl(217 91% 60% / .15);color:hsl(217 75% 32%);padding:5px 9px;border-radius:6px}
  /* §2 lightness/hue vs opacity */
  .tag-row{display:flex;flex-direction:column;gap:10px;align-items:center}
  .tag-op{padding:5px 10px;border-radius:6px;font-weight:600}
  .tag-bad2{background:hsl(150 65% 42%);color:#fff;opacity:.35}
  .tag-good2{background:hsl(146 60% 90%);color:hsl(150 45% 26%)}
  /* §3 ボタン化 vs ラベル */
  .tag-bad3{background:hsl(262 70% 55%);color:#fff;font-size:17px;font-weight:700;padding:13px 18px;border-radius:12px;box-shadow:0 4px 8px rgba(0,0,0,.18)}
  .tag-good3{background:hsl(262 60% 60% / .15);color:hsl(262 55% 38%);font-size:13px;font-weight:500;padding:5px 9px;border-radius:6px}
  /* §4 角丸使い分け */
  .tag-r{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .tag-pillall{background:hsl(217 91% 60% / .15);color:hsl(217 75% 32%);padding:5px 11px;border-radius:999px}
  .tag-rounded{background:hsl(217 91% 60% / .15);color:hsl(217 75% 32%);padding:5px 9px;border-radius:6px}
  .tag-pilled{background:hsl(0 72% 51%);color:#fff;font-weight:600;padding:4px 8px;border-radius:999px;min-width:20px;justify-content:center}
  .tag-square{background:hsl(215 16% 90%);color:hsl(215 19% 35%);padding:5px 9px;border-radius:3px}
  /* §5 色だけ vs 形+アイコン */
  .tag-sem{padding:5px 9px;border-radius:6px;gap:5px}
  .tag-err{background:hsl(0 72% 51% / .15);color:hsl(0 65% 38%)}
  .tag-ok{background:hsl(142 71% 45% / .15);color:hsl(142 60% 28%)}
  .tag-dot{display:inline-flex;gap:8px}
  .tag-cdot{width:13px;height:13px;border-radius:999px}
  /* §6 グレーピル彩度 */
  .tag-gray0{background:hsl(0 0% 90%);color:hsl(0 0% 40%);padding:5px 9px;border-radius:6px;font-weight:500}
  .tag-grayH{background:hsl(215 16% 91%);color:hsl(215 19% 35%);padding:5px 9px;border-radius:6px;font-weight:500}
</style>

## 結論

プロのラベルは「原色ベタ塗り＋白文字＋丸ボタン化」を避け、不透明度15〜20%相当のティント背景に同系統の濃い文字色を載せる。柔らかくしたいときは opacity を下げず lightness を上げ hue を明るい側へ回して彩度を保ち、サイズは本文より一段小さく（13px前後）・横>縦パディング・中字（500）で組む。色の濃淡で優先度を、見た目の差で静的バッジとインタラクティブチップを伝え分けるのが「子どもっぽさ」と「成熟」の分岐点だ。

## 01 — 原色ベタ塗り＋白文字をやめ、ティント背景＋濃い同系色文字に

最も子どもっぽく見える原因がこれ。高彩度の原色に白文字を載せた丸ボタン風バッジは、彩度が暴れてコントラストも不安定になる。プロはパッシブなカテゴリ/タグを **15%ティント背景＋同系統の濃い文字色** に置き換える。背景は彩度を保ったまま薄く、文字は高コントラストを維持するので、画面が静かになり階層も保てる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-bad1">DESIGN</span></div><div class="label">✗ 原色ベタ塗り＋白文字＋丸ボタン → 子どもっぽく主張過多</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-good1">DESIGN</span></div><div class="label">✓ 15%ティント＋濃い同系色文字 → 静かで成熟</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/ynotdraw/9351627d7509cc35813eeac4245cab3b" target="_blank" rel="noopener">Steve Schoger — Refactoring UI, CSS Day 2019 (notes)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/badge-ui-design" target="_blank" rel="noopener">Badge UI design — Setproduct Blog</a></p>

## 02 — 柔らかくするときは opacity ではなく lightness/hue で

「淡くしたい」と全体に `opacity` を掛けると、彩度ごと沈んで washed out になり、かえって安っぽくくすむ。正解は opacity を触らず、**lightness を上げて最寄りの明るい hue へ回す** こと。彩度を保ったまま明度差だけでコントラストを落とすので、淡くても色がいきいきする（Schoger）。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-row"><span class="tag-base tag-op tag-bad2">SUCCESS</span></div></div><div class="label">✗ ソリッド緑に opacity:.35 → くすんで washed out</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-row"><span class="tag-base tag-op tag-good2">SUCCESS</span></div></div><div class="label">✓ lightnessを上げ明るいhueへ → 彩度を保ち鮮やか</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/ynotdraw/9351627d7509cc35813eeac4245cab3b" target="_blank" rel="noopener">Steve Schoger — Refactoring UI, CSS Day 2019 (notes)</a></p>

## 03 — ボタン化させない：本文より一段小さく・横>縦パディング・中字

縦パディングが厚く、フォントが大きく bold だと、ラベルが「押せるボタン」に見えて視覚階層が崩れる。ラベルは **font-size 13px前後（0.75em）・padding は横0.65em / 縦0.35em の約2:1非対称・ウェイトは Medium(500)** が洗練の条件。Bootstrap の `.badge`、Material Design 3 の Label Large（14px / Medium）がこの寸法の一次的な根拠だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-bad3">NEW</span></div><div class="label">✗ 大きい・bold・厚い縦パディング・影 → ボタンに見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-good3">NEW</span></div><div class="label">✓ 13px / 500 / 横>縦パディング → ラベルとして収まる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://getbootstrap.com/docs/5.3/components/badge/" target="_blank" rel="noopener">Badges · Bootstrap v5.3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/chips/specs" target="_blank" rel="noopener">Chips – Material Design 3</a></p>

## 04 — pill一律をやめ、用途別に rounded / pilled / square

完全な丸（pill）を全ラベルに当てると、数字や長文で形が破綻する。標準は **rounded（6px）**、カウントバッジは **pilled（999px）**、グリッド整合が要るときは **square（3px）** と使い分けるのが成熟スタイル。角丸は意味ではなく中身の形に合わせる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-r"><span class="tag-base tag-pillall">CATEGORY</span><span class="tag-base tag-pillall">設定が長いラベル</span><span class="tag-base tag-pillall">3</span></div></div><div class="label">✗ 全部pill → 長文も数字も同じ形で間延び・破綻</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-r"><span class="tag-base tag-rounded">CATEGORY</span><span class="tag-base tag-square">設定が長いラベル</span><span class="tag-base tag-pilled">3</span></div></div><div class="label">✓ rounded / square / pilled を用途別に</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://cieden.com/book/atoms/badge/badge-ui-design" target="_blank" rel="noopener">What should I consider when creating badge UI design? — Cieden</a></p>

## 05 — 色だけで意味を伝えない（テキスト/アイコン/形＋aria-label）

色だけでステータスを表すのは WCAG 1.4.1（Level A）違反で、色覚特性のあるユーザーに伝わらない。**テキスト・アイコン・形状を必ず併用し、`aria-label` も付ける。** さらにバッジ内テキストは4.5:1、境界やアイコンなど非テキスト要素は3:1（WCAG 1.4.11）を満たす。ティント15%背景でもこの比は保証されないので、必ず実色で実測する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-dot"><span class="tag-cdot" style="background:hsl(0 72% 51%)"></span><span class="tag-cdot" style="background:hsl(142 60% 42%)"></span></div></div><div class="label">✗ 色ドットだけ → 色覚特性ユーザーに区別不能</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="tag-r"><span class="tag-base tag-sem tag-err" aria-label="エラー">✕ Error</span><span class="tag-base tag-sem tag-ok" aria-label="成功">✓ Success</span></div></div><div class="label">✓ アイコン＋テキスト＋aria-label → 色なしでも伝わる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://testparty.ai/blog/wcag-non-text-contrast-guide" target="_blank" rel="noopener">WCAG 1.4.11 Non-Text Contrast guide — TestParty</a></p>

## 06 — 純グレーをやめ、hueで温度を足す（濃淡で優先度を）

彩度ゼロ（S=0）のグレーピルは UI を鈍く不自然に見せる。ニュートラルなステータスでも **S≈16% で hue を足す**（寒色なら青寄り、暖色なら黄/茶寄り）と、明暗どちらの段でも自然になじむ。そして緊急/未読/エラーだけをソリッドな高コントラスト色（典型は赤）に予約し、**色の強度=優先度** を一致させる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-gray0">ARCHIVED</span></div><div class="label">✗ S=0 の純グレー → 鈍く生気がない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="tag-base tag-grayH">ARCHIVED</span></div><div class="label">✓ S≈16%・青寄りhue → 温度が乗って自然</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/badge-ui-design" target="_blank" rel="noopener">Badge UI design — Setproduct Blog</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/ynotdraw/9351627d7509cc35813eeac4245cab3b" target="_blank" rel="noopener">Steve Schoger — Refactoring UI (notes)</a></p>

## 実装スニペット

```css
/* パッシブなティントバッジ（推奨の基本形） */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75em;        /* 本文より一段小さく ≒14px */
  font-weight: 500;          /* boldでなくMedium */
  line-height: 1;
  padding: 0.35em 0.65em;    /* 横>縦の非対称（約2:1） */
  border-radius: 6px;        /* pill一律でなくrounded */
  letter-spacing: 0.01em;
}
.badge--category {
  background: hsl(217 91% 60% / 0.15);  /* 15%ティント */
  color: hsl(217 75% 32%);              /* 濃い同系色 */
}
```

```css
/* 緊急/未読のソリッド色 & グレーピルへの彩度付与 */
.badge--urgent {
  background: hsl(0 72% 51%);   /* solid red = error/緊急に予約 */
  color: #fff;
  font-weight: 600;
}
.badge--neutral {
  background: hsl(215 16% 93%); /* S=0でなく16%で温度を足す */
  color: hsl(215 19% 35%);
}
.badge--count::after { content: "99+"; } /* ~4字 / 99+キャップ */
```

```css
/* 写真・ツールバー上で溶けないように surface色ストロークで縁取る */
.badge--on-image {
  background: hsl(0 0% 100% / 0.92);
  color: hsl(222 47% 20%);
  box-shadow: 0 0 0 1.5px var(--surface, #fff); /* 擬似ストローク */
  border-radius: 999px;
}
```

```css
/* セマンティックトークン（hueでなくpurposeで命名） */
:root {
  /* primitive */
  --blue-600: #2563eb; --red-600: #dc2626; --green-600: #16a34a;
  /* semantic */
  --color-text-error: var(--red-600);
  --color-bg-info:    hsl(217 91% 60% / 0.15);
  --color-bg-success: hsl(142 71% 45% / 0.15);
}
.badge--error { background: hsl(0 72% 51% / 0.15); color: var(--color-text-error); }
```

## チェックリスト

<ul class="check">
  <li>カテゴリ/タグは原色ベタ塗り＋白文字でなく、15〜20%ティント背景＋濃い同系色文字になっているか</li>
  <li>淡くするとき opacity を下げていないか（lightnessを上げ・明るいhueへ回したか）</li>
  <li>font-size は本文より一段小さい13〜14px、ウェイトは bold でなく Medium(500) か</li>
  <li>padding は横>縦の非対称（約2:1）で、ボタンに見える厚い縦パディングになっていないか</li>
  <li>角丸は用途別か（標準=rounded / カウント=pilled / グリッド整合=square）、pill一律になっていないか</li>
  <li>色だけで意味を伝えていないか（テキスト/アイコン/形＋aria-labelを併用したか）</li>
  <li>テキスト4.5:1・境界/アイコン3:1を実色で実測したか（ティント15%でも切り上げ不可）</li>
  <li>ニュートラルバッジが S=0 の純グレーになっていないか（S≈16%で温度を足したか）</li>
  <li>緊急/未読/エラーだけソリッド赤に予約し、全バッジを同じ強さで塗っていないか</li>
  <li>静的バッジとインタラクティブチップを見た目で区別したか（チップのみ48×48px/間隔8pxを確保）</li>
  <li>写真や可変背景の上では surface色1〜2pxストロークで縁取って detach したか</li>
  <li>数値バッジは ~4字で 99+ にキャップしたか</li>
</ul>

## 限界 / 出典

「15〜20%ティント」「surface色1〜2pxストローク」は主に Setproduct（ブログ）由来の実務的目安で、複数の権威ソースの直接合意ではない。一方 `padding .35em / .65em` や `.75em` は Bootstrap の一次実装値、32px/12px/14px Medium は Material Design 3 の一次仕様で信頼度が高い。コントラスト比（4.5:1 / 3:1）は WCAG 準拠で確実だが、**ティント15%背景＋濃い文字が常に4.5:1を満たす保証はなく、実色の組み合わせごとに必ず実測が必要（切り上げ不可）**。「48×48px・8px間隔」はインタラクティブ要素のみで、静的バッジには適用しない（過大化を避ける）。Schoger の lightness/hue 手法は実務的支持が強いが出典は講演ノート（二次）。角丸の用途別使い分けや3層トークンはチーム規約化が前提で、単発バナー/小規模LPには過剰なことがある。HSL relative color 構文など新CSS機能は、古いブラウザ対象のLPではフォールバックが要る。

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/badge-ui-design" target="_blank" rel="noopener">Badge UI design: Notification, count, and status patterns — Setproduct Blog</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://smart-interface-design-patterns.com/articles/badges-chips-tags-pills/" target="_blank" rel="noopener">Badges vs. Pills vs. Chips vs. Tags — Smart Interface Design Patterns</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/ynotdraw/9351627d7509cc35813eeac4245cab3b" target="_blank" rel="noopener">Steve Schoger — Refactoring UI, CSS Day 2019 (notes)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://getbootstrap.com/docs/5.3/components/badge/" target="_blank" rel="noopener">Badges · Bootstrap v5.3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/chips/specs" target="_blank" rel="noopener">Chips – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/typography/type-scale-tokens" target="_blank" rel="noopener">Typography – Material Design 3 (type scale tokens)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://cieden.com/book/atoms/badge/badge-ui-design" target="_blank" rel="noopener">What should I consider when creating badge UI design? — Cieden</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://testparty.ai/blog/wcag-non-text-contrast-guide" target="_blank" rel="noopener">WCAG 1.4.11 Non-Text Contrast guide — TestParty</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/color-consistency-design-systems/" target="_blank" rel="noopener">Color Consistency in Design Systems — UXPin</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://horizon.servicenow.com/workspace/components/now-pill" target="_blank" rel="noopener">Pill - Horizon Design System - ServiceNow</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/design-bootcamp/ux-blueprint-03-badges-vs-chips-tags-a-friendly-guide-e38ab2217be3" target="_blank" rel="noopener">Badges vs chips/tags — a friendly guide (Bootcamp/Medium)</a></p>
