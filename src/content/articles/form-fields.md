---
title: "フォームが安っぽい——入力欄の質を上げる"
problem: "input/selectの作り込みが甘く、フォーム全体が素人っぽい。"
category: 細部
tags: [フォーム, 入力欄, UI]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .for-field{display:flex;flex-direction:column;width:100%;max-width:260px;text-align:left}
  .for-lbl{font-size:14px;font-weight:600;color:#16150f;margin-bottom:8px}
  .for-input{box-sizing:border-box;width:100%;min-height:40px;padding:8px 12px;font-size:16px;line-height:1.25;border-radius:4px;background:#fff;color:#16150f}

  /* 01 ラベル位置 */
  .for-lbl-bad{position:relative;width:100%;max-width:260px;text-align:left}
  .for-ph{box-sizing:border-box;width:100%;min-height:40px;padding:8px 12px;font-size:16px;border:2px solid #6b7280;border-radius:4px;background:#fff;color:#8d8b80}
  .for-lbl-left{display:flex;align-items:center;gap:64px;width:100%;max-width:300px}
  .for-lbl-left .for-lbl{margin-bottom:0;white-space:nowrap}
  .for-input-plain{box-sizing:border-box;width:100%;min-height:40px;padding:8px 12px;font-size:16px;border:2px solid #6b7280;border-radius:4px;background:#fff;color:#16150f}

  /* 02 フォーカス */
  .for-focus-bad{box-sizing:border-box;width:100%;max-width:240px;min-height:40px;padding:8px 12px;font-size:16px;border:1px solid #c8c6bd;border-radius:4px;background:#fff;color:#16150f;outline:none}
  .for-focus-good{box-sizing:border-box;width:100%;max-width:240px;min-height:40px;padding:8px 12px;font-size:16px;border:2px solid #1d4ed8;border-radius:4px;background:#fff;color:#16150f;outline:3px solid #1a1a1a;outline-offset:0;box-shadow:0 0 0 6px #fff}

  /* 03 寸法・リズム */
  .for-rhythm{display:flex;flex-direction:column;align-items:stretch;width:100%;max-width:220px}
  .for-bad-i1{box-sizing:border-box;width:100%;height:28px;padding:2px 8px;font-size:12px;border:1px solid #c8c6bd;border-radius:4px;background:#fff;color:#16150f;margin-bottom:4px}
  .for-bad-i2{box-sizing:border-box;width:100%;height:44px;padding:2px 8px;font-size:12px;border:1px solid #c8c6bd;border-radius:4px;background:#fff;color:#16150f;margin-bottom:14px}
  .for-bad-btn{box-sizing:border-box;width:100%;height:34px;border:none;border-radius:4px;background:#16150f;color:#f4f2ec;font-size:13px}
  .for-good-i{box-sizing:border-box;width:100%;height:40px;padding:8px 12px;font-size:16px;border:2px solid #6b7280;border-radius:4px;background:#fff;color:#16150f;margin-bottom:16px}
  .for-good-btn{box-sizing:border-box;width:100%;height:40px;border:none;border-radius:4px;background:#16150f;color:#f4f2ec;font-size:15px;font-weight:600}

  /* 04 エラー */
  .for-err-bad{box-sizing:border-box;width:100%;max-width:240px;min-height:40px;padding:8px 12px;font-size:16px;border:2px solid #b91c1c;border-radius:4px;background:#fff;color:#16150f}
  .for-err-wrap{width:100%;max-width:240px;text-align:left}
  .for-err-good{box-sizing:border-box;width:100%;min-height:40px;padding:8px 12px;font-size:16px;border:2px solid #b91c1c;border-radius:4px;background:#fff;color:#16150f}
  .for-err-text{display:flex;align-items:center;gap:6px;margin-top:8px;color:#b91c1c;font-size:13px;line-height:1.4}
  .for-err-text::before{content:"\26A0";font-size:14px}

  /* 05 状態 */
  .for-states{display:flex;flex-direction:column;gap:10px;width:100%;max-width:230px;text-align:left}
  .for-st{box-sizing:border-box;width:100%;min-height:36px;padding:6px 10px;font-size:15px;border-radius:4px;display:flex;align-items:center}
  .for-st-default{border:2px solid #6b7280;background:#fff;color:#16150f}
  .for-st-hover{border:2px solid #374151;background:#fff;color:#16150f}
  .for-st-focus{border:2px solid #1d4ed8;background:#fff;color:#16150f;outline:3px solid #1a1a1a;box-shadow:0 0 0 4px #fff}
  .for-st-error{border:2px solid #b91c1c;background:#fff;color:#16150f}
  .for-st-disabled{border:2px solid #e5e7eb;background:#f3f4f6;color:#9ca3af}
  .for-st-tag{font-size:11px;font-weight:700;color:#5c5a50;margin-bottom:2px}
  .for-flat{box-sizing:border-box;width:100%;max-width:230px;min-height:36px;padding:6px 10px;font-size:15px;border:1px solid #c8c6bd;border-radius:4px;background:#fff;color:#16150f}
</style>

## 結論

プロは入力欄の「安っぽさ」を、状態フィードバックと寸法・余白を具体数値で固めることで消す。ラベルはフィールド外に上揃え常時表示し、フォーカスは色だけでなく太さ+box-shadowで多層化してWCAG 3:1を満たす。高さ40〜56px・font-size 16px以上・8pxグリッドの一定リズムで「整っている=高品質」を作り、エラーは色単独でなくアイコン+テキスト+ARIAで多重化する。

## 01 — ラベルはフィールド外・上揃えで常時表示する

プレースホルダーをラベル代わりにすると、入力を始めた瞬間に何の欄か分からなくなり、薄いグレーはコントラスト不足でスクリーンリーダーにも届かない。ラベルはフィールド直上（top-aligned）に常時置くのが正解だ。Penzoのアイトラッキングでは視線移動（サッカード）が上揃え約50msに対し左揃えは約500msと、上揃えが最も速い。ラベルは1〜2語・センテンスケース（"名"）で。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-lbl-bad"><div class="for-ph">メールアドレス</div></div></div><div class="label">✗ プレースホルダーがラベル代わり → 入力すると消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-field"><span class="for-lbl">メールアドレス</span><div class="for-input-plain">you@example.com</div></div></div><div class="label">✓ ラベルを直上に常時表示、補助だけプレースホルダー</div></div>
</div>

<div class="note"><b>左揃えの落とし穴：</b>ラベルとフィールドの間に大きな白を空けて左揃えにすると、視線移動が増えグルーピングが崩れて散漫に見える。横並びは極端に長いデスクトップフォームのみ検討する。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/form-design-placeholders/" target="_blank" rel="noopener">Placeholders in Form Fields Are Harmful — NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php" target="_blank" rel="noopener">Label Placement in Forms — UXmatters</a></p>

## 02 — フォーカスは色だけでなく太さ+box-shadowで多層化する

キーボードユーザーにとってフォーカスインジケータはマウスカーソルに相当する唯一の位置手がかりだ。`outline:none` を代替なしで消すと操作不能になり、見た目も雑になる。WCAG SC1.4.11はボーダーもフォーカスも隣接背景に3:1以上を要求し、SC2.4.13（AAA）はフォーカス領域に2 CSS px厚の周長以上を求める。outline 3px+box-shadow 6px（白ハロー、厚みはoutlineの2倍）+ボーダー色変更の三層が汎用パターン。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-focus-bad">outline:none のまま</div></div><div class="label">✗ フォーカスが消えて今どこを編集中か不明</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-focus-good">3px outline + 6px halo</div></div><div class="label">✓ outline+ハロー+ボーダー色の三層で確実に伝わる</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast — W3C WAI</a></p>

## 03 — 高さ・文字サイズ・余白を仕様値で固める

安っぽいフォームは入力欄の高さがバラバラで、ボタンとも揃わず縦のリズムが崩れている。高さは標準56px（密度高めで40〜48px）、入力/ラベル文字16px、font-sizeは`max(16px,1em)`でiOS自動ズームを防ぐ。入力欄の高さは主ボタンの高さに揃え、フィールド間は最低16px。8pxグリッドの一定リズムこそが「整っている=高品質」の核だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-rhythm"><div class="for-bad-i1">28px</div><div class="for-bad-i2">44px / 文字12px</div><button class="for-bad-btn">送信(34px)</button></div></div><div class="label">✗ 高さも余白も不揃い、文字16px未満でiOSズーム</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-rhythm"><div class="for-good-i">40px / 16px</div><div class="for-good-i">40px / 16px</div><button class="for-good-btn">送信(40px)</button></div></div><div class="label">✓ 全高40px・間隔16px・ボタンも同高で揃う</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/components/text-fields.html" target="_blank" rel="noopener">Text fields — Components — Material Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sitepoint.com/designing-form-layout-spacing/" target="_blank" rel="noopener">Designing Form Layout: Spacing — SitePoint</a></p>

## 04 — エラーは色+アイコン+テキスト+ARIAで多重化する

赤枠だけに頼ると、色覚多様性のユーザーに伝わらずWCAG非適合になる。`aria-invalid="true"` と `aria-describedby` でエラー文を関連付け、動的注入には `role="alert"` を付ける。検証は送信時の一括ではなくchange/blur時にフィールド近傍へインライン表示し、入力済みの誤り値は保持して修正させる。エラー本文テキストは4.5:1（枠線の3:1より高い）を確保する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-err-bad">taro@</div></div><div class="label">✗ 赤枠だけ → 何が問題か・色が見えない人に伝わらない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-err-wrap"><div class="for-err-good">taro@</div><div class="for-err-text">有効なメールアドレスを入力してください</div></div></div><div class="label">✓ 赤枠+アイコン+テキストの三重化、ARIAで関連付け</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/ultimate-guide-to-accessible-form-design/" target="_blank" rel="noopener">Ultimate Guide to Accessible Form Design — UXPin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/input-ui-design" target="_blank" rel="noopener">Input UI design: States, anatomy, and validation patterns — Setproduct</a></p>

## 05 — 全状態を設計する（default/hover/focus/error/disabled）

安っぽいフォームは「のっぺり」していて、押せるのか・編集中なのかが分からない。プロはdefaultだけでなくhover/focus/filled/error/disabled/successまで明示的に色と太さを定義する。状態差が見えるだけで「作り込まれている」印象が一気に出る。disabledはWCAGコントラスト要件の対象外だが、視覚的に区別できるよう薄くする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-flat">全部おなじ見た目</div></div><div class="label">✗ 1状態しか作らず、反応が読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="for-states"><div><div class="for-st-tag">DEFAULT</div><div class="for-st for-st-default">通常</div></div><div><div class="for-st-tag">FOCUS</div><div class="for-st for-st-focus">編集中</div></div><div><div class="for-st-tag">DISABLED</div><div class="for-st for-st-disabled">無効</div></div></div></div><div class="label">✓ 各状態を色+太さで明示（focus/disabled等）</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/input-ui-design" target="_blank" rel="noopener">Input UI design: States, anatomy, and validation patterns — Setproduct</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uiprep.com/blog/ui-designers-guide-to-creating-forms-inputs" target="_blank" rel="noopener">UI Designer's Guide to Creating Forms & Inputs — UI Prep</a></p>

## 実装スニペット

ベースとなる入力欄（寸法・余白・iOSズーム防止）。

```css
.field { display: flex; flex-direction: column; gap: 8px; }
.field label { font-size: 16px; line-height: 1.4; font-weight: 600; }
.input {
  box-sizing: border-box;
  width: 100%;
  min-height: 40px;            /* 主ボタン高さに揃える(8pxグリッド) */
  padding: 8px 12px;
  font-size: max(16px, 1em);   /* iOS自動ズーム防止 */
  line-height: 1.25;
  border: 2px solid #6b7280;   /* 隣接背景に3:1以上を確保 */
  border-radius: 4px;
  background: #fff;
  transition: border-color 180ms ease-in-out, box-shadow 180ms ease-in-out;
}
.input::placeholder { color: #6b7280; } /* ラベル代わりにはしない・補助のみ */
.field + .field { margin-top: 16px; }   /* フィールド間 最低16px */
```

フォーカス可視化（WCAG 1.4.11 / 2.4.13 準拠の多層）。`:focus-visible` でキーボード操作時のみ強いリングを出す。

```css
.input:focus-visible {
  outline: 3px solid #1a1a1a;          /* 3px outline */
  outline-offset: 0;
  box-shadow: 0 0 0 6px #fff;          /* ハロー幅 = outlineの2倍 */
  border-color: #1d4ed8;               /* 色も変える(色のみに頼らない) */
}
/* outline:none は単独で使わない。使うなら必ず上記box-shadow等で代替 */
```

エラー状態（色のみに頼らない・ARIA前提）。

```css
.input[aria-invalid="true"] {
  border-color: #b91c1c;               /* 赤枠(3:1以上) */
  border-width: 2px;
}
.error-text {
  display: flex; align-items: center; gap: 6px;
  margin-top: 8px;
  color: #b91c1c;                      /* テキストは4.5:1以上 */
  font-size: 12px; line-height: 1.4;
}
.error-text::before { content: "\26A0"; }  /* アイコンを併用 */

/* HTML:
<input class="input" aria-invalid="true" aria-describedby="email-err">
<p id="email-err" class="error-text" role="alert">有効なメールアドレスを入力してください</p>
*/
```

全状態の定義（default/hover/filled/disabled/success）。

```css
.input:hover { border-color: #374151; }
.input:not(:placeholder-shown) { border-color: #374151; } /* filled */
.input:disabled {
  background: #f3f4f6; color: #9ca3af;
  border-color: #e5e7eb; cursor: not-allowed;
}
/* disabledはWCAGコントラスト要件の対象外。だが識別可能に薄める */
.input--success { border-color: #15803d; }
```

## チェックリスト

<ul class="check">
  <li>ラベルをフィールド外・上揃えで常時表示し、プレースホルダーをラベル代わりにしていない</li>
  <li>font-sizeは `max(16px, 1em)` 以上で、iOSフォーカス時の自動ズームを防いでいる</li>
  <li>入力欄の高さ（40〜56px）が主ボタンの高さに揃い、フィールド間は最低16px空いている</li>
  <li>余白が8pxグリッドの一定リズムで、単一カラムで下方向に流れている</li>
  <li>`:focus-visible` で outline+box-shadow+ボーダー色の多層フォーカスを出し、隣接背景に3:1以上ある</li>
  <li>`outline:none` を代替なしで使っていない</li>
  <li>エラーを赤枠だけでなくアイコン+テキストで示し、本文は4.5:1を満たす</li>
  <li>`aria-invalid` / `aria-describedby` を付与し、動的エラーに `role="alert"` を使っている</li>
  <li>検証はchange/blurでインライン表示し、誤り値は保持して修正させている</li>
  <li>default/hover/focus/filled/error/disabledまで各状態を視覚的に定義している</li>
  <li>郵便番号・電話・カード番号など長さが決まる項目は幅を絞り、想定入力長を示している</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>Penzoのアイトラッキング数値（約50ms / 約500ms）は2006年の小規模研究で、傾向（上揃えが最速）は他研究と整合するが絶対値は鵜呑みにしない。Material Designの具体寸法はm1（Material 1）のもので、Material 3では数値が更新されている——56px/16px等は出発点の目安として使う。フォーカスの汎用パターン（outline 3px+shadow 6px・黒/白）は背景色に依存するため、実配色で必ず3:1（テキストは4.5:1）を測定し直すこと。WCAG SC2.4.13（Focus Appearance）はAAAであり全案件で必須ではないが、満たすと品質が上がる。「指針準拠78%vs非準拠42%」はNN/g記事内の主張で母数・条件の詳細は限定的。font-size 16px以上のiOSズーム防止はSafari挙動依存で、将来のOS更新で変わる可能性がある。バナー内の擬似入力UIは見た目の寸法・余白原則のみ流用する。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/form-design-placeholders/" target="_blank" rel="noopener">Placeholders in Form Fields Are Harmful — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/web-form-design/" target="_blank" rel="noopener">Website Forms Usability: Top 10 Recommendations — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html" target="_blank" rel="noopener">Understanding SC 1.4.11: Non-text Contrast — W3C WAI</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/components/text-fields.html" target="_blank" rel="noopener">Text fields — Components — Material Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://moderncss.dev/custom-css-styles-for-form-inputs-and-textareas/" target="_blank" rel="noopener">Custom CSS Styles for Form Inputs and Textareas — Modern CSS</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/ultimate-guide-to-accessible-form-design/" target="_blank" rel="noopener">Ultimate Guide to Accessible Form Design — UXPin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.setproduct.com/blog/input-ui-design" target="_blank" rel="noopener">Input UI design: States, anatomy, and validation patterns — Setproduct</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxmatters.com/mt/archives/2006/07/label-placement-in-forms.php" target="_blank" rel="noopener">Label Placement in Forms — UXmatters</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sitepoint.com/designing-form-layout-spacing/" target="_blank" rel="noopener">Designing Form Layout: Spacing — SitePoint</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uiprep.com/blog/ui-designers-guide-to-creating-forms-inputs" target="_blank" rel="noopener">UI Designer's Guide to Creating Forms & Inputs — UI Prep</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.sitepoint.com/definitive-guide-form-label-positioning/" target="_blank" rel="noopener">The Definitive Guide to Form Label Positioning — SitePoint</a></p>
