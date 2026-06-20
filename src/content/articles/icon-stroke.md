---
title: "アイコンが浮く——線幅と光学サイズの揃え方"
problem: "アイコンの線幅・サイズがテキストやUIと合わず浮く。"
category: 細部
tags: [アイコン, 線幅, 光学調整]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .ic-svg{display:block}
  .ic-row{display:flex;align-items:center;gap:18px;color:#16150f}
  .ic-row svg{display:block;color:#16150f}

  /* 01 線幅比例スケール */
  .ic-bad path,.ic-bad rect,.ic-bad circle,.ic-bad line,.ic-bad polyline,.ic-bad polygon{vector-effect:none}
  .ic-good [stroke]{vector-effect:non-scaling-stroke}

  /* labels for sizes */
  .ic-cap{font-size:11px;color:#5c5a50;margin-top:6px;text-align:center}
  .ic-stack{display:flex;flex-direction:column;align-items:center}

  /* 02 set consistency */
  .ic-mixed svg:nth-child(1) [stroke]{stroke-width:1}
  .ic-mixed svg:nth-child(2) [stroke]{stroke-width:2.4}
  .ic-mixed svg:nth-child(3) [stroke]{stroke-width:1.6}
  .ic-uniform svg [stroke]{stroke-width:1.5}

  /* 03 optical center play triangle */
  .ic-box{width:64px;height:64px;border:1px solid rgba(22,21,15,.16);border-radius:50%;display:flex;align-items:center;justify-content:center;background:#f4f2ec;color:#16150f}
  .ic-box svg{display:block}

  /* 04 keyline area */
  .ic-keybox{width:64px;height:64px;border:1px dashed rgba(22,21,15,.22);display:flex;align-items:center;justify-content:center;background:#f4f2ec;color:#16150f}

  /* 05 subpixel blur */
  .ic-blur{filter:blur(.4px)}
  .ic-crisp{shape-rendering:crispEdges}

  /* text-adjacent demo */
  .ic-textline{display:inline-flex;align-items:center;gap:8px;color:#16150f;font-size:18px;font-weight:600}
  .ic-textline svg{display:block;color:#16150f}
  .ic-heavy [stroke]{stroke-width:3}
  .ic-tuned [stroke]{stroke-width:1.6}

  /* baseline */
  .ic-btn{display:inline-flex;align-items:center;gap:8px;background:#16150f;color:#f4f2ec;padding:10px 16px;border-radius:8px;font-size:16px;font-weight:600}
  .ic-btn svg{display:block;color:#f4f2ec}
  .ic-off svg{transform:translateY(-2px)}
  .ic-on svg{transform:translateY(.5px)}
</style>

## 結論

プロは「線幅」と「光学サイズ」を別々の規律として扱う。第一に線幅をセット全体で1つの値に固定し（Material 2dp、Octicons/Atlassian 1.5px、Semrush 2px）、サイズが変わっても比例拡縮させず据え置くか opsz 軸で補正する。第二に外接矩形の数学的中央ではなく光学的重心とキーライン基準図形で面積を揃え、座標を整数でピクセルグリッドにスナップする——この2点で「1つだけ浮く」は消える。

## 01 — 線幅はサイズに比例させず据え置く

最大の浮き要因はこれ。24pxで描いた2px線をそのまま48pxに拡大すると線は4px相当に太り、別物に見える。SVGなら `vector-effect:non-scaling-stroke` で拡縮時の線太りを止め、サイズ別クラスで線幅を据え置く（または16px→1.5px、24px→2pxのように微調整）のが正解。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row ic-bad">
      <div class="ic-stack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>
        <span class="ic-cap">24px</span>
      </div>
      <div class="ic-stack">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>
        <span class="ic-cap">48px（線が太る）</span>
      </div>
    </div>
  </div><div class="label">✗ 同じSVGを拡大 → 線幅も2倍に太って別アイコンに見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row ic-good">
      <div class="ic-stack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>
        <span class="ic-cap">24px</span>
      </div>
      <div class="ic-stack">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16"/></svg>
        <span class="ic-cap">48px（線幅一定）</span>
      </div>
    </div>
  </div><div class="label">✓ non-scaling-stroke で線幅2pxを据え置き → 太さの印象が揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://primer.style/octicons/design-guidelines/" target="_blank" rel="noopener">Octicons | Primer (GitHub)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developers.google.com/fonts/docs/material_symbols" target="_blank" rel="noopener">Material Symbols guide – Google Fonts</a></p>

## 02 — セット内で線幅を1つに統一する

アイコンごとに1px / 1.5px / 2pxが混ざると「別々のストックサイトから拾い集めた」ように見え、プロ感が一気に消える。小サイズでは可読性も落ちる。代表値は Material 2dp、Octicons/Atlassian 1.5px、Semrush 2px。値そのものは何でもよく、本質は「1セット1線幅」。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row ic-mixed">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/></svg>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
    </div>
  </div><div class="label">✗ 1px / 2.4px / 1.6px が混在 → バラバラで安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row ic-uniform">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M16 16l4 4"/></svg>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M14 6l6 6-6 6"/></svg>
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>
    </div>
  </div><div class="label">✓ 全アイコン 1.5px に統一 → 同じ家族に見える</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/iconography" target="_blank" rel="noopener">Iconography - Atlassian Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.semrush.com/intergalactic/style/icon/icon" target="_blank" rel="noopener">Semrush Intergalactic - Icon</a></p>

## 03 — 非対称アイコンは光学的中央へ寄せる

Playの三角形を外接矩形の数学的中央に置くと、左に寄って見える。重量が右に偏っているからだ。正解は視覚的重心へ微調整して右へ寄せること。検証は目を細める「squintテスト」で、各アイコンの視覚的ウェイトが均等かを見る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-box">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
    </div>
  </div><div class="label">✗ 三角形を幾何中央に配置 → 円の中で左に寄って見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-box">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M10 5v14l11-7z"/></svg>
    </div>
  </div><div class="label">✓ 重心ぶん右へ寄せる → 円の中心に座って見える</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxplanet.org/practical-guide-to-icon-design-794baf5624c8" target="_blank" rel="noopener">Practical Guide To Icon Design – UX Planet</a></p>

## 04 — キーライン基準図形で「面積」を揃える

同じ24pxの箱に詰めても、円・複雑な形・細い形は塗り面積が小さく、小さく見える。「幾何学的に等しい＝光学的に不等しい」のが原因。Materialは24dpキャンバスで円⌀20dp / 正方形18×18dp / 縦横の矩形20×16dpという基準図形に主要マスを合わせ、形が違っても大きさ感を一定にする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row">
      <div class="ic-keybox"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20"/></svg></div>
      <div class="ic-keybox"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
    </div>
  </div><div class="label">✗ 同じ外接サイズで配置 → 円が四角より小さく見える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-row">
      <div class="ic-keybox"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18"/></svg></div>
      <div class="ic-keybox"><svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg></div>
    </div>
  </div><div class="label">✓ 正方形18 / 円⌀20の基準に合わせる → 大きさ感が揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/style/icons.html" target="_blank" rel="noopener">Icons - Style - Material Design (M1)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://dutchicon.com/optical-weight-icons/" target="_blank" rel="noopener">Optical weight in icons – Dutchicon</a></p>

## 05 — テキスト隣は opsz を下げてベースラインを合わせる

Material Symbolsのデフォルトは opsz=48。本文16-24pxの隣でそのまま使うと太く重く、ピクセルグリッドにも乗らない。完全グリッド整合に設計されているのは20と24版のみ。テキスト隣では opsz を文字サイズに合わせて20か24へ下げ、ベースラインのズレも `line-height:1` や微小な translateY で潰す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <span class="ic-textline ic-heavy">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      新規プロジェクト
    </span>
  </div><div class="label">✗ opsz=48相当の太い線のまま → 文字より重く浮く</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <span class="ic-textline ic-tuned">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      新規プロジェクト
    </span>
  </div><div class="label">✓ opsz=20相当に細め＋字サイズへ連動 → 文字と一体化</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/icons/applying-icons" target="_blank" rel="noopener">Icons – Material Design 3 (Applying icons)</a></p>

## 06 — 整数座標でピクセルグリッドにスナップする

X/Y座標が小数だとアンチエイリアスで線がにじみ、隣のシャープなアイコンの中で1つだけぼやけて浮く。座標は整数でon-pixel配置、外側エッジをピクセル境界に揃える。1px線は座標を.5に置いて線の中心をピクセル中央へ合わせる。下のボタンはベースラインずれの「浮き」も同時に示す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-btn ic-off">
      <svg class="ic-blur" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      保存しました
    </div>
  </div><div class="label">✗ サブピクセル座標＋ベースライン上ズレ → にじんで浮く</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)">
    <div class="ic-btn ic-on">
      <svg class="ic-crisp" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
      保存しました
    </div>
  </div><div class="label">✓ 整数座標スナップ＋光学的にベースライン合わせ → シャープ</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://primer.style/octicons/design-guidelines/" target="_blank" rel="noopener">Octicons | Primer (GitHub)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://minoraxis.medium.com/icon-grids-keylines-demystified-5a228fe08cfd" target="_blank" rel="noopener">Icon Grids & Keylines Demystified – Helena Zhang</a></p>

## 実装スニペット

インラインSVGの線幅を全箇所で固定し、サイズが変わっても据え置く。

```css
.icon{
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;            /* 24px基準。全アイコン共通で固定、サイズ比例させない */
  stroke-linecap: square;     /* 四角いキャップ（Atlassian流） */
  stroke-linejoin: round;     /* 外角は丸め、内角はパス側で直角に */
  vector-effect: non-scaling-stroke; /* 拡大しても線幅を太らせない */
}
.icon--16{ width:16px; height:16px; stroke-width:1.5; }
.icon--32{ width:32px; height:32px; stroke-width:2; }
```

Material Symbols（可変フォント）をテキスト隣で最適化する。opszは表示font-sizeに連動させる。

```css
.material-symbols-outlined{
  font-variation-settings:
    'opsz' 24,   /* 本文隣はピクセルグリッド整合の24（または20） */
    'wght' 400,  /* テキストの太さに合わせる */
    'GRAD' 0,    /* テキストフォントのGRADと揃える */
    'FILL' 0;
  font-size: 24px;
  line-height: 1;            /* ベースラインのズレ＝浮きを防ぐ */
  vertical-align: middle;
}
/* 大きく飾るときだけ opsz を上げる */
.icon-hero{ font-size:48px; font-variation-settings:'opsz' 48,'wght' 400,'GRAD' 0,'FILL' 0; }
```

ボタン内でアイコンとテキストのベースラインを光学的に合わせる。

```css
.btn{ display:inline-flex; align-items:center; gap:8px; }
.btn .icon{
  width:1em; height:1em;          /* 文字サイズに連動 */
  flex:0 0 auto;
  transform: translateY(0.05em);  /* 光学的に下げてテキスト重心へ合わせる */
}
```

小サイズのにじみを防ぐ。直線主体には crispEdges、曲線中心には geometricPrecision を。

```css
.icon--crisp{
  shape-rendering: crispEdges;   /* 16px等の小サイズで線のにじみを抑える */
}
/* 書き出し時: viewBoxは整数、パス座標も整数/0.5刻みに。
   1px線は座標を .5 に置き中心をピクセル中央へ（例 x=8 → 7.5/8.5境界） */
```

## チェックリスト

<ul class="check">
  <li>セット内の全アイコンが<b>1つの線幅</b>で描かれている（1px/1.5px/2pxの混在なし）</li>
  <li>サイズ違いで線幅を<b>比例拡縮していない</b>（据え置き or opsz/サイズ別クラスで補正）</li>
  <li>SVGに <code>vector-effect:non-scaling-stroke</code> を入れ、拡大時の線太りを止めた</li>
  <li>Play等の非対称アイコンを<b>光学的中央</b>へ寄せ、squintテストで重量が均等</li>
  <li>円・複雑な形をキーライン基準図形に合わせ、<b>面積（大きさ感）が揃って</b>いる</li>
  <li>テキスト隣のMaterial Symbolsは <code>opsz=20か24</code>、デフォルト48のままにしていない</li>
  <li>座標は整数でピクセルグリッドにスナップ、外側エッジが境界に乗りにじみがない</li>
  <li>ボタン/ラベルでアイコンとテキストの<b>ベースライン</b>が揃い、上下に浮いていない</li>
</ul>

## 限界 / 出典

数値の多くは Material（2dp）・Octicons（1.5px）・Semrush（2px）など各デザインシステム固有の規定で、絶対基準ではない。本質は「自分のセットで線幅を1つに統一する」ことで、値そのものは可変。opszの「完全ピクセルグリッド整合は20と24版のみ」は Material Symbols 固有で、他フォントには当てはまらない。GRAD軸の範囲は資料により-50〜200/-25〜200と表記揺れがある。CSSの `vector-effect:non-scaling-stroke` と `shape-rendering:crispEdges` はブラウザ/レンダラ依存で、特に crispEdges は曲線で角張るため直線アイコン向け（曲線中心は geometricPrecision が安全）。0.5px刻みやサブピクセル調整は高DPR（Retina）前提で、等倍/低DPR環境では消える・にじむリスクがある。ColorParkの「2026」表記は将来日付で、新規性より一般的目安として扱うのが妥当。設計時の数値は実機・実DPRでのスクショ検証を最終確認とすべき。

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/style/icons.html" target="_blank" rel="noopener">Icons - Style - Material Design (M1)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developers.google.com/fonts/docs/material_symbols" target="_blank" rel="noopener">Material Symbols guide – Google Fonts</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/icons/applying-icons" target="_blank" rel="noopener">Icons – Material Design 3 (Applying icons)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://primer.style/octicons/design-guidelines/" target="_blank" rel="noopener">Octicons | Primer (GitHub)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/iconography" target="_blank" rel="noopener">Iconography - Atlassian Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.semrush.com/intergalactic/style/icon/icon" target="_blank" rel="noopener">Semrush Intergalactic - Icon</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxplanet.org/practical-guide-to-icon-design-794baf5624c8" target="_blank" rel="noopener">Practical Guide To Icon Design – UX Planet</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://minoraxis.medium.com/icon-grids-keylines-demystified-5a228fe08cfd" target="_blank" rel="noopener">Icon Grids & Keylines Demystified – Helena Zhang</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://dutchicon.com/optical-weight-icons/" target="_blank" rel="noopener">Optical weight in icons – Dutchicon</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://api.flutter.dev/flutter/widgets/Icon/opticalSize.html" target="_blank" rel="noopener">opticalSize property - Flutter API</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.telerik.com/design-system/docs/foundation/iconography/styles-and-guidelines/" target="_blank" rel="noopener">Iconography – Telerik/Kendo Design System</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.colorpark.io/blog/practical-icon-size-guidelines-for-ui-ux-design" target="_blank" rel="noopener">Practical Icon Size Guidelines (2026) – ColorPark</a></p>
