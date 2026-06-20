import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 「地味な悩み」記事のコレクション。1記事=1Markdown。
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    // 一言の悩み（カードに出る共感フック）
    problem: z.string(),
    // 色 / 余白 / タイポ / 画像 / レイアウト / 質感 / 細部
    category: z.enum(['色', '余白', 'タイポ', '画像', 'レイアウト', '質感', '細部']),
    tags: z.array(z.string()).default([]),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // リサーチの裏取り情報（任意）
    sources: z.number().optional(),
    // 下書きは公開リポでも一覧/ビルドから除外される
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
