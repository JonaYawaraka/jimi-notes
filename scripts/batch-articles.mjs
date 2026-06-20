export const meta = {
  name: 'jimi-notes-batch',
  description: '10個の「地味なデザインの悩み」をdeep-research方式で調べ、Jimi Notes記事(作例つき)を執筆',
  phases: [
    { title: 'Research', detail: '各テーマ3角度の検索→統合検証' },
    { title: 'Write', detail: 'findings→作例つき記事マークダウン' },
  ],
}

// args（pick-topics.mjs が渡す配列）が来たらそれを使い、無ければデフォルト10件。
// key(CSSクラス接頭辞)は記事ごとのページ内でしか使われないので slug 由来で十分。
const DEFAULT_TOPICS = [
  { key:'sh', slug:'shadow-depth', category:'質感', title:'影が安っぽい——のっぺりを脱する影の設計',
    problem:'影をつい単一の濃い黒影で付けてしまい、安っぽく・のっぺり見える。',
    tags:['影','シャドウ','エレベーション'],
    angles:['why CSS box shadows look cheap fake antipatterns single harsh black shadow',
            'designing beautiful realistic shadows layered box-shadow light source color Josh Comeau Tobias Ahlin',
            'material design elevation shadow tokens scale dark mode shadow alternatives'] },
  { key:'sp', slug:'spacing-rhythm', category:'余白', title:'余白がなんとなく——8ptで決める余白とリズム',
    problem:'余白を感覚で置いてしまい、詰まり/スカスカ・不揃いになる。',
    tags:['余白','スペーシング','リズム'],
    angles:['8 point grid spacing system UI design why use 8pt',
            'spacing scale design tokens t-shirt sizes rhythm vertical whitespace',
            'whitespace negative space proximity grouping common spacing mistakes'] },
  { key:'ts', slug:'type-scale', category:'タイポ', title:'フォントサイズが行き当たりばったり——タイプスケールとジャンプ率',
    problem:'見出し/本文のサイズを都度決めてしまい、階層もリズムも出ない。',
    tags:['タイポ','タイプスケール','階層'],
    angles:['modular typographic scale ratio web design 1.25 1.333 major third',
            'type hierarchy contrast font size jump ratio heading body',
            'fluid typography clamp responsive type scale best practice'] },
  { key:'nc', slug:'neutral-grey', category:'色', title:'グレーが濁る——使えるニュートラルと色の作り方',
    problem:'グレーやニュートラルが濁って安っぽい。色の選び方に芯がない。',
    tags:['色','グレー','彩度'],
    angles:['why pure grey looks dull design temperature tinted neutrals',
            'creating color palette neutrals saturation lightness HSL design system',
            'refactoring UI color tips greys with hue accessible color contrast'] },
  { key:'br', slug:'border-radius', category:'細部', title:'角丸がバラバラ——半径の統一とネスト',
    problem:'角丸の半径が要素ごとにバラバラで、入れ子で歪む。',
    tags:['角丸','radius','細部'],
    angles:['border radius consistency design system nested radius formula',
            'border radius scale tokens when to use rounded corners',
            'concentric nested border radius inner outer padding rule'] },
  { key:'bt', slug:'button-states', category:'細部', title:'ボタンの状態が雑——hover/active/disabled/focusの詰め',
    problem:'ボタンのhover/active/disabled/focusを詰め切れず、触り心地が安っぽい。',
    tags:['ボタン','状態','インタラクション'],
    angles:['button states design hover active focus disabled best practice',
            'interactive states feedback affordance micro-interaction button',
            'accessible focus visible state disabled contrast WCAG button'] },
  { key:'dv', slug:'dividers-borders', category:'細部', title:'区切り線が安っぽい——ボーダーとセパレータの品',
    problem:'区切り線やボーダーがどぎつく、画面が安っぽく見える。',
    tags:['ボーダー','区切り線','細部'],
    angles:['hairline dividers borders subtle UI design too heavy lines',
            'border color opacity low contrast separators whitespace vs lines',
            'when to use dividers vs spacing card borders design'] },
  { key:'ic', slug:'icon-stroke', category:'細部', title:'アイコンが浮く——線幅と光学サイズの揃え方',
    problem:'アイコンの線幅・サイズがテキストやUIと合わず浮く。',
    tags:['アイコン','線幅','光学調整'],
    angles:['icon stroke width consistency optical size alignment UI',
            'icon size optical balance vs text weight pixel grid alignment',
            'icon set consistency grid keyline shapes design guidelines'] },
  { key:'jp', slug:'jp-typography', category:'タイポ', title:'日本語が読みにくい——行間・約物・ジャンプ率',
    problem:'日本語の行間・約物アキ・字間が整わず、読みにくく素人っぽい。',
    tags:['日本語','組版','palt'],
    angles:['Japanese web typography line-height letter-spacing readability 日本語 行間',
            'CSS font-feature-settings palt kerning Japanese punctuation 約物 詰め',
            'Japanese type hierarchy jump ratio line length 文字組 ベストプラクティス'] },
  { key:'al', slug:'alignment-grid', category:'レイアウト', title:'微妙にズレる——整列とグリッドの規律',
    problem:'要素が微妙に揃わず、全体がプロっぽくならない。',
    tags:['整列','グリッド','レイアウト'],
    angles:['alignment principles design grid systems optical alignment',
            'edge alignment baseline grid columns gutters layout discipline',
            'common alignment mistakes UI optical adjustment icon text baseline'] },
]

const ANGLE_SCHEMA = {
  type:'object', additionalProperties:false,
  properties:{
    summary:{type:'string'},
    findings:{type:'array', items:{
      type:'object', additionalProperties:false,
      properties:{
        claim:{type:'string', description:'a concrete, falsifiable finding incl. numbers/values if any'},
        value:{type:'string', description:'concrete value/number/CSS if relevant, else empty'},
        sourceUrl:{type:'string'},
        sourceTitle:{type:'string'},
      }, required:['claim','sourceUrl','sourceTitle','value']
    }},
  }, required:['summary','findings']
}

const FINDINGS_SCHEMA = {
  type:'object', additionalProperties:false,
  properties:{
    summary:{type:'string', description:'2-3 sentence thesis: how pros solve this'},
    antipatterns:{type:'array', items:{type:'object', additionalProperties:false,
      properties:{ name:{type:'string'}, why:{type:'string'} }, required:['name','why'] },
      description:'why it looks cheap / common mistakes'},
    principles:{type:'array', items:{type:'object', additionalProperties:false,
      properties:{ name:{type:'string'}, detail:{type:'string'}, when:{type:'string'},
        sourceUrl:{type:'string'}, confidence:{type:'string'} },
      required:['name','detail','when','sourceUrl','confidence'] },
      description:'4-7 concrete techniques pros use, with when-to-use and a source'},
    implementation:{type:'array', items:{type:'object', additionalProperties:false,
      properties:{ label:{type:'string'}, code:{type:'string'}, note:{type:'string'} },
      required:['label','code','note'] },
      description:'2-4 copy-paste CSS snippets with concrete values'},
    trends:{type:'array', items:{type:'object', additionalProperties:false,
      properties:{ name:{type:'string'}, use:{type:'string'}, caveat:{type:'string'} },
      required:['name','use','caveat'] }},
    sources:{type:'array', items:{type:'object', additionalProperties:false,
      properties:{ url:{type:'string'}, title:{type:'string'}, what:{type:'string'},
        quality:{type:'string', description:'primary|secondary|blog'} },
      required:['url','title','what','quality'] }},
    caveats:{type:'string', description:'limitations / refuted claims / time-sensitivity'},
  }, required:['summary','antipatterns','principles','implementation','trends','sources','caveats']
}

const DESIGN_SPEC = `
DESIGN SYSTEM — Jimi Notes (editorial Swiss/Bauhaus, LIGHT/paper theme):
- The page background is PAPER (light #f4f2ec); text is near-black #16150f.
- HARD RULE on contrast: NEVER place light/white text on a light surface, or dark text on a dark surface.
  Inside any demo cell, set an EXPLICIT text color: dark surface => light text (e.g. #f4f2ec), light surface => dark text (#16150f). Never rely on inherited color in demos.
- Global CSS variables available: --paper:#f4f2ec; --paper-2:#eceae2; --ink:#16150f; --ink-2:#5c5a50; --ink-3:#8d8b80; --line:rgba(22,21,15,.16); --accent:#de3c24; --measure:680px.
- Global helper classes (already styled — use directly, DO NOT redefine):
  .grid with .g2 (2 cols) or .g3 (3 cols): responsive, auto-collapse to 1 col on mobile. Never set your own column widths.
  .card : a cell; inside .grid it gets a hairline border. <div class="card"><h4>title</h4><p>text</p></div>
  .demo : a framed figure. EXACT structure:
     <div class="demo"><div class="canvas" style="background:var(--paper-2)"> ...your visual...</div><div class="label">caption</div></div>
     .canvas is 200px tall and centers its content (flex). Put your demo element inside.
  .note : callout. <div class="note"><b>ラベル：</b>本文</div>
  ul.check : checklist with accent bullets. <ul class="check"><li>...</li></ul>
  .src/.badge : sources line. <p class="src"><span class="badge b-blog">blog</span><a href="URL" target="_blank" rel="noopener">Title</a></p> (use b-primary for primary sources)
  Markdown tables => clean Swiss tables. Fenced code blocks => dark code blocks.
- Headings (use these literally): "## 結論", then "## 01 — ...", "## 02 — ...", ... then "## 実装スニペット", "## チェックリスト", "## 限界 / 出典".
- Put ALL article-specific demo CSS in ONE <style> block at the very top of the body. PREFIX every custom class with "{PREFIX}-" (given per article) to avoid collisions. Pure CSS/SVG only — NEVER use <img> or external images/URLs.

NON-NEGOTIABLE RULES:
1. EVERY principle/section MUST include a live visual demo that actually renders the concept. Strongly prefer a Before/After pair: a .grid.g2 with two .demo cells, one "✗ 安っぽい例" and one "✓ プロの例". Text-only is NOT allowed.
2. The demo must genuinely show THIS topic (e.g. shadows => boxes with different box-shadow; spacing => blocks with different gaps; type scale => actual text at scaled sizes; radius => boxes with different radii; color => actual swatches; buttons => actual styled buttons with :hover note).
3. Stay responsive: rely only on .grid/.g2/.g3; never hard-code wide fixed pixel widths that could overflow a phone.
4. Japanese body copy, concrete and implementation-ready. Keep each section tight.
4b. This is for WEB designers. Use px (or rem) for ALL sizes/values; NEVER use "pt". Speak in CSS/browser terms, not print. The "8-point grid" must be written as the "8pxグリッド".
5. Cite the provided sources in the relevant sections and in 出典.
6. Output ONLY the markdown body: start with the <style> block, then "## 結論", end after "## 限界 / 出典". No YAML frontmatter, no surrounding code fences, no preamble or sign-off.`

const DEMO_EXAMPLE = `
EXAMPLE demo block (copy this pattern — note prefixed classes, explicit text colors, real CSS, Before/After):
<style>
  .xx-bad{background:#fff;box-shadow:0 6px 12px rgba(0,0,0,.45)}
  .xx-good{background:#fff;box-shadow:0 1px 1px rgba(20,18,12,.05),0 4px 8px rgba(20,18,12,.06),0 16px 28px rgba(20,18,12,.07)}
  .xx-chip{width:130px;height:84px;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#16150f;font-weight:700}
</style>

<div class="grid g2">
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="xx-chip xx-bad">cheap</div></div><div class="label">✗ 単一の濃い黒影 → 縁がくっきりして安っぽい</div></div>
  <div class="demo"><div class="canvas" style="background:var(--paper-2)"><div class="xx-chip xx-good">pro</div></div><div class="label">✓ 低不透明度を3層に重ねる → 自然な距離感</div></div>
</div>`

phase('Research')
log(`10テーマを並列リサーチ→執筆へpipeline`)

const articles = await pipeline(TOPICS,
  // ---- Stage 1: research (3 angles in parallel, then synthesize+verify) ----
  async (topic) => {
    const angles = await parallel(topic.angles.map((q, ai) => () =>
      agent(
        `You are a design researcher. Use WebSearch and WebFetch to research this angle and extract concrete, falsifiable findings WITH source URLs and concrete values/numbers/CSS where possible.\n\nTOPIC: ${topic.title}\nANGLE ${ai+1}: ${q}\n\nDo 1-2 web searches, fetch the 2-3 most authoritative results, and return structured findings. Prefer primary/expert sources (Material Design, Josh Comeau, Refactoring UI, Smashing, NN/g, Tobias Ahlin, W3C). Capture concrete numbers (ratios, px, opacity, hex) verbatim.`,
        { label:`research:${topic.key}#${ai+1}`, phase:'Research', schema: ANGLE_SCHEMA }
      )
    ))
    const good = angles.filter(Boolean)
    const synth = await agent(
      `Synthesize and cross-verify these research findings into a structured brief for a practical design article titled "${topic.title}".\n\nRAW FINDINGS (3 angles):\n${JSON.stringify(good)}\n\nRules: keep only claims supported by at least one credible source; drop vague or unsupported claims; prefer concrete values (numbers, ratios, hex, CSS). Produce 4-7 actionable principles (each with when-to-use + a sourceUrl + confidence high/medium/low), the key antipatterns (why it looks cheap), 2-4 copy-paste CSS implementation snippets with REAL values, any 2024-2026 trends with caveats, a deduped sources list, and honest caveats. Be specific and implementation-ready for web/LP/banner.`,
      { label:`synth:${topic.key}`, phase:'Research', schema: FINDINGS_SCHEMA }
    )
    log(`✓ research done: ${topic.title} (${synth.sources.length} sources)`)
    return synth
  },
  // ---- Stage 2: write the article body (with live demos) ----
  async (findings, topic) => {
    const spec = DESIGN_SPEC.replace('{PREFIX}', topic.key)
    const example = DEMO_EXAMPLE
    const body = await agent(
      `You are writing the body of an article for "Jimi Notes" — a site that solves unglamorous-but-real design pains with cited research and LIVE CSS demos.\n\n` +
      `ARTICLE TITLE: ${topic.title}\nTHE PAIN: ${topic.problem}\nCLASS PREFIX for your demo CSS: "${topic.key}-"\n\n` +
      `RESEARCH BRIEF (ground the article in this; cite the sources):\n${JSON.stringify(findings)}\n\n` +
      `Write the full markdown body with this structure:\n` +
      `- "## 結論": 2-3 sentence thesis (how pros actually solve it).\n` +
      `- "## 01 — ...", "## 02 — ...", ... (4-6 sections): each is ONE principle/technique, with a tight explanation AND a live Before/After demo (✗ cheap vs ✓ pro) that actually renders the concept. End relevant sections with a .src sources line.\n` +
      `- "## 実装スニペット": 2-4 fenced CSS code blocks with real copy-paste values from the brief.\n` +
      `- "## チェックリスト": a ul.check the reader runs before shipping.\n` +
      `- "## 限界 / 出典": honest caveats (from the brief) + a list of .src source lines for every source in the brief.\n\n` +
      spec + '\n' + example + '\n\n' +
      `Remember: every section needs a real, working, visually-clear CSS/SVG demo for THIS topic. Output ONLY the markdown body (start with the <style> block).`,
      { label:`write:${topic.key}`, phase:'Write' }
    )
    return { slug: topic.slug, key: topic.key, title: topic.title, problem: topic.problem,
      category: topic.category, tags: topic.tags, sourceCount: findings.sources.length, body }
  }
)

return articles.filter(Boolean)
