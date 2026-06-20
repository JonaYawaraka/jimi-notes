---
title: "区切り線が安っぽい——ボーダーとセパレータの品"
problem: "区切り線やボーダーがどぎつく、画面が安っぽく見える。"
category: 細部
tags: [ボーダー, 区切り線, 細部]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .dv-bad-line{border:0;border-top:3px solid #888;width:100%}
  .dv-good-line{border:0;border-top:1px solid rgba(22,21,15,.12);width:100%}
  .dv-rowwrap{width:80%;color:#16150f}
  .dv-row{padding:10px 4px;font-size:14px}
  .dv-noise{border:0;border-top:2px solid #999}
  .dv-card-bad{background:#fff;border:2px solid #888;border-radius:10px;padding:16px;width:150px;color:#16150f;font-size:13px}
  .dv-card-good{background:#fff;box-shadow:0 1px 2px rgba(22,21,15,.06),0 1px 1px rgba(22,21,15,.04);border-radius:12px;padding:16px;width:150px;color:#16150f;font-size:13px}
  .dv-sec-bad,.dv-sec-good{width:84%;color:#16150f;font-size:13px}
  .dv-sec-bad .dv-blk{padding:12px 10px;border-bottom:2px solid #888;background:#fff}
  .dv-sec-good .dv-blk{padding:12px 10px;background:#fff}
  .dv-sec-good .dv-blk:nth-child(even){background:#eceae2}
  .dv-grp-bad,.dv-grp-good{width:80%;color:#16150f;font-size:13px;display:flex;flex-direction:column}
  .dv-grp-bad .dv-item{padding:9px 6px;border-bottom:1px solid rgba(22,21,15,.12)}
  .dv-grp-good .dv-g{display:flex;flex-direction:column;gap:4px}
  .dv-grp-good .dv-g+.dv-g{margin-top:22px}
  .dv-grp-good .dv-item{padding:3px 6px}
  .dv-thick{height:1px;background:rgba(22,21,15,.12);width:78%;transform:scaleY(4);transform-origin:center}
  .dv-thin{height:1px;background:rgba(22,21,15,.12);width:78%}
  .dv-hl-wrap{width:78%;color:#16150f;font-size:13px;text-align:center}
  .dv-swatch{display:flex;gap:0;width:78%;height:40px;border-radius:6px;overflow:hidden}
  .dv-s1{flex:1;background:#000}
  .dv-s2{flex:1;background:rgba(0,0,0,.12)}
  .dv-on{height:54px;display:flex;align-items:center;justify-content:center;color:#16150f;font-size:12px;background:var(--paper-2)}
  .dv-cap{font-size:11px;color:#5c5a50;margin-top:6px}
</style>

## 結論

プロは境界を「線」ではなく「余白」で表現し、線は最後の手段として扱う。どうしても線が必要なら 1px・不透明度 12%（`rgba(0,0,0,0.12)`）のヘアラインに抑え、ベタの濃いグレーや太線は使わない。安っぽさの正体は「線が濃すぎる・太すぎる・多すぎる」の3点で、Material Design と Refactoring UI が別角度から同じ結論に到達している。

## 01 — 線は 1px × 不透明度12% のヘアラインに

安っぽさの第一原因は、線が画面で一番目立ってしまうこと。`#888` や `#ccc` のベタ線はコンテンツより前に出る。Material Design の divider 仕様は厚み 1dp、色は黒12%不透明（`rgba(0,0,0,0.12)`）。CSS に `border-opacity` は無いので、rgba の低 alpha で低コントラストを作るのが正解。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-rowwrap"><div class="dv-row">アカウント設定</div><hr class="dv-bad-line"><div class="dv-row">通知</div><hr class="dv-bad-line"><div class="dv-row">プライバシー</div></div></div><div class="label">✗ 3px・濃いグレーのベタ線 → 線が主役になり安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-rowwrap"><div class="dv-row">アカウント設定</div><hr class="dv-good-line"><div class="dv-row">通知</div><hr class="dv-good-line"><div class="dv-row">プライバシー</div></div></div><div class="label">✓ 1px・黒12%のヘアライン → 句読点として静かに効く</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/components/dividers.html" target="_blank" rel="noopener">Dividers - Material Design (M1)</a></p>

## 02 — 余白ファースト：線は最後の手段

要素を分離するとき、まず余白・box-shadow・2色の背景差を試す。それでも分離できないときだけ divider を足す。余白で足りる場面に線を引くのが「安っぽい」典型例。カードは枠線よりも薄い影で面を持ち上げ、交互セクションは背景色差で区切ると線がゼロで済む。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-card-bad"><b>プラン</b><br>月額 ¥980<br>3ユーザーまで</div></div><div class="label">✗ 2px枠線でカードを囲う → 縁取りが目立ち重い</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-card-good"><b>プラン</b><br>月額 ¥980<br>3ユーザーまで</div></div><div class="label">✓ 薄い box-shadow で面を持ち上げる → 線ゼロで上品</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI (gist)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/cards/specs" target="_blank" rel="noopener">Cards - Material Design 3</a></p>

## 03 — 線を引かず「背景色差」でセクションを区切る

セクション間に毎回フルブリードの線を引くと、Material の言う「visual noise」になり divider の意味が薄れる。独立したセクションは、線ではなく2色の背景差（`#fff` ↔ `#f7f7f8`）で分けるとノイズが減って情報の階層が読める。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-sec-bad"><div class="dv-blk">特長</div><div class="dv-blk">料金</div><div class="dv-blk">FAQ</div></div></div><div class="label">✗ 全ブロックに太いボーダー → 雑然として階層が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-sec-good"><div class="dv-blk">特長</div><div class="dv-blk">料金</div><div class="dv-blk">FAQ</div></div></div><div class="label">✓ 交互の背景色だけで分離 → 線ゼロで区切りが伝わる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/dividers" target="_blank" rel="noopener">Dividers - Material Design (M2)</a></p>

## 04 — 外側余白 > 内側余白でグルーピング

グループは「内側より外側の余白が広い」ときに、線なしでも"まとまり"として読める。この関係が崩れると、線で無理に補おうとして divider が増えていく。まず外側余白を広げ、それで足りない場合だけ最弱（`0.08`）の線を足す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-grp-bad"><div class="dv-item">氏名</div><div class="dv-item">メール</div><div class="dv-item">会社名</div><div class="dv-item">役職</div></div></div><div class="label">✗ 等間隔＋全行に線 → どこで群が切れるか読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-grp-good"><div class="dv-g"><div class="dv-item">氏名</div><div class="dv-item">メール</div></div><div class="dv-g"><div class="dv-item">会社名</div><div class="dv-item">役職</div></div></div></div><div class="label">✓ 外側余白を広げる → 線なしで2群に読める</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI (gist)</a></p>

## 05 — 太さと不透明度：細く・薄くが品

divider の標準は 1px のヘアライン。2px 以上の線は装飾過多に見える。色も同様で、不透明な黒のベタは線そのものを浮き上がらせる。「細く・薄く」が上品さの条件。下のスウォッチで黒ベタ（左）と黒12%（右）の差は一目瞭然。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-thick"></div><div class="dv-cap" style="text-align:center">4px 相当の太線</div><div class="dv-swatch" style="margin-top:14px"><div class="dv-s1"></div></div><div class="dv-cap">色：黒100%ベタ</div></div><div class="label">✗ 太い・不透明 → 線が前面に出て安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="dv-thin"></div><div class="dv-cap" style="text-align:center">1px ヘアライン</div><div class="dv-swatch" style="margin-top:14px"><div class="dv-s2"></div></div><div class="dv-cap">色：黒12%（rgba(0,0,0,.12)）</div></div><div class="label">✓ 細い・半透明 → 構造を示す句読点として機能</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://mui.com/material-ui/react-divider/" target="_blank" rel="noopener">React Divider component - Material UI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.tubikstudio.com/visual-dividers-user-interface/" target="_blank" rel="noopener">Tubik Visual Dividers</a></p>

## 06 — ダーク／トークン対応で 1変数に寄せる

固定の `#ccc` 系はダークモードで浮く。`rgba(0,0,0,0.12)` ↔ `rgba(255,255,255,0.12)` を切り替えれば自然に追従する。デザインシステムなら、divider 色は 4.5:1 を要する `outline` ではなく低コントラスト専用の `outline-variant` トークンへ割り当てるのが M3 標準。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:#16150f"><div class="dv-hl-wrap" style="color:#f4f2ec"><div style="padding:10px 0">通知設定</div><div style="height:1px;background:rgba(0,0,0,.12)"></div><div style="padding:10px 0">表示</div><div class="dv-cap" style="color:#8d8b80">黒12%のまま → 暗い面で線が消える</div></div></div><div class="label">✗ ライト用の黒線を流用 → ダークで見えない</div></div>
  <div class="demo"><div class="canvas" style="background:#16150f"><div class="dv-hl-wrap" style="color:#f4f2ec"><div style="padding:10px 0">通知設定</div><div style="height:1px;background:rgba(255,255,255,.12)"></div><div style="padding:10px 0">表示</div><div class="dv-cap" style="color:#8d8b80">白12%へ反転 → 自然に追従</div></div></div><div class="label">✓ prefers-color-scheme で白12%に切替</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/color/roles" target="_blank" rel="noopener">Color roles - Material Design 3</a></p>

## 実装スニペット

```css
/* 上品なヘアライン divider（Material 12%準拠） */
.divider {
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.12); /* ライト: 黒12% */
  margin: 24px 0;
}
@media (prefers-color-scheme: dark) {
  .divider { border-top-color: rgba(255, 255, 255, 0.12); } /* ダーク: 白12% */
}
```

```css
/* 線なしで分離（box-shadow + 背景色差） */
.card {
  background: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06), 0 1px 1px rgba(0, 0, 0, 0.04);
  border-radius: 12px;
}
.section--alt {
  background: #f7f7f8; /* 2色の背景差でセクションを区切る（線ゼロ） */
}
```

```css
/* 余白でグルーピング（外側 > 内側） */
.group {
  display: flex;
  flex-direction: column;
  gap: 8px;            /* 内側の余白は狭く */
  margin-bottom: 40px; /* 外側の余白は広く＝線なしで分離 */
}
.group + .group { /* 線が必要な場合のみ最弱の divider */
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}
```

```css
/* 真のヘアライン（Retina 0.5px） */
.hairline {
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
}
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 2dppx) {
  .hairline { transform: scaleY(0.5); transform-origin: top; }
}
/* 代替: box-shadow 方式 */
.hairline-shadow { box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.12); }
```

## チェックリスト

<ul class="check">
  <li>その境界、余白・box-shadow・背景色差で代替できないか先に試したか</li>
  <li>線の色は <code>rgba(0,0,0,0.12)</code> 前後の半透明か（<code>#ccc</code>/<code>#000</code> のベタを使っていないか）</li>
  <li>線の太さは 1px か（2px 以上の rule を装飾で使っていないか）</li>
  <li>1画面に線が多すぎないか（フルブリード線の乱用＝visual noise）</li>
  <li>グループは「外側余白 > 内側余白」になっているか</li>
  <li>分離強度に応じて full-bleed / inset / middle を使い分けたか</li>
  <li>ダークモードで線が消えていないか（白12%へ反転しているか）</li>
  <li>Retina で 1px が太って見えないか（必要なら 0.5px ヘアライン）</li>
  <li>入力欄など「操作可能要素の境界」は 12% では不足していないか（3:1 目安を確保）</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>12% という数値は Material Design の仕様であり普遍の正解ではない。背景色・ブランド・コントラスト要件次第で 8〜16% 程度に調整する前提で扱う。divider は装飾要素として低コントラストが許容されるが、入力欄の枠など「操作可能要素の境界」はアクセシビリティ上もっと高いコントラスト（3:1 目安）が必要で、12% では不足する場合がある。box-shadow / 背景色差での分離は低品質ディスプレイや明るい環境で消えることがあるため、可視性要件が強い場面では薄枠線を併用する。Retina の 0.5px ヘアラインはブラウザ/OS のサブピクセル処理で見え方が揺れ、1px 環境ではフォールバックが要る。1px.com / tubik / angularjswiki / geeksforgeeks は一次情報ではないブログ/解説記事のため、数値の根拠は併記の Material 一次仕様を優先する。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/components/dividers.html" target="_blank" rel="noopener">Dividers - Material Design (M1)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/dividers" target="_blank" rel="noopener">Dividers - Material Design (M2)</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/styles/color/roles" target="_blank" rel="noopener">Color roles - Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/cards/specs" target="_blank" rel="noopener">Cards - Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://github.com/isalvaus/material-web/blob/main/docs/components/divider.md" target="_blank" rel="noopener">material-web divider docs</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://mui.com/material-ui/react-divider/" target="_blank" rel="noopener">React Divider component - Material UI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://gist.github.com/selcukcihan/b9418596a98abfcd4bbc622550820cc5" target="_blank" rel="noopener">Notes from Refactoring UI (gist)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://medium.com/refactoring-ui/7-practical-tips-for-cheating-at-design-40c736799886" target="_blank" rel="noopener">7 Practical Tips for Cheating at Design - Refactoring UI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://1px.com/1px-css-borders/" target="_blank" rel="noopener">1px Borders CSS</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.tubikstudio.com/visual-dividers-user-interface/" target="_blank" rel="noopener">Tubik Visual Dividers</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.angularjswiki.com/angular/angular-material-divider-mat-divider-example/" target="_blank" rel="noopener">Angular Material Divider Example</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.geeksforgeeks.org/css/how-to-set-border-opacity-with-css/" target="_blank" rel="noopener">How to Set Border Opacity with CSS - GeeksforGeeks</a></p>
