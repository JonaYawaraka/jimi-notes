---
title: "モーダルが雑——ダイアログの作法"
problem: "オーバーレイ・フォーカストラップ・閉じ方が甘い。"
category: 細部
tags: [モーダル, ダイアログ, UI]
date: 2026-06-20
sources: 12
draft: false
---

<style>
  .mod-trigger{display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;border-radius:8px;background:var(--ink);color:var(--paper);font-weight:700;font-size:13px;border:none}
  .mod-stage{position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden}
  .mod-bg{position:absolute;inset:0;padding:14px;color:var(--ink-3);font-size:11px;line-height:1.5;user-select:none}
  .mod-scrim-none{position:absolute;inset:0}
  .mod-scrim-32{position:absolute;inset:0;background:hsl(0 0% 0% / .32);backdrop-filter:blur(1px)}
  .mod-scrim-60{position:absolute;inset:0;background:hsl(0 0% 0% / .60)}
  .mod-dialog{position:relative;background:var(--paper);color:var(--ink);border-radius:12px;padding:14px 16px;width:160px;box-shadow:0 8px 24px rgba(0,0,0,.25);font-size:12px}
  .mod-dialog h5{margin:0 0 6px;font-size:13px}
  .mod-dialog p{margin:0 0 10px;color:var(--ink-2);font-size:11px;line-height:1.5}
  .mod-row{display:flex;gap:6px;justify-content:flex-end}
  .mod-btn{border:none;border-radius:6px;padding:5px 10px;font-size:11px;font-weight:700;cursor:pointer}
  .mod-btn-ghost{background:var(--paper-2);color:var(--ink);border:1px solid var(--line)}
  .mod-btn-danger{background:var(--accent);color:var(--paper)}
  .mod-x{position:absolute;top:6px;right:8px;font-size:14px;color:var(--ink-3);font-weight:700}
  .mod-close-tag{display:inline-block;margin-top:8px;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px}
  .mod-close-ok{background:#1f7a3d;color:var(--paper)}
  .mod-close-bad{background:var(--accent);color:var(--paper)}
  .mod-ring{outline:3px solid var(--accent);outline-offset:2px}
  .mod-tree{font-size:11px;line-height:1.7;color:var(--ink);text-align:left;font-family:ui-monospace,monospace}
  .mod-tree .mod-dim{color:var(--ink-3)}
  .mod-tree .mod-hit{color:var(--accent);font-weight:700}
  .mod-focusflow{display:flex;flex-direction:column;gap:8px;align-items:center;font-size:11px;color:var(--ink)}
  .mod-node{padding:5px 10px;border-radius:6px;border:1px solid var(--line);background:var(--paper);color:var(--ink);font-weight:700}
  .mod-arrow{font-size:14px;color:var(--ink-3)}
  .mod-lost{color:var(--accent)}
  .mod-ok{color:#1f7a3d}
  .mod-scrimswatch{display:flex;flex-direction:column;align-items:center;gap:6px}
  .mod-scrimbox{width:150px;height:96px;border-radius:8px;position:relative;overflow:hidden;border:1px solid var(--line)}
  .mod-scrimbox .mod-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);background:var(--paper);color:var(--ink);font-size:10px;font-weight:700;padding:6px 10px;border-radius:6px}
  .mod-scrimlabel{font-size:10px;color:var(--ink-2);font-weight:700}
</style>

## 結論

プロは「雑なモーダル」を W3C APG の3本柱——フォーカス管理（開いたら内部へ、閉じたら起動元へ）、正しいセマンティクス（`role="dialog"` + `aria-modal="true"` + ラベル）、背景の無効化と暗転（`inert` + scrim）——で解決する。2022年以降はネイティブ `<dialog>` + `showModal()` を第一選択にすれば、top layer 描画・背景の `inert` 化・暗黙の `aria-modal`・初期フォーカス移動・Esc で閉じる・`::backdrop` がブラウザから無料で得られ、手書きのフォーカストラップ JS は原則不要になる。最大の差は「閉じ方」——背景クリックは ARIA 要件ではない便利機能にすぎず、Esc か可視のクローズボタンによるキーボード閉じが必須だ。

## 01 — ネイティブ `<dialog>` + `showModal()` を第一選択にする

`<div>` をオーバーレイで重ねただけの手製モーダルは、フォーカス管理も `inert` も Esc も自前 JS が必要で、どれか1つ欠けた瞬間に「雑」になる。`showModal()` で開けば top layer 描画・背景の `inert` 化・暗黙の `aria-modal="true"`・初期フォーカス移動・Esc 閉じ・`::backdrop` が全て自動で付く。`show()` や `open` 属性は非モーダル（`aria-modal="false"`、Esc 自動クローズなし）なので、モーダル挙動が要るときは必ず `showModal()` を使う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文</div><div class="mod-scrim-none"></div><div class="mod-dialog" style="box-shadow:0 2px 6px rgba(0,0,0,.15)"><h5>確認</h5><p>div を重ねただけ</p><div class="mod-row"><button class="mod-btn mod-btn-ghost">OK</button></div><span class="mod-close-tag mod-close-bad">inert / Esc 無し</span></div></div></div><div class="label">✗ 安っぽい例：暗転なし・背景にフォーカスが抜ける・Esc で閉じない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文 ページ本文</div><div class="mod-scrim-32"></div><div class="mod-dialog"><h5>確認</h5><p>showModal() で開く</p><div class="mod-row"><button class="mod-btn mod-btn-ghost">OK</button></div><span class="mod-close-tag mod-close-ok">inert / Esc 自動</span></div></div></div><div class="label">✓ プロの例：top layer・背景 inert・::backdrop・Esc が無料で付く</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog" target="_blank" rel="noopener">&lt;dialog&gt; HTML dialog element — MDN</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal" target="_blank" rel="noopener">HTMLDialogElement: showModal() method — MDN</a></p>

## 02 — 正しいセマンティクスを付ける（role + aria-modal + ラベル）

`aria-modal="true"` はアクセシビリティツリーを変えるだけで、フォーカス管理やモーダル挙動そのものは別途必要だ。コンテナに `role="dialog"`（確認・警告系は `role="alertdialog"`）と `aria-modal="true"` を付け、可視タイトルを `aria-labelledby` で参照するか `aria-label` を付ける（どちらか必須）。これがあると見出しがスクリーンリーダーに読まれ、背景は `aria-hidden` を付けなくても無視される。`<dialog>` + `showModal()` なら暗黙付与されるが、手製なら明示が必須だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-tree"><div class="mod-dim">▸ &lt;div class="overlay"&gt;</div><div class="mod-dim">　▸ &lt;div class="modal"&gt;</div><div>　　　&lt;div&gt; <span class="mod-dim">削除しますか？</span></div><div>　　　&lt;button&gt; 削除</div><div class="mod-hit">⚠ role 無し → グループとして</div><div class="mod-hit">　読まれず、見出しも無名</div></div></div><div class="label">✗ 安っぽい例：role/ラベルなし → 「ダイアログ」と認識されない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-tree"><div>▸ &lt;div role="dialog"</div><div>　　aria-modal="true"</div><div>　　aria-labelledby="t"&gt;</div><div>　　&lt;h2 id="t"&gt; <span class="mod-ok">削除しますか？</span></div><div>　　&lt;button&gt; 削除</div><div class="mod-ok">✓ 「ダイアログ・削除しますか？」</div></div></div><div class="label">✓ プロの例：role + aria-modal + aria-labelledby で名前が読まれる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener">Dialog (Modal) Pattern | APG | W3C WAI-ARIA</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-modal" target="_blank" rel="noopener">ARIA: aria-modal attribute — MDN</a></p>

## 03 — フォーカスを正しく管理する（開いたら内部、閉じたら起動元へ）

開いてもフォーカスがトリガーやページ先頭に残り、閉じたらページ冒頭へ飛ぶ実装は、キーボード操作の文脈を完全に破壊する。鉄則は「開いたら内部の最初のフォーカス可能要素へ移し、Tab/Shift+Tab はダイアログ内で循環させ、閉じたら起動元の要素へ `.focus()` で戻す」。手製なら開く直前にトリガー参照を保存しておく。ただしブラウザ chrome（アドレスバー等）への Tab 離脱は意図的に許容される——トラップするのはページ内だけだ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-focusflow"><div class="mod-node">トリガー <span class="mod-lost">●</span></div><div class="mod-arrow">↓ 開く</div><div class="mod-node" style="opacity:.55">モーダル（フォーカス来ず）</div><div class="mod-arrow">↓ 閉じる</div><div class="mod-lost">↟ ページ冒頭へ飛ぶ</div></div></div><div class="label">✗ 安っぽい例：フォーカスがトリガーに残り、閉じると先頭へ迷子</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-focusflow"><div class="mod-node">トリガー</div><div class="mod-arrow">↓ 開く</div><div class="mod-node mod-ring">モーダル内へ移動 ●</div><div class="mod-arrow">↑ 閉じる</div><div class="mod-ok">↩ 起動元トリガーへ復帰</div></div></div><div class="label">✓ プロの例：開いたら内部へ、閉じたら起動元へ .focus() で戻す</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener">Dialog (Modal) Pattern | APG | W3C WAI-ARIA</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/there-is-no-need-to-trap-focus-on-a-dialog-element/" target="_blank" rel="noopener">There is No Need to Trap Focus on a Dialog Element | CSS-Tricks</a></p>

## 04 — キーボードで閉じられる手段を必ず用意する

最大の落とし穴がこれだ。背景クリック（light dismiss）や `×` アイコンだけでは、キーボードやスクリーンリーダーの利用者が閉じられず操作不能になる。背景クリックは ARIA 要件ではない便利機能にすぎない。必須なのは「Esc で閉じる」と「Tab 順内にある可視の `role="button"` クローズ要素（×やキャンセル）」だ。`<dialog>` なら `closedby="any"` で背景クリック閉じを宣言的に足せるが、足しても Esc とクローズボタンは絶対に残す。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">背景 背景 背景 背景 背景 背景 背景 背景 背景 背景 背景 背景</div><div class="mod-scrim-32"></div><div class="mod-dialog"><h5>お知らせ</h5><p>背景クリックだけで閉じる</p><span class="mod-close-tag mod-close-bad">Esc ✗ / ボタン ✗</span></div></div></div><div class="label">✗ 安っぽい例：マウスのみ → キーボード利用者は閉じられない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">背景 背景 背景 背景 背景 背景 背景 背景 背景 背景 背景 背景</div><div class="mod-scrim-32"></div><div class="mod-dialog"><span class="mod-x">×</span><h5>お知らせ</h5><p>Esc / × / キャンセル</p><div class="mod-row"><button class="mod-btn mod-btn-ghost">キャンセル</button></div><span class="mod-close-tag mod-close-ok">Esc ✓ / ボタン ✓</span></div></div></div><div class="label">✓ プロの例：Esc + 可視クローズボタン（背景クリックは任意で追加）</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener">Dialog (Modal) Pattern | APG | W3C WAI-ARIA</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://uit.stanford.edu/accessibility/testing/manual-checks/dialogs" target="_blank" rel="noopener">Dialogs | University IT Accessibility — Stanford</a></p>

## 05 — 背景を `inert` にし、scrim で暗転させる

scrim（暗転レイヤー）は「アプリの残りは操作不能」を視覚的に示す要素だ。暗転がないと階層が伝わらず安っぽい。逆に黒60%のようなベタ塗りは古い非統一値で、Material は scrim を 32% 不透明に統一した。コードでは背景を `inert` にして操作無効化と支援技術からの隠蔽を1宣言で行う。`aria-modal="true"` を名乗ってよいのは「コードで外部操作を無効化」かつ「視覚的に背景を覆う」両方が揃ったときだけだ。

<div class="grid g3">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-scrimswatch"><div class="mod-scrimbox"><div class="mod-bg" style="position:absolute;inset:0;padding:8px;font-size:9px">背景 背景 背景 背景 背景 背景 背景</div><div class="mod-scrim-none"></div><div class="mod-card">card</div></div><span class="mod-scrimlabel mod-lost">✗ 0%（暗転なし）</span></div></div><div class="label">階層が伝わらず安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-scrimswatch"><div class="mod-scrimbox"><div class="mod-bg" style="position:absolute;inset:0;padding:8px;font-size:9px">背景 背景 背景 背景 背景 背景 背景</div><div class="mod-scrim-32"></div><div class="mod-card">card</div></div><span class="mod-scrimlabel mod-ok">✓ 32%（Material）</span></div></div><div class="label">操作不能が伝わり読みやすい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-scrimswatch"><div class="mod-scrimbox"><div class="mod-bg" style="position:absolute;inset:0;padding:8px;font-size:9px">背景 背景 背景 背景 背景 背景 背景</div><div class="mod-scrim-60"></div><div class="mod-card">card</div></div><span class="mod-scrimlabel mod-lost">✗ 60%（旧・濃すぎ）</span></div></div><div class="label">古い非統一値・重い印象</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/dialogs/android" target="_blank" rel="noopener">Dialogs — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://github.com/material-components/material-components-android/issues/4295" target="_blank" rel="noopener">[Docs] unify scrim opacity · Issue #4295</a></p>

## 06 — モーダルは「割り込むコストに見合う」場面に限定する

モーダルは scrim で他の全作業をブロックする割り込みだ。NN/g は、警告・破壊的/不可逆操作の確認・フロー継続に必須な情報など「割り込むコストに見合う重要事項」に限れと明言している。ニュースレター登録のような些末な用途でモーダルを多用すると、鬱陶しく安っぽい印象を与える。それは非モーダルやインライン表示で十分だ。確認・警告系は `role="alertdialog"` を使う。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">記事を読んでいる最中…… 記事 記事 記事 記事 記事 記事 記事</div><div class="mod-scrim-32"></div><div class="mod-dialog"><span class="mod-x">×</span><h5>📧 登録して！</h5><p>ニュースレターに登録</p><div class="mod-row"><button class="mod-btn mod-btn-danger">登録</button></div></div></div></div><div class="label">✗ 安っぽい例：些末な用件を割り込みで強制 → 鬱陶しい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mod-stage"><div class="mod-bg">アカウント設定 アカウント設定 アカウント設定 アカウント設定</div><div class="mod-scrim-32"></div><div class="mod-dialog"><h5>アカウントを削除</h5><p>この操作は取り消せません。</p><div class="mod-row"><button class="mod-btn mod-btn-ghost">キャンセル</button><button class="mod-btn mod-btn-danger">削除</button></div></div></div></div><div class="label">✓ プロの例：不可逆操作の確認 → role="alertdialog" で割り込む価値あり</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.nngroup.com/articles/modal-nonmodal-dialog/" target="_blank" rel="noopener">Modal & Nonmodal Dialogs: When (& When Not) to Use Them — NN/g</a></p>

## 実装スニペット

```css
/* ① ネイティブ <dialog>：中央寄せ + scrim（最小・推奨） */
dialog {
  margin: auto;            /* top layer 内で中央寄せ */
  position: fixed;
  inset: 0;
  border: none;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: min(90vw, 480px);
}
/* showModal() のときだけ自動生成される暗転レイヤー */
dialog::backdrop {
  background-color: hsl(0 0% 0% / 0.32); /* Material 準拠の scrim 32% */
  backdrop-filter: blur(2px);
}
```

```css
/* ② 開閉トランジション（display / overlay も含めてアニメ） */
dialog {
  opacity: 0;
  transition: opacity 0.2s ease, overlay 0.2s ease allow-discrete,
              display 0.2s ease allow-discrete;
}
dialog[open] { opacity: 1; }
@starting-style {
  dialog[open] { opacity: 0; }
}
dialog::backdrop {
  opacity: 0;
  transition: opacity 0.2s ease, overlay 0.2s ease allow-discrete,
              display 0.2s ease allow-discrete;
}
dialog[open]::backdrop { opacity: 1; }
@starting-style { dialog[open]::backdrop { opacity: 0; } }
```

```html
<!-- ③ 宣言的な背景クリック閉じ（light dismiss） -->
<dialog id="d" closedby="any">
  <h2 id="title">確認</h2>
  <p>この操作は取り消せません。</p>
  <button autofocus>キャンセル</button>
  <button class="danger">削除する</button>
</dialog>
<!-- closedby="any":         背景クリック + Esc + ボタンで閉じる -->
<!-- closedby="closerequest": Esc + ボタンのみ（背景クリック不可） -->
<!-- <dialog> 自体に tabindex は付けない -->
```

```css
/* ④ <dialog> が使えない場合のみ：手製 overlay + scrim */
.mod-overlay {
  position: fixed;
  inset: 0;                       /* top/right/bottom/left: 0 */
  background: rgba(0, 0, 0, 0.5); /* 黒50% scrim（旧来の定番値） */
  display: grid;
  place-items: center;
  z-index: 1000;
}
.mod-modal {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: min(90vw, 480px);
}
/* JS: appRoot.inert = true; 閉じたら appRoot.inert = false; trigger.focus(); */
/* role="dialog" aria-modal="true" aria-labelledby を付与し、 */
/* フォーカストラップ・inert・trigger 復帰を JS で実装する */
```

## チェックリスト

<ul class="check">
  <li>モーダル挙動が要るなら <code>show()</code>/<code>open</code> ではなく <code>showModal()</code> で開いている</li>
  <li><code>role="dialog"</code>（確認・警告は <code>alertdialog</code>）+ <code>aria-modal="true"</code> が付いている</li>
  <li>可視タイトルを <code>aria-labelledby</code> で参照、または <code>aria-label</code> がある（どちらか必須）</li>
  <li>開いたら内部の最初のフォーカス可能要素へフォーカスが移る（必要なら <code>autofocus</code>）</li>
  <li>Tab / Shift+Tab がダイアログ内で循環する（最後→Tab→最初）</li>
  <li>閉じたらフォーカスが起動元のトリガーへ <code>.focus()</code> で戻る</li>
  <li><b>Esc で閉じられる</b>、かつ Tab 順内に可視のクローズボタンがある（背景クリックだけにしない）</li>
  <li>背景を <code>inert</code> 化（手製時）し、scrim で暗転させている（黒32%目安／黒60%は避ける）</li>
  <li><code>&lt;dialog&gt;</code> 自体に <code>tabindex</code> を付けていない</li>
  <li>そのモーダルは「割り込むコストに見合う」重要事項か（些末ならインライン表示にする）</li>
  <li><code>closedby</code> / <code>@starting-style</code> / <code>allow-discrete</code> はターゲットブラウザのサポートを確認した</li>
</ul>

## 限界 / 出典

<div class="note"><b>scrim 値に唯一の正解はない：</b>Material の統一値は 32%、12 Days of Web の実例は黒35%+blur 2px、wpdean は黒50%。いずれも credible だが文脈依存なので、背景の明度やブランドに応じて調整する。合意があるのは「旧来の黒60%は濃すぎとして非推奨」という点だけだ。</div>

<div class="note"><b>新しめの機能は本番前にサポート確認を：</b><code>closedby</code> 属性や <code>@starting-style</code> + <code>transition-behavior: allow-discrete</code> によるトランジションは比較的新しい CSS/HTML 機能。未対応環境ではアニメなしの即時表示や JS でのクリック外し判定にフォールバックを用意する。</div>

<div class="note"><b>「手動フォーカストラップ不要」は前提付き：</b>これは <code>&lt;dialog&gt;</code> + <code>showModal()</code> / <code>inert</code> が使える前提の話。React のポータル実装や旧ブラウザ対応など <code>&lt;dialog&gt;</code> を使えない場合は、従来通りの手製トラップ・<code>inert</code>・trigger 復帰が依然必要だ。背景クリック閉じを足すのは自由だが、Esc と可視クローズボタンは省いてはいけない。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/" target="_blank" rel="noopener">Dialog (Modal) Pattern | APG | W3C WAI-ARIA Authoring Practices</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog" target="_blank" rel="noopener">&lt;dialog&gt; HTML dialog element — MDN Web Docs</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-modal" target="_blank" rel="noopener">ARIA: aria-modal attribute — MDN Web Docs</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal" target="_blank" rel="noopener">HTMLDialogElement: showModal() method — MDN</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/components/dialogs/android" target="_blank" rel="noopener">Dialogs — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://github.com/material-components/material-components-android/issues/4295" target="_blank" rel="noopener">[Docs] unify scrim opacity · Issue #4295 (material-components-android)</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.nngroup.com/articles/modal-nonmodal-dialog/" target="_blank" rel="noopener">Modal & Nonmodal Dialogs: When (& When Not) to Use Them — NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://12daysofweb.dev/2022/dialog/" target="_blank" rel="noopener">HTML Dialog | 12 Days of Web</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://css-tricks.com/there-is-no-need-to-trap-focus-on-a-dialog-element/" target="_blank" rel="noopener">There is No Need to Trap Focus on a Dialog Element | CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/how-to-build-accessible-modals-with-focus-traps/" target="_blank" rel="noopener">How to Build Accessible Modals with Focus Traps (2026 Guide) | UXPin</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://uit.stanford.edu/accessibility/testing/manual-checks/dialogs" target="_blank" rel="noopener">Dialogs | University IT Accessibility — Stanford</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://wpdean.com/css-modals/" target="_blank" rel="noopener">Practical CSS Modals Examples You Can Use</a></p>
