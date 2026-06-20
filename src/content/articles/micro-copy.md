---
title: "文言がダサい——マイクロコピーの質"
problem: "ボタンや空状態の文言が機械的で冷たい。"
category: タイポ
tags: [マイクロコピー, UXライティング, 文言]
date: 2026-06-20
sources: 14
draft: false
---

<style>
  .mic-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5em;white-space:nowrap;min-height:44px;padding:0 1.25rem;font-size:1rem;line-height:1.2;font-weight:600;border-radius:6px;border:none;cursor:default;font-feature-settings:"palt"}
  .mic-btn-bad{background:#3a3833;color:#f4f2ec;text-transform:uppercase;letter-spacing:.04em}
  .mic-btn-good{background:var(--accent);color:#f4f2ec;text-transform:none;letter-spacing:0}
  .mic-btn-arrow{display:inline-flex;align-items:center;justify-content:flex-start;text-align:left;width:200px;max-width:100%;background:var(--ink);color:#f4f2ec;border-radius:6px;padding:0 1rem;min-height:44px;gap:.5em;font-weight:600;font-feature-settings:"palt"}
  .mic-btn-arrow .mic-ico{margin-left:auto}
  .mic-link-bad,.mic-link-good{display:block;color:#16150f;font-size:.95rem;line-height:1.7;max-width:34ch;text-align:left}
  .mic-link-bad a,.mic-link-good a{color:var(--accent);text-decoration:underline;text-underline-offset:2px}
  .mic-msg{display:block;width:100%;max-width:34ch;text-align:left}
  .mic-msg-title{font-weight:700;font-size:.95rem;margin:0 0 .35rem}
  .mic-msg-body{font-size:.85rem;line-height:1.6;margin:0}
  .mic-field{width:100%;max-width:34ch;text-align:left}
  .mic-input{width:100%;height:38px;border-radius:6px;padding:0 .65rem;font-size:.9rem;background:#f4f2ec;color:#16150f;border:2px solid #b3261e;box-shadow:0 0 0 2px rgba(179,38,30,.18);box-sizing:border-box}
  .mic-input-ok{border:2px solid var(--line);box-shadow:none}
  .mic-err{display:flex;gap:.375rem;align-items:flex-start;color:#b3261e;font-weight:600;font-size:.8125rem;line-height:1.4;margin-top:.35rem}
  .mic-err-help{display:block;color:#5c5a50;font-weight:600;font-size:.8125rem;line-height:1.4;margin-top:.35rem}
  .mic-err svg{flex:0 0 16px;margin-top:1px}
  .mic-empty{display:flex;flex-direction:column;align-items:center;gap:.6rem;max-width:32ch;margin:0 auto;padding:.5rem;text-align:center;color:#5c5a50}
  .mic-empty-icon{width:44px;height:44px;border:2px dashed #8d8b80;border-radius:10px}
  .mic-empty-title{font-size:1.05rem;font-weight:700;color:#16150f;margin:0}
  .mic-empty-body{font-size:.85rem;line-height:1.5;margin:0}
  .mic-empty-cta{margin-top:.25rem;display:inline-flex;align-items:center;min-height:38px;padding:0 1rem;border-radius:6px;background:var(--accent);color:#f4f2ec;font-weight:600;font-size:.85rem}
  .mic-empty-bad{font-size:1.4rem;font-weight:700;color:#8d8b80}
  .mic-cta-bad,.mic-cta-good{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:0 1.5rem;border-radius:8px;font-weight:700;font-size:1rem;font-feature-settings:"palt"}
  .mic-cta-bad{background:#3a3833;color:#f4f2ec}
  .mic-cta-good{background:var(--accent);color:#f4f2ec}
</style>

## 結論

「文言がダサい」の正体は、装飾でもフォントでもなく抽象語だ。プロは Submit / OK / Click here / 失敗しました といった機能語を捨て、Carbon の `{動詞}+{目的語}` 公式で「押すと何が起きるか」を名指しする。さらに Voice（製品の人格）は固定したまま Tone だけ文脈で動かし、エラーでは絶対にユーザーを責めず「何が起きた＋なぜ＋次の一手」を肯定形で渡す——この3点に収束する。

## 01 — 動詞+目的語で「結果」を名指しする

ボタンの役目は装飾ではなく「押すと何が起きるか」を伝えることだ（NN/g）。`Submit` は「何を Submit？」と読み手に確認させる空っぽの機能語で、Carbon の `{verb}+{noun}` 公式に従って `Publish review` `Send invoice` のように目的語まで言い切る。Parallel の実測では `Submit`→`Send invoice` で +18% CTR。例外は `Done` `Close` `Cancel` `Add` `Delete` など慣用1語のみ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="mic-btn mic-btn-bad">SUBMIT</button></div><div class="label">✗ 何をSubmit？ 全大文字の機能語 → 意味が空っぽで冷たい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="mic-btn mic-btn-good">請求書を送信</button></div><div class="label">✓ 動詞+目的語で結果を宣言 → 押した先が見える</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/components/button/usage/" target="_blank" rel="noopener">Button – Carbon Design System</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/3-is-of-microcopy/" target="_blank" rel="noopener">The 3 I's of Microcopy — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.parallelhq.com/blog/ux-writing-best-practices" target="_blank" rel="noopener">10 UX Writing Best Practices — Parallel</a></p>

## 02 — 「こちら」を消し、リンクで結果を語る

`Click here` `こちら` `Click to read` は、ユーザーが既に知っている「押し方」を説明しているだけで、肝心のリンク先・結果を一切語らない。だからスキャンしても何のリンクか分からず、古臭く見える（UX Movement / UXgem）。リンクテキストには遷移先の中身そのものを入れ、`Connect your account` のように具体化する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="mic-link-bad">詳しい料金については<a href="#">こちら</a>をご覧ください。</span></div><div class="label">✗ 「こちら」だけが青い → 押し方の説明で中身ゼロ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="mic-link-good"><a href="#">料金プランと価格を見る</a></span></div><div class="label">✓ 行き先そのものがリンク → スキャンで意味が立つ</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/" target="_blank" rel="noopener">5 Rules for Choosing the Right Words on Button Labels — UX Movement</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxgem.com/articles/button-text-copywriting-tips" target="_blank" rel="noopener">Button text copywriting tips — UXgem</a></p>

## 03 — エラーは責めない。「何が起きた+なぜ+次の一手」

NN/g は `invalid` `illegal` `incorrect`、そして「あなたは〜を間違えました」を明示的に禁止する。正しい使い方の責任はシステム側にあるからだ。`You failed to enter a valid credit card number!!` は加害的で、`!!` のシャウトと全大文字が安っぽさを倍増させる。UX Content Collective の3部構成——「何が起きた＋なぜ＋次の一手」——で、否定を肯定の指示に言い換える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mic-field"><input class="mic-input" value="4111-1111" readonly aria-label="card bad"><span class="mic-err"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="7" fill="#b3261e"/><rect x="7" y="4" width="2" height="5" fill="#fff"/><rect x="7" y="10" width="2" height="2" fill="#fff"/></svg>INVALID INPUT!! あなたの入力は間違っています</span></div></div><div class="label">✗ invalid＋!!＋「あなたが間違い」→ 責めるトーン</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mic-field"><input class="mic-input mic-input-ok" value="4111 1111 1111 1111" readonly aria-label="card ok"><span class="mic-err-help">カード番号は16桁で入力してください。ハイフンは不要です。</span></div></div><div class="label">✓ 何が必要か＋なぜを肯定形で → 次の一手が分かる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/error-message-guidelines/" target="_blank" rel="noopener">Error-Message Guidelines — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxcontent.com/how-to-write-error-messages/" target="_blank" rel="noopener">How to write error messages — UX Content Collective</a></p>

## 04 — 空状態は「空っぽ」ではなく「誘い」に反転する

空のリスト画面で `データがありません` とだけ出すのは、行き止まりを通知しているだけだ。空状態は次の一手への入口であり、1〜2文・能動態・明確な単一CTA（`Add New Item`）で前に進ませる（Atlassian / UI Content）。装飾絵文字は最大1個、頻出する状態ほど簡潔・控えめに。ジョークやお茶目語は日本語UIで特に陳腐に見えるので避ける。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mic-empty"><span class="mic-empty-bad">😢</span><p class="mic-empty-body">データがありません。</p></div></div><div class="label">✗ 空っぽの通知＋泣き顔 → 行き止まりで手詰まり</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="mic-empty"><span class="mic-empty-icon" aria-hidden="true"></span><p class="mic-empty-title">まだタスクはありません</p><p class="mic-empty-body">最初のタスクを追加すると、ここに一覧が並びます</p><span class="mic-empty-cta">タスクを追加</span></div></div><div class="label">✓ 状況＋次の一手CTAを1つ → 空白が入口になる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/content/writing-guidelines/empty-state/" target="_blank" rel="noopener">Writing guidelines — Empty state — Atlassian Design System</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uicontent.co/best-practices-for-writing-empty-state-messages/" target="_blank" rel="noopener">Best Practices for Writing Empty State Messages — UI Content</a></p>

## 05 — 主要CTAは一人称+ベネフィットで具体化する

コンバージョン主導のCTAでは、`Start your free trial` を `Start my free trial`（your→my）に変えるだけで Aagaard のテストでクリック +90%。語り手をユーザー本人の声に寄せ、得られる価値を名指しする。`start / get / save / claim / book` の強い動詞で始めるのが定石。ただし削除確認のような機能ボタンには持ち込まないこと（後述の限界も参照）。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="mic-cta-bad">無料登録する</span></div><div class="label">✗ 一般的な機能語 → 自分ごとにならない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="mic-cta-good">無料ガイドを受け取る</span></div><div class="label">✓ 一人称視点＋得られる価値 → 押す理由が立つ</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://unbounce.com/conversion-rate-optimization/design-call-to-action-buttons/" target="_blank" rel="noopener">How to Design Call to Action Buttons that Convert — Unbounce</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.zoho.com/pagesense/20-highly-converting-a-b-test-ideas-that-no-marketer-should-miss.html" target="_blank" rel="noopener">20 Highly Converting A/B Test Ideas — Zoho</a></p>

## 06 — センテンスケース・1行表示・動詞は実挙動に合わせる

仕上げの3点。①全大文字は怒鳴り、Title Case は形式ばって冷たい——センテンスケース（日本語では約物詰め `palt` と敬体の統一）を守る。②文言は折り返さず1行で全表示、処理開始ボタンの `...` は削る（Material）。③`delete` は永久消去、`remove` はグループからの切り離し。プレイリストから曲を外すなら `Remove`——含意と実挙動を一致させ誤操作を防ぐ（UX Movement）。Carbon は幅広ボタンでもラベルを左揃えにする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><button class="mic-btn mic-btn-bad">DELETE FROM PLAYLIST...</button></div><div class="label">✗ 全大文字＋不要な…＋永久削除を連想させるdelete</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><span class="mic-btn-arrow">プレイリストから削除<span class="mic-ico" aria-hidden="true">→</span></span></div><div class="label">✓ センテンスケース・1行・左揃え／実挙動はremove相当</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/buttons/guidelines" target="_blank" rel="noopener">Buttons – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/style/writing.html" target="_blank" rel="noopener">Writing – Style – Material Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/" target="_blank" rel="noopener">5 Rules for Choosing the Right Words on Button Labels — UX Movement</a></p>

## 実装スニペット

ボタン文言を切り詰めず1行で全表示し、ALL CAPS を封じる（Material 準拠）。`text-transform` は使わず、HTML側に `請求書を送信` とセンテンスケースで直書きするのが肝。

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  white-space: nowrap;       /* 折り返し禁止 */
  overflow: visible;         /* 切り詰め禁止 */
  text-overflow: clip;
  min-height: 44px;          /* タップターゲット下限 */
  padding: 0 1.25rem;
  font-size: 1rem;
  line-height: 1.2;
  text-transform: none;      /* ALL CAPS禁止 */
  letter-spacing: 0;
  font-feature-settings: "palt";  /* 日本語の約物詰め */
}
```

Carbon 式に、幅広ボタンでもラベルは左揃え。動詞を左、矢印アイコンを右端に寄せる。

```css
.btn--block {
  display: flex;
  width: 100%;
  justify-content: flex-start; /* 中央でなく左揃え */
  text-align: left;
  padding-inline: 1rem;
}
.btn--block .btn__icon {
  margin-left: auto;           /* アイコンは右端へ */
}
```

エラーメッセージの視覚規約（NN/g：太字・高コントラスト・赤）。色だけに頼らずアイコンを併用し、コントラスト比4.5:1以上を確保する。文言は `カード番号は16桁で入力してください。` のように肯定＋具体で。

```css
.field-error {
  display: flex;
  gap: 0.375rem;
  color: #b3261e;            /* Material error相当の赤 */
  font-weight: 600;          /* 太字で気づける */
  font-size: 0.8125rem;
  line-height: 1.4;
  margin-top: 0.25rem;
}
.input--invalid {
  border-color: #b3261e;
  box-shadow: 0 0 0 2px rgba(179, 38, 30, 0.18);
}
```

空状態ブロック（誘い＋単一CTA）。`max-width:32ch` で本文を1〜2文の読みやすい行長に制限する。

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 32ch;           /* 1-2文に収まる行長 */
  margin-inline: auto;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #5f6368;
}
.empty-state__title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #202124;
}
.empty-state__cta { margin-top: 0.5rem; } /* 次の一手は1つだけ */
```

## チェックリスト

<ul class="check">
  <li>すべての操作ボタンが「動詞+目的語」で結果を名指ししている（例外は Done/Close/Cancel/Add/Delete など慣用1語のみ）</li>
  <li>Submit / OK / Go / Yes-No / Click here / こちら / 送信する を一掃した</li>
  <li>文言は1〜3語・5語以内、折り返さず1行で全表示、処理開始ボタンの `...` を削った</li>
  <li>全大文字・Title Case・多重感嘆符（!!）を排し、センテンスケース／約物詰め・敬体の統一にした</li>
  <li>エラーから invalid / illegal / incorrect /「あなたが間違えました」を消し、「何が起きた＋なぜ＋次の一手」を肯定形で書いた</li>
  <li>エラーは赤・太字・コントラスト比4.5:1以上で、色だけでなくアイコンも併用</li>
  <li>困っている瞬間にジョーク・過剰な「ごめんなさい」・お茶目語を挟んでいない</li>
  <li>delete（永久消去）と remove（切り離し）を実挙動どおりに使い分けた</li>
  <li>空状態は「空っぽ」を次の一手への誘いに反転させ、CTAは1つ・絵文字は最大1個</li>
  <li>Voice は製品全体で一貫させ、Tone だけ文脈で変えている</li>
  <li>一人称CTA（my）など売上数値の主張は、機能ボタンに持ち込まず自前A/Bで検証する</li>
</ul>

## 限界 / 出典

<div class="note"><b>数値は鵜呑みにしない：</b>本文の +90% / +200% / +18% / +20% は単発のA/Bテストや業界ブログ経由の引用で、母集団・期間・統計的有意性が不明なものが多い。特に +200%（Zoho）と +90%（Unbounce/Aagaard）は再現性が文脈依存で、自社オーディエンスでの検証なしに一般化しないこと。一人称CTA（my）の優位も後続テストでは10〜40%とブレ、状況によっては逆効果もありうる。</div>

<div class="note"><b>日本語への読み替え：</b>センテンスケースは英語前提のルールで、日本語UIには大文字小文字の概念がない。`約物詰め（palt）`・`敬体/常体の統一`・過剰な「ください」「!」の抑制に読み替える。絵文字やお茶目語は日本語UIで特に安っぽく見えやすいので慎重に。</div>

<div class="note"><b>裏付けの強さ：</b>動詞+目的語・センテンスケース・責めないエラー・Voice/Tone といった原則の大半は NN/g・Material・Carbon・Atlassian の一次権威で多重裏付けがあり信頼度は高い。一方 UX Movement / UX Content Collective / UXgem / Parallel はブログ実務知で査読なし。色値（#b3261e 等）とコントラストは実装例なので、必ず WCAG 4.5:1 とブランドガイドラインに合わせて再調整すること。Material/Carbon の一部ガイドはバージョン更新でURL・数値が変わりうる（本記事は2026年時点）。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/3-is-of-microcopy/" target="_blank" rel="noopener">The 3 I's of Microcopy: Inform, Influence, and Interact — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxmovement.com/buttons/5-rules-for-choosing-the-right-words-on-button-labels/" target="_blank" rel="noopener">5 Rules for Choosing the Right Words on Button Labels — UX Movement</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m3.material.io/components/buttons/guidelines" target="_blank" rel="noopener">Buttons – Material Design 3</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m1.material.io/style/writing.html" target="_blank" rel="noopener">Writing – Style – Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/components/button/usage/" target="_blank" rel="noopener">Button – Carbon Design System</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://codelabs.developers.google.com/codelabs/material-communication-guidance" target="_blank" rel="noopener">Material's Communication Principles: Intro to UX Writing — Google Codelabs</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/error-message-guidelines/" target="_blank" rel="noopener">Error-Message Guidelines — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uxcontent.com/how-to-write-error-messages/" target="_blank" rel="noopener">How to write error messages — UX Content Collective</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://atlassian.design/content/writing-guidelines/empty-state/" target="_blank" rel="noopener">Writing guidelines — Empty state — Atlassian Design System</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://uicontent.co/best-practices-for-writing-empty-state-messages/" target="_blank" rel="noopener">Best Practices for Writing Empty State Messages — UI Content</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://unbounce.com/conversion-rate-optimization/design-call-to-action-buttons/" target="_blank" rel="noopener">How to Design Call to Action Buttons that Convert — Unbounce</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.parallelhq.com/blog/ux-writing-best-practices" target="_blank" rel="noopener">10 UX Writing Best Practices for Clear & Concise UI Copy — Parallel</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxgem.com/articles/button-text-copywriting-tips" target="_blank" rel="noopener">Button text copywriting tips — UXgem</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.zoho.com/pagesense/20-highly-converting-a-b-test-ideas-that-no-marketer-should-miss.html" target="_blank" rel="noopener">20 Highly Converting A/B Test Ideas — Zoho</a></p>
