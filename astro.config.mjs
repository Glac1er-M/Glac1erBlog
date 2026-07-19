// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import icon from 'astro-icon';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDirective from 'remark-directive';
import rehypeComponents from "rehype-components";

import { admonition } from "./src/plugins/rehype-component-admonition.mjs";
import { parseDirectiveNode } from "./src/plugins/remark-directive-rehype.js";
import { MusicCardComponent } from "./src/plugins/rehype-component-music-card.mjs";
import { GithubCardComponent } from './src/plugins/rehype-component-github-card.mjs';
import { QuoteComponent } from "./src/plugins/rehype-component-quote.mjs"
import { customFigurePlugin } from "./src/plugins/rehype-figure-plugin.mjs";
import { remarkCombined } from './src/plugins/remark-combined.mjs';
import { remarkTypst } from './src/plugins/remark-typst.mjs';
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs';
import { remarkLqip } from './src/plugins/remark-lqip.js';
import expressiveCode from 'astro-expressive-code';

import svelte from "@astrojs/svelte";

import { siteConfig } from './src/config';

const site = process.env.ASTRO_SITE ?? 'https://momo.motues.top';
const base = process.env.ASTRO_BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  i18n: {
    locales: ['zh-cn', 'en'],
    defaultLocale: 'zh-cn',
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false
    }
  },
  integrations: [icon({
    include: {
      "fa6-brands": ["*"],
      "fa6-solid": ["*"],
      "simple-icons": ["*"],
      "vscode-icons": ["*"],
      "material-symbols": ["*"],
      "flue": ["*"],
    }
  }), svelte(), expressiveCode()],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkReadingTime,
      remarkDirective,
      remarkTypst,
      parseDirectiveNode,
      remarkCombined,
      [remarkLqip, { enable: siteConfig.theme.LQIP }],
    ],
    rehypePlugins: [
      rehypeKatex,
      customFigurePlugin,
      [
        rehypeComponents,
        {
          components: {
            github: GithubCardComponent,
            music: MusicCardComponent,
            quote: QuoteComponent,
            note: admonition("note"),
            tip: admonition("tip"),
            important: admonition("important"),
            caution: admonition("caution"),
            warning: admonition("warning"),
          },
        },
      ],
    ]
  },
  vite: {
    plugins: [tailwindcss()],
    // Typst's compiler loads a platform-specific `.node` binary. It must stay
    // external during Astro's SSR build instead of being parsed by Rollup.
    ssr: {
      external: ['@myriaddreamin/typst-ts-node-compiler']
    }
  }
});
