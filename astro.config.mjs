// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build
export default defineConfig({
  // 公開時に独自ドメインを取ったらここを書き換える（OGP/RSSの絶対URL用）
  site: 'https://jimi-notes.pages.dev',
  markdown: {
    // 生のHTML（ライブデモのdiv等）をそのまま通す
    smartypants: false,
  },
});
