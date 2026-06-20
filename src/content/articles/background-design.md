---
title: 背景に逃げてしまう——無地から脱却する背景デザイン
problem: 背景をつい無地・無難な単色で仕上げてしまい、世界観もセクションの個性も出ない。
category: 質感
tags: [背景, グラデーション, グレイン, 可読性, OKLCH]
date: 2026-06-20
sources: 23
draft: false
---

<style>
  /* この記事のデモ専用クラス（共通枠は global.css） */
  .val-bad{background:#6b6f7a;color:#8a8e98}
  .val-good{background:#15171f;color:#fff}
  .grad-srgb{background:linear-gradient(in srgb,#ff6a00,#0066ff)}
  .grad-oklch{background:linear-gradient(in oklch,#ff6a00,#0066ff)}
  .grain-base{background:linear-gradient(135deg,#7c5cff,#ff5aa0)}
  .grain-over::after{content:"";position:absolute;inset:0;opacity:.55;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23gn)'/%3E%3C/svg%3E")}
  .mesh{background:radial-gradient(40% 60% at 20% 20%,#7c5cff,transparent 60%),radial-gradient(50% 50% at 80% 30%,#16d6c8,transparent 60%),radial-gradient(60% 60% at 50% 90%,#ff5aa0,transparent 60%),#1a0f2e}
  .pglow{background:radial-gradient(60% 90% at 50% 120%,rgba(124,92,255,.6),transparent 60%),#0a0b10}
  .scrim-photo{background:linear-gradient(120deg,#c2410c,#fde68a 40%,#0ea5e9)}
  .scrim-yes::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(to top,rgba(0,0,0,.6),transparent 70%)}
  .rhythm{border:1px solid var(--line)}
  .rhythm > div{padding:15px 20px;font-size:15px}

  /* === §03 タイプ別スウォッチ === */
  .types{display:grid;grid-template-columns:repeat(3,1fr);margin:26px 0;border-top:1px solid var(--line);border-left:1px solid var(--line)}
  @media(max-width:760px){.types{grid-template-columns:1fr}}
  .type{border-right:1px solid var(--line);border-bottom:1px solid var(--line)}
  .type .sw{height:108px}
  .type .meta{padding:14px 16px}
  .type .nm{font-size:14px;font-weight:700;color:var(--ink)}
  .type .use{font-size:12.5px;color:var(--ink-2);margin-top:5px;line-height:1.6}
  .type .cau{font-size:11.5px;color:var(--accent);margin-top:8px}
  .sw-solid{background:linear-gradient(90deg,#16150f 0 50%,#dcd9cd 50% 100%)}
  .sw-grad{background:linear-gradient(120deg,#6a3df0,#16d6c8)}
  .sw-glow{background:radial-gradient(75% 110% at 50% 135%, #7c5cff, transparent 60%), #120f1c}
  .photo,.sw-photo{background:radial-gradient(85% 65% at 76% 16%, #efc488 0%, transparent 55%),radial-gradient(70% 90% at 14% 92%, #7c4a2a 0%, transparent 60%),linear-gradient(158deg, #4a2f1c, #1a120b)}
  .sw-glass{position:relative;background:linear-gradient(120deg,#6a3df0,#ff5aa0);overflow:hidden}
  .sw-glass::after{content:"";position:absolute;inset:22px 30px;background:rgba(255,255,255,.16);backdrop-filter:blur(7px);-webkit-backdrop-filter:blur(7px);border:1px solid rgba(255,255,255,.4);border-radius:8px}
  .sw-pattern{background-color:#e6e3da;background-image:radial-gradient(rgba(22,21,15,.22) 1.4px, transparent 1.5px);background-size:13px 13px}

  /* === §04 ヒーロー作例（mini-hero） === */
  .shots{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:26px 0}
  @media(max-width:760px){.shots{grid-template-columns:1fr}}
  .shot{border:1px solid var(--line);background:var(--paper)}
  .shot .stage{position:relative;aspect-ratio:4/3;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:18px}
  .shot .ttl{position:relative;z-index:3;font-size:clamp(16px,2.2vw,21px);font-weight:800;line-height:1.08;letter-spacing:-.01em;color:#fff}
  .shot .sub{position:relative;z-index:3;font-size:11px;margin-top:7px;color:rgba(255,255,255,.85)}
  .shot .pill{position:absolute;top:13px;left:14px;z-index:3;font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;color:#fff}
  .shot .cap{padding:12px 16px;border-top:1px solid var(--line);font-size:12.5px;color:var(--ink-2);line-height:1.55}
  .shot .cap b{color:var(--ink)}
  .f-dark .ov{position:absolute;inset:0;z-index:1;background:linear-gradient(to top, rgba(0,0,0,.82), rgba(0,0,0,.12))}
  .f-color .ov{position:absolute;inset:0;z-index:1;background:linear-gradient(150deg, rgba(222,60,36,.62), rgba(18,8,6,.78))}
  .duo{background:radial-gradient(85% 65% at 76% 16%, #f2e4bf 0%, transparent 55%),radial-gradient(70% 95% at 12% 95%, #14304f 0%, transparent 62%),linear-gradient(158deg, #275478, #0a1726)}
  .f-white{background:#fbfaf6}
  .f-white .ttl{color:#16150f;font-size:clamp(20px,2.8vw,27px);letter-spacing:-.03em}
  .f-white .sub{color:var(--ink-2)}
  .f-white .pill{color:var(--accent)}
  .f-grad{background:linear-gradient(140deg,#6a3df0,#16d6c8)}
  .f-grad .c1{position:absolute;z-index:1;width:120px;height:120px;border-radius:50%;border:2px solid rgba(255,255,255,.55);top:-32px;right:-20px}
  .f-grad .c2{position:absolute;z-index:1;width:58px;height:58px;background:rgba(255,255,255,.22);left:22px;top:24px;transform:rotate(45deg)}

  /* === §07 バナー作例 === */
  .ad{position:relative;display:grid;grid-template-columns:1.55fr 1fr;align-items:stretch;border:1px solid var(--line);overflow:hidden;margin:26px 0}
  .ad .scene{position:relative;min-height:148px;padding:22px 24px;display:flex;flex-direction:column;justify-content:center;background:radial-gradient(85% 130% at 105% -5%, rgba(124,92,255,.75), transparent 55%), #120f1c}
  .ad .scene .eb{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#c2b4ff;font-weight:700}
  .ad .scene .h{font-size:clamp(17px,2.3vw,23px);font-weight:800;color:#fff;line-height:1.18;margin-top:8px;letter-spacing:-.01em}
  .ad .right{display:flex;align-items:center;justify-content:center;padding:20px;background:var(--paper)}
  .ad .cta{background:var(--accent);color:#fff;font-weight:800;font-size:14px;padding:12px 22px;letter-spacing:.02em;white-space:nowrap}
  @media(max-width:560px){.ad{grid-template-columns:1fr}.ad .right{border-top:1px solid var(--line)}}
  .ad-bad .scene{background:#8f8a7e}
  .ad-bad .scene .eb{color:#e6e2d6}
  .ad-bad .scene .h{color:#b4afa3}
</style>

## 結論

一流が背景でやっているのは「色を塗る」ことではなく、**①明度(value)でコントラストと焦点を設計し、②セクションごとに背景を意図的に切り替えてリズムと世界観を作り、③可読性のガードレール(WCAG比率＋スクリム)を死守する**——この3点です。

「無地が無難で安全」なのではなく、**ガードレールを持っていないから無地に逃げてしまう**。逆に言えば、ガードレールさえ持てば攻めた背景でも崩れません。

## 01 — 色相ではなく「value(明度)」で考える

背景の良し悪しを決める主レバーは色相(hue)ではなく **value＝色と独立した相対的な明暗**。可読性・コントラスト・焦点はすべて明度差で生まれます。色は自由に冒険してよく、**明度差さえ確保すれば安っぽくなりません**。色弱ユーザー対応の観点でも色相依存はNGで、明度差が読みやすさを担保します。

<div class="grid g2">
  <div class="demo"><div class="canvas val-bad"><span class="txt">明度差が無い</span></div><div class="label">✗ 背景と前景のvalueが近い → 焦点が立たない</div></div>
  <div class="demo"><div class="canvas val-good"><span class="txt">明度差で焦点</span></div><div class="label">✓ 暗い地に白 → 色を問わず即座に焦点になる</div></div>
</div>

<div class="note"><b>判断基準：</b>背景に色やテクスチャを足すとき、見るのは「前景テキスト/CTAとの<b>明度差を残せているか</b>」だけ。これが「攻めても崩れない」根拠になります。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://owdt.com/article/elements-of-art-and-principles-of-design/" target="_blank" rel="noopener">owdt.com — Elements of Art & Principles of Design</a>（Skillshare / WCAG・APCA輝度ベースが裏付け）</p>

## 02 — リズムは「背景の切り替え」で作る

長尺LPで最も簡単かつ効果的なのは、**セクション間で背景を交互に切り替えること**。回遊性・現在地把握・視線誘導すべてに効きます。**全部を塗らないのがコツ**で、目安は「**5セクションに1つ**」だけを明るい色でハイライトして単調さを破る。

<div class="rhythm" style="overflow:hidden">
  <div style="background:#14140f;color:#f4f2ec">セクションA（暗）</div>
  <div style="background:#e6e3da;color:#16150f">セクションB（やや明）</div>
  <div style="background:#14140f;color:#f4f2ec">セクションC（暗）</div>
  <div style="background:linear-gradient(100deg,#7c5cff,#16d6c8);color:#0a0b10;font-weight:700">セクションD ← 5つに1つだけアクセント</div>
  <div style="background:#14140f;color:#f4f2ec">セクションE（暗）</div>
</div>

<p class="dim">→ 製品LPなら「白 → 薄グレー → ダーク+グロー(スペック訴求) → 白 → アクセント色(CTA)」のような<strong>明度のうねり</strong>を設計する。</p>

<p class="src"><span class="badge b-blog">course</span><a href="https://tilda.education/en/courses/landing-page/landing-page-design-principles/" target="_blank" rel="noopener">tilda.education — Landing Page Design Principles</a></p>

## 03 — 背景タイプの選定マップ

背景タイプは「いつ何を選ぶか」で決まります。代表的な6種を作例で。

<div class="types">
  <div class="type"><div class="sw sw-solid"></div><div class="meta"><div class="nm">ソリッド色面の交互</div><div class="use">リズム付けの基本。長尺LP全般</div><div class="cau">注意 — 5つに1つだけアクセント</div></div></div>
  <div class="type"><div class="sw sw-grad"></div><div class="meta"><div class="nm">グラデーション</div><div class="use">mood と movement を足したいとき</div><div class="cau">注意 — 2色塗りでなく質感を足す(§6)</div></div></div>
  <div class="type"><div class="sw sw-glow"></div><div class="meta"><div class="nm">ダーク+グロー</div><div class="use">テック系・製品LP・プロモ</div><div class="cau">注意 — 奥行きと高コントラスト</div></div></div>
  <div class="type"><div class="sw sw-photo"></div><div class="meta"><div class="nm">写真背景</div><div class="use">世界観・情緒。ヒーロー</div><div class="cau">注意 — 厳選必須＋スクリム</div></div></div>
  <div class="type"><div class="sw sw-glass"></div><div class="meta"><div class="nm">グラスモーフィズム/ブラー</div><div class="use">浮遊カード・モーダル・ナビに限定</div><div class="cau">注意 — 全面背景には使わない</div></div></div>
  <div class="type"><div class="sw sw-pattern"></div><div class="meta"><div class="nm">軽い幾何パターン</div><div class="use">注意を奪わずモダンさを出す</div><div class="cau">注意 — 低コントラストに留める</div></div></div>
</div>

<div class="note"><b>写真を選ぶ基準：</b>①ワイドアングルで一目で内容が分かる ②フェードさせやすい ③サイトのパレットを含む or <b>大きなネガティブスペース</b>を持つ。オーバーレイは「前景を十分見せつつ画像を消しすぎない」量に。</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://clay.global/blog/web-design-guide/website-design-background" target="_blank" rel="noopener">clay.global</a> ／ <a href="https://designshack.net/articles/trends/background-design-trends/" target="_blank" rel="noopener">designshack.net</a></p>

## 04 — ヒーロー背景のツールキット（5択）

「①ブランドカラーを決める → ②被写体/トーンを見る → ③この5択から1つ選ぶ」が現実的な導出フロー。

<div class="shots">
  <div class="shot">
    <div class="stage f-dark photo">
      <div class="ov"></div>
      <span class="pill">① Dark filter</span>
      <span class="ttl">LET'S BRING<br>YOUR VISION</span>
      <span class="sub">暗幕で白文字を最大可読に</span>
    </div>
    <div class="cap"><b>ダークフィルター</b> — ソリッド/グラデの暗いオーバーレイ。最も安全で万能</div>
  </div>
  <div class="shot">
    <div class="stage f-color photo">
      <div class="ov"></div>
      <span class="pill">② Color filter</span>
      <span class="ttl">YOUR BRAND<br>IN ONE HUE</span>
      <span class="sub">ブランド色で写真を染める</span>
    </div>
    <div class="cap"><b>カラーフィルター</b> — コーポレートカラーを被写体に重ね、認知を上げる</div>
  </div>
  <div class="shot">
    <div class="stage duo">
      <span class="pill">③ Duotone</span>
      <span class="ttl">TWO-TONE<br>MOOD</span>
      <span class="sub">2色マッピングで統一感</span>
    </div>
    <div class="cap"><b>デュオトーン</b> — 2〜3色の写真効果。バラバラ素材も一気にまとまる</div>
  </div>
  <div class="shot">
    <div class="stage f-white">
      <span class="pill">④ White × Type</span>
      <span class="ttl">大きな文字で、<br>世界観を語る。</span>
      <span class="sub">背景を引き、タイポ主導</span>
    </div>
    <div class="cap"><b>白地×タイポ主導</b> — 背景を引き、文字組だけで強さを出す</div>
  </div>
  <div class="shot">
    <div class="stage f-grad">
      <div class="c1"></div><div class="c2"></div>
      <span class="pill">⑤ Gradient + Shape</span>
      <span class="ttl">SHAPE THE<br>ATMOSPHERE</span>
      <span class="sub">グラデ＋幾何で抽象的に</span>
    </div>
    <div class="cap"><b>グラデ＋抽象図形</b> — 幾何形・波・線を重ね、動きと奥行きを出す</div>
  </div>
  <div class="shot" style="display:flex;flex-direction:column;justify-content:center;background:transparent;border-style:dashed">
    <div style="padding:24px">
      <div style="font-size:13px;font-weight:700;color:var(--accent);letter-spacing:.08em">→ 迷ったら</div>
      <p style="margin:10px 0 0;font-size:14px;color:var(--ink-2);line-height:1.7">②カラーフィルター か ⑤グラデ＋抽象が、ブランド世界観を出しつつ外しにくい。</p>
    </div>
  </div>
</div>

<p class="src"><span class="badge b-blog">course</span><a href="https://tilda.education/en/courses/landing-page/landing-page-design-principles/" target="_blank" rel="noopener">tilda.education</a></p>

## 05 — 可読性ガードレール（これがあるから攻められる）

**WCAG最低基準を物差しにする**（背景craft全般の土台、一次標準）：

<div class="grid g2">
  <div class="card"><h4>本文テキスト</h4><p style="font-size:34px;font-weight:800;color:var(--accent);letter-spacing:-.02em">4.5 : 1</p></div>
  <div class="card"><h4>大見出し（18pt / 14pt太字〜）</h4><p style="font-size:34px;font-weight:800;color:var(--accent);letter-spacing:-.02em">3 : 1</p></div>
</div>

### 複雑背景の上にテキスト → スクリム

写真/グラデ/複雑背景の上では、テキスト背後に `rgba(0,0,0,.6)→transparent` の linear-gradient(スクリム)を重ねて一貫したコントラストを確保します。

<div class="grid g2">
  <div class="demo"><div class="canvas scrim-photo"><span class="txt" style="color:#fff">スクリム無し</span></div><div class="label">✗ グラデは端で合格・反対端で不合格になりやすい</div></div>
  <div class="demo"><div class="canvas scrim-photo scrim-yes"><span class="txt" style="color:#fff">スクリム有り</span></div><div class="label">✓ 下から黒グラデを重ねて文字を底上げ</div></div>
</div>

<div class="note"><b>worst-caseで検証：</b>グラデ/写真背景は「最悪条件のピクセル」でコントラストを測る。<span class="dim">(※「scrimが最も堅牢」は一部ソースのみの順位付け＝2-1判定。並列手法の一つとして扱う)</span></div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.nngroup.com/articles/text-over-images/" target="_blank" rel="noopener">NN/g — Text Over Images</a> ／ <a href="https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part2/" target="_blank" rel="noopener">Smashing Magazine</a> ／ W3C WCAG 1.4.3</p>

## 06 — トレンドと使いどころ（2024–2026）

**いまのグラデは「色」ではなく「質感」で差がつく。** グラデの価値は色そのものより **mood と movement** を足す点にある。

<div class="grid g2">
  <div class="demo"><div class="canvas grain-base grain-over"><span class="txt" style="color:#fff">Grain</span></div><div class="label">グレイン/ノイズ注入 → のっぺり感を消し未来的に</div></div>
  <div class="demo"><div class="canvas mesh"><span class="txt" style="color:#fff">Mesh</span></div><div class="label">メッシュ(多放射グロー) → アーティスティックな地</div></div>
  <div class="demo"><div class="canvas pglow"><span class="txt" style="color:#fff">Dark + Glow</span></div><div class="label">テック製品LPの定番。奥行きと高コントラスト</div></div>
  <div class="demo"><div class="canvas" style="background:linear-gradient(in oklch,#7c5cff,#16d6c8)"><span class="txt" style="color:#0a0b10">OKLCHグラデ</span></div><div class="label">中点が濁らない滑らかな色遷移(§8)</div></div>
</div>

<p class="dim"><strong>グラデ4タイプ：</strong> linear(直線遷移) / radial(スポットライト・グロー) / conic(中心回転) / mesh(複雑ブレンド)。Figmaなら「Gradient Grain」プラグインがメッシュ＋グレインをそのまま生成。</p>

<p class="src"><span class="badge b-blog">blog</span><a href="https://www.kittl.com/blogs/gradient-graphic-design-trend/" target="_blank" rel="noopener">kittl.com</a> ／ <a href="https://www.figma.com/community/plugin/1625257589953949443/gradient-grain" target="_blank" rel="noopener">Figma: Gradient Grain</a></p>

## 07 — バナー広告特有の背景設計

面積が限られるので原則がシビア。背景は「世界観の地」、文字とCTAは「図」。背景がfigureを食ったら負け。

<div class="ad">
  <div class="scene">
    <span class="eb">Anker · Power</span>
    <span class="h">世界観は背景で、<br>訴求はCTA1つで。</span>
  </div>
  <div class="right"><span class="cta">今すぐ見る →</span></div>
</div>
<p class="dim" style="margin-top:8px">✓ 背景＝世界観の「地」（ダーク＋グロー）、文字は最小、CTAは朱赤で1つ。高コントラストで視認性◎。</p>

<div class="ad ad-bad">
  <div class="scene">
    <span class="eb">セール開催中</span>
    <span class="h">あれもこれも全部お得！詳しくはこちら今すぐクリック</span>
  </div>
  <div class="right"><span class="cta" style="background:#b9b3a6">詳細</span></div>
</div>
<p class="dim" style="margin-top:8px">✗ 低コントラストの無地グレー地＋文字過多＋弱いCTA。背景が「図」を食い、訴求が埋もれる典型。</p>

<div class="grid g3" style="margin-top:26px">
  <div class="card"><h4>高コントラスト色</h4><p>主要要素に。ただしアクセシブル比率は維持(黄×黒・橙×青が優位)</p></div>
  <div class="card"><h4>テキスト最小化</h4><p>余白を賢く使う</p></div>
  <div class="card"><h4>CTAは1つだけ</h4><p>焦点を保つ</p></div>
</div>

<p class="src"><span class="badge b-blog">blog</span><a href="https://nextmillennium.com/blog/banner-ad-design-best-practices/" target="_blank" rel="noopener">nextmillennium.com</a>（designrush CTRテスト / Google Display が裏付け）</p>

## 08 — そのまま使える実装スニペット

### ① グラデの「グレーバンド(中点の濁り)」を消す

sRGB直線補間はオレンジ→青などで中点が灰色に濁る。OKLCH補間で回避（下のデモ左右を比較）。

<div class="grid g2">
  <div class="demo"><div class="canvas grad-srgb"></div><div class="label">✗ in srgb — 中点が濁る</div></div>
  <div class="demo"><div class="canvas grad-oklch"></div><div class="label">✓ in oklch — 中点も高彩度で滑らか</div></div>
</div>

```css
/* Chrome 111 / Safari 16.4 / Firefox 113+ */
background: linear-gradient(in oklch, #ff6a00, #0066ff);
/* 古いブラウザ向けに sRGB フォールバックを別途用意 */
```

### ② テキスト用スクリム（写真/グラデ上の可読性確保）

```css
.hero::before {
  content: "";
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,.55), transparent 60%);
}
```

### ③ グレインを足してのっぺり防止

SVGの `feTurbulence` ノイズを薄く重ねるだけで安物感が消える（このサイト全体にも適用済み）。

```html
<div class="bg"></div>
<style>
.bg::after{
  content:""; position:absolute; inset:0;
  opacity:.5; mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
}
</style>
```

<p class="src"><span class="badge b-blog">blog</span><a href="https://colorarchive.org/guides/color-gradients-design-guide/" target="_blank" rel="noopener">colorarchive.org</a>（MDN が in srgb vs in oklch を実証）／ CSS-Tricks「Grainy Gradients」</p>

## 09 — 脱・無地 チェックリスト

背景を仕上げる前に、これだけ見る。

<ul class="check">
  <li>前景テキスト/CTAとの<strong>明度差</strong>は残っているか（色より先に明度）</li>
  <li>長尺なら<strong>セクションの背景を交互</strong>に振ったか／5つに1つだけアクセント</li>
  <li>グラデは<strong>in oklch</strong>で中点の濁りを消したか</li>
  <li>のっぺり感を<strong>グレイン/ノイズ</strong>で消したか</li>
  <li>写真/複雑背景の文字に<strong>スクリム</strong>を入れたか（worst-caseで検証）</li>
  <li>本文 <strong>4.5:1</strong> / 大見出し <strong>3:1</strong> を満たすか</li>
  <li>グラスブラーを<strong>全面背景に使っていない</strong>か（カード/モーダル限定）</li>
  <li>バナーは<strong>CTA1つ・テキスト最小・高コントラスト</strong>か</li>
</ul>

## 限界 / 次の問い

- 実名スタジオ(Pentagram, Locomotive, Active Theory 等)の**一次インタビュー/思考プロセス**は確認できず、原則論に留まった。
- ブランド/被写体/業界を入力に背景を機械的に導く**完全な手順書**は、5択ツールキット以上の粒度では未確認。
- 背景の違いが**CTR/滞在時間**にどれだけ寄与するかの定量A/Bデータ(高コントラスト以外)は裏付けなし。
- トレンド系は**18–24ヶ月で再確認**が必要。OKLCH対応の古いブラウザ要件があれば sRGB フォールバック併記。

<p class="dim"><strong>却下された主張（参考）：</strong>「hue-arcは30-90度が最適」(0-3)／「グラスブラーはグラデ背景上で最も有効」(0-3)／「グラデは2-3色・linearで誘導/radialでスポット」(1-2) はいずれも検証で棄却。</p>
