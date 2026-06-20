---
title: "リンクが浮く・埋もれる——テキストリンクの設計"
problem: "リンクの色・下線の見せ方が雑で、浮くか埋もれるかになる。"
category: タイポ
tags: [リンク, タイポ, 可読性]
date: 2026-06-20
sources: 9
draft: false
---

<style>
  .lin-p{color:#16150f;font-size:15px;line-height:1.9;max-width:340px;margin:0;font-feature-settings:"palt"}
  /* 01 underline vs color-only */
  .lin-bad01 a{color:#3a6bd6;text-decoration:none}
  .lin-gray{filter:grayscale(1)}
  .lin-good01 a{color:#3344dd;text-decoration-line:underline;text-decoration-color:#8c93ee;text-decoration-thickness:.08em;text-underline-offset:.15em;text-decoration-skip-ink:auto}
  /* 02 underline quality */
  .lin-ug-bad a{color:#3344dd;text-decoration:underline;text-decoration-color:#3344dd;text-decoration-thickness:.18em;text-underline-offset:0}
  .lin-ug-good a{color:#3344dd;text-decoration:underline;text-decoration-color:#8c93ee;text-decoration-thickness:.08em;text-underline-offset:.15em;text-decoration-skip-ink:auto}
  /* 03 triple contrast swatches */
  .lin-sw{display:flex;flex-direction:column;gap:8px;width:230px}
  .lin-sw .row{background:#fff;color:#16150f;padding:8px 12px;font-size:14px;line-height:1.7;border:1px solid var(--line)}
  .lin-bad03 .l{color:#9aa6d6}
  .lin-good03 .l{color:#3344dd}
  .lin-good03 .v{color:#884488}
  .lin-tag{font-size:11px;color:#5c5a50;display:block;margin-top:6px}
  /* 04 focus rings */
  .lin-btn{display:inline-block;background:#1f1f1f;color:#f4f2ec;padding:10px 18px;border-radius:4px;font-size:14px;font-weight:700;text-decoration:none}
  .lin-fbad{outline:none}
  .lin-fgood{outline:2px solid #1a1a1a;outline-offset:2px;box-shadow:0 0 0 4px #fff;border-radius:4px}
  /* 05 state cues */
  .lin-st a{color:#3366cc;text-decoration:none;margin:0 2px}
  .lin-bad05 a.hov{text-decoration:none;color:#3366cc}
  .lin-good05 a.foc{text-decoration:underline;text-decoration-thickness:.1em;outline:2px solid #1a1a1a;outline-offset:2px;box-shadow:0 0 0 4px #fff;border-radius:2px}
  .lin-good05 a.hov{text-decoration:underline;text-decoration-thickness:.1em}
  /* 06 affordance consistency */
  .lin-af{color:#16150f;font-size:14px;line-height:1.9;max-width:300px}
  .lin-bad06 .fakelink{color:#3344dd}
  .lin-bad06 .fakeul{text-decoration:underline;text-underline-offset:.15em}
  .lin-good06 a{color:#3344dd;text-decoration:underline;text-decoration-color:#8c93ee;text-decoration-thickness:.08em;text-underline-offset:.15em}
  .lin-good06 b.em{color:#16150f}
</style>

## 結論

プロは「本文中のテキストリンクは下線つきが既定」と考える。色だけで区別する設計はWCAGで二重条件（本文と3:1＋hover/focus両方での非色キュー）を満たさないと F73（Level A）違反になり、適合する色域が極端に狭くて割に合わないからだ。下線は消すのではなく `text-decoration-color/offset/thickness` で主張を弱めて上品に整え、フォーカスは `:focus-visible` で2px以上の outline を確保する——これが「浮かず・埋もれず」の実装の勘所になる。

## 01 — 本文中リンクは下線を既定にする

段落テキスト内のリンクは下線を付ける。これが WCAG の preferred technique であり、色のみの区別は低視力・色覚特性・ナイトモード／グレースケール環境でリンクと本文を見分けられず、F73（SC 1.4.1, Level A）の明確な失敗事例に該当する。ナビ・カード・ボタンなど「位置でリンクと分かる」箇所は下線を省いてよいが、文章中のインラインリンクは別だ。下のデモは色だけのリンクをグレースケールで見た状態——リンクが完全に本文へ溶ける。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-bad01 lin-gray"><p class="lin-p">詳しくは<a href="#">サポートページ</a>を確認してください。手続きには<a href="#">本人確認</a>が必要です。</p></div></div><div class="label">✗ 色だけ（グレースケール化）→ リンクが本文に埋没 = F73違反</div></div>
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-good01"><p class="lin-p">詳しくは<a href="#">サポートページ</a>を確認してください。手続きには<a href="#">本人確認</a>が必要です。</p></div></div><div class="label">✓ 薄い下線つき → 色覚・色なし環境でも識別できる</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F73" target="_blank" rel="noopener">F73: Failure of SC 1.4.1 due to creating links not visually evident without color — W3C/WAI</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.nngroup.com/articles/guidelines-for-visualizing-links/" target="_blank" rel="noopener">Guidelines for Visualizing Links — NN/g</a></p>

## 02 — 下線は text-decoration のサブプロパティで上品に整える

「下線つき＝うるさい」は古い前提だ。下線色は文字色と同一である必要はなく、`text-decoration-color` で文字より薄い色にすれば主張が一段下がる。さらに `text-decoration-thickness`（`0.08em` 程度）と `text-underline-offset`（`0.15em`）で太さと距離を調整し、`text-decoration-skip-ink:auto` で g・y・p などディセンダと下線の交差を避けると、小さい文字でもぐっと読みやすくなる。下線を「消す」のではなく「薄く・細く・離す」で両立させるのが今の主流。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-ug-bad"><p class="lin-p">この設計の<a href="#">タイポグラフィ</a>と<a href="#">余白設計</a>について。</p></div></div><div class="label">✗ 文字色と同じ濃さ・太線・offsetゼロ → ディセンダと交差してうるさい</div></div>
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-ug-good"><p class="lin-p">この設計の<a href="#">タイポグラフィ</a>と<a href="#">余白設計</a>について。</p></div></div><div class="label">✓ 薄色・細線・offset・skip-ink → 上品で可読性が高い</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness" target="_blank" rel="noopener">text-decoration-thickness — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://adrianroselli.com/2016/06/on-link-underlines.html" target="_blank" rel="noopener">On Link Underlines — Adrian Roselli</a></p>

## 03 — 色を選ぶときは「三重コントラスト制約」を同時に満たす

AA 適合のリンク配色は1つの比率では足りない。「本文↔背景 4.5:1」「リンク↔背景 4.5:1」「リンク↔周囲本文 3:1」の3つを同時に満たす必要がある。黒文字／白背景なら `#3344dd`（デフォルト）・`#bb1122`（hover/focus/active）・`#884488`（visited）が全条件を満たす実例で、許容される青はおよそ `#6a5eff`〜`#531fff`。ブランドカラーをそのまま使う前に、この3条件で必ず検算する。下のデモは検算を通っていない淡い青——本文に対して 3:1 を割り、リンクが浮いて見えない。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="lin-bad03 lin-sw"><div class="row">本文テキストの中の<span class="l">淡すぎる青リンク</span>。<span class="lin-tag">リンク↔本文が3:1未満 → 埋もれる</span></div></div></div><div class="label">✗ 検算なし → リンクが本文に埋もれて識別不能</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="lin-good03 lin-sw"><div class="row">本文テキストの中の<span class="l">#3344dd の青リンク</span>と<span class="v">#884488 の訪問済み</span>。<span class="lin-tag">本文4.5:1・リンク4.5:1・リンク↔本文3:1 すべて適合</span></div></div></div><div class="label">✓ 三重制約を通したAA安全配色</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://webaim.org/blog/wcag-2-0-and-link-colors/" target="_blank" rel="noopener">WebAIM: WCAG 2.0 and Link Colors</a></p>

## 04 — フォーカスは :focus-visible で2px以上の outline を確保

`outline:none` でフォーカスリングを消すのは SC 2.4.7（Level AA）違反で、キーボード利用者から唯一の現在位置インジケータを奪う。正解は `:focus`（マウスでも出る）ではなく `:focus-visible`（キーボード時のみ）を使い、隣接色に対し 3:1 以上・solid なら2px以上の outline を付けること。`outline-offset` で要素から離し、`box-shadow` を重ねた二重リングにすれば背景色を問わず見える。「リングを消したい」という要求こそ `:focus-visible` で解決する。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><a href="#" class="lin-btn lin-fbad" onclick="return false">送信する</a></div><div class="label">✗ outline:none → キーボードで現在位置が消える = SC2.4.7違反</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><a href="#" class="lin-btn lin-fgood" onclick="return false">送信する</a></div><div class="label">✓ solid 2px + offset + box-shadow二重リング → 背景を問わず視認</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible" target="_blank" rel="noopener">:focus-visible — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>

## 05 — 下線を外すなら hover「と」focus の両方で非色キューを再付与

デザイン都合でどうしても下線なしにしたいなら、条件はセットだ。リンク色は周囲の本文と 3:1 以上を確保し（G183 の実例は `#3366cc` ↔ 黒本文で 3.9:1）、かつ**ポインタ hover 時とキーボード focus 時の両方**で下線・太字・斜体・サイズ増のいずれかを再付与する。実装で最も頻発する抜け漏れが「hover にだけ下線を付けて focus に付けない」パターン——これだけで G183 不適合になる。下のデモで Tab フォーカスしてみると差が出る。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-st lin-bad05" style="color:#16150f;font-size:15px"><p style="margin:0">マウスでは <a href="#" class="hov" onclick="return false">下線が出る</a> が、<a href="#" class="hov" onclick="return false">Tabフォーカス</a> では何も起きない</p></div></div><div class="label">✗ hoverのみ → キーボードに非色キューなし = G183不適合</div></div>
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-st lin-good05" style="color:#16150f;font-size:15px"><p style="margin:0"><a href="#" class="hov" onclick="return false">hover</a> でも <a href="#" class="foc" onclick="return false">focus</a> でも下線が戻る（focusはリングも）</p></div></div><div class="label">✓ hover/focus両方で下線を再付与 + focus-visibleリング</div></div>
</div>

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Techniques/general/G183" target="_blank" rel="noopener">G183: Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on hover — W3C/WAI</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://accessibleweb.com/question-answer/what-are-the-contrast-requirements-for-an-elements-focus-mouseover-select-states/" target="_blank" rel="noopener">Contrast requirements for focus/mouseover/select states — Accessible Web</a></p>

## 06 — リンクのアフォーダンスは一貫させる

リンク色を非リンクテキストに使ったり、非リンクに下線を付けたりすると「クリックできそうなのにできない／できそうにないのにできる」という誤誘導が生まれ、アフォーダンスの一貫性が崩れてチープに見える。色相は青を最優先のリンクシグナルに使う——青はクリック可能性の知覚が最も強い。赤・緑をリンクに使うなら色覚特性対応のため下線が必須だ。強調したい非リンク語は色ではなく太字や別手段で差をつける。

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-af lin-bad06"><p style="margin:0">この<span class="fakelink">青い語</span>はリンクではなく、<span class="fakeul">この下線</span>もただの強調。本物の<a href="#" style="color:#16150f;text-decoration:none" onclick="return false">リンク</a>は地味。</p></div></div><div class="label">✗ 非リンクに色/下線、リンクは地味 → 誤クリックと混乱</div></div>
  <div class="demo"><div class="canvas" style="background:#fff"><div class="lin-af lin-good06"><p style="margin:0">強調は<b class="em">太字</b>で示し、クリックできる<a href="#" onclick="return false">リンク</a>だけが青＋下線。シグナルが一貫する。</p></div></div><div class="label">✓ 青＋下線はリンク専用、強調は太字 → 誤誘導が消える</div></div>
</div>

<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.nngroup.com/articles/guidelines-for-visualizing-links/" target="_blank" rel="noopener">Guidelines for Visualizing Links — NN/g</a></p>

## 実装スニペット

```css
/* 本文中リンク：下線つき・上品に整える（AA安全配色 / 黒文字・白背景前提） */
a {
  color: #3344dd;                          /* 白背景に4.5:1, 黒本文に3:1 */
  text-decoration-line: underline;
  text-decoration-color: #8c93ee;          /* 文字より薄い下線で主張を抑える */
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.15em;
  text-decoration-skip-ink: auto;          /* ディセンダと下線の交差を回避 */
}
a:hover { text-decoration-color: currentColor; }  /* hoverで下線を強調 */
a:visited { color: #884488; }                     /* 訪問済み */
```

```css
/* 下線なしにする場合：hover/focus 両方で下線を再付与（G183準拠） */
a.bare {
  color: #3366cc;                 /* 黒本文に3.9:1（G183の実例値）, 白背景に4.5:1 */
  text-decoration: none;
}
a.bare:hover,
a.bare:focus-visible {            /* hoverだけでなくfocusにも必須 */
  text-decoration: underline;
  text-decoration-thickness: 0.1em;
}
```

```css
/* アクセシブルなフォーカスリング（:focus-visible 二重リング） */
a:focus-visible {
  outline: 2px solid #1a1a1a;     /* solidは2px以上、隣接色に3:1以上 */
  outline-offset: 2px;            /* 要素から離して視認性UP */
  box-shadow: 0 0 0 4px #ffffff;  /* 背景色を問わず見える二重リング */
  border-radius: 2px;
}
/* dashed/dotted を使うなら面積が減るため 4px 以上にする */
```

```css
/* AAA配色（背景7:1・色域が激減。下線併用が前提） */
a { color: #3344dd; }                  /* 青: 白に7:1, 黒に3:1 */
a:hover, a:active { color: #b50010; }  /* 赤 */
a:visited { color: #804180; }          /* 紫 */
```

## チェックリスト

<ul class="check">
  <li>本文・記事・LP の文章中インラインリンクに下線が付いているか（色だけにしていないか＝F73回避）</li>
  <li>下線を外した箇所は「本文と3:1以上」＋「hover と focus の両方で非色キュー」をセットで満たしているか</li>
  <li>リンク配色が「本文↔背景4.5:1」「リンク↔背景4.5:1」「リンク↔本文3:1」の三重制約を通っているか（ブランドカラーは検算してから採用）</li>
  <li>下線を `text-decoration-color`（薄色）/`thickness`/`offset`/`skip-ink:auto` で整え、文字色ベタ太線にしていないか</li>
  <li>`outline:none` で消していないか。`:focus`ではなく`:focus-visible`で solid 2px以上（dashed/dottedは4px以上）＋offsetを確保しているか</li>
  <li>非リンクテキストにリンク色を使っていないか／非リンクに下線を付けていないか（アフォーダンスの一貫性）</li>
  <li>赤・緑をリンク色にする場合は下線を必須にしているか（色覚特性で消えるため）</li>
  <li>背景色やダーク背景を使う箇所では hex を再計算したか（提供値は黒文字・白背景前提）</li>
  <li>Safari の小サイズ時に offset/skip-ink のレンダリングを実機確認したか</li>
</ul>

## 限界 / 出典

数値はすべて WCAG 2.0/2.1 基準。具体的な hex（`#3344dd`/`#bb1122`/`#884488` など）は黒文字・白背景前提の WebAIM 実例であり、背景色やダーク背景では必ず再計算が必要だ。`:focus-visible` はモダンブラウザで広くサポートされるが、ごく古い環境向けには `:focus` フォールバックの検討余地がある。SC 2.4.13 Focus Appearance（面積式 4×width＋4×height）は AAA 要件で、多くのプロジェクトの必達ラインである AA では必須ではない（参考値として扱う）。バナー等の非インタラクティブな静止画には focus/hover 要件は適用されないが、色だけでリンク風に見せる表現は誤誘導になり得るので注意。下線の offset/skip-ink の細かいレンダリングはブラウザ差があり、特に Safari の小サイズ時は実機確認が必要。state 同士のコントラスト（hover↔focus 等）についての扱いは confidence:medium のソースに基づく参考情報である。

<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Techniques/general/G183" target="_blank" rel="noopener">G183: Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on hover — W3C/WAI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://www.w3.org/WAI/WCAG21/Techniques/failures/F73" target="_blank" rel="noopener">F73: Failure of SC 1.4.1 due to creating links not visually evident without color — W3C/WAI</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://webaim.org/blog/wcag-2-0-and-link-colors/" target="_blank" rel="noopener">WebAIM: WCAG 2.0 and Link Colors</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.nngroup.com/articles/guidelines-for-visualizing-links/" target="_blank" rel="noopener">Guidelines for Visualizing Links — NN/g</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://www.sarasoueidan.com/blog/focus-indicators/" target="_blank" rel="noopener">A guide to designing accessible, WCAG-conformant focus indicators — Sara Soueidan</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness" target="_blank" rel="noopener">text-decoration-thickness — MDN Web Docs</a></p>
<p class="src"><span class="badge b-primary">primary</span><a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:focus-visible" target="_blank" rel="noopener">:focus-visible — MDN Web Docs</a></p>
<p class="src"><span class="badge b-blog">secondary</span><a href="https://accessibleweb.com/question-answer/what-are-the-contrast-requirements-for-an-elements-focus-mouseover-select-states/" target="_blank" rel="noopener">Contrast requirements for focus/mouseover/select states — Accessible Web</a></p>
<p class="src"><span class="badge b-blog">blog</span><a href="https://adrianroselli.com/2016/06/on-link-underlines.html" target="_blank" rel="noopener">On Link Underlines — Adrian Roselli</a></p>
