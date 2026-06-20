---
title: "メリハリがない——コントラストで階層を作る"
problem: "全部同じ強さで、どこを見ればいいか分からない平板な画面になる。"
category: 色
tags: [コントラスト, 階層, 視線誘導]
date: 2026-06-20
sources: 9
draft: false
---

<style>
  .con-stack{display:flex;flex-direction:column;gap:6px;text-align:left;width:100%;max-width:240px;padding:0 8px}
  .con-flat *{color:#16150f;font-weight:700;font-size:16px;margin:0}
  .con-h1{color:#16150f;font-weight:700;font-size:20px;margin:0;line-height:1.3}
  .con-body2{color:rgba(22,21,15,.87);font-weight:400;font-size:14px;margin:0;line-height:1.4}
  .con-meta{color:rgba(22,21,15,.60);font-weight:400;font-size:12px;margin:0}

  .con-card{background:#fff;border-radius:8px;padding:14px 16px;width:100%;max-width:240px;text-align:left;box-shadow:0 1px 2px rgba(22,21,15,.08)}
  .con-card .con-t{color:rgba(22,21,15,.87);font-weight:700;font-size:16px;margin:0 0 6px}
  /* bad: secondary text de-emphasized with thin weight */
  .con-thin{color:#16150f;font-weight:300;font-size:13px;margin:0;line-height:1.45}
  /* good: secondary text de-emphasized with opacity, normal weight */
  .con-dim{color:rgba(22,21,15,.60);font-weight:400;font-size:13px;margin:0;line-height:1.45}

  /* color background secondary text */
  .con-banner{background:#1e7a46;border-radius:8px;padding:16px 18px;width:100%;max-width:240px;text-align:left}
  .con-banner .con-bt{color:#fff;font-weight:700;font-size:16px;margin:0 0 6px}
  .con-gray{color:#9a9a9a;font-weight:400;font-size:13px;margin:0;line-height:1.45} /* washed out */
  .con-white60{color:rgba(255,255,255,.75);font-weight:400;font-size:13px;margin:0;line-height:1.45}

  /* label vs value */
  .con-row{display:flex;flex-direction:column;gap:2px;text-align:left}
  .con-lab-bad{color:#16150f;font-weight:700;font-size:15px;margin:0}
  .con-val-bad{color:#16150f;font-weight:700;font-size:15px;margin:0}
  .con-lab-good{color:rgba(22,21,15,.60);font-weight:500;font-size:11px;letter-spacing:.04em;text-transform:uppercase;margin:0}
  .con-val-good{color:rgba(22,21,15,.87);font-weight:700;font-size:18px;margin:0}

  /* F-pattern / wall of text */
  .con-prose{text-align:left;width:100%;max-width:240px;font-size:11px;line-height:1.5}
  .con-prose p{color:rgba(22,21,15,.87);margin:0 0 6px}
  .con-wall p{color:rgba(22,21,15,.87);margin:0}
  .con-prose h5{color:#16150f;font-weight:700;font-size:14px;margin:0 0 4px}
  .con-prose strong{font-weight:600;color:#16150f}
  .con-callout{background:#eceae2;border-left:3px solid #de3c24;padding:6px 8px;border-radius:4px;margin:6px 0 0}
</style>

## 結論

メリハリ（視覚的階層）は気合いではなく**サイズ・フォントウェイト・色（コントラスト）の3レバー**で機械的に作る。プロが最初にやるのは主役を巨大化することではなく、競合する**副要素を意図的に弱める**（背景に近づけてコントラストを下げる）こと。弱化はウェイトを細くするのではなく、不透明度やグレー階調・サイズで段階化し、操作要素だけはWCAGの下限を割らない——これだけで平板な画面に焦点が生まれる。

## 01 — 3レバーで階層を作る（サイズだけに頼らない）

階層は「サイズ・font-weight・色」の3つで作る。サイズ1本に頼ると主役が巨大化し副役が極小化してバランスが崩れる。サイズ差は控えめにして、ウェイト（600/700）と色コントラストを併用するのがプロの配合だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack con-flat"><p>新着レポート</p><p>2026年6月20日 更新</p><p>本文がここに続きます。すべて同じ濃さ同じ太さ。</p></div></div><div class="label">✗ 全部16px・全部太字の黒 → どこを見ればいいか分からない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack"><p class="con-h1">新着レポート</p><p class="con-meta">2026年6月20日 更新</p><p class="con-body2">本文がここに続きます。サイズ・ウェイト・色で3段階に。</p></div></div><div class="label">✓ 見出し20px/700、本文87%、メタ12px/60% → 視線が降りる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI</a></p>

## 02 — 主役を強めず脇役を弱める（emphasize by de-emphasizing）

主要素が既に十分大きいのに散漫に見えるなら、焦点を盛るのではなく**競合する副要素のコントラストを背景方向へ落とす**。これが最も上品な手法だ。二次テキストは明背景で黒87%→60%→38%、暗背景で白100%→70%→50%に段階化する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-card"><p class="con-t">Pro プラン</p><p class="con-thin">月額1,200円。チーム共有とエクスポートに対応。いつでも変更可能です。</p></div></div><div class="label">✗ 弱めたい補足を font-weight:300 → 細くて安っぽく可読性も低下</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-card"><p class="con-t">Pro プラン</p><p class="con-dim">月額1,200円。チーム共有とエクスポートに対応。いつでも変更可能です。</p></div></div><div class="label">✓ ウェイトは400のまま色を60%へ → 主役が相対的に立つ</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/text-legibility.html" target="_blank" rel="noopener">Text legibility — Material Design</a></p>

## 03 — 弱化はウェイトでなく色とサイズで（400未満は禁止）

UIで400未満のウェイトは細すぎて安っぽく、可読性が落ちる。弱めたいときはウェイトを下げるのではなく**色を薄く（グレー階調）するかサイズを下げる**。逆に低コントラストの要素を少し立てたいときだけ600/700を足す。通常は400/500の間で運用する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack"><p style="color:#16150f;font-weight:700;font-size:16px;margin:0">配送状況</p><p class="con-thin" style="font-size:14px">お届け予定 6月22日</p><p class="con-thin" style="font-size:14px">追跡番号 1234-5678</p></div></div><div class="label">✗ 補足を 300 で細らせる → かすれて読みにくい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack"><p style="color:#16150f;font-weight:700;font-size:16px;margin:0">配送状況</p><p style="color:rgba(22,21,15,.60);font-weight:400;font-size:13px;margin:0">お届け予定 6月22日</p><p style="color:rgba(22,21,15,.60);font-weight:400;font-size:13px;margin:0">追跡番号 1234-5678</p></div></div><div class="label">✓ ウェイト400・色60%・サイズ13px で弱める → 読めるのに引っ込む</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI</a></p>

## 04 — 色背景ではグレー禁止、透過白か同hueで弱める

グレーが効くのは「白背景でコントラストを下げている」からに過ぎない。色背景にグレーを乗せると濁って（washed out）汚く見える。色背景の二次テキストは**白文字のopacityを下げて背景を透かす**か、背景と同じhueでsaturation/lightnessだけ調整した色を使う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-banner"><p class="con-bt">無料トライアル受付中</p><p class="con-gray">クレジットカード不要、14日間お試しいただけます。</p></div></div><div class="label">✗ 緑背景に #9a9a9a のグレー → 濁って沈んで見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-banner"><p class="con-bt">無料トライアル受付中</p><p class="con-white60">クレジットカード不要、14日間お試しいただけます。</p></div></div><div class="label">✓ rgba(255,255,255,.75) で背景を透かす → 馴染んで階層も出る</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886" target="_blank" rel="noopener">Refactoring UI — 7 Practical Tips for Cheating at Design</a></p>

## 05 — ラベルは値と同格にしない

「価格：」「日付：」などのラベルは副次情報だ。値と同じ濃さ・サイズだと階層が潰れ、視線が散る。ラベルは**小さく・低コントラスト・軽め**にして、値を主役に立てる（そもそもラベルは最後の手段で、省けるなら省く）。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack" style="gap:10px"><div class="con-row"><p class="con-lab-bad">価格</p><p class="con-val-bad">¥3,800</p></div><div class="con-row"><p class="con-lab-bad">配送</p><p class="con-val-bad">無料</p></div></div></div><div class="label">✗ ラベルも値も同じ15px・太字の黒 → どっちが情報か不明瞭</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-stack" style="gap:10px"><div class="con-row"><p class="con-lab-good">価格</p><p class="con-val-good">¥3,800</p></div><div class="con-row"><p class="con-lab-good">配送</p><p class="con-val-good">無料</p></div></div></div><div class="label">✓ ラベル11px/60%、値18px/87% → 値が即座に拾える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>

## 06 — F字を壊して焦点へ誘導する

誘導シグナルのない「壁のようなテキスト」だと、ユーザーは最小努力のF字スキャンに落ち、最初の数行と各行の左端しか拾わない。**重要点を冒頭2段落に前置きし、見出しで区切り、キーワードを太字化し、関連要素を枠や背景でグループ化**してスキャン経路を断ち切る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-prose con-wall"><p>本サービスは複数の機能を備えており設定画面から各種オプションを変更でき通知やエクスポートやチーム共有なども利用可能でプランによって上限が異なります詳細は料金ページをご確認ください。</p></div></div><div class="label">✗ 見出しも太字も区切りもない壁 → 左上だけ読まれて離脱</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="con-prose"><h5>主要機能</h5><p><strong>チーム共有</strong>と<strong>エクスポート</strong>に対応。</p><p>通知や上限はプランで変わります。</p><div class="con-callout">詳細は料金ページへ</div></div></div><div class="label">✓ 見出し+キーワード太字+グループ化 → 視線を焦点へ運べる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/" target="_blank" rel="noopener">F-Shaped Pattern of Reading on the Web — NN/g</a></p>

## 実装スニペット

```css
/* 明背景の3段階テキスト階層（Material の emphasis レベル） */
:root{
  --text-high: rgba(0,0,0,.87);     /* 見出し・主テキスト */
  --text-medium: rgba(0,0,0,.60);   /* 二次・メタ・ヒント */
  --text-disabled: rgba(0,0,0,.38); /* 無効・補助の最弱 */
}
.title { color: var(--text-high);   font-weight: 700; font-size: 1.25rem; }
.body  { color: var(--text-high);   font-weight: 400; }
.meta  { color: var(--text-medium); font-weight: 400; font-size: .875rem; }
.label { color: var(--text-medium); font-weight: 500; font-size: .75rem;
         text-transform: uppercase; letter-spacing: .04em; }
```

```css
/* 暗背景の階層（白の不透明度。二次/無効を明背景より高めに） */
.dark{
  background:#121212;
  --on-dark-high:     rgba(255,255,255,1);    /* 100% */
  --on-dark-medium:   rgba(255,255,255,.70);  /* 二次 70% */
  --on-dark-disabled: rgba(255,255,255,.50);  /* 50% */
}
.dark .title { color: var(--on-dark-high); }
.dark .meta  { color: var(--on-dark-medium); }
```

```css
/* 色背景の二次テキスト（透過白 or 同hue。グレーは使わない） */
.banner{ background:#1e7a46; color:#fff; }              /* green hero */
.banner .subtext     { color: rgba(255,255,255,.75); }  /* 方法1: 透過白で背景を透かす */
.banner .subtext--hue{ color:#a7d8bd; }                 /* 方法2: 同hueで L/S だけ調整 */
```

```css
/* F字を壊す見出し階層＋キーワード強調 */
.prose h2{ font-size: clamp(1.5rem,3vw,2rem); font-weight:700; line-height:1.3; margin:2em 0 .5em; }
.prose p { max-width: 65ch; color: rgba(0,0,0,.87); }
.prose strong{ font-weight:600; }                       /* キーワードを太字化 */
.prose .lead { font-size:1.125rem; }                    /* 冒頭2段落をやや大きく前置き */
.callout{ background:#f4f6f8; border-left:4px solid #1e7a46;
          padding:1rem 1.25rem; border-radius:6px; }    /* 関連要素をグループ化 */
```

## チェックリスト

<ul class="check">
  <li>階層を「サイズ・ウェイト・色」の3レバーで作っている（サイズ1本に依存していない）</li>
  <li>散漫なら主役を盛る前に、競合する副要素のコントラストを落とした</li>
  <li>二次テキストを明背景87/60/38%、暗背景100/70/50%で段階化した</li>
  <li>弱化に font-weight 400未満を使っていない（弱めるのは色とサイズ）</li>
  <li>色背景の二次テキストはグレーでなく透過白か同hueで処理した</li>
  <li>ラベルは値より小さく・軽く・低コントラストにした（または省いた）</li>
  <li>本文・操作要素は通常4.5:1／大テキスト・UIは3:1を満たしている</li>
  <li>長文は冒頭2段落に要点を置き、見出し・太字・グループ化でF字を壊した</li>
  <li>階層に使う色・ウェイトは2〜3種に絞った</li>
</ul>

## 限界 / 出典

<div class="note"><b>数値の食い違い：</b>Material の二次テキストは旧版が黒54%、現行M2が60%で差異がある。使うトークン体系（M2/M3か旧版か）を確認すること。本記事は現行M2の60%を採用。</div>

<div class="note"><b>opacity方式 vs 実色グレー：</b>opacityは背景が変わると合成色が変わる。重なり・スクショ・固定UI色が要る箇所では実色トークン（またはoklch階調）の方が安全。</div>

<div class="note"><b>WCAGは下限であって目標ではない：</b>4.5:1／3:1は「ここまでなら弱めてよい」線。本文・操作要素は必ず満たし、装飾的弱化のみこの線へ近づける。APCA／WCAG3は2026時点でドラフトのままで、納品・監査基準は依然WCAG2.1 AA。</div>

<div class="note"><b>F字は理想形ではない：</b>NN/gのF字は「悪いフォーマットの症状」であり読み方の手本ではない。バナーなど小面積ではサイズ差を取りにくいので、ウェイトと色コントラストを主レバーにする。CSS値（rgba/oklch/clamp）は対象ブラウザのサポートを確認し、古い環境にはフォールバックを用意すること。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/text-legibility.html" target="_blank" rel="noopener">Text legibility — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/typography/the-type-system.html" target="_blank" rel="noopener">The type system — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/" target="_blank" rel="noopener">F-Shaped Pattern of Reading on the Web — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://webaim.org/resources/contrastchecker/" target="_blank" rel="noopener">WebAIM: Contrast Checker</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI (GitHub gist)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886" target="_blank" rel="noopener">Refactoring UI — 7 Practical Tips for Cheating at Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sglavoie.com/posts/2023/09/09/book-summary-refactoring-ui/" target="_blank" rel="noopener">Book summary: Refactoring UI — sglavoie.com</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://accessibilityassistant.com/blog/accessibility-insights/wcag-2-colour-contrast-accessibility-guidelines/" target="_blank" rel="noopener">WCAG 2 Colour Contrast Guidelines</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://github.com/material-components/material-components-web/blob/0bfb393407727b9ad5e8de1e8dda6ea6a0ee21fd/packages/mdc-theme/README.md" target="_blank" rel="noopener">material-components-web / mdc-theme README</a></p>
