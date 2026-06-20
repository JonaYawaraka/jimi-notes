---
title: "空っぽ・読込中が雑——空状態とローディング"
problem: "空状態やローディングを後回しにして、体験が安っぽくなる。"
category: 細部
tags: [空状態, ローディング, スケルトン]
date: 2026-06-20
sources: 7
draft: false
---

<style>
  .emp-card{background:#fff;border-radius:8px;padding:14px;width:170px;display:flex;flex-direction:column;gap:8px;color:#16150f}
  .emp-row{display:flex;align-items:center;gap:10px}
  .emp-av{width:40px;height:40px;border-radius:50%;flex:0 0 auto;background:#d8dade}
  .emp-ln{height:11px;border-radius:5px;background:#d8dade}
  .emp-ln.t{height:14px;width:62%}
  .emp-ln.s{width:40%}
  .emp-thumb{width:100%;aspect-ratio:16/9;border-radius:8px;background:#d8dade}
  /* shimmer */
  .emp-sk{position:relative;overflow:hidden}
  .emp-sk::after{content:"";position:absolute;inset:0;transform:translateX(-100%);background:linear-gradient(90deg,transparent,rgba(255,255,255,.7),transparent);animation:emp-shimmer 1.4s ease-in-out infinite}
  @keyframes emp-shimmer{100%{transform:translateX(100%)}}

  /* bare spinner */
  .emp-spin{width:34px;height:34px;border-radius:50%;border:4px solid #cfd1d6;border-top-color:#5c5a50;animation:emp-rot .8s linear infinite}
  @keyframes emp-rot{100%{transform:rotate(360deg)}}

  /* frame-only skeleton */
  .emp-frame{width:170px;background:#fff;border-radius:8px;color:#16150f;display:flex;flex-direction:column;overflow:hidden}
  .emp-frame .hd,.emp-frame .ft{height:22px;background:#d8dade}
  .emp-frame .bd{height:80px;background:#fff}

  /* empty-state block */
  .emp-es{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;max-width:230px;color:#16150f}
  .emp-es .t{font-size:14px;font-weight:700;line-height:1.4}
  .emp-es .b{font-size:11px;line-height:1.5;color:#5c5a50}
  .emp-cta{margin-top:2px;padding:7px 16px;border-radius:8px;font-weight:700;font-size:12px;background:var(--accent);color:#f4f2ec;border:0}
  .emp-art{width:54px;height:54px;color:#8d8b80}
  .emp-bad-msg{color:#8d8b80;font-size:13px;font-weight:600}

  /* fake tagline-as-button */
  .emp-faketag{padding:7px 16px;border-radius:8px;border:1.5px solid #c4c6cb;color:#8d8b80;font-size:12px;font-weight:700;background:transparent}

  /* dashboard widgets */
  .emp-dash{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
  .emp-w{width:78px;height:78px;border-radius:8px;background:#fff;display:flex;align-items:center;justify-content:center;color:#8d8b80;font-size:22px}
  .emp-wtxt{width:104px;min-height:78px;border-radius:8px;background:#fff;border:1px dashed #c4c6cb;display:flex;align-items:center;justify-content:center;text-align:center;padding:8px;font-size:10px;line-height:1.4;color:#5c5a50}

  /* progress */
  .emp-pwrap{width:200px;color:#16150f}
  .emp-bar{width:100%;height:6px;background:#d8dade;border-radius:999px;overflow:hidden}
  .emp-fill{height:100%;width:62%;background:var(--accent);border-radius:inherit}
  .emp-indet{height:100%;width:40%;background:var(--accent);border-radius:inherit;animation:emp-sweep 1.2s ease-in-out infinite}
  @keyframes emp-sweep{0%{margin-left:-40%}100%{margin-left:100%}}
  .emp-plabel{font-size:11px;color:#5c5a50;margin-top:8px;text-align:center}
</style>

## 結論

プロは空状態とローディングを「設計された状態」として扱い、後回しにしない。空状態は**情報を伝えるコピー＋補助ビジュアル＋ただ1つの主要CTA**の3点構成を、4つの型（初回利用／ユーザー消去後／データなし・検索0件／エラー）に合わせて書き分ける。ローディングは所要時間でゲートし、**1秒未満は何も出さない・2〜10秒は最終レイアウトを写したスケルトン・10秒超は確定的プログレスバー**を使い分ける。

## 01 — 空状態は「コピー＋ビジュアル＋1つのCTA」で組む

`No data` のような汎用プレースホルダは、なぜ空なのか・次に何をすべきかを何も伝えず、システムが壊れているように見える。空状態の最小単位は**短く具体的なコピー＋（任意の）補助ビジュアル＋ちょうど1つの主要CTA**。コピーは必須、イラストとCTAは状況次第だが、初回利用ではCTAが必須だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-card" style="align-items:center;justify-content:center;min-height:120px"><span class="emp-bad-msg">No data</span></div></div><div class="label">✗ 汎用プレースホルダ → 理由も次の一手も不明</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-es">
    <svg class="emp-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9h16M9 13h6"/></svg>
    <div class="t">プロジェクトはまだありません</div>
    <div class="b">最初のプロジェクトを作って、チームと共有しましょう。</div>
    <button class="emp-cta">プロジェクトを作成</button>
  </div></div><div class="label">✓ コピー＋装飾ビジュアル＋主要CTA1つ</div></div>
</div>

<div class="note"><b>幅：</b>コンテナは約360pxに絞り、コピーは「強い一文＋任意の補足一行」に収める。CTAは1つだけ。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pencilandpaper.io/articles/empty-states" target="_blank" rel="noopener">Empty State UX Examples & Best Practices — Pencil & Paper</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://mobbin.com/glossary/empty-state" target="_blank" rel="noopener">Empty State UI Design: Best practices — Mobbin</a></p>

## 02 — 4つの型を見分けてからコピーを書く

空状態は1種類ではない。**初回利用**（白紙＋手順＋主要CTA）、**ユーザー消去後**（タスク完了・受信箱ゼロ。祝福してよい）、**データなし／検索0件**（理由を説明し、ドキュメントやFAQへ逃がす）、**エラー**（障害。説明＋復旧アクション）。型を先に決め、それからコピーとCTAの意図を変える。下は同じ「検索0件」を、行き止まりにするか・逃げ道を用意するかの違い。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-es"><div class="t" style="color:#8d8b80">検索結果: 0件</div></div></div><div class="label">✗ 行き止まり → ユーザーが取り残される</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-es">
    <div class="t">「{keyword}」に一致なし</div>
    <div class="b">スペルを変えるか、<u>絞り込みをクリア</u>。困ったら <u>サポート</u> へ。</div>
    <button class="emp-cta" style="background:transparent;color:#16150f;border:1.5px solid var(--line)">絞り込みをクリア</button>
  </div></div><div class="label">✓ 型=no-results → 代替経路へ誘導</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/" target="_blank" rel="noopener">Designing the Overlooked Empty States — UXPin</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/patterns/empty-states-pattern/" target="_blank" rel="noopener">Empty states — Carbon Design System</a></p>

## 03 — ローディングは所要時間でゲートする

インジケータは「時間予算」で選ぶ。**1秒未満は何も出さない**（注意が散るのは約1秒の空白以降）。**2〜10秒の全画面読込はスケルトン**。**10秒超は確定的プログレスバー＋残り時間の目安**。素のスピナーが許されるのは小さな単一モジュールだけで、全画面の素スピナーはスケルトンより遅く感じられ、進捗もレイアウトも伝えない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-spin"></div></div><div class="label">✗ 全画面を素スピナー → 進捗もレイアウトも不明</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-card">
    <div class="emp-thumb emp-sk"></div>
    <div class="emp-row"><div class="emp-av emp-sk"></div><div style="flex:1"><div class="emp-ln t emp-sk"></div><div class="emp-ln s emp-sk" style="margin-top:6px"></div></div></div>
  </div></div><div class="label">✓ 2〜10秒はレイアウトを写すスケルトン</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/skeleton-screens/" target="_blank" rel="noopener">Skeleton Screens 101 — Nielsen Norman Group</a></p>

## 04 — スケルトンは最終レイアウトを写す

スケルトンの効果は「データが届いた瞬間に再レイアウト（reflow）が起きない」ことに尽きる。だから各ブロックは実コンテンツの構造（アバター48px、16:9サムネ、タイトル60%幅、本文行）に一致させる。ヘッダー／フッターだけ光って本文が空白の**枠だけスケルトン**は、データ着地時にガクッとずれて知覚パフォーマンスの利点を壊す。動きは控えめにし、`prefers-reduced-motion` を尊重する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-frame"><div class="hd emp-sk"></div><div class="bd"></div><div class="ft emp-sk"></div></div></div><div class="label">✗ 枠だけ光る → 着地で本文がずれる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-card">
    <div class="emp-row"><div class="emp-av emp-sk"></div><div style="flex:1"><div class="emp-ln t emp-sk"></div><div class="emp-ln s emp-sk" style="margin-top:6px"></div></div></div>
    <div class="emp-ln emp-sk"></div><div class="emp-ln emp-sk" style="width:80%"></div>
  </div></div><div class="label">✓ 実カードと同じ骨格 → reflowなし</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/skeleton-screens/" target="_blank" rel="noopener">Skeleton Screens 101 — Nielsen Norman Group</a></p>

## 05 — タグラインをボタン風に書かない／装飾は支援技術から隠す

イラストやタグラインはタップに反応しない非インタラクティブ要素。なのにボタンのような文言（「ここをタップ」等）を載せると、ユーザーを誤誘導する。**実行可能な指示は本物のボタンに置く**。また、空状態のイラストはたいてい装飾なので、`alt=""`／`role="presentation"` でスクリーンリーダーから隠し、ノイズを増やさない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-es">
    <svg class="emp-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
    <div class="emp-faketag">＋ 新規作成（タップ不可）</div>
  </div></div><div class="label">✗ 非操作イラスト上のボタン風コピー → 誤誘導</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-es">
    <svg class="emp-art" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>
    <div class="b">まだ項目がありません。</div>
    <button class="emp-cta">新規作成</button>
  </div></div><div class="label">✓ 指示は本物のボタンに／装飾は alt="" で隠す</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/communication/empty-states.html" target="_blank" rel="noopener">Empty states — Material Design</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/patterns/empty-states-pattern/" target="_blank" rel="noopener">Empty states — Carbon Design System</a></p>

## 06 — ダッシュボードで空が連発するなら「テキストのみ」

複数モジュールが同時に空・失敗する画面でイラスト付き空状態を繰り返すと、アイコンは効果を失い視覚的ノイズだけが増える。Carbon の指針どおり、こうした場面では**イラストを外しテキストのみ**の空状態にして、繰り返しが静かに収まるようにする。検索0件なら、インラインリンクでドキュメントやFAQへ逃がす。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-dash">
    <div class="emp-w">🗒️</div><div class="emp-w">🗒️</div><div class="emp-w">🗒️</div>
  </div></div><div class="label">✗ 同じ空イラストが連発 → ノイズ化</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-dash">
    <div class="emp-wtxt">データなし。<u>ソースを追加</u></div>
    <div class="emp-wtxt">データなし。<u>設定ガイド</u></div>
  </div></div><div class="label">✓ テキストのみ＋逃げ道リンクで静かに</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/patterns/empty-states-pattern/" target="_blank" rel="noopener">Empty states — Carbon Design System</a></p>

## 07 — 10秒超は「確定的」プログレスバーで

10秒を超える処理（大量インポート等）では、進捗が見えないと不安が募る。**確定的なバー＋数量や残り時間の見積もり**を出す。幅はデータ駆動で更新し、不確定スイープでごまかさない。下の左は嘘の不確定スイープ、右は実進捗を反映した確定バー。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-pwrap"><div class="emp-bar"><div class="emp-indet"></div></div><div class="emp-plabel">処理中…（いつ終わる？）</div></div></div><div class="label">✗ 10秒超を不確定スイープ → 進捗が読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="emp-pwrap"><div class="emp-bar"><div class="emp-fill"></div></div><div class="emp-plabel">5,000行中 3,100行 — 残り約20秒</div></div></div><div class="label">✓ 確定バー＋数量・残り時間の見積もり</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/skeleton-screens/" target="_blank" rel="noopener">Skeleton Screens 101 — Nielsen Norman Group</a></p>

## 実装スニペット

最終レイアウトを写すスケルトン（reduced-motion ガード付き）。各ブロックのサイズを実カードに合わせる。

```css
.skeleton { --sk-base:#e8eaed; --sk-shine:#f4f5f7; }
.skeleton__line,
.skeleton__avatar,
.skeleton__thumb {
  background: var(--sk-base);
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}
.skeleton__avatar { width:48px; height:48px; border-radius:50%; }
.skeleton__thumb  { aspect-ratio:16/9; width:100%; border-radius:8px; }
.skeleton__line   { height:12px; margin:8px 0; }
.skeleton__line--title { height:16px; width:60%; }
.skeleton__line--short { width:40%; }

.skeleton__line::after,
.skeleton__thumb::after {
  content:""; position:absolute; inset:0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, var(--sk-shine), transparent);
  animation: sk-shimmer 1.4s ease-in-out infinite;
}
@keyframes sk-shimmer { 100% { transform: translateX(100%); } }

@media (prefers-reduced-motion: reduce) {
  .skeleton__line::after,
  .skeleton__thumb::after { animation: none; }
  .skeleton { animation: sk-pulse 1.6s ease-in-out infinite; }
}
@keyframes sk-pulse { 50% { opacity:.6; } }
```

空状態ブロック：コピー＋装飾ビジュアル（AT非表示）＋CTA1つ。

```css
.empty-state {
  display: grid; justify-items: center; gap: 12px;
  max-width: 360px; margin: 64px auto; text-align: center;
}
.empty-state__art   { width:96px; height:96px; opacity:.9; }
.empty-state__title { font-size:18px; font-weight:600; line-height:1.4; }
.empty-state__body  { font-size:14px; line-height:1.6; color:#5f6368; }
.empty-state__cta {
  margin-top:4px; padding:10px 20px; border-radius:8px;
  font-weight:600; background:#1a73e8; color:#fff; border:0;
}
/* <img class="empty-state__art" alt="" role="presentation"> */
```

繰り返す／失敗ウィジェット用のテキストのみ空状態。

```css
.widget-empty {
  display: flex; align-items: center; justify-content: center;
  min-height: 120px; padding: 16px; text-align: center;
  font-size: 13px; line-height: 1.5; color: #6b7280;
  background: #f8f9fa; border: 1px dashed #d2d5da; border-radius: 8px;
}
.widget-empty a { color:#1a73e8; text-decoration: underline; }
/* 例: "まだ活動がありません。ソースを追加するか <a>設定ガイド</a> を参照。" */
```

10秒超向けの確定的プログレスバー（幅は JS で更新）。

```css
.progress {
  width: 100%; height: 6px; background: #e8eaed;
  border-radius: 999px; overflow: hidden;
}
.progress__fill {
  height: 100%;
  width: var(--pct, 0%); /* JSで: el.style.setProperty('--pct', p+'%') */
  background: #1a73e8; border-radius: inherit;
  transition: width .3s ease;
}
/* ラベル併記: "5,000行中 1,240行 — 残り約20秒" */
```

## チェックリスト

<ul class="check">
  <li>空状態の「型」を先に決めた（初回利用／ユーザー消去後／データなし・0件／エラー）。</li>
  <li>各空状態に、具体的なコピー＋（任意の）ビジュアル＋主要CTA**1つ**がある。`No data` 等の汎用文は排除した。</li>
  <li>初回利用には主要CTAが必ずある。コピーは「指示2：遊び心1」でClarityを優先。</li>
  <li>ローディングは時間で出し分け：1秒未満=何も出さない／2〜10秒=スケルトン／10秒超=確定バー。</li>
  <li>スケルトンは実コンテンツの骨格（アバター・サムネ比率・行幅）に一致し、reflowが起きない。</li>
  <li>`prefers-reduced-motion: reduce` でシマーを止め、穏やかな opacity パルスにフォールバックした。</li>
  <li>装飾イラストは `alt=""` ／ `role="presentation"` で支援技術から隠した。</li>
  <li>ダッシュボードで空・失敗が連発する箇所はテキストのみにした。</li>
  <li>検索0件・エラーに逃げ道（ドキュメント／FAQ／サポート）を用意した。</li>
  <li>タグライン／イラストにボタン風コピーを置かず、操作は本物のボタンに集約した。</li>
  <li>10秒超の確定バーは実データで幅を更新し、不確定スイープでごまかしていない。</li>
</ul>

## 限界 / 出典

<div class="note"><b>注意：</b>所要時間のしきい値（1秒／2〜10秒／10秒）は NNg のヒューリスティックで、絶対的な境界ではない。実測レイテンシとコンテンツ種別に合わせて調整し、小さな単一モジュールはスピナーでもよい。「指示2：遊び心1」も覚えやすい目安（Smashing, 2017）で、実測値ではない。Material（2017）や Smashing（2017）は2024年以前の出典だが、パターン自体は現役で、新しいトレンドではない。Pencil & Paper の「自然のイメージがストレスを下げる」という主張は根拠が弱く、低信頼として扱い過度に依拠しない。スニペットの色・サイズ（Material系ブルー #1a73e8 など）は無難な初期値なので、自社ブランドトークンへ差し替えること。出典はすべて英語の設計系リファレンスで、日本語LP／バナーのコピー長や palt・約物詰めは自社のタイポルールに合わせて調整する必要がある。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/skeleton-screens/" target="_blank" rel="noopener">Skeleton Screens 101 — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://carbondesignsystem.com/patterns/empty-states-pattern/" target="_blank" rel="noopener">Empty states — Carbon Design System</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://m2.material.io/design/communication/empty-states.html" target="_blank" rel="noopener">Empty states — Material Design</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.pencilandpaper.io/articles/empty-states" target="_blank" rel="noopener">Empty State UX Examples & Best Practices — Pencil & Paper</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/ux-best-practices-designing-the-overlooked-empty-states/" target="_blank" rel="noopener">Designing the Overlooked Empty States — UXPin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://mobbin.com/glossary/empty-state" target="_blank" rel="noopener">Empty State UI Design: Best practices — Mobbin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.smashingmagazine.com/2017/02/user-onboarding-empty-states-mobile-apps/" target="_blank" rel="noopener">The Role Of Empty States In User Onboarding — Smashing Magazine</a></p>
