---
title: "ダークモードが映えない——落とし穴と作り方"
problem: "ただ反転しただけで、影も色も映えないダークモードになる。"
category: 色
tags: [ダークモード, 色, 質感]
date: 2026-06-20
sources: 10
draft: false
---

<style>
  /* === 01 純黒 vs #121212 === */
  .dar-bgblack{background:#000000}
  .dar-bggrey{background:#121212}
  .dar-surf{width:100%;height:100%;border-radius:10px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:6px;padding:18px;box-sizing:border-box}
  .dar-halo{color:#ffffff;font-weight:800;font-size:22px;letter-spacing:.04em;text-shadow:0 0 8px rgba(255,255,255,.9),0 0 2px rgba(255,255,255,.8)}
  .dar-calm{color:rgba(255,255,255,.87);font-weight:800;font-size:22px;letter-spacing:.04em}
  .dar-sub-light{color:rgba(255,255,255,.6);font-size:12px}

  /* === 02 影 vs トーナル・エレベーション === */
  .dar-stage{background:#121212;width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;border-radius:6px}
  .dar-cardflat{width:120px;height:120px;border-radius:12px;background:#121212;box-shadow:0 18px 30px rgba(0,0,0,.8);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.7);font-weight:700;font-size:13px}
  .dar-base{position:absolute;width:160px;height:160px;border-radius:14px;background:#121212}
  .dar-cardtonal{position:relative;width:120px;height:120px;border-radius:12px;background:#2c2c2c;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.87);font-weight:700;font-size:13px}

  /* === 03 上の面を明るく(レイヤー積層) === */
  .dar-deck{background:#121212;width:100%;height:100%;display:flex;align-items:flex-end;justify-content:center;padding-bottom:24px;box-sizing:border-box;border-radius:6px;position:relative}
  .dar-lyr{position:absolute;border-radius:10px;display:flex;align-items:flex-start;justify-content:flex-start;padding:8px 10px;box-sizing:border-box;color:rgba(255,255,255,.8);font-size:11px;font-weight:700}
  .dar-l1{width:150px;height:150px;bottom:24px}
  .dar-l2{width:118px;height:118px;bottom:38px}
  .dar-l3{width:86px;height:86px;bottom:52px}
  /* bad: all same color, only shadow */
  .dar-bad1{background:#1c1c1c;left:calc(50% - 75px)}
  .dar-bad2{background:#1c1c1c;left:calc(50% - 59px);box-shadow:0 6px 12px rgba(0,0,0,.6)}
  .dar-bad3{background:#1c1c1c;left:calc(50% - 43px);box-shadow:0 6px 12px rgba(0,0,0,.6)}
  /* good: ramp lighter going up */
  .dar-good1{background:#1e1e1e;left:calc(50% - 75px)}
  .dar-good2{background:#272727;left:calc(50% - 59px)}
  .dar-good3{background:#323232;left:calc(50% - 43px)}

  /* === 04 アクセント色の彩度調整 === */
  .dar-acc{background:#121212;width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;border-radius:6px;padding:16px;box-sizing:border-box}
  .dar-btn{border:none;border-radius:8px;padding:11px 20px;font-weight:800;font-size:14px;letter-spacing:.02em;cursor:pointer}
  .dar-btn-vibrate{background:#6200ee;color:#ffffff}
  .dar-btn-tone{background:#b39ddb;color:#1a1326}
  .dar-link-vibrate{color:#3d5afe;font-weight:700;font-size:13px;text-decoration:underline}
  .dar-link-tone{color:#9fa8ff;font-weight:700;font-size:13px;text-decoration:underline}

  /* === 05 テキストの不透明度階層 === */
  .dar-txt{background:#121212;width:100%;height:100%;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:7px;border-radius:6px;padding:18px;box-sizing:border-box;text-align:left}
  .dar-txt-flat{color:#ffffff}
  .dar-h-bad{font-weight:800;font-size:16px}
  .dar-b-bad{font-size:13px;line-height:1.5}
  .dar-c-bad{font-size:11px}
  .dar-h-good{color:rgba(255,255,255,.87);font-weight:800;font-size:16px}
  .dar-b-good{color:rgba(255,255,255,.87);font-size:13px;line-height:1.5}
  .dar-c-good{color:rgba(255,255,255,.6);font-size:11px}
  .dar-d-good{color:rgba(255,255,255,.38);font-size:11px}

  /* === 06 影の代替(色付き影 / ヘアライン) === */
  .dar-shadowstage{background:#1e1e1e;width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:6px}
  .dar-sc{width:130px;height:96px;border-radius:12px;background:#252525;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.87);font-weight:700;font-size:12px}
  .dar-sc-black{box-shadow:0 10px 20px rgba(0,0,0,.9)}
  .dar-sc-tint{border:1px solid rgba(255,255,255,.08);box-shadow:0 1px 2px hsl(220deg 60% 50% / .2),0 2px 4px hsl(220deg 60% 50% / .2),0 4px 8px hsl(220deg 60% 50% / .25)}
</style>

## 結論

プロのダークモードは「反転」ではなく「再設計」だ。土台に純黒#000000を使わずダークグレー**#121212**を基準サーフェスに置き、奥行きは影ではなく「上の面ほど明るくする」半透明白オーバーレイのランプ(0dp=0%→24dp=16%)で表現する。そのうえでアクセント色は彩度を落とした明トーンへ、本文は純白ベタをやめて白の不透明度87/60/38%で階層化する——この3点が揃って初めてダークモードは「映える」。

## 01 — 背景は純黒ではなく #121212

「ダークだから真っ黒」が最初の落とし穴。純黒#000000に純白#FFFFFFを乗せるとコントラストが過剰になり、文字がにじむ**ハレーション/ブルーミング**(縁が発光して振動する現象)を起こす。乱視・ディスレクシアのユーザーで可読性が落ち、OLEDではスメアも出る。基準を**#121212**にすると、影や標高オーバーレイが表現できるうえ、純白本文でも約15.8:1という十分なコントラストに収まる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-surf dar-bgblack"><span class="dar-halo">Aa 映え</span><span class="dar-sub-light">#000000 + #FFFFFF</span></div></div><div class="label">✗ 純黒×純白 → 文字が発光してにじむ(ハレーション)</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-surf dar-bggrey"><span class="dar-calm">Aa 映え</span><span class="dar-sub-light">#121212 + 白87%</span></div></div><div class="label">✓ #121212 ベース → ギラつかず長時間でも疲れない</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://colorarchive.org/guides/dark-mode-color-design-guide/" target="_blank" rel="noopener">Dark Mode Color Design — ColorArchive</a></p>

## 02 — 奥行きは影ではなく「面の明るさ」で出す

ライトモードは影だけで重なりが伝わるが、ダークモードでは影は「光の反転=暗い値」なので暗背景上ではほとんど見えず、平坦で安っぽくなる。階層を伝える唯一の手は**トーナル・エレベーション**——#121212の上に白オーバーレイを重ね、標高が高いほど明るくする。正準ランプは 1dp=5%、3dp=8%、8dp=12%、24dp=16%。結果、card(1dp)≈#1E1E1E、dialog(3dp)≈#2C2C2C になる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-stage"><div class="dar-cardflat">card</div></div></div><div class="label">✗ #121212 のカードに黒い影 → 影が沈んで浮かない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-stage"><div class="dar-base"></div><div class="dar-cardtonal">card</div></div></div><div class="label">✓ 面を #2C2C2C に明るく → 背景から面が浮き上がる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.parker.mov/notes/good-dark-mode-shadows" target="_blank" rel="noopener">good dark mode shadows &amp; elevation — parker.mov</a></p>

## 03 — 上の面は必ず下の面より明るく

積層UI(ドロワー/シート/ポップオーバー)で前後関係を伝えるルールはシンプルだ。「上のサーフェスが下より明るいときだけ、重なり順が読める」。各レイヤーで背景に+4〜8%の明度(=上記オーバーレイ)を足す。下のbadは全レイヤー同色で影だけ足したもの——どれが手前か判然としない。goodは #1E1E1E→#272727→#323232 と上に行くほど明るく、奥行きが一目で伝わる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-deck"><div class="dar-lyr dar-l1 dar-bad1">1</div><div class="dar-lyr dar-l2 dar-bad2">2</div><div class="dar-lyr dar-l3 dar-bad3">3</div></div></div><div class="label">✗ 全レイヤー同じ明度+影 → 階層が潰れる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-deck"><div class="dar-lyr dar-l1 dar-good1">1</div><div class="dar-lyr dar-l2 dar-good2">2</div><div class="dar-lyr dar-l3 dar-good3">3</div></div></div><div class="label">✓ 上ほど明るく(+明度ランプ) → 重なり順が読める</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.fourzerothree.in/p/scalable-accessible-dark-mode" target="_blank" rel="noopener">Designing a Scalable and Accessible Dark Theme — fourzerothree</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Elevation — Atlassian Design</a></p>

## 04 — アクセント色は彩度を落とした明トーンへ

ライトモードの飽和したブランド色をそのまま乗せると、暗背景で**視覚的振動(vibration)**を起こして眼精疲労を招き、WCAG AA 4.5:1も割って読みにくい。Materialは**トーン200付近**(範囲200〜50)の明るく彩度を落とした色を推奨する。目安は全体-10〜20%、青/シアンは-20〜30%、鮮やかな赤は70〜80%まで落とす。#6200EE→#B39DDB のように明トーンへ振り直す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-acc"><button class="dar-btn dar-btn-vibrate">購入する</button><a class="dar-link-vibrate">詳しく見る →</a></div></div><div class="label">✗ 高彩度のまま(#6200EE / #3D5AFE) → 縁が振動して目が痛い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-acc"><button class="dar-btn dar-btn-tone">購入する</button><a class="dar-link-tone">詳しく見る →</a></div></div><div class="label">✓ 明トーンへ(#B39DDB / #9FA8FF) → 落ち着いて読める</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/snapp-mobile/design-for-the-dark-theme-9a2185bbb1d5" target="_blank" rel="noopener">Design for the Dark Theme — Snapp Mobile</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a></p>

## 05 — テキストは白の不透明度で階層化(87/60/38%)

本文に純白#FFFFFFをベタ塗りするとギラついて、しかも強調レベルの階層が作れない。プロは白を**不透明度87/60/38%**で運用する——高強調87%(見出し・本文)、中強調60%(補助・キャプション)、無効38%。ベタが要る場面は#E0E0E0〜#F0F0F0のオフホワイトに。これで過剰コントラストを避けつつ、見出し→本文→キャプションの濃淡が自然に立ち上がる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-txt dar-txt-flat"><span class="dar-h-bad">見出しテキスト</span><span class="dar-b-bad">本文も同じ純白でベタ塗り。</span><span class="dar-c-bad">キャプションも純白。</span></div></div><div class="label">✗ 全部 #FFFFFF → ギラつき+階層なしでのっぺり</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-txt"><span class="dar-h-good">見出しテキスト</span><span class="dar-b-good">本文は白87%でしっとり。</span><span class="dar-c-good">キャプションは白60%。</span><span class="dar-d-good">無効状態は白38%。</span></div></div><div class="label">✓ 87/60/38% → 濃淡で強調レベルが伝わる</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://medium.com/androiddevelopers/dark-theme-with-mdc-4c6fc357d956" target="_blank" rel="noopener">Dark Theme with MDC — Chris Banes</a></p>

## 06 — 影を使うなら色付き多層か、1pxヘアラインで

オーバーレイだけで境界が曖昧なとき、または最上位レイヤーに追加の奥行きが欲しいとき——ライトモードの黒い影を流用してはいけない。暗背景で黒影は見えないか、見えても汚い。手は2つ。(1) 小さいUIやテーブルは**1pxの淡いヘアライン**(rgba(255,255,255,.08))で面を区切る。(2) 影を使うなら純黒透明ではなく**彩度のある色味**を付け(例 hsl(220deg 60% 50%))、低不透明度で多層に重ねる。Atlassianは最上位の標高にのみ影を残す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-shadowstage"><div class="dar-sc dar-sc-black">card</div></div></div><div class="label">✗ ライトの黒い影を流用 → 汚く沈むだけ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dar-shadowstage"><div class="dar-sc dar-sc-tint">card</div></div></div><div class="label">✓ 1pxヘアライン+青味の多層影 → 締まって浮く</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Elevation — Atlassian Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>

## 実装スニペット

標高サーフェスのトークン(白オーバーレイ正準ランプ)。影ではなくこの明度差で奥行きを出す。

```css
:root[data-theme="dark"] {
  --surface-0:  #121212;  /* 0dp  base */
  --surface-1:  #1E1E1E;  /* 1dp  = 5%  white overlay */
  --surface-2:  #232323;  /* 2dp  = 7%  */
  --surface-3:  #252525;  /* 3dp  = 8%  -> cards/dialogs */
  --surface-4:  #272727;  /* 4dp  = 9%  */
  --surface-6:  #2C2C2C;  /* 6dp  = 11% */
  --surface-8:  #2E2E2E;  /* 8dp  = 12% -> app bars */
  --surface-12: #323232;  /* 12dp = 14% */
  --surface-16: #353535;  /* 16dp = 15% */
  --surface-24: #373737;  /* 24dp = 16% (max) */
}
```

オーバーレイをCSSで合成(任意のブランド面)。標高が上がるほど不透明度を上げる(最大16%)。

```css
.card {
  /* base #121212 + 8% white overlay (≈3dp相当) */
  background-image:
    linear-gradient(rgba(255,255,255,.08), rgba(255,255,255,.08));
  background-color: #121212;
  border-radius: 12px;
}
.card--branded {
  /* #121212 + 8% primary でブランド面に (例: #1F1B24) */
  background-image:
    linear-gradient(rgba(124,77,255,.08), rgba(124,77,255,.08));
  background-color: #121212;
}
```

テキスト強調レベル(白の不透明度 87/60/38%)。#121212上で高強調はおよそ15:1級、AA 4.5:1を余裕で満たす。

```css
:root[data-theme="dark"] {
  --text-high:     rgba(255,255,255,.87);  /* 見出し・本文 */
  --text-medium:   rgba(255,255,255,.60);  /* 補助・キャプション */
  --text-disabled: rgba(255,255,255,.38);  /* 無効状態 */
  --text-body:     #E6E6E6;                /* ベタが要る場面のオフホワイト */
}
body { background:#121212; color:var(--text-high); }
.caption { color:var(--text-medium); }
```

アクセント色のダーク再調整と、影/境界の代替。グローで標高表現はしない(Material非推奨)。

```css
:root[data-theme="dark"] {
  --primary: #B39DDB;          /* not #6200EE。明トーン(~tone200)でAA 4.5:1を狙う */
  --shadow-color: 220deg 60% 50%;
}
.card {
  border: 1px solid rgba(255,255,255,.08);  /* 影が見えない時の境界補強 */
  box-shadow:
    0 1px 2px hsl(var(--shadow-color) / .2),
    0 2px 4px hsl(var(--shadow-color) / .2),
    0 4px 8px hsl(var(--shadow-color) / .2);
}
/* color-mix が使えるモダン環境ならトークン生成も1行 */
.surface-3 { background: color-mix(in srgb, #121212, white 8%); }
```

## チェックリスト

<ul class="check">
  <li>背景に純黒 #000000 を使っていない(基準は #121212)</li>
  <li>カード/モーダルの奥行きを黒い影ではなく「面の明るさ」で出している</li>
  <li>積層したレイヤーは上に行くほど明るい(+4〜8%の明度ランプ)</li>
  <li>アクセント/ブランド色を彩度を落とした明トーン(~tone200)へ再調整した</li>
  <li>CTA・リンク・本文の主要な色で WCAG AA 4.5:1 を実測で確認した</li>
  <li>本文に純白ベタを使わず、白の不透明度 87/60/38% で階層化した</li>
  <li>影を使う箇所は黒の流用でなく色付き多層、または 1px ヘアラインにした</li>
  <li>グロー(発光)で標高を表現していない(Material 非推奨)</li>
  <li>color-mix / OKLCH を使う場合、レガシー環境向けに固定hexのフォールバックを併記した</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>数値の正準ソースは Material Design <b>M2</b> で、Material 3 では surface-container 系のトーナル設計に体系が変わっている。実装時はどちらのバージョンに準拠するか明示すること。近似hex(#1E1E1E 等)は #121212 に白を重ねた計算値で、実機/ブラウザのアルファ合成や色空間で 1〜2 刻みのズレが出る。15.8:1 や 18.75:1 はサーフェス対100%白文字の理論値であり、不透明度を落とした文字やアクセント色では別途 WCAG を実測すべき(最低 AA 4.5:1)。アクセント減彩度の具体%(青-20〜30%、赤70〜80%)と Josh Comeau の影レシピは実務ブログ由来の経験則で、ブランド/色相ごとに調整が要る。OLED 省電力で純黒が好まれる文脈はあるが、本記事は「映え/可読性」を最優先するため純黒は非推奨としている。color-mix / OKLCH はブラウザサポートに依存し、レガシー対応の LP/バナーではフォールバック必須。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/color/dark-theme.html" target="_blank" rel="noopener">Dark theme — Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://api.flutter.dev/flutter/material/ThemeData/applyElevationOverlayColor.html" target="_blank" rel="noopener">applyElevationOverlayColor — Flutter material API</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/foundations/elevation" target="_blank" rel="noopener">Elevation — Atlassian Design</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://medium.com/androiddevelopers/dark-theme-with-mdc-4c6fc357d956" target="_blank" rel="noopener">Dark Theme with MDC — Chris Banes (Android Developers)</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://medium.com/snapp-mobile/design-for-the-dark-theme-9a2185bbb1d5" target="_blank" rel="noopener">Design for the Dark Theme — Snapp Mobile</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.joshwcomeau.com/css/designing-shadows/" target="_blank" rel="noopener">Designing Beautiful Shadows in CSS — Josh W. Comeau</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.parker.mov/notes/good-dark-mode-shadows" target="_blank" rel="noopener">good dark mode shadows &amp; elevation — parker.mov</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://colorarchive.org/guides/dark-mode-color-design-guide/" target="_blank" rel="noopener">Dark Mode Color Design — ColorArchive</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.fourzerothree.in/p/scalable-accessible-dark-mode" target="_blank" rel="noopener">Designing a Scalable and Accessible Dark Theme — fourzerothree</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.netguru.com/blog/tips-dark-mode-ui" target="_blank" rel="noopener">Dark Mode UI: 11 Tips — Netguru</a></p>
