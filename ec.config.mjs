import { defineEcConfig } from 'astro-expressive-code';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';

/**
 * The single source of truth for Markdown and MDX code blocks.
 *
 * Keep presentation decisions here so Astro's Markdown configuration,
 * component scripts, and global CSS do not each control code blocks.
 */
export default defineEcConfig({
  // Keep the code block theme in sync with the site's light/dark toggle.
  themes: ['github-light', 'aurora-x'],
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) =>
    theme.type === 'dark' ? '[data-theme="dark"]' : '[data-theme="light"]',
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],

  frames: {
    extractFileNameFromCode: true,
    showCopyToClipboardButton: true,
    removeCommentsWhenCopyingTerminalFrames: true,
  },
  defaultProps: {
    wrap: false,
    showLineNumbers: true,
    collapseStyle: 'collapsible-auto',
  },
  styleOverrides: {
    uiFontFamily: '"JetBrains Mono Variable", ui-monospace, monospace',
    borderColor: 'var(--button-border-color)',
    frames: {
      editorActiveTabIndicatorTopColor: 'transparent',
      editorActiveTabBorderColor: 'var(--button-border-color)',
      editorTabBarBorderBottomColor: 'var(--button-border-color)',
      tooltipSuccessBackground: 'var(--text-color)',
      tooltipSuccessForeground: 'var(--bg-color)',
    },
    lineNumbers: {
      foreground: 'var(--text-color-70)',
      highlightForeground: 'var(--text-color)',
    },
    collapsibleSections: {
      closedBackgroundColor: 'var(--button-hover-color)',
      closedBorderColor: 'var(--button-border-color)',
      closedTextColor: 'var(--text-color-70)',
    },
  },
});
