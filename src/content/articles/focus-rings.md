---
title: "フォーカスが消えてる——focusリングの設計"
problem: "outlineを消してアクセシビリティを壊しがち。"
category: 細部
tags: [フォーカス, a11y, 状態]
date: 2026-06-20
sources: 6
draft: false
---

<style>
  .foc-btn{padding:12px 22px;border:none;border-radius:8px;background:#16150f;color:#f4f2ec;font-weight:700;font-size:14px;cursor:pointer}
  .foc-link{color:#16150f;font-weight:700;font-size:14px;text-decoration:underline;cursor:pointer}

  /* 01: outline:none 単独 vs 代替リング */
  .foc-bad1{outline:none}
  .foc-good1{outline:2px solid #1a73e8;outline-offset:2px}

  /* 02: :focus 常時 vs :focus-visible（疑似的に常時表示で再現） */
  .foc-noisy{outline:3px solid #1a73e8;outline-offset:2px}
  .foc-clean{outline:none}

  /* 03: コントラスト不足の細い薄リング vs 3:1 のリング */
  .foc-thin{outline:1px solid #cccccc;outline-offset:2px}
  .foc-strong{outline:3px solid #1a73e8;outline-offset:2px}

  /* 04: box-shadow だけ（クリップで消える）vs outline 主体 */
  .foc-clip{overflow:hidden;width:170px;height:120px;border-radius:12px;background:var(--ink);display:flex;align-items:center;justify-content:center}
  .foc-clip-inner{width:150px;padding:14px 0;text-align:center;border-radius:8px;background:#f4f2ec;color:#16150f;font-weight:700;font-size:13px}
  .foc-shadowring{box-shadow:0 0 0 4px #1a73e8}
  .foc-outlinering{outline:3px solid #1a73e8;outline-offset:2px}

  /* 05: 単色リング（暗背景で沈む）vs 黒+白 二色ハロー */
  .foc-photo{background:repeating-linear-gradient(45deg,#3a3730 0 14px,#4a463d 14px 28px);width:100%;height:100%;display:flex;align-items:center;justify-content:center}
  .foc-onecolor{outline:3px solid #16150f;outline-offset:2px}
  .foc-oreo{outline:3px solid #16150f;box-shadow:0 0 0 6px #ffffff}
</style>

## 結論

プロは focus リングを「飾り」ではなくアクセシビリティ契約として扱う。`outline` を消すなら必ず同等以上の代替を同じセレクタに置き、`:focus-visible` でキーボード時だけ表示し、WCAG の2つの 3:1 コントラスト（フォーカス前後の変化＝SC 2.4.13／隣接色との差＝SC 1.4.11）と「2 CSS px 厚の外周分」の最低面積を満たす。主役は `overflow:hidden` や forced-colors に強い `outline`、背景が読めない場面では黒+白の二色ハローを重ねるのが定石だ。

## 01 — outline を消すなら、必ず同じセレクタで置き換える

`outline:none` や `outline:0` を代替なしで書いた瞬間、キーボード利用者は「今どこにいるか」を完全に見失う。ブラウザ標準のフォーカスリングは WCAG のコントラスト要件が免除されているが、CSS で上書きした途端に 3:1 と最低面積の責任は自分に移る。これは WCAG SC 2.4.7（Level A）違反で、「焦点が消えてる」の最大の原因。ルールは単純で、`outline:none` と書いたら同じセレクタに必ず代替リングをセットで書く。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-bad1">送信</button></div><div class="label">✗ outline:none だけ → 見た目はすっきりだがフォーカスが完全に消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-good1">送信</button></div><div class="label">✓ 同じ要素に 2px solid のリングを置く → どこにいるか分かる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>

## 02 — :focus ではなく :focus-visible でキーボード時だけ出す

`:focus` で常時リングを出すと、マウスクリックやタップのたびに太いリングが現れてビジュアルノイズになる。それを嫌ったデザイナーが結局 `outline:none` に走る——この悪循環が事故の温床だ。`:focus-visible` は UA のヒューリスティックでキーボード操作時のみリングを表示し、ポインタ操作では出さない。これでノイズを抑えつつキーボードアクセシビリティを維持でき、「消したくなる動機」そのものが消える。Baseline で2022年3月から主要ブラウザ対応済み。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-noisy">クリック</button></div><div class="label">✗ :focus → マウスクリックでも太いリングが残りノイズになる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-clean">クリック</button></div><div class="label">✓ :focus-visible → マウス時は静か、Tab で来たときだけ出る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible" target="_blank" rel="noopener">:focus-visible CSS pseudo-class — MDN Web Docs</a></p>

## 03 — 3:1 を満たす太さと色で。薄い細リングは「無いのと同じ」

「主張させたくない」という心理から、つい `1px #ccc` や半透明グレーの細リングにしてしまう。だが SC 1.4.11 は、フォーカス状態のリングが隣接色に対して 3:1 のコントラストを持つことを求める。薄く細いリングは明るい背景や写真の上で消え、実質「無いのと同じ」になる。色は明背景・暗背景・写真上など複数の隣接色でテストし、最低面積（後述の 2 CSS px 厚相当）も同時に確保する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-thin">保存</button></div><div class="label">✗ 1px #ccc → 紙色の上で 3:1 を割り、ほぼ見えない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="foc-btn foc-strong">保存</button></div><div class="label">✓ 3px の十分なコントラスト色 → どの背景でも視認できる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" target="_blank" rel="noopener">Understanding SC 2.4.13: Focus Appearance | WAI | W3C</a></p>

## 04 — 主役は outline。box-shadow だけはクリップで消える

「角丸に追従するから」と box-shadow 単独でリングを作ると、`overflow:hidden` の親（カード・モーダル・スクロール領域）の内側でクリップされて消える。さらに Windows ハイコントラスト／forced-colors では box-shadow が剥がされ、リングが丸ごと消滅する——デバッグしにくい不可視バグだ。一次指標は `outline 2–3px solid + outline-offset` にする。`outline` はクリップされず forced-colors でも残り、現代ブラウザは `outline` でも border-radius を尊重するので、かつて box-shadow が好まれた理由は解消した。box-shadow はハローへ降格する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foc-clip"><div class="foc-clip-inner foc-shadowring">box-shadow</div></div></div><div class="label">✗ box-shadow だけ → overflow:hidden の親にリングがクリップされ消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foc-clip"><div class="foc-clip-inner foc-outlinering">outline</div></div></div><div class="label">✓ outline 主体 → クリップ親をはみ出して必ず見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.72technologies.com/blog/focus-rings-visible-focus-guide" target="_blank" rel="noopener">Visible Focus Rings: A Practical Guide for 2026 — 72Technologies</a></p>

## 05 — 背景が読めないなら、黒+白の二色リングで両賭けする

単色リングは一部の隣接色で必ず 3:1 を割る。暗い写真の上に黒リングを置けば沈むし、白リングは明るい背景で消える。黒 `outline` と白 `box-shadow` ハローを重ねた「サンドイッチ／Oreo」型なら、明暗どちらの背景でも片方の色が必ずコントラストして見える。LP・バナー・テーマ切替・写真や動画の上など、背景色が固定でない再利用コンポーネントの安全策だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="padding:0;overflow:hidden"><div class="foc-photo"><button class="foc-btn foc-onecolor" style="background:#f4f2ec;color:#16150f">詳しく見る</button></div></div><div class="label">✗ 単色（黒）リング → 暗い背景の上で輪郭が沈んで読めない</div></div>
  <div class="demo"><div class="canvas" style="padding:0;overflow:hidden"><div class="foc-photo"><button class="foc-btn foc-oreo" style="background:#f4f2ec;color:#16150f">詳しく見る</button></div></div><div class="label">✓ 黒+白の二色ハロー → 暗背景では白が、明背景では黒が効く</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>

## 06 — forced-colors とレガシーのフォールバックを置く

forced-colors（Windows ハイコントラスト）では box-shadow が剥がされるため、`@media (forced-colors: active)` でシステムカラーキーワード（`CanvasText` など）の `outline` に切り替える。`:focus-visible` 非対応の旧ブラウザには `@supports not selector(:focus-visible)` で `:focus` フォールバックを与える。行政・BtoB などアクセシビリティ要件が厳しい本番ではここまで用意する。下のデモは forced-colors 時に色がシステム由来に置き換わる挙動を、二色ハロー（不安定）と単色 outline（安定）で対比したもの。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--ink)"><button class="foc-btn foc-oreo" style="background:#f4f2ec;color:#16150f">送信</button></div><div class="label">✗ ハロー頼み → forced-colors で box-shadow が剥がれ白い縁が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--ink)"><button class="foc-btn" style="background:#f4f2ec;color:#16150f;outline:3px solid #de3c24;outline-offset:3px">送信</button></div><div class="label">✓ outline 主体 → forced-colors では CanvasText に切替えて必ず残る</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.72technologies.com/blog/focus-rings-visible-focus-guide" target="_blank" rel="noopener">Visible Focus Rings: A Practical Guide for 2026 — 72Technologies</a></p>

## 実装スニペット

デフォルトの第一選択。多くの UI でこれが最適解。`max(2px, 0.08em)` にすれば要素サイズに追従する。

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring, #1a73e8);
  outline-offset: 2px;
}

/* マウスクリックの :focus ノイズを消す（レガシー保険） */
:focus:not(:focus-visible) {
  outline: none;
}
```

背景が読めない LP・バナー向け。黒+白の二色リングと、主要 CTA 用の Oreo 二重リング。

```css
:focus-visible {
  outline: 3px solid black;
  box-shadow: 0 0 0 6px white;
}

/* より高い視認性が要る主要 CTA 等（Oreo 二重リング） */
.cta:focus-visible {
  outline: 9px double black;
  box-shadow: 0 0 0 6px white;
}
```

outline を一次指標にしつつ、busy 背景でハロー（box-shadow）でプロミネンスを足す。ハローが消える環境でも 3:1 を維持できる。

```css
.button:focus-visible {
  outline: 2px solid var(--color-focus-ring, #1a73e8);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--color-focus-ring-halo, rgba(255,255,255,.9));
}
```

forced-colors と `:focus-visible` 非対応のフォールバック。本番で最も堅い構成。

```css
.button:focus-visible {
  outline: 3px solid deepskyblue;
  outline-offset: 3px;
}

@supports not selector(:focus-visible) {
  .button:focus {
    outline: 3px solid deepskyblue;
    outline-offset: 3px;
  }
}

@media (forced-colors: active) {
  .button:focus-visible {
    outline: 2px solid CanvasText;
  }
}
```

## チェックリスト

<ul class="check">
  <li><code>outline:none</code> / <code>outline:0</code> を書いた箇所すべてに、同じセレクタの代替リングがセットで存在する</li>
  <li>リングは <code>:focus-visible</code> で出している（<code>:focus</code> 常時表示でマウスノイズを出していない）</li>
  <li>リング色は隣接色に対して 3:1（SC 1.4.11）。明背景・暗背景・写真上で実測した</li>
  <li>フォーカス前後で同じピクセルが 3:1 変化する（SC 2.4.13 の change-of-contrast）</li>
  <li>面積は 2 CSS px 厚の外周分以上。<code>dashed</code>/<code>dotted</code> を使うなら約 4px に倍増させた</li>
  <li>一次指標は <code>outline</code>。<code>overflow:hidden</code> の親内・スクロールコンテナ内でクリップされて消えないか確認した</li>
  <li>背景が固定でない再利用コンポーネントは黒+白の二色（Oreo）リングにした</li>
  <li><code>@media (forced-colors: active)</code> で <code>CanvasText</code> 等のシステムカラー <code>outline</code> に切替えた</li>
  <li><code>@supports not selector(:focus-visible)</code> で旧ブラウザに <code>:focus</code> フォールバックを置いた</li>
  <li>色値（<code>#1a73e8</code>/<code>deepskyblue</code> 等）は例示。実際の隣接色で 3:1 を満たすか各自テストした</li>
</ul>

## 限界 / 出典

数値（3:1、2 CSS px 厚の外周分、Baseline 2022-03）は W3C／MDN／WebAIM の一次・準一次ソースで一致しており信頼度は高い。注意点は4つ。

<div class="note"><b>適合レベルの表記揺れ：</b>SC 2.4.13 Focus Appearance は Level AAA。一方で原資料間（Soueidan 記事内でも AAA とする箇所と「要件」として扱う箇所がある）に表記揺れがある。法的義務は WCAG 2.1 AA を基準とする案件が多く、2.4.13（2.2 追加）の扱いは契約要件で必ず確認すること。本記事では「実務上の良い設計目安」として AAA 基準を採用している。</div>

<div class="note"><b>box-shadow 二色リングの弱点：</b>box-shadow ベースの黒+白リングは <code>overflow:hidden</code> の親内でクリップされ、forced-colors で剥がされる。クリップする親を持つコンポーネントでは outline 主体版に寄せること。</div>

<div class="note"><b>ブログ品質ソース：</b>72Technologies と CSS-Tricks はブログ品質（個人/企業の実務知見）で規範ソースではない。具体的な色値（<code>deepskyblue</code>/<code>#1a73e8</code> 等）は例示であり、実際の隣接色に対して 3:1 を満たすかは各自テスト必須。</div>

<div class="note"><b>outline の border-radius 尊重：</b>「最近のブラウザは outline で border-radius を尊重」は2026年時点の前提で、極端に古い環境では成り立たない可能性がある。重要案件では実機確認を。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html" target="_blank" rel="noopener">Understanding SC 2.4.13: Focus Appearance | WAI | W3C</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://webaim.org/articles/contrast/" target="_blank" rel="noopener">WebAIM: Contrast and Color Accessibility</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible" target="_blank" rel="noopener">:focus-visible CSS pseudo-class — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/standardizing-focus-styles-with-css-custom-properties/" target="_blank" rel="noopener">Standardizing Focus Styles with CSS Custom Properties — CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.72technologies.com/blog/focus-rings-visible-focus-guide" target="_blank" rel="noopener">Visible Focus Rings: A Practical Guide for 2026 — 72Technologies</a></p>
