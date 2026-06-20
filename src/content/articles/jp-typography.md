---
title: "日本語が読みにくい——行間・約物・ジャンプ率"
problem: "日本語の行間・約物アキ・字間が整わず、読みにくく素人っぽい。"
category: タイポ
tags: [日本語, 組版, palt]
date: 2026-06-20
sources: 10
draft: false
---

<style>
  .jp-base{font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Noto Sans JP',sans-serif;color:#16150f}
  .jp-block{width:88%;max-width:300px;text-align:left}
  .jp-bad-lh{line-height:1.15;letter-spacing:0;font-size:15px}
  .jp-good-lh{line-height:1.8;letter-spacing:0.04em;font-size:15px}
  .jp-yaku-bad{font-size:17px;line-height:1.9;letter-spacing:0}
  .jp-yaku-good{font-size:17px;line-height:1.9;letter-spacing:0;font-feature-settings:'palt' 1}
  .jp-jump-bad b{font-size:1.05rem;display:block;margin-bottom:.4em;font-weight:700}
  .jp-jump-bad span{font-size:1rem;line-height:1.7}
  .jp-jump-good b{font-size:2rem;display:block;margin-bottom:.35em;font-weight:700;line-height:1.3;letter-spacing:.01em}
  .jp-jump-good span{font-size:1rem;line-height:1.7}
  .jp-wide{max-width:none;width:94%;font-size:14px;line-height:1.9}
  .jp-narrow{max-width:230px;width:94%;font-size:14px;line-height:1.9;text-align:justify;text-justify:inter-character}
  .jp-small-bad{font-size:13px;line-height:1.8;letter-spacing:0;font-feature-settings:'palt' 1}
  .jp-small-good{font-size:13px;line-height:1.8;letter-spacing:0.06em;font-feature-settings:'palt' 1}
  .jp-font-row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .jp-weight{width:120px;height:96px;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;color:#16150f;background:#fff;border:1px solid rgba(22,21,15,.16);text-align:center;padding:8px}
  .jp-weight .jp-kb{font-size:11px;color:#5c5a50}
  .jp-tag{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;color:#5c5a50;margin-bottom:.5em}
</style>

## 結論

プロは「日本語は英語よりも行間を広く・行長を短く・約物を詰める」の3点で可読性を組み立てる。一次情報のデジタル庁デザインシステム(DADS)を基準に、本文は `font-size:16px` 以上・`line-height:1.5〜1.75`・`letter-spacing:0.02em` を土台とし、約物の余分なアキは `font-feature-settings:"palt"` または YakuHanJP で詰める。さらに見出し/本文のジャンプ率を150〜200%取って階層を作り、重い日本語Webフォントは見出しだけに限定して本文は端末標準フォントで軽く流す。

## 01 — 行間は最低1.5、読み物は1.7前後にする

漢字は画数が多く字面が大きいため、英語基準の詰まった `line-height:1.2` だと文字が団子状に潰れて素人臭くなる。DADSは本文を150%(標準)/160%/170〜175%(認知負荷軽減)と段階定義しており、WCAGの最低基準も1.5。読み物は1.75が無難な落としどころで、英語より+10〜15%広げるのが定石だ。字間も `0` のままより `0.02em` 以上で呼吸させる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-bad-lh">日本語の本文は漢字の字面が大きく、行間を詰めると行同士がくっついて団子状に潰れます。視線が次の行を見失い、読むのに疲れます。</div></div><div class="label">✗ line-height:1.15 / letter-spacing:0 → 団子状に潰れる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-good-lh">日本語の本文は漢字の字面が大きく、行間を広げると一行ずつが分離して読みやすくなります。視線の移動が安定し、長文でも疲れません。</div></div><div class="label">✓ line-height:1.8 / letter-spacing:0.04em → 行が分離して快適</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://design.digital.go.jp/dads/foundations/typography/" target="_blank" rel="noopener">タイポグラフィ（概要）｜デジタル庁デザインシステムβ版</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://qiita.com/NagayamaToshiaki/items/25d4969636d05bf48c41" target="_blank" rel="noopener">日本語の文章とline-heightに対する考察 #CSS - Qiita</a></p>

## 02 — 約物の余分なアキを palt / YakuHanJP で詰める

「」（）、。などの全角約物は前後に半角分の余白を持ち、行頭や連続時に不自然な穴が空いてリズムが崩れる。素のNoto Sans JPはこの状態だ。`font-feature-settings:"palt"` はOpenTypeプロポーショナルメトリクスで全体を一律に詰めて引き締まるので見出し向き。本文の自然なリズムを保ちたいなら約物だけ詰める YakuHanJP(明朝は YakuHanMP)が定石になる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-yaku-bad">「設定」（および「通知」）を、ここで変更できます。</div></div><div class="label">✗ palt なし → 約物の前後に穴が空く</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-yaku-good">「設定」（および「通知」）を、ここで変更できます。</div></div><div class="label">✓ palt 1 → 約物が詰まりリズムが整う</div></div>
</div>

<div class="note"><b>使い分け：</b>見出し・バナーで全体を締めたいなら <code>palt</code>。本文の読み物で自然なリズムを保ちたいなら約物だけ詰める <code>YakuHanJP</code>。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://udct.co.jp/little-press/kerning-and-yakuhanjp/" target="_blank" rel="noopener">「Yaku Han JP」から、デジタル上における字詰めの技術を振り返る｜Undercurrent</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.to-ko-s.com/punctuation-mark-kerning/" target="_blank" rel="noopener">Webで行う役物の文字詰め方法(font-feature-settings, YakuHanJP)</a></p>

## 03 — ジャンプ率150〜200%で見出しと本文に階層をつける

見出しと本文のサイズ比が100〜125%だと区別がつかず、のっぺりして情報設計が無いように見える。150%以上で階層が成立し、一般Webは150〜200%が標準。バナーやヒーローの主役コピーは300〜400%まで上げて高コントラスト演出にする。見出しは `line-height:1.4`・`letter-spacing:0.01em`(36px以上)で締めるのがDADS流だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-jump-bad"><b>機能の概要</b><span>本文とほぼ同じ大きさだと、どこが見出しか判別できません。</span></div></div><div class="label">✗ ジャンプ率 約105% → 見出しが埋もれる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-jump-good"><b>機能の概要</b><span>見出しを2倍にすると階層が一目で立ち上がり、視線が誘導されます。</span></div></div><div class="label">✓ ジャンプ率 約200% → 階層が明確</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.i-ryo.com/entry/2019/02/19/230354" target="_blank" rel="noopener">【行長・行間・ジャンプ率】タイポグラフィ事始め - クモのようにコツコツと</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://envision-inc.jp/insights/column20" target="_blank" rel="noopener">ジャンプ率の定義や重要性を解説！｜envision Inc.</a></p>

## 04 — 行長は1行25〜35字に制限する

日本語の最適行長は英語(45〜75字)の約半分で、25〜35字(モバイルは約20字)。PC全幅にベタ流しすると1行が50字を超え、視線の戻りが大きくて読み疲れる。`max-width:34em` 程度で字数を制御するのが手堅い。日本語はハイフネーション不要なので `text-align:justify`(両端揃え)も有効に効く。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-wide">日本語の本文を全幅にベタ流しすると、一行が長くなりすぎて、行末から次の行頭へ視線を戻すときに距離が大きく、どこを読んでいたか見失いやすく、読み疲れの原因になります。</div></div><div class="label">✗ 全幅ベタ流し(50字超) → 視線の戻りが大きい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-narrow">日本語の本文は1行25〜35字に収めると、視線の戻りが短くリズムよく読めます。両端揃えで端も整います。</div></div><div class="label">✓ max-width で約30字 + justify → 読みやすい</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.aqworks.com/blog/perfect-japanese-typography" target="_blank" rel="noopener">Seven rules for perfect Japanese typography - AQ</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@masaharuhayataki/japanese-web-typography-anatomy-and-best-practices-185449b7be65" target="_blank" rel="noopener">Japanese Web Typography: Anatomy and Best Practices | Masaharu Hayataki</a></p>

## 05 — paltの過剰圧縮は letter-spacing で戻す

paltは仮名・約物を一律に詰めるため、小サイズ本文に強く効かせると過剰圧縮で窮屈になる。`letter-spacing:0.02〜0.08em`(きつければ0.1emまで)を併用して詰めた分を戻し、`font-kerning:normal` も添えるのが正解。一律圧縮を避けたいなら、仮名だけプロポーショナルにする `pkna` という緩い代替もモダンブラウザ全対応で使える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-small-bad">注釈やキャプションのような小さい文字にpaltだけを当てると、仮名が詰まりすぎて窮屈に見え、かえって読みにくくなります。</div></div><div class="label">✗ palt のみ / letter-spacing:0 → 詰まりすぎ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-base jp-block jp-small-good">注釈やキャプションのような小さい文字には、詰めた分を字間で戻すとほどよい余白が生まれ、読みやすさが回復します。</div></div><div class="label">✓ palt + letter-spacing:0.06em → 余白が回復</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://pgmemo.tokyo/data/archives/2587.html" target="_blank" rel="noopener">pgmemo: 読みやすい日本語フォントCSSとカーニング</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://ics.media/en/entry/14087/" target="_blank" rel="noopener">Using CSS font-feature-settings for better kerning in Japanese text - ICS MEDIA</a></p>

## 06 — 本文は端末標準フォント、Webフォントは見出しに限定する

日本語Webフォントは2MB超で英語(約500KB)の約4倍重く、本文全文に当てるとFOIT/FOUTで体験が劣化し安っぽく感じる。本文はヒラギノ角ゴ/游ゴシック/Meiryo等のweb-safeスタックで軽く流し、Webフォント(Noto Sans JP等)は見出しだけに限定するのが定石。可変フォント+サブセット化が使えるなら本文Webフォントも現実的になってきた。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-font-row"><div class="jp-weight"><b style="font-size:18px">本文 + 見出し</b><span class="jp-kb">Webフォント 2MB超</span></div><div class="jp-weight" style="background:#16150f;color:#f4f2ec;border-color:#16150f"><b style="font-size:18px">読み込み遅延</b><span class="jp-kb" style="color:#8d8b80">FOIT / FOUT</span></div></div></div><div class="label">✗ 本文全文にWebフォント → 重く表示が遅い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="jp-font-row"><div class="jp-weight"><b style="font-size:18px">見出しだけ</b><span class="jp-kb">Webフォント(限定)</span></div><div class="jp-weight"><b style="font-size:15px">本文は端末標準</b><span class="jp-kb">web-safe / 即表示</span></div></div></div><div class="label">✓ 見出しのみWebフォント + 本文web-safe → 軽快</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@masaharuhayataki/japanese-web-typography-anatomy-and-best-practices-185449b7be65" target="_blank" rel="noopener">Japanese Web Typography: Anatomy and Best Practices | Masaharu Hayataki</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://design.digital.go.jp/dads/foundations/typography/" target="_blank" rel="noopener">タイポグラフィ（概要）｜デジタル庁デザインシステムβ版</a></p>

## 実装スニペット

本文(読み物)— DADS準拠のベース。`line-height:1.75`・`letter-spacing:0.02em`・`font-size:16px` はDADS/WCAG準拠、`max-width:34em` で行長を25〜35字帯に収める。

```css
body, .prose {
  font-family: 'Hiragino Kaku Gothic ProN', 'Hiragino Sans',
               'Noto Sans JP', YuGothic, 'Yu Gothic', Meiryo, sans-serif;
  font-size: 16px;
  line-height: 1.75;          /* 漢字の字面に合わせ広め */
  letter-spacing: 0.02em;     /* DADS標準テキスト 2% */
  font-feature-settings: 'palt' 1;
  font-kerning: normal;
}
.prose p { max-width: 34em; } /* ≒1行34字に制限 */
```

約物だけ詰める — YakuHanJP(本文向き)。paltと違い仮名・英数は詰めず、約物のみ。本文の自然なリズムを保ちたい読み物に。明朝は `yakuhanmp`。

```css
/* <link rel="stylesheet"
   href="https://cdn.jsdelivr.net/npm/yakuhanjp@4.1.1/dist/css/yakuhanjp.min.css"> */
.prose {
  /* YakuHanJP を先頭に置くと約物だけ詰まり、本文リズムは維持 */
  font-family: 'YakuHanJP', 'Hiragino Kaku Gothic ProN',
               'Noto Sans JP', sans-serif;
  line-height: 1.7;
  letter-spacing: 0.02em;
}
```

見出し / ヒーロー — paltで締める + 高ジャンプ率。見出しは `line-height:1.4`・`letter-spacing:0.01em`(DADS)、ヒーローはジャンプ率300%超で行間を詰める。

```css
.heading {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 700;
  font-size: 2rem;            /* 本文16px比 約200% ジャンプ率 */
  line-height: 1.4;           /* DADS見出し 140% */
  letter-spacing: 0.01em;     /* 36px+は1%、それ未満は0〜 */
  font-feature-settings: 'palt' 1;
}
.hero-copy {
  font-size: 3rem;            /* 本文比 300%超でヒーロー演出 */
  line-height: 1.25;
  letter-spacing: 0;
  font-feature-settings: 'palt' 1;
}
```

paltが小サイズで詰まりすぎる時の補正。`letter-spacing` で戻し、`pkna`(プロポーショナル仮名)を緩い代替に。

```css
.note {
  font-size: 14px;
  font-feature-settings: 'palt' 1;
  letter-spacing: 0.06em;     /* 0.02–0.08em、きつければ0.1emまで */
  line-height: 1.8;
}
/* paltが強すぎる場合の代替: 仮名のみプロポーショナル */
.alt { font-feature-settings: 'pkna' 1; }
```

## チェックリスト

<ul class="check">
  <li>本文の <code>line-height</code> は1.5以上、読み物なら1.7前後にしたか</li>
  <li>本文 <code>font-size</code> は16px以上、補助テキストでも14pxを下限にしたか</li>
  <li><code>letter-spacing</code> をサイズ別に 0.02em / 0.01em / 0 で設定したか</li>
  <li>約物のアキを <code>palt</code>(見出し)か YakuHanJP(本文)で詰めたか</li>
  <li>見出し/本文のジャンプ率は150〜200%以上あるか</li>
  <li>本文の行長を <code>max-width</code> で25〜35字帯に収めたか</li>
  <li>小サイズにpaltを当てた箇所は <code>letter-spacing</code> で戻したか</li>
  <li>本文は端末標準フォント、Webフォントは見出しに限定したか</li>
</ul>

## 限界 / 出典

数値は「正解1点」ではなくレンジである点に注意。DADSは `line-height` 150〜175%・`letter-spacing` 0/0.01/0.02em を段階トークンとして提示しており、コンテンツ特性(読み物/UI/業務系)で選ぶ前提だ。記事採用の1.75は中間値の一例で、情報密度優先の管理画面UIなら120〜130%まで下げてよい。ジャンプ率150〜200%・行長25〜35字などの具体値は一次情報ではなく実務ブログ由来(confidence medium)が多く、権威度は DADS > AQ/ICS > 個人ブログの順。約物の `palt`/`pkna` はフォント側に当該OpenTypeテーブルがある場合のみ効き、フォールバックのweb-safeフォントでは効かない(Noto Sans JPは対応)。日本語フォント2MB・英語500KBは単一ブログの概算で、フォントやサブセットで大きく変動する(2024〜2026は可変フォント+サブセット化で緩和傾向)。`letter-spacing:0.05em` というHayataki固有値はDADSの0.02emと食い違い、小サイズや約物未処理時の代替値と解釈するのが妥当。DADSはβ版で改訂が続くため、実装前に最新版の数値確認を推奨する。

<p class="src"><span class="badge b-primary">primary</span><a href="https://design.digital.go.jp/dads/foundations/typography/" target="_blank" rel="noopener">タイポグラフィ（概要）｜デジタル庁デザインシステムβ版</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.aqworks.com/blog/perfect-japanese-typography" target="_blank" rel="noopener">Seven rules for perfect Japanese typography - AQ</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/@masaharuhayataki/japanese-web-typography-anatomy-and-best-practices-185449b7be65" target="_blank" rel="noopener">Japanese Web Typography: Anatomy and Best Practices | Masaharu Hayataki</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.to-ko-s.com/punctuation-mark-kerning/" target="_blank" rel="noopener">Webで行う役物の文字詰め方法(font-feature-settings, YakuHanJP)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://udct.co.jp/little-press/kerning-and-yakuhanjp/" target="_blank" rel="noopener">「Yaku Han JP」から、デジタル上における字詰めの技術を振り返る｜Undercurrent</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://ics.media/en/entry/14087/" target="_blank" rel="noopener">Using CSS font-feature-settings for better kerning in Japanese text - ICS MEDIA</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://pgmemo.tokyo/data/archives/2587.html" target="_blank" rel="noopener">pgmemo: 読みやすい日本語フォントCSSとカーニング</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.i-ryo.com/entry/2019/02/19/230354" target="_blank" rel="noopener">【行長・行間・ジャンプ率】タイポグラフィ事始め - クモのようにコツコツと</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://qiita.com/NagayamaToshiaki/items/25d4969636d05bf48c41" target="_blank" rel="noopener">日本語の文章とline-heightに対する考察 #CSS - Qiita</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://envision-inc.jp/insights/column20" target="_blank" rel="noopener">ジャンプ率の定義や重要性を解説！｜envision Inc.</a></p>
