---
title: "写真の切り方が決まらない——トリミングと被写体配置"
problem: "写真のトリミングや被写体位置が決まらず、収まりが悪い。"
category: 画像
tags: [写真, トリミング, 構図]
date: 2026-06-20
sources: 9
draft: false
---

<style>
  .pho-frame{position:relative;width:150px;height:150px;background:var(--paper);overflow:hidden;border:1px solid var(--line)}
  .pho-grid-lines{position:absolute;inset:0;pointer-events:none}
  .pho-grid-lines::before,.pho-grid-lines::after{content:"";position:absolute;background:rgba(222,60,36,.55)}
  .pho-grid-lines::before{left:33.33%;right:33.33%;top:0;bottom:0;border-left:1px dashed rgba(222,60,36,.55);border-right:1px dashed rgba(222,60,36,.55);background:transparent}
  .pho-grid-lines::after{top:33.33%;bottom:33.33%;left:0;right:0;border-top:1px dashed rgba(222,60,36,.55);border-bottom:1px dashed rgba(222,60,36,.55);background:transparent}
  /* a stylized "subject": a head + shoulders rendered in pure CSS */
  .pho-subject{position:absolute;width:46px;height:46px;border-radius:50%;background:#16150f}
  .pho-subject::after{content:"";position:absolute;left:50%;top:54px;transform:translateX(-50%);width:78px;height:60px;border-radius:40px 40px 0 0;background:#16150f}
  .pho-center{left:50%;top:50%;transform:translate(-50%,-50%)}
  .pho-thirds{left:66.66%;top:33.33%;transform:translate(-50%,-50%)}
  .pho-sky{position:absolute;inset:0;background:linear-gradient(180deg,#9db4c4 0%,#cdd8de 100%)}
  .pho-land{position:absolute;left:0;right:0;bottom:0;background:#4a5a3a}
  .pho-horizon-bad .pho-land{height:50%}
  .pho-horizon-good .pho-land{height:33.33%}
  .pho-sun{position:absolute;width:26px;height:26px;border-radius:50%;background:#f4e3a1}
  .pho-horizon-bad .pho-sun{left:50%;top:25%;transform:translate(-50%,-50%)}
  .pho-horizon-good .pho-sun{left:66.66%;top:33.33%;transform:translate(-50%,-50%)}

  /* object-fit / object-position demo using a CSS-painted "photo" in an aspect box */
  .pho-photo{position:relative;width:120px;background:var(--paper);overflow:hidden;border:1px solid var(--line)}
  .pho-portrait{aspect-ratio:1/1}
  /* the "photo content": tall portrait, face near the top */
  .pho-fill{position:absolute;inset:0}
  .pho-fill .pho-body{position:absolute;left:50%;bottom:0;transform:translateX(-50%);width:70px;height:120px;border-radius:35px 35px 0 0;background:#7a6a55}
  .pho-fill .pho-face{position:absolute;left:50%;top:8px;transform:translateX(-50%);width:42px;height:42px;border-radius:50%;background:#16150f}
  /* default 50% 50% : push content down so face is cut */
  .pho-pos-default .pho-fill{top:38%}
  .pho-pos-top .pho-fill{top:6%}

  /* ratio consistency demo */
  .pho-tile{overflow:hidden;border:1px solid var(--line);background:linear-gradient(135deg,#6b7c8c,#3a4a5a);display:flex;align-items:center;justify-content:center;color:#f4f2ec;font-size:11px;font-weight:700}
  .pho-mix-1{width:54px;aspect-ratio:1/1}
  .pho-mix-2{width:54px;aspect-ratio:4/3}
  .pho-mix-3{width:54px;aspect-ratio:9/16}
  .pho-uni{width:54px;aspect-ratio:1/1}
  .pho-row{display:flex;gap:8px;align-items:center}

  /* fit modes */
  .pho-fitbox{width:90px;height:90px;border:1px solid var(--line);overflow:hidden;background:var(--paper-2);position:relative}
  .pho-logo{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
  .pho-logo span{display:block;width:80px;height:40px;border-radius:8px;background:#de3c24;color:#f4f2ec;font-weight:800;font-size:13px;text-align:center;line-height:40px}
  .pho-fit-fill .pho-logo span{width:88px;height:88px;border-radius:8px;line-height:88px}
  .pho-fit-contain .pho-logo span{width:80px;height:40px}
</style>

## 結論

プロは「どう切るか」を2段階で解いている。まず**被写体をどこに置くか**を三分割法のパワーポイント（交点）で決め、中央固定（日の丸構図）を避けて視線にテンションを作る。次にそれを**CSSで実装**する——コンテナを `aspect-ratio` で比率固定し、`object-fit: cover` で枠を充填クロップ、残すクロップ位置を `object-position` で必ず上書きする。デフォルトの `50% 50%` は顔や商品を切り落とすので、放置は事故の元だ。

## 01 — 主役は中央でなく三分割の交点に置く

フレームを縦横3分割した「井」の交点が**パワーポイント**。最重要要素をここ（または線上）に寄せると、中央配置より視線が動的になる。中央＝視線が着いて即停止する静的な日の丸構図で、サムネ一覧が単調・素人っぽく見える。視線の重みは均等ではなく、左上交点が最も注目を集める（40%超とされる）。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-frame"><div class="pho-grid-lines"></div><div class="pho-subject pho-center"></div></div></div><div class="label">✗ 中央固定（日の丸） → 視線が止まり静的・単調</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-frame"><div class="pho-grid-lines"></div><div class="pho-subject pho-thirds"></div></div></div><div class="label">✓ 交点に寄せる → 余白方向に視線が動きテンションが生まれる</div></div>
</div>

<p class="src"><span class="badge b-primary">secondary</span><a href="https://ixdf.org/literature/topics/rule-of-thirds" target="_blank" rel="noopener">What is the Rule of Thirds? — IxDF</a></p>

## 02 — 人物は目を上の横線、地平線も横線に乗せる

ポートレートは**目を上側の水平グリッド線**に、肩を下側の線の内側に収める。風景は**地平線を中央でなくいずれかの横線**に合わせると安定する。中央に地平線を引くと上下が拮抗して凡庸になる。空を見せたいなら地平線を下の線へ、地面を見せたいなら上の線へ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-frame pho-horizon-bad"><div class="pho-sky"></div><div class="pho-land"></div><div class="pho-sun"></div><div class="pho-grid-lines"></div></div></div><div class="label">✗ 地平線も太陽も中央 → 上下が拮抗して平板</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-frame pho-horizon-good"><div class="pho-sky"></div><div class="pho-land"></div><div class="pho-sun"></div><div class="pho-grid-lines"></div></div></div><div class="label">✓ 地平線を下の横線、太陽を交点へ → 空が主役で安定</div></div>
</div>

<p class="src"><span class="badge b-primary">secondary</span><a href="https://ixdf.org/literature/topics/rule-of-thirds" target="_blank" rel="noopener">What is the Rule of Thirds? — IxDF</a></p>

## 03 — コンテナに aspect-ratio、img に object-fit:cover で枠を充填クロップ

サイズ不揃いの写真をグリッドで揃える基本形。**コンテナ側で `aspect-ratio` で比率を固定**し、内部 `img` を `width/height:100%` ＋ `object-fit:cover` にすると、元写真の比率に関係なく枠を満たしつつ自動クロップされる。`fill` は枠に合わせて引き伸ばすので顔や商品が潰れる。写真サムネは `cover`、ロゴは `contain` で使い分ける。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-fitbox pho-fit-fill"><div class="pho-logo"><span>LOGO</span></div></div></div><div class="label">✗ object-fit:fill → 比率が崩れてロゴが歪む</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-fitbox pho-fit-contain"><div class="pho-logo"><span>LOGO</span></div></div></div><div class="label">✓ ロゴは contain で全体保持、写真サムネは cover で充填</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://ishadeed.com/article/css-aspect-ratio/" target="_blank" rel="noopener">Let's Learn About Aspect Ratio In CSS — Ahmad Shadeed</a></p>

## 04 — object-position で残すクロップ位置（焦点）を必ず上書きする

`cover` のデフォルトは中央基準（`50% 50%`）。顔・商品・ロゴなど重要部分が中央にない写真では、**首から下だけ・商品が見切れる**典型事故になる。`object-position` は「どの部分を残すか」を決める設定なので、必ず上書きする。アバターは顔が上部にあることが多いので `center top`。値はキーワード・%・lengthを**横→縦の順**で指定し、px絶対値でなく**%など相対単位**で持たせると画面サイズが変わっても被写体が枠内に残る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-photo pho-portrait pho-pos-default"><div class="pho-fill"><div class="pho-body"></div><div class="pho-face"></div></div></div></div><div class="label">✗ デフォルト 50% 50% → 顔が枠外、首から下だけ残る</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-photo pho-portrait pho-pos-top"><div class="pho-fill"><div class="pho-body"></div><div class="pho-face"></div></div></div></div><div class="label">✓ object-position: center top → 顔・目を残してクロップ</div></div>
</div>

<p class="src"><span class="badge b-primary">secondary</span><a href="https://css-tricks.com/almanac/properties/o/object-position/" target="_blank" rel="noopener">object-position | CSS-Tricks</a></p>

## 05 — 比率はプロダクト全体で意図的に統一する

グリッド内で 1:1・4:3・16:9 が混在すると視覚言語が崩れ、雑な印象になる。比率はコンテンツと UX に合わせて選び、**全サーフェスで統一**する。正方形（1:1）は最も一貫性を確保しやすくサムネで支配的、ヒーロー／バナーは 16:9 が定番。1枚のソース画像を `aspect-ratio` 変数（`16/9`・`1/1`・`3/4`）＋ `cover` で使い回せば、手動クロップ版を量産せず各レイアウトに対応できる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-row"><div class="pho-tile pho-mix-1">1:1</div><div class="pho-tile pho-mix-2">4:3</div><div class="pho-tile pho-mix-3">9:16</div></div></div><div class="label">✗ 比率バラバラ → 高さが揃わず一覧が雑に見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-row"><div class="pho-tile pho-uni">1:1</div><div class="pho-tile pho-uni">1:1</div><div class="pho-tile pho-uni">1:1</div></div></div><div class="label">✓ 1:1 に統一 → グリッドが整い視覚言語が一貫</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://playbook.ebay.com/foundations/layout-in-product/image-ratio" target="_blank" rel="noopener">Image ratio — eBay Playbook</a></p>

## 06 — 焦点を変数化して1枚で複数比率に対応する

CMS や LP で同じ写真をカード・ヒーロー・正方形サムネに使い回すなら、**焦点を %カスタムプロパティ**（`--focus-x` / `--focus-y`）に保存し、`aspect-ratio` を変数で切り替える。焦点は画像クリックで座標を取得して % で持たせる（px は避ける）。横長→縦長など縦横比が大きく変わるヒーローでは、縮小だけでは焦点が枠外に出るため、**ブレークポイントで `object-position` を切り替える**（モバイルは `center top` で顔の上部を多く見せる）。任意焦点をコンテナ中央に固定したい場合は `clamp()`/`calc()` 式を使う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-row" style="flex-direction:column"><div class="pho-tile" style="width:120px;aspect-ratio:16/9">--ratio: 16/9</div></div></div><div class="label">同一ソース・焦点 64% / 36% を 16:9 ヒーローで使用</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="pho-row"><div class="pho-tile" style="width:70px;aspect-ratio:1/1">1/1</div><div class="pho-tile" style="width:52px;aspect-ratio:3/4">3/4</div></div></div><div class="label">✓ 同じ --focus 変数のまま比率だけ差し替え → 量産不要</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://henry.codes/writing/pure-css-focal-points/" target="_blank" rel="noopener">Using focal points, aspect ratio & object-fit to crop images correctly — Henry From Online</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://odland.dev/2023/02/26/cropping-images-with-css-while-keeping-a-focal-point-in-the-center.html" target="_blank" rel="noopener">Cropping Images with CSS While Keeping a Focal Point in the Center — Odland</a></p>

## 実装スニペット

グリッドサムネを比率固定で統一クロップ（基本形）。`img` に `width/height:100%` が無いと `object-fit` が効かない。HTMLの `img` にも `width/height` 属性を付けて CLS を防ぐ。

```css
.card__thumb{
  position: relative;
  aspect-ratio: 4 / 3; /* or 1/1 for square thumbs */
}
.card__thumb img{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;        /* fills + crops, no distortion */
  object-position: center;  /* override the default 50% 50% as needed */
}
```

アバター／顔サムネ。顔は上部にあることが多いので `center top`。中央デフォルトだと顔が切れる。明示寸法が必須。

```css
.avatar{
  width: 100px;
  height: 100px;
  object-fit: cover;
  object-position: center top; /* keep face/eyes, crop body */
  border-radius: 50%;
}
```

焦点を変数化して1枚で複数比率に対応。焦点は %（相対単位）で持たせると画面サイズが変わっても被写体が枠内に残る。px は避ける。

```css
.media{
  --focus-x: 64.2862%;  /* captured from a click on the source */
  --focus-y: 35.5263%;
  --ratio: 16 / 9;       /* swap to 1/1, 3/4 per context */
}
.media img{
  width: 100%;
  aspect-ratio: var(--ratio);
  object-fit: cover;
  object-position: var(--focus-x) var(--focus-y);
}
```

任意焦点をコンテナ中央に固定（Odland式・art-direction）。`container-type` と `cqw/cqh` 単位が前提。Safari 15未満などはメディアクエリで `object-position` 切替にフォールバック。

```css
.crop{
  container-type: size;
  aspect-ratio: 3 / 1;
  --crop-focus-x: 0.6;  /* 0-1 range */
  --crop-focus-y: 0.5;
}
.crop img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  --image-width: calc(100cqw - 100%);
  --image-height: calc(100cqh - 100%);
  object-position:
    clamp(0%, calc(0.5*100cqw - var(--crop-focus-x)*var(--image-width)), 100%)
    clamp(0%, calc(0.5*100cqh - var(--crop-focus-y)*var(--image-height)), 100%);
}
@media (max-width: 1080px){
  .crop img{ object-position: center top; } /* simpler fallback on mobile */
}
```

## チェックリスト

<ul class="check">
  <li>主役を中央固定（日の丸）にしていないか。三分割の交点・線上に寄せたか</li>
  <li>人物は目を上の横線に、風景は地平線をいずれかの横線に乗せたか</li>
  <li>コンテナに `aspect-ratio` を設定し、`img` は `width/height:100%` ＋ `object-fit:cover` にしたか</li>
  <li>`object-position` をデフォルト `50% 50%` のまま放置せず、焦点を上書きしたか（顔は `center top`）</li>
  <li>焦点を px 絶対値でなく %（相対単位）で指定したか</li>
  <li>写真は `cover`、ロゴは `contain`。`fill` で歪ませていないか</li>
  <li>`img` に `width/height` 属性（または `aspect-ratio`）を付け、CLS を防いだか</li>
  <li>グリッド内で比率を混在させず、プロダクト全体で意図的に統一したか（サムネは 1:1 が無難）</li>
  <li>横長→縦長で比率が大きく変わるヒーローは、ブレークポイントで `object-position` を切り替えたか</li>
</ul>

## 限界 / 出典

三分割法は経験則であり厳密な視覚法則ではない。「左上交点が注目40%超」「`center top` が顔向き構図に効く」は単一ソース由来で、被写体やデザイン文脈で変動するため鵜呑みにしない。CSS の数値（焦点 `64.2862%` 等）は出典のサンプル値で、実画像では焦点を取り直すこと。Odland式の `clamp()`/`calc()` 式は出典の表記に揺れがあり（`clamp` の引数順は min, preferred, max が正で、上のスニペットはその順に整理した）、本番投入前に実機検証が必須。container query 単位と `aspect-ratio` は Safari 15+／Chrome 88+／Firefox 89+ 対応で、それ未満の環境は `@supports` ＋ `padding-top` のフォールバックが必要。比率の「1:1推奨」は eBay のプロダクト文脈であり、ブランドや媒体によって最適比率は異なる。

<p class="src"><span class="badge b-primary">secondary</span><a href="https://ixdf.org/literature/topics/rule-of-thirds" target="_blank" rel="noopener">What is the Rule of Thirds? — IxDF</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.etienneaubertbonn.com/rule-of-thirds/" target="_blank" rel="noopener">Rule of Thirds in Design and Photography: A Visual Guide</a></p>
<p class="src"><span class="badge b-primary">secondary</span><a href="https://www.digitalocean.com/community/tutorials/css-cropping-images-object-fit" target="_blank" rel="noopener">How To Scale and Crop Images with CSS object-fit — DigitalOcean</a></p>
<p class="src"><span class="badge b-primary">secondary</span><a href="https://css-tricks.com/almanac/properties/o/object-position/" target="_blank" rel="noopener">object-position | CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://henry.codes/writing/pure-css-focal-points/" target="_blank" rel="noopener">Using focal points, aspect ratio & object-fit to crop images correctly — Henry From Online</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://odland.dev/2023/02/26/cropping-images-with-css-while-keeping-a-focal-point-in-the-center.html" target="_blank" rel="noopener">Cropping Images with CSS While Keeping a Focal Point in the Center — Odland</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://ishadeed.com/article/css-aspect-ratio/" target="_blank" rel="noopener">Let's Learn About Aspect Ratio In CSS — Ahmad Shadeed</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://web.dev/articles/aspect-ratio" target="_blank" rel="noopener">The CSS aspect-ratio property — web.dev</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://playbook.ebay.com/foundations/layout-in-product/image-ratio" target="_blank" rel="noopener">Image ratio — eBay Playbook</a></p>
