export const meta = {
  name: 'jimi-notes-review',
  description: 'Jimi Notes 全体を7次元で批判レビューし、改善案をランク付けで統合',
  phases: [
    { title: 'Review', detail: '7次元を並列査読（実ファイルを読む）' },
    { title: 'Synthesize', detail: '重複排除・優先度付け・自己矛盾チェック' },
  ],
}

const ROOT = '/Users/otsu_naoya/Desktop/projects/jimi-notes'

const FINDINGS_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    dimension: { type: 'string' },
    summary: { type: 'string' },
    issues: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false,
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', description: 'high | medium | low' },
          evidence: { type: 'string', description: 'file:line or concrete observation' },
          fix: { type: 'string', description: 'concrete, implementable change' },
          effort: { type: 'string', description: 'S | M | L' },
          value: { type: 'string', description: 'why it matters / impact if fixed' },
        },
        required: ['title', 'severity', 'evidence', 'fix', 'effort', 'value'],
      },
    },
  },
  required: ['dimension', 'summary', 'issues'],
}

const PLAN_SCHEMA = {
  type: 'object', additionalProperties: false,
  properties: {
    metaCritique: { type: 'string', description: 'does the site practice what it preaches? overall verdict' },
    quickWins: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { title: { type: 'string' }, change: { type: 'string' }, files: { type: 'string' } },
      required: ['title', 'change', 'files'] } },
    highValue: { type: 'array', items: { type: 'object', additionalProperties: false,
      properties: { rank: { type: 'number' }, title: { type: 'string' }, why: { type: 'string' },
        change: { type: 'string' }, files: { type: 'string' }, effort: { type: 'string' } },
      required: ['rank', 'title', 'why', 'change', 'files', 'effort'] } },
    skip: { type: 'array', items: { type: 'string' }, description: 'considered but not worth it, with reason' },
  },
  required: ['metaCritique', 'quickWins', 'highValue', 'skip'],
}

const COMMON = `You are reviewing the live design-education site "Jimi Notes" (Astro 5, editorial Swiss/Bauhaus, light/paper theme, deployed to Cloudflare Pages). The site teaches good web design with cited research + live CSS demos — so it MUST itself be exemplary; flag anywhere it violates the very principles its articles teach. Repo root: ${ROOT}. Use Read/Bash to inspect actual files. Be specific (file:line), critical, and propose concrete implementable fixes. Prioritize honestly (don't pad). Key files: src/styles/global.css, src/layouts/Base.astro, src/pages/index.astro, src/pages/articles/[...id].astro, src/components/Thumb.astro, src/content.config.ts, astro.config.mjs, and sample articles in src/content/articles/.`

const DIMENSIONS = [
  { key: 'design', prompt: `${COMMON}\n\nDIMENSION: Visual design & consistency. Evaluate the typographic scale & rhythm, spacing system, color/contrast usage, grid discipline, hierarchy, the index & article layouts, the thumbnail system, and overall editorial polish. Does the site itself follow the advice in its own articles (type-scale, spacing-rhythm, contrast-hierarchy, alignment, shadows, etc.)? Read global.css and the layouts plus 2-3 articles.` },
  { key: 'a11y', prompt: `${COMMON}\n\nDIMENSION: Accessibility. Check color contrast (paper #f4f2ec / ink #16150f / accent #de3c24 / ink-2/3 dim text), focus-visible states on links/rows (ironic: there's a focus-rings article), keyboard nav, semantic HTML & heading order, aria, alt/aria-hidden on SVG, reduced-motion coverage, tap target sizes on mobile, language attributes. Read Base.astro, global.css, index.astro, [...id].astro, Thumb.astro.` },
  { key: 'seo', prompt: `${COMMON}\n\nDIMENSION: SEO & metadata & sharing. Check: per-page <title>/description, canonical URLs, Open Graph / Twitter card images (are there per-article OG images? big gap if not), sitemap.xml, robots.txt, RSS feed (astro.config mentions site/RSS?), structured data (Article schema), lang, the og:image situation. Read Base.astro, astro.config.mjs, package.json, src/pages/. Note missing integrations (@astrojs/sitemap, @astrojs/rss).` },
  { key: 'perf', prompt: `${COMMON}\n\nDIMENSION: Performance. Check Google Fonts loading (render-blocking? preconnect/preload/display-swap?), total CSS size, the cost of many continuously-animating inline SVG thumbnails on the index (CPU/jank with 30+ rows), inline SVG payload, no-image approach (good), build output size, any layout shift. Read Base.astro, global.css, Thumb.astro; run a production build and inspect dist sizes via Bash.` },
  { key: 'ux', prompt: `${COMMON}\n\nDIMENSION: UX & information architecture. The index is a flat list that grows by 3 articles/day — will it scale (category grouping/filtering/search)? Is there an About/intro page explaining what Jimi Notes is? Navigation? A table of contents for long articles? Related-articles links? The back link, reading flow, breadcrumbs, pagination. Read index.astro and [...id].astro.` },
  { key: 'content', prompt: `${COMMON}\n\nDIMENSION: Content quality. Read 4-5 articles fully (e.g. shadow-depth.md, spacing-rhythm.md, contrast-hierarchy.md, data-numbers.md, alignment-grid.md). Assess: accuracy of claims, citation quality, demo clarity & correctness, structural consistency across articles, cross-article redundancy/overlap, any broken or invisible demos, the 結論/出典/限界 sections. Flag weak or duplicated content.` },
  { key: 'code', prompt: `${COMMON}\n\nDIMENSION: Code quality & maintainability. Review the Astro components/pages, global.css organization, content schema, the generation/automation scripts (scripts/*.mjs, .claude/commands/daily-articles.md). Look for fragility, duplication, footguns, missing error handling, and maintainability issues. Read src/* and scripts/*.` },
]

phase('Review')
const reviews = await parallel(DIMENSIONS.map((d) => () =>
  agent(d.prompt, { label: `review:${d.key}`, phase: 'Review', schema: FINDINGS_SCHEMA, effort: 'high' })
))
const good = reviews.filter(Boolean)
log(`reviewed ${good.length}/7 dimensions, total issues: ${good.reduce((n, r) => n + (r.issues?.length || 0), 0)}`)

phase('Synthesize')
const plan = await agent(
  `You are the lead reviewer for "Jimi Notes". Below are 7 dimension reviews (JSON). Synthesize into a single prioritized improvement plan for the maintainer to implement now.\n\n${JSON.stringify(good)}\n\nRules: dedupe overlapping issues; rank by (impact × low-effort); separate true quick-wins from higher-effort high-value bets; be ruthlessly honest about what to SKIP and why. Add a meta-critique: does this design-teaching site actually practice what it preaches? Focus on changes that materially improve the site for real readers (a public design-education site that grows daily). Concrete, implementable, file-level.`,
  { label: 'synthesize', phase: 'Synthesize', schema: PLAN_SCHEMA, effort: 'high' }
)

return { plan, reviews: good }
