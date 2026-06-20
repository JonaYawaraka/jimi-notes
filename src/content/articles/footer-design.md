---
title: "フッターが投げやり——フッターの設計"
problem: "フッターを適当にして情報が迷子になる。"
category: レイアウト
tags: [フッター, レイアウト, IA]
date: 2026-06-20
sources: 7
draft: false
---

<style>
  .foo-fdemo{width:100%;font-family:inherit}
  .foo-bad-wrap,.foo-good-wrap{width:100%;border-radius:6px;padding:14px 12px;color:#f4f2ec;font-size:11px;line-height:1.5}
  .foo-bad-wrap{background:#1a1d24}
  .foo-good-wrap{background:#1a1d24}

  /* dumping ground: flat list of links, no grouping */
  .foo-dump{display:flex;flex-wrap:wrap;gap:6px 14px;color:#8d8b80}
  .foo-dump span{color:#8d8b80;white-space:nowrap;text-decoration:underline}

  /* grouped columns */
  .foo-cols{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .foo-col h6{margin:0 0 6px;font-size:11px;font-weight:700;color:#fff;letter-spacing:.02em}
  .foo-col ul{list-style:none;margin:0;padding:0}
  .foo-col li{color:#c9ced6;padding:1px 0;font-weight:400}

  /* contrast demo */
  .foo-contrast{display:flex;flex-direction:column;gap:7px}
  .foo-contrast b{color:#fff;font-size:11px}
  .foo-lowc{color:#3a3f48}
  .foo-okc{color:#c9ced6}

  /* heading hierarchy demo */
  .foo-flat li,.foo-flat h6{color:#c9ced6;font-weight:400;font-size:11px;margin:0;padding:1px 0;list-style:none}
  .foo-flat ul{margin:0;padding:0}
  .foo-hier h6{color:#fff;font-weight:700;font-size:12px;margin:0 0 5px}
  .foo-hier ul{list-style:none;margin:0;padding:0}
  .foo-hier li{color:#c9ced6;font-weight:400;font-size:11px;padding:1px 0}

  /* separation demo */
  .foo-page{width:100%;border-radius:6px;overflow:hidden;font-size:10px;line-height:1.5}
  .foo-page .foo-body{background:#f4f2ec;color:#16150f;padding:12px}
  .foo-merge{background:#f4f2ec;color:#16150f;padding:12px;border-top:1px dashed transparent}
  .foo-split{background:#1a1d24;color:#c9ced6;padding:12px;border-top:1px solid #2c313a}
  .foo-split .foo-fhead{color:#fff;font-weight:700}

  /* legal row demo */
  .foo-legal-mixed li,.foo-legal-mixed h6{color:#c9ced6;font-weight:400;font-size:11px;margin:0;padding:1px 0;list-style:none}
  .foo-legal-mixed h6{color:#fff;font-weight:700;margin:0 0 5px}
  .foo-legal-mixed .foo-leg{color:#8d8b80;text-decoration:underline}
  .foo-legal-ok h6{color:#fff;font-weight:700;font-size:11px;margin:0 0 5px}
  .foo-legal-ok ul{list-style:none;margin:0;padding:0}
  .foo-legal-ok li{color:#c9ced6;font-size:11px;padding:1px 0}
  .foo-legrow{display:flex;flex-wrap:wrap;gap:6px 14px;margin-top:10px;padding-top:8px;border-top:1px solid #2c313a;font-size:10px;color:#8d8b80}
  .foo-legrow a{color:#8d8b80;text-decoration:underline}

  /* label clarity demo */
  .foo-label li{color:#c9ced6;font-size:11px;padding:1px 0;list-style:none}
  .foo-label ul{margin:0;padding:0}
  .foo-label h6{color:#fff;font-weight:700;font-size:11px;margin:0 0 5px}
</style>

## 結論

プロのフッターは「余ったリンクの置き場」ではなく、**意味でグルーピングした2階層のナビゲーション**として設計されている。具体的には3〜4列・各列7〜8リンク以内に絞り、太字の見出し+通常太さの子リンクで階層を作り、WCAG AAコントラスト（本文4.5:1）と読めるタイポ（理想14px/モバイル16px）、そして対照背景・1px罫線・余白で本文から視覚的に切り離す。NN/g・Baymard・USWDSの権威ソースはこの方向に一貫して収束している。

## 01 — リンクの墓場をやめ、意味でグルーピングする

フッターが「投げやり」に見える最大の原因は、見出しもグルーピングもなく全サイトマップを一列に流し込む**dumping ground（リンクの墓場）**だ。Baymardの調査では大手ECの13%がこの欠陥を抱える。「全部重要」は「何も重要でない」と同義で、ユーザーは目的のリンクを探せない。関連リンクをカテゴリ別の列にまとめ、各列に見出しを付けるだけで、フッターは一気に設計されたものに見える。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-bad-wrap foo-fdemo"><div class="foo-dump"><span>会社概要</span><span>送料</span><span>採用</span><span>返品</span><span>FAQ</span><span>プレス</span><span>注文確認</span><span>ギフト</span><span>店舗</span><span>サイズ表</span><span>ブログ</span><span>お問い合わせ</span></div></div></div><div class="label">✗ 見出しなしの羅列 → どこに何があるか走査できない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-good-wrap foo-fdemo"><div class="foo-cols"><div class="foo-col"><h6>カスタマーサービス</h6><ul><li>送料・配送</li><li>返品・交換</li><li>サイズ表</li></ul></div><div class="foo-col"><h6>マイアカウント</h6><ul><li>注文確認</li><li>ギフトカード</li><li>店舗検索</li></ul></div><div class="foo-col"><h6>会社情報</h6><ul><li>会社概要</li><li>採用情報</li><li>プレス</li></ul></div></div></div></div><div class="label">✓ 3列に意味で分割+見出し → 一目で当たりがつく</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://baymard.com/blog/footer-links-ecommerce" target="_blank" rel="noopener">Footer Links Should be Divided into Distinct Semantic Sections — Baymard Institute</a></p>

## 02 — 階層は2レベル厳守、太字見出し+通常太さリンク

NN/gはフッターの情報階層を**2レベルまで**と規定する。見出しは太字（または大きめ・別色）、子リンクは通常太さ——この単純な太さの差が「見出し／中身」の関係を作る。USWDSの Big Footer も level1=見出し / level2=リンクの同じモデルだ。逆に全部を同じ太さでフラットに並べると、見出しと子が混ざって平面に潰れ、3階層以上の入れ子は視覚的に読めなくなって設計破綻に見える。見出しは意味的にH2〜H4を使い、本文の見出し構造と競合させない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-bad-wrap foo-fdemo foo-flat"><h6>カスタマーサービス</h6><ul><li>送料・配送</li><li>返品・交換</li><li>サイズ表</li><li>お問い合わせ</li></ul></div></div><div class="label">✗ 見出しも子も同じ太さ・同じ色 → 階層が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-good-wrap foo-fdemo foo-hier"><h6>カスタマーサービス</h6><ul><li>送料・配送</li><li>返品・交換</li><li>サイズ表</li><li>お問い合わせ</li></ul></div></div><div class="label">✓ 太字白見出し+通常太さ子リンク → 2階層が明確</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/footers/" target="_blank" rel="noopener">Web Page Footers 101 — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://designsystem.digital.gov/components/footer/" target="_blank" rel="noopener">Footer — U.S. Web Design System (USWDS)</a></p>

## 03 — 曖昧なラベルを捨て、具体名にする

「Resources」「Help」のような中身を予測できないラベルは走査不能だ——NN/gが明示的に警告している。ユーザーは見出しを読んで「この下に欲しいものがあるか」を一瞬で判断する。中身が想像できないラベルはその判断を止め、結果として手抜きに見える。「Contact Us」「Customer Service」「My Account」のように、その列に何が入っているかが言葉だけで分かる具体名にする。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-bad-wrap foo-fdemo foo-label"><h6>リソース</h6><ul><li>送料・配送</li><li>返品・交換</li><li>サイズ表</li></ul></div></div><div class="label">✗「リソース」→ 中に何があるか開くまで分からない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-good-wrap foo-fdemo foo-label"><h6>カスタマーサービス</h6><ul><li>送料・配送</li><li>返品・交換</li><li>サイズ表</li></ul></div></div><div class="label">✓「カスタマーサービス」→ 中身が見出しで予測できる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/footers/" target="_blank" rel="noopener">Web Page Footers 101 — Nielsen Norman Group</a></p>

## 04 — コントラストとタイポで「読める」を担保する

暗背景に濃いグレー文字を置くと、WCAG AA（本文4.5:1）を割って可読性が死ぬ。読めないフッターは誰の役にも立たない。チャコールやネイビーの暗背景には白〜明るいグレーを合わせ、本文は最小12px・理想14px、モバイルは16px。タップターゲットは44×44px、リンクは記述的テキストにする（「こちら」禁止）。下のデモは同じ暗背景の上で、薄すぎるグレーと、コントラストを確保した明るいグレーを並べたもの。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-bad-wrap foo-fdemo foo-contrast"><b>会社情報</b><span class="foo-lowc">会社概要</span><span class="foo-lowc">採用情報</span><span class="foo-lowc">プレスリリース</span></div></div><div class="label">✗ #3a3f48 on #1a1d24 ≈ 1.6:1 → AA未達、ほぼ読めない</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-good-wrap foo-fdemo foo-contrast"><b>会社情報</b><span class="foo-okc">会社概要</span><span class="foo-okc">採用情報</span><span class="foo-okc">プレスリリース</span></div></div><div class="label">✓ #c9ced6 on #1a1d24 ≈ 4.6:1 → AA達成で読める</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/website-footer-design-practices/" target="_blank" rel="noopener">Website footer design best practices — LogRocket</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/footer-design-basics/" target="_blank" rel="noopener">Footer Design Best Practices — UXPin</a></p>

## 05 — 本文とGestalt的に分離する

背景色も罫線も余白もないと、フッターは本文の続きにしか見えず、構造が崩れて雑に映る。対照的な背景色、1pxの上罫線、上下のパディングで「ここからフッター」という境界を作る。これはGestaltの図地分離そのもので、面が変わった瞬間にユーザーは「別の領域だ」と認識する。列間ガターは20〜40pxを確保する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-page foo-fdemo"><div class="foo-body">…記事本文の最後の段落がここで終わります。</div><div class="foo-merge"><b>会社概要</b>／採用／お問い合わせ／プライバシー</div></div></div><div class="label">✗ 同じ背景で地続き → 本文との境界が消える</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-page foo-fdemo"><div class="foo-body">…記事本文の最後の段落がここで終わります。</div><div class="foo-split"><span class="foo-fhead">会社概要</span>／採用／お問い合わせ／プライバシー</div></div></div><div class="label">✓ 対照背景+1px罫線+余白 → フッターとして自立</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.smashingmagazine.com/2009/06/informative-and-usable-footers-in-web-design/" target="_blank" rel="noopener">Informative And Usable Footers — Smashing Magazine</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.interaction-design.org/literature/article/how-to-implement-sitemap-footers-to-keep-users-going" target="_blank" rel="noopener">How to Implement Sitemap Footers — Interaction Design Foundation</a></p>

## 06 — 法務情報は最下部の独立行に分ける

プライバシーポリシー・利用規約・Cookie設定・著作権をカテゴリリンクに紛れ込ませると、探したい時に見つからない。これらはナビ・連絡先と性格が違う「常に最下部にある定型情報」なので、最終行に独立してまとめ、1px罫線でナビ領域と区切るのが定石。文字は最小12pxで控えめにし、著作権表記は行末に寄せる。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-bad-wrap foo-fdemo foo-legal-mixed"><h6>会社情報</h6><ul><li>会社概要</li><li class="foo-leg">プライバシーポリシー</li><li>採用情報</li><li class="foo-leg">利用規約</li><li>プレス</li></ul></div></div><div class="label">✗ 法務リンクをナビ列に混在 → 探しにくい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="foo-good-wrap foo-fdemo foo-legal-ok"><h6>会社情報</h6><ul><li>会社概要</li><li>採用情報</li><li>プレス</li></ul><div class="foo-legrow"><a>プライバシーポリシー</a><a>利用規約</a><a>Cookie設定</a><span>© 2026 Jimi</span></div></div></div><div class="label">✓ 法務+著作権を罫線下の独立行へ分離</div></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.interaction-design.org/literature/article/how-to-implement-sitemap-footers-to-keep-users-going" target="_blank" rel="noopener">How to Implement Sitemap Footers — Interaction Design Foundation</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/website-footer-design-practices/" target="_blank" rel="noopener">Website footer design best practices — LogRocket</a></p>

## 実装スニペット

グループ化フッターの基本グリッド。4列・ガター40px・暗背景チャコール+1px上罫線で本文と分離する。本文色 `#c9ced6` は `#1a1d24` に対し約4.6:1でWCAG AAを満たす。

```css
.site-footer{
  background:#1a1d24;        /* チャコール: 本文と対照 */
  color:#c9ced6;             /* 明るいグレー本文 ≈4.6:1 on #1a1d24 */
  border-top:1px solid #2c313a;
  padding:56px 24px 32px;
  font-size:14px;            /* 理想14px */
  line-height:1.7;
  font-feature-settings:"palt"; /* 日本語の約物詰め */
}
.site-footer__cols{
  display:grid;
  grid-template-columns:repeat(4,minmax(0,1fr)); /* 3〜4列 */
  gap:40px;                  /* 列間ガター20〜40px */
  max-width:1200px;
  margin:0 auto;
}
```

2階層タイポ。見出しは太字、子リンクは通常太さで、タップターゲット44pxと `focus-visible` を確保する。

```css
.footer__heading{
  font-size:15px;
  font-weight:700;           /* 見出しは太字で階層化 */
  color:#fff;
  margin:0 0 16px;
  letter-spacing:.02em;
}
.footer__list{list-style:none;margin:0;padding:0;}
.footer__list a{
  display:inline-block;
  font-weight:400;           /* 子リンクは通常太さ(2階層厳守) */
  color:#c9ced6;
  text-decoration:none;
  padding:6px 0;
  min-height:44px;           /* 44×44pxタップターゲット */
  line-height:32px;
}
.footer__list a:hover,
.footer__list a:focus-visible{color:#fff;text-decoration:underline;}
.footer__list a:focus-visible{outline:2px solid #4c9aff;outline-offset:2px;}
```

法務行の分離。プライバシー/利用規約/Cookie/著作権を最下部の独立行に置き、1px罫線でナビ領域と分ける。

```css
.footer__legal{
  display:flex;
  flex-wrap:wrap;
  gap:8px 24px;
  align-items:center;
  max-width:1200px;
  margin:40px auto 0;
  padding-top:24px;
  border-top:1px solid #2c313a; /* ナビと視覚分離 */
  font-size:12px;            /* 最小12px */
  color:#8a929e;
}
.footer__legal a{color:#8a929e;text-decoration:underline;}
.footer__copyright{margin-left:auto;}
```

モバイル。1080pxの単一ブレークポイントで1カラム化し、本文16pxで可読性を確保。各グループを罫線で区切り、`details/summary`でアコーディオン化する余地も残す。

```css
@media (max-width:1080px){     /* BP=1080px 1点 */
  .site-footer{padding:40px 20px 24px;font-size:16px;} /* モバイル16px */
  .site-footer__cols{
    grid-template-columns:1fr;  /* 単一カラムに積み上げ */
    gap:0;
  }
  .footer__group{border-bottom:1px solid #2c313a;padding:16px 0;}
  .footer__heading{margin-bottom:8px;}
  .footer__legal{flex-direction:column;align-items:flex-start;}
  .footer__copyright{margin-left:0;}
}
```

## チェックリスト

<ul class="check">
  <li>リンクを意味でグルーピングし、各列に具体名の見出しを付けたか（墓場化していないか）</li>
  <li>列数は3〜4（上限5〜6）、各列7〜8リンク以内に収まっているか</li>
  <li>階層は2レベルまでか。太字見出し+通常太さ子リンクで差を付けたか</li>
  <li>「Resources」「Help」のような曖昧ラベルを具体名に置き換えたか</li>
  <li>本文4.5:1・大きい文字3:1をコントラストチェッカーで実測したか</li>
  <li>本文は最小12px・理想14px、モバイル16px。タップターゲットは44×44pxか</li>
  <li>対照背景・1px罫線・上下パディングで本文から視覚分離しているか（ガター20〜40px）</li>
  <li>プライバシー/利用規約/Cookie/著作権を最下部の独立行にまとめたか</li>
  <li>リンクはキーボード操作可能で `focus-visible` が見えるか。記述的テキストか（「こちら」禁止）</li>
  <li>総リンクが40〜50超なら、アコーディオンか専用サイトマップページへ分離したか</li>
</ul>

## 限界 / 出典

3〜4列という数値はUXPin/LogRocket等のブログ実務コンセンサスで、絶対基準ではなくコンテンツ量で調整可（USWDSは5〜6列まで許容）。コントラスト4.5:1/3:1・タップ44pxはWCAG準拠の堅い数値だが、本記事の `#c9ced6 on #1a1d24` ≈4.6:1 などは推定値なので、コード化後にコントラストチェッカーで必ず実測すること。Baymardの13%統計と曖昧ラベル禁止はEC文脈の知見だが、コーポレート/LPにも一般化できる。Smashing Magazine記事は2009年と古く、列数・分離の原則は今も有効だが当時のビジュアル例は時代遅れである点に留意。モバイルアコーディオンは発見性を下げるため、連絡先・法務など重要リンクは折りたたまず常時露出させる。ブレークポイントは本プロジェクト方針の1080px1点を採用した。

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/footers/" target="_blank" rel="noopener">Web Page Footers 101: Design Patterns and When to Use Each — Nielsen Norman Group</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://baymard.com/blog/footer-links-ecommerce" target="_blank" rel="noopener">Footer Links Should be Divided into Distinct Semantic Sections — Baymard Institute</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://designsystem.digital.gov/components/footer/" target="_blank" rel="noopener">Footer — U.S. Web Design System (USWDS)</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.uxpin.com/studio/blog/footer-design-basics/" target="_blank" rel="noopener">Footer Design Best Practices: 6 Expert Examples & Tips for 2026 — UXPin</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://blog.logrocket.com/ux-design/website-footer-design-practices/" target="_blank" rel="noopener">Website footer design best practices — LogRocket Blog</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.smashingmagazine.com/2009/06/informative-and-usable-footers-in-web-design/" target="_blank" rel="noopener">Informative And Usable Footers In Web Design — Smashing Magazine</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://www.interaction-design.org/literature/article/how-to-implement-sitemap-footers-to-keep-users-going" target="_blank" rel="noopener">How to Implement Sitemap Footers to Keep Users Going — Interaction Design Foundation</a></p>
