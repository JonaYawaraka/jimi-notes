---
title: "ナビが散らかる——ヘッダーとナビ設計"
problem: "項目過多・階層不明でヘッダーが散らかる。"
category: レイアウト
tags: [ナビ, ヘッダー, IA]
date: 2026-06-20
sources: 14
draft: false
---

<style>
  .nav-bar{width:100%;max-width:340px;background:#16150f;color:#f4f2ec;border-radius:8px;padding:0;font-size:11px;font-weight:600;overflow:hidden}
  .nav-row{display:flex;align-items:center;gap:0;padding:0 10px;height:42px}
  .nav-brand{font-weight:800;letter-spacing:.5px;color:#f4f2ec;margin-right:auto}
  .nav-link{color:#cfcdc4;padding:0 7px;white-space:nowrap;line-height:42px}
  .nav-link.nav-on{color:#f4f2ec}
  .nav-cramped .nav-link{padding:0 4px;font-size:9.5px}
  .nav-tag{display:inline-block;font-size:8px;font-weight:700;letter-spacing:.5px;padding:1px 5px;border-radius:99px;background:rgba(255,255,255,.12);color:#f4f2ec;margin-left:6px}

  /* chunking demo */
  .nav-flat,.nav-chunk{width:100%;max-width:340px;background:#fff;color:#16150f;border:1px solid var(--line);border-radius:8px;padding:12px;font-size:11px}
  .nav-flat ul{list-style:none;margin:0;padding:0;columns:2;gap:8px}
  .nav-flat li{padding:2px 0;color:#16150f}
  .nav-grp{margin-bottom:9px}
  .nav-grp:last-child{margin-bottom:0}
  .nav-grp b{display:block;font-size:9px;font-weight:800;letter-spacing:.6px;color:#8d8b80;margin-bottom:3px}
  .nav-grp span{display:inline-block;background:var(--paper-2);color:#16150f;border-radius:4px;padding:2px 7px;margin:0 4px 4px 0;font-size:10px}

  /* dropdown depth demo */
  .nav-stack{position:relative;font-size:10px}
  .nav-pop{background:#fff;color:#16150f;border:1px solid var(--line);border-radius:6px;padding:6px 8px;box-shadow:0 6px 14px rgba(20,18,12,.14)}
  .nav-pop2{margin-left:14px;margin-top:4px}
  .nav-pop3{margin-left:28px;margin-top:4px;border-color:var(--accent)}
  .nav-pop4{margin-left:42px;margin-top:4px;border-color:var(--accent);opacity:.6}
  .nav-pop .nav-it{padding:2px 0;color:#16150f}

  /* mega menu demo */
  .nav-mega{width:100%;max-width:360px;background:#fff;color:#16150f;border:1px solid var(--line);border-radius:8px;padding:14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px 14px;font-feature-settings:"palt"}
  .nav-mega .nav-mh{font-size:8.5px;font-weight:800;letter-spacing:.5px;color:#8d8b80;margin-bottom:4px}
  .nav-mega .nav-ml{font-size:10px;color:#16150f;padding:1px 0}
  .nav-mega .nav-mfirst{outline:2px solid var(--accent);outline-offset:4px;border-radius:2px}
  .nav-soup{width:100%;max-width:360px;background:#fff;color:#16150f;border:1px solid var(--line);border-radius:8px;padding:14px;font-size:10px;line-height:1.9}
  .nav-soup span{color:#16150f;margin-right:9px;white-space:nowrap}

  /* hover delay demo */
  .nav-hov{position:relative;width:100%;max-width:320px}
  .nav-hov .nav-trigger{background:#16150f;color:#f4f2ec;border-radius:6px;height:38px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;cursor:pointer}
  .nav-dd{position:absolute;top:44px;left:0;right:0;background:#fff;color:#16150f;border:1px solid var(--line);border-radius:6px;padding:8px 10px;font-size:10px;box-shadow:0 8px 18px rgba(20,18,12,.16)}
  .nav-dd .nav-it{color:#16150f;padding:2px 0}
  .nav-fire .nav-dd{opacity:0;visibility:hidden;transition:opacity .08s,visibility 0s linear 0s}
  .nav-fire:hover .nav-dd{opacity:1;visibility:visible;transition-delay:0s}
  .nav-intent .nav-dd{opacity:0;visibility:hidden;transition:opacity .1s ease,visibility 0s linear .5s}
  .nav-intent:hover .nav-dd{opacity:1;visibility:visible;transition-delay:.5s,.5s}

  /* sticky header demo */
  .nav-scroll{width:100%;max-width:340px;height:150px;overflow-y:scroll;border:1px solid var(--line);border-radius:8px;background:var(--paper-2);position:relative}
  .nav-sticky{position:sticky;top:0;background:#16150f;color:#f4f2ec;display:flex;align-items:center;padding:0 12px;font-size:11px;font-weight:700;z-index:2}
  .nav-thick{height:72px;box-shadow:0 6px 14px rgba(0,0,0,.4)}
  .nav-thin{height:44px;box-shadow:0 2px 8px rgba(0,0,0,.12)}
  .nav-body{padding:10px 12px;font-size:10px;color:#5c5a50;line-height:1.8}
  .nav-body p{margin:0 0 8px}

  /* mobile hybrid demo */
  .nav-phone{width:160px;background:#fff;border:1px solid var(--line);border-radius:10px;overflow:hidden;font-size:10px}
  .nav-ptop{background:#16150f;color:#f4f2ec;display:flex;align-items:center;height:34px;padding:0 10px;gap:0}
  .nav-ptop .nav-brand2{font-weight:800;color:#f4f2ec;margin-right:auto;font-size:10px}
  .nav-burger{color:#f4f2ec;font-size:13px}
  .nav-pvis{display:flex;gap:8px;padding:6px 10px;background:var(--paper-2);font-size:9px}
  .nav-pvis span{color:#16150f;font-weight:700}
  .nav-pbody{height:54px;background:#fff}
  .nav-allhidden .nav-pvis{display:none}
</style>

## 結論

ナビの散らかりは「項目を7個に削る」では直らない。プロは関連リンクを**使用頻度順の意味あるカテゴリにチャンク化**し、2層を超えたら素のドロップダウンを捨ててメガメニュー（左上に最重要・各選択肢は1回だけ）かルーティングページへ逃がす。仕上げにstickyヘッダーを約50pxへ縮め、剥がれた時だけ薄い影を出し、ホバーは0.5秒静止判定で誤発火を止める——これが「整っている」の正体だ。

## 01 — 項目数の上限ではなくチャンク化で整理する

「ナビは7項目まで」はMillerの7±2の誤用だ。メニューは選択肢が**画面に見え続ける「認識(recognition)」タスク**であって、暗記する「記憶(recall)」タスクではない。だから作業記憶の上限（Cowan 2001で約4）は当てはまらない。正解は項目を削ることではなく、12リンクを4カテゴリに束ねるような**チャンク化**だ。トップは5〜7リンクが現実的な観測値だが、整理さえできていれば横7＋縦17カテゴリの複雑サイトも成立する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-flat"><ul><li>会社概要</li><li>採用</li><li>料金</li><li>事例</li><li>ブログ</li><li>API</li><li>サポート</li><li>導入支援</li><li>セミナー</li><li>資料DL</li><li>お問合せ</li><li>ログイン</li></ul></div></div><div class="label">✗ 12項目を一列に並べただけ → どれを見ればいいか分からない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-chunk"><div class="nav-grp"><b>製品</b><span>料金</span><span>API</span><span>事例</span></div><div class="nav-grp"><b>導入</b><span>導入支援</span><span>資料DL</span><span>セミナー</span></div><div class="nav-grp"><b>会社</b><span>会社概要</span><span>採用</span><span>ブログ</span></div></div></div><div class="label">✓ 12リンクを4カテゴリへチャンク化 → 探す前に当たりがつく</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7-plus-minus-2-rule/" target="_blank" rel="noopener">Your menu doesn't need Miller's 7±2 rule — Stéphanie Walter</a><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/millers-law-ux-design/" target="_blank" rel="noopener">How can Miller's law make UX better? — LogRocket</a></p>

## 02 — カテゴリ数は固定せず、使用頻度で並べる

カテゴリをいくつ作るかは「7」のような固定数ではなく、**discoverability（見つけやすさ）**で決める。グループ化も並び順も基準は**使用頻度**——最も多くの人が探すものを最短で出せる順に置く。五十音順／アルファベット順が効くのは20項目を超えるリストだけで、10未満では効果が薄いので頻度順のまま。メガメニューでは最重要グループを**左上**に置き、ラベルは情報量の多い語を先頭にする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-chunk"><div class="nav-grp"><b>あ行（五十音順に整列）</b><span>会社概要</span><span>お問合せ</span></div><div class="nav-grp"><b>か〜さ行</b><span>採用</span><span>資料DL</span><span>事例</span></div><div class="nav-grp"><b>た〜は行</b><span>導入支援</span><span>料金</span></div></div></div><div class="label">✗ 10未満を五十音順 → よく押す「料金」が最後に埋もれる</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-chunk"><div class="nav-grp"><b>よく見られる順</b><span>料金</span><span>事例</span><span>資料DL</span></div><div class="nav-grp"><b>次に多い</b><span>導入支援</span><span>採用</span></div><div class="nav-grp"><b>その他</b><span>会社概要</span><span>お問合せ</span></div></div></div><div class="label">✓ 使用頻度順 → 「料金」が左上の最短位置に来る</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/ia-questions-navigation-menus/" target="_blank" rel="noopener">Top 3 IA Questions about Navigation Menus — NN/g</a></p>

## 03 — 2層を超えたらドロップダウンを捨てる

素のドロップダウンが有効なのは**1層まで**。2層で使いにくくなり、2層を超えると NN/g いわく **highly inadvisable（強く非推奨）**だ。深い入れ子はカーソルが端で外れて消え、操作が当てづらく、安っぽく壊れて見える。多階層は2〜3層を適切に扱える**メガメニュー**かルーティングページへ逃がす。ポイントは volume（量）そのものではなく、未整理の volume が致命的だということ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-stack"><div class="nav-pop"><div class="nav-it">製品</div></div><div class="nav-pop nav-pop2"><div class="nav-it">クラウド版</div></div><div class="nav-pop nav-pop3"><div class="nav-it">プラン</div></div><div class="nav-pop nav-pop4"><div class="nav-it">年額 ▸</div></div></div></div><div class="label">✗ 素のドロップダウンを4層ネスト → 端で消える・当てられない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-mega"><div><div class="nav-mh">製品</div><div class="nav-ml">クラウド版</div><div class="nav-ml">オンプレ版</div></div><div><div class="nav-mh">プラン</div><div class="nav-ml">月額</div><div class="nav-ml">年額</div></div><div><div class="nav-mh">サポート</div><div class="nav-ml">FAQ</div><div class="nav-ml">問合せ</div></div></div></div><div class="label">✓ メガメニューで2次元に並べる → 全部見えて1クリックで届く</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/menu-design/" target="_blank" rel="noopener">Menu-Design Checklist: 17 UX Guidelines — NN/g</a><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mega-menus-work-well/" target="_blank" rel="noopener">Mega Menus Work Well for Site Navigation — NN/g</a></p>

## 04 — メガメニューは「グループ化＋左上に最重要」で整える

volume は問題ない。**未整理の volume が致命的**だ。見出しもカラムもないリンクの羅列は、二次元パネルの「見て選ぶ」利点を殺し、ただ散らかって見える。プロは関連セットにグループ化し、**中粒度・各選択肢は1回だけ**表示する。最重要グループは `order:-1` で左上へ。`max-width` で画面全体を覆わないようにし、日本語LPなら `font-feature-settings:"palt"` をルートに付けて約物を詰める。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-soup"><span>料金</span><span>事例</span><span>API</span><span>採用</span><span>FAQ</span><span>資料DL</span><span>会社概要</span><span>セミナー</span><span>ブログ</span><span>導入支援</span><span>ログイン</span><span>規約</span></div></div><div class="label">✗ 見出しなしで大量リンクを流し込む → 二次元の利点が死ぬ</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-mega"><div class="nav-mfirst"><div class="nav-mh">製品（最重要）</div><div class="nav-ml">料金</div><div class="nav-ml">事例</div><div class="nav-ml">API</div></div><div><div class="nav-mh">導入</div><div class="nav-ml">資料DL</div><div class="nav-ml">セミナー</div></div><div><div class="nav-mh">会社</div><div class="nav-ml">採用</div><div class="nav-ml">ブログ</div></div></div></div><div class="label">✓ 見出しでグループ化＋最重要を左上 → 視線が迷わない</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mega-menus-work-well/" target="_blank" rel="noopener">Mega Menus Work Well for Site Navigation — NN/g</a><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2013/12/efficiently-simplifying-navigation-information-architecture/" target="_blank" rel="noopener">Efficiently Simplifying Navigation, Part 1: IA — Smashing</a></p>

## 05 — ホバーメニューは0.5秒ディレイで誤発火を防ぐ

ディレイ0で即展開すると、マウスが**横切っただけ**でメニューが暴発し、画面がチカチカして雑な印象になる。NN/g の処方は明確だ——ポインタが**0.5秒静止**してから表示（表示自体はその後0.1秒以内）、ナビ項目とドロップダウンの両方からポインタが離れて**0.5秒後**に非表示。CSS だけなら `transition-delay` と `visibility` の遅延解除で hover-intent を再現できる。下のデモは実際にホバーで挙動が変わる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-hov nav-fire"><div class="nav-trigger">製品 ▾（ホバーで即開く）</div><div class="nav-dd"><div class="nav-it">料金</div><div class="nav-it">事例</div></div></div></div><div class="label">✗ ディレイ0 → カーソルが触れた瞬間に暴発する</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-hov nav-intent"><div class="nav-trigger">製品 ▾（0.5秒乗せると開く）</div><div class="nav-dd"><div class="nav-it">料金</div><div class="nav-it">事例</div></div></div></div><div class="label">✓ 0.5秒静止で表示・離脱0.5秒後に隠す → 通過では開かない</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mega-menus-work-well/" target="_blank" rel="noopener">Mega Menus Work Well for Site Navigation — NN/g</a></p>

## 06 — stickyヘッダーは約50pxに縮め、剥がれた時だけ影を出す

スクロール最上部から濃い影が出て分厚いヘッダーが居座ると、剥がれ感が出ず本文を圧迫する。プロの基準は**約50px**。影は常時ではなく、IntersectionObserver の番兵（sentinel）がヘッダーの剥がれ（stuck）を検知した時だけ薄く出す。下スクロールで隠し上スクロールで再表示する場合は 300〜400ms のスライドインで、項目は最大5。Chrome 133+ なら `container-type:scroll-state` で JS なしも可能だが、本番は IntersectionObserver フォールバック必須だ。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-scroll"><div class="nav-sticky nav-thick">分厚いヘッダー 72px</div><div class="nav-body"><p>スクロールしてください。</p><p>最上部から濃い影が出て、ヘッダーが本文を圧迫する。</p><p>剥がれ感がなく重い印象。</p><p>本文の縦スペースを食う。</p></div></div></div><div class="label">✗ 72px＋常時の濃い影 → 重く本文を圧迫する</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-scroll"><div class="nav-sticky nav-thin">スリムヘッダー 44px</div><div class="nav-body"><p>スクロールしてください。</p><p>約50pxに抑え、剥がれた時だけ薄い影を出す。</p><p>本文が広く使える。</p><p>洗練された追従感。</p></div></div></div><div class="label">✓ 約50px＋剥がれた時だけ薄い影 → 軽く本文が広い</div></div>
</div>

<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/" target="_blank" rel="noopener">Designing Sticky Menus — Smashing Magazine</a><span class="badge b-blog">blog</span><a href="https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/" target="_blank" rel="noopener">Sticky Header Shadow on Scroll — Ryan Mulligan</a></p>

## 07 — モバイルは重要3〜5項目を見せ、残りを隠す

ハンバーガーは発見性が低い。主要導線（CVボタンや「料金」）まで全部隠すと、見えない＝押されない機会損失になる。高パフォーマンスなのは**重要な3〜5項目を可視のまま見せ、副次リンクだけハンバーガーに隠すハイブリッド方式**だ。ブレークポイントは 1080px 単点で切り替える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-phone nav-allhidden"><div class="nav-ptop"><span class="nav-brand2">LOGO</span><span class="nav-burger">≡</span></div><div class="nav-pvis"><span>料金</span><span>事例</span><span>無料登録</span></div><div class="nav-pbody"></div></div></div><div class="label">✗ 主要導線まで全部ハンバーガーへ → CV導線が見えない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="nav-phone"><div class="nav-ptop"><span class="nav-brand2">LOGO</span><span class="nav-burger">≡</span></div><div class="nav-pvis"><span>料金</span><span>事例</span><span>無料登録</span></div><div class="nav-pbody"></div></div></div><div class="label">✓ 重要3項目は可視＋残りは≡ → CV導線が常に見える</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mobile-subnavigation/" target="_blank" rel="noopener">Mobile Subnavigation — NN/g</a></p>

## 実装スニペット

stuck 状態を JS なしで検知して縮小・影付けする（Chrome 133+、要フォールバック）。

```css
/* stuck状態をJSなしで検知 (Chrome 133+) */
.site-header {
  position: sticky;
  top: 0;
  height: 120px;
  container-type: scroll-state;
  transition: height .3s ease, box-shadow .3s ease;
}
@container scroll-state(stuck: top) {
  .site-header {
    height: 70px; /* 縮小 */
    box-shadow: 0 2px 8px rgba(0,0,0,.12); /* 剥がれた時だけ影 */
  }
}
.site-header__inner {
  display: flex;
  align-items: center;
  height: 100%;
}
```

全ブラウザ対応の堅実版。番兵が画面外に出た＝剥がれた、で影をトグルする（高さ50px＝NN/g推奨）。

```css
.header-sentinel { position: absolute; top: 0; height: 1px; width: 1px; }
.site-header {
  position: sticky; top: 0; height: 50px;
  transition: box-shadow .3s ease;
}
.site-header.is-stuck {
  box-shadow: 0 2px 8px rgba(0,0,0,.12);
}
/* JS: 番兵を監視して is-stuck をトグル
   new IntersectionObserver(([e]) =>
     header.classList.toggle('is-stuck', !e.isIntersecting),
   { threshold: [0] }).observe(sentinel); */
```

ホバーメニューの0.5sディレイ。`transition-delay` で表示を遅らせ、`visibility` の遅延解除で離脱後0.5秒で隠す。`focus-within` でキーボードも担保。

```css
.has-dropdown { position: relative; }
.dropdown {
  position: absolute; top: 100%; left: 0;
  opacity: 0; visibility: hidden;
  transition: opacity .1s ease, visibility 0s linear .5s; /* 離脱後0.5sで隠す */
}
.has-dropdown:hover .dropdown,
.has-dropdown:focus-within .dropdown {
  opacity: 1; visibility: visible;
  transition-delay: .5s, .5s; /* 0.5s静止してから表示 */
}
```

メガメニューのグループ化グリッド。`order:-1` で最重要を左上へ、`max-width` で画面占有を防ぎ、`palt` で日本語の約物を詰める。

```css
.mega-menu {
  display: grid;
  grid-template-columns: repeat(4, minmax(140px, 1fr));
  gap: 24px 32px;
  padding: 24px;
  max-width: 960px; /* 画面全体を覆わない */
  font-feature-settings: "palt"; /* 日本語の約物詰め */
}
.mega-menu__group:first-child { order: -1; } /* 最重要を左上へ */
.mega-menu__heading {
  font-size: 13px; font-weight: 700;
  color: #888; margin-bottom: 8px;
}
.mega-menu__link { display: block; padding: 6px 0; font-size: 14px; line-height: 1.5; }
@media (max-width: 1080px) { .mega-menu { display: none; } } /* モバイルはハンバーガーへ */
```

## チェックリスト

<ul class="check">
<li>トップが8項目を超えそうなら、削る前に関連リンクをグループ化できないか先に検討した</li>
<li>カテゴリの並び順を使用頻度で決め、最重要を左上／先頭に置いた（五十音順は20+項目のみ）</li>
<li>2層を超える階層を素のドロップダウンで出していない（メガメニューかルーティングページへ逃がした）</li>
<li>メガメニューは見出しでグループ化し、各選択肢を1回だけ表示・max-widthで画面を覆わない</li>
<li>ホバー展開は0.5秒静止で表示・離脱0.5秒後に非表示し、focus-withinでキーボード対応した</li>
<li>stickyヘッダーは約50pxで、影は剥がれた(stuck)時だけ出している（常時の濃い影をやめた）</li>
<li>scroll-stateを使う場合、IntersectionObserverのフォールバックを併用した</li>
<li>モバイルは重要3〜5項目を可視に残し、副次リンクだけハンバーガーへ隠した（1080px単点）</li>
<li>サブメニューを出す／出さないを全トップ項目で統一した（一部だけの不整合をなくした）</li>
</ul>

## 限界 / 出典

<div class="note"><b>項目数ルールの矛盾：</b>「5〜8項目／Miller 7±2」を権威ルールとして語る流派と、これをメニューへの誤用として明確に棄却する流派（Stéphanie Walter・UX Myths・NN/g本体）がある。結論として「7項目キャップ」はハードルールではなくソフトな目安で、本質は<b>チャンク化と頻度順整理</b>。5〜7はあくまで観測される現実値であって規範ではない。Cowan 2001の約4も記憶チャンクの話で、可視メニューには直接適用しない。</div>

<div class="note"><b>Hick's Lawの注意：</b>決定時間は RT = a + b·log2(N+1) と<b>対数</b>で増えるため、選択肢が増えるほど追加コストは逓減する。「削れば削るほど速くなる」という単純化は誤り。選択肢を絞る根拠として引く時は対数である点に注意する。</div>

<div class="note"><b>数値とブラウザの留保：</b>stickyの約50px・300〜400ms・最大5などSmashing由来の値、NN/gのホバー0.5sは<b>推奨ガイドライン</b>で、デバイス／文脈により調整余地があり、A/Bテストでの検証が望ましい。`container-type:scroll-state` は2024〜2025の新機能でChromium系(133+)中心、SafariやFirefoxの対応を確認のうえ<b>IntersectionObserverフォールバック必須</b>。card sortingでの実ユーザー検証は理想だが工数がかかるため、小規模LPでは頻度順の仮説で代替し後検証する前提で進める。</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/ia-questions-navigation-menus/" target="_blank" rel="noopener">Top 3 IA Questions about Navigation Menus — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mega-menus-work-well/" target="_blank" rel="noopener">Mega Menus Work Well for Site Navigation — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/menu-design/" target="_blank" rel="noopener">Menu-Design Checklist: 17 UX Guidelines — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/mobile-subnavigation/" target="_blank" rel="noopener">Mobile Subnavigation — NN/g</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/drop-down-menus/" target="_blank" rel="noopener">Dropdowns: Design Guidelines — NN/g</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://stephaniewalter.design/blog/your-menu-doesnt-need-millers-7-plus-minus-2-rule/" target="_blank" rel="noopener">Your menu doesn't need Miller's 7±2 rule — Stéphanie Walter</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://uxmyths.com/post/931925744/myth-23-choices-should-always-be-limited-to-seven" target="_blank" rel="noopener">Myth #23: Choices should always be limited to 7±2 — UX Myths</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/millers-law-ux-design/" target="_blank" rel="noopener">How can Miller's law make UX better? — LogRocket</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/" target="_blank" rel="noopener">Designing Sticky Menus — Smashing Magazine</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://css-tricks.com/how-to-create-a-shrinking-header-on-scroll-without-javascript/" target="_blank" rel="noopener">Shrinking Header Without JavaScript — CSS-Tricks</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://ryanmulligan.dev/blog/sticky-header-scroll-shadow/" target="_blank" rel="noopener">Sticky Header Shadow on Scroll — Ryan Mulligan</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://www.smashingmagazine.com/2013/12/efficiently-simplifying-navigation-information-architecture/" target="_blank" rel="noopener">Efficiently Simplifying Navigation, Part 1: IA — Smashing Magazine</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.brightdigital.com/en/blog/the-menu-structure-of-your-website-best-practices" target="_blank" rel="noopener">The menu structure of your website: best practices — Bright Digital</a></p>
<p class="src"><span class="badge b-secondary">secondary</span><a href="https://lawsofux.com/hicks-law/" target="_blank" rel="noopener">Hick's Law — Laws of UX</a></p>
